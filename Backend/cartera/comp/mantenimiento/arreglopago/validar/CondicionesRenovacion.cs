using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using dal.cartera;
using dal.generales;
using dal.prestaciones;
using modelo;
using socio.datos;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.arreglopago.validar
{
    /// <summary>
    /// Clase que se encarga de ejecutar validacion de para ejecutar la renovación
    /// </summary>
    public class CondicionesRenovacion : ComponenteMantenimiento
    {

        /// <summary>
        /// Validación de condiciones de renovación por producto
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            tcaroperacion tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;

            // Condiciones de arreglo de pago
            tcaroperacionarreglopago arregloPago = (tcaroperacionarreglopago)rqmantenimiento.GetTabla("TCAROPEARREGLOPAGO").Lregistros.ElementAt(0);

            // Validación renovación
            if (arregloPago.ctipoarreglopago == TcarParametrosDal.GetValorTexto("CODIGO-RENOVACION", rqmantenimiento.Ccompania))
            {
                tcaroperacion.ctabla = arregloPago.GetInt("ctabla");
                tcarproducto tcarproducto = TcarProductoDal.Find((int)tcaroperacion.cmodulo, (int)tcaroperacion.cproducto, (int)tcaroperacion.ctipoproducto);
                ValidaRenovacion(rqmantenimiento, tcaroperacion, tcarproducto);
                ValidaMontos(rqmantenimiento, tcaroperacion, tcarproducto, decimal.Parse(arregloPago.Mdatos["monto"].ToString()), (int)arregloPago.numerocuotas);
            }
        }

        /// <summary>
        /// Valida porcentaje de renovación
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        /// <param name="operacion">Registro de operacion.</param>
        /// <param name="producto">Registro de producto de la operacion.</param>
        public static void ValidaRenovacion(RqMantenimiento rq, tcaroperacion operacion, tcarproducto producto)
        {
            // Condiciones de renovación
            if ((producto.renovacion == null) || (!(bool)producto.renovacion))
            {
                throw new AtlasException("CAR-0056", "PRODUCTO NO PERMITE RENOVACIÓN");
            }
            if (producto.porcentajerenovacion == null || producto.porcentajerenovacion < 0)
            { // CCA 20220418 <=
                throw new AtlasException("CAR-0057", "PRODUCTO NO REGISTRA PORCENJATE DE RENOVACIÓN");
            }

            // Calcula el monto base de acuerdo al porcentaje de renovación
            decimal montobase = (decimal)operacion.montooriginal * ((decimal)producto.porcentajerenovacion / Constantes.CIEN);

            // Capital cobrado
            decimal capitalcobrado = decimal.Subtract((decimal)operacion.montooriginal, rq.Mdatos.ContainsKey("saldocapital") ? (decimal)rq.GetDecimal("saldocapital") : Constantes.CERO);
            if (capitalcobrado < montobase)
            {
                throw new AtlasException("CAR-0058", "NO SE HA CANCELADO EL PORCENTAJE MÍNIMO REQUERIDO POR OPERACIÓN");
            }

            //Operaciones vencidas
            List<tcaroperacion> loperaciones = TcarOperacionDal.FindPorPersona((long)operacion.cpersona, true).Cast<tcaroperacion>().ToList();
            foreach (tcaroperacion op in loperaciones)
            {
                tcarestatus estatus = TcarEstatusDal.FindInDataBase(op.cestatus);
                if ((estatus.cestatus == EnumEstatus.APROVADA.Cestatus))
                {
                    throw new AtlasException("CAR-0048", "SOCIO TIENE LA OPERACIÓN: {0} APROBADA PARA DESEMBOLSO", op.coperacion);
                }

                if (!estatus.cestatus.Equals(EnumEstatus.CANCELADA.Cestatus))
                {

                    // Calcula dias mora
                    int diasmora = 0;
                    Operacion operacioncartera = OperacionFachada.GetOperacion(op.coperacion, true);

                    if ((operacioncartera.Lcuotas != null) && !(operacioncartera.Lcuotas.Count < 1) && (rq.Fproceso > operacioncartera.Lcuotas[0].fvencimiento))
                    {
                        diasmora = Fecha.Resta365((int)rq.Fproceso, (int)operacioncartera.Lcuotas[0].fvencimiento);
                    }

                    if (producto.consolidado == null || !(bool)producto.consolidado)
                    {
                        if (!(producto.cproducto == 1 && producto.ctipoproducto == 21))//CCA 20221021
                        {
                            int diasgracia = TcarParametrosDal.GetInteger("DIASGRACIAMORA", (int)operacioncartera.tcaroperacion.ccompania);
                            if (diasmora > diasgracia)
                            {
                                throw new AtlasException("CAR-0035", "SOCIO EN MORA. OPERACION: {0} - DIAS MORA: {1} - ESTADO: {2}", op.coperacion, diasmora, estatus.nombre);
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Valida porcentaje de renovación
        /// </summary>
        /// <param name="rq">Request de Mantenimiento</param>
        /// <param name="operacion">Registro de operacion.</param>
        /// <param name="producto">Registro de producto de la operacion.</param>
        /// <param name="monto">Monto operacion.</param>
        /// <param name="numerocuotas">Numero de cuotas de la nueva operacion.</param>
        public static void ValidaMontos(RqMantenimiento rq, tcaroperacion operacion, tcarproducto producto, decimal monto, int numerocuotas)
        {
            List<tcarproductorangos> lrangos = TcarProductoRangosDal.find((int)operacion.cmodulo, (int)operacion.cproducto, (int)operacion.ctipoproducto, monto);

            if (lrangos.Count() != 1)
            {
                throw new AtlasException("CAR-0031", "MONTO NO SE ENCUENTRA PARAMETRIZADO");
            }

            if (((int)lrangos[0].plazomaximo) < numerocuotas)
            {
                throw new AtlasException("CAR-0032", "NÚMERO DE CUOTAS MÁXIMO NO PUEDE SER MAYOR A: {0}", lrangos[0].plazomaximo);
            }

            CalculaMontoMaximo(rq, operacion, producto, monto);
        }

        /// <summary>
        /// Valida el monto máximo.
        /// </summary>
        /// <param name="rq">Request de Mantenimiento</param>
        /// <param name="operacion">Registro de operacion.</param>
        /// <param name="producto">Registro de producto de la operacion.</param>
        /// <param name="monto">Monto operacion.</param>
        public static void CalculaMontoMaximo(RqMantenimiento rq, tcaroperacion operacion, tcarproducto producto, decimal monto)
        {
            decimal maxaportes = Constantes.CERO;

            //if ((producto.montoporaportaciones != null) && (bool)producto.montoporaportaciones) {
            //    decimal montoAportes = 0;
            //    IList<Dictionary<string, object>> deudor = TpreAportesDal.GetTotalAportes((long)operacion.cpersona);
            //    montoAportes = (deudor[0]["TAPORTE"] != null) ? decimal.Parse(deudor[0]["TAPORTE"].ToString()) : 0;
            //    maxaportes = Math.Round(((decimal)(producto.porcentajeaportaciones * montoAportes) / Constantes.CIEN), TgenMonedaDal.GetDecimales(operacion.cmoneda), MidpointRounding.AwayFromZero);

            //    // Valida saldo de aportes
            //    if (maxaportes < (decimal)operacion.montooriginal) {
            //        //throw new AtlasException("CAR-0026", "MONTO DE LA SOLICITUD NO PUEDE SER MAYOR A: {0}", maxaportes);
            //    }
            //}


            decimal montoabsorcionaportes = Constantes.CERO;

            if ((producto.montoporaportaciones != null) && (bool)producto.montoporaportaciones)
            {
                Socios socio = new Socios((long)operacion.cpersona, rq);
                if (socio.GetTotalAportes() < 240)
                {
                    decimal saldoaportes = Constantes.CERO;
                    decimal montoaportes = Math.Round(decimal.Parse(socio.GetAcumAportes().ToString()), 2, MidpointRounding.AwayFromZero);
                    maxaportes = Math.Round(((montoaportes * (decimal)producto.porcentajeaportaciones) / Constantes.CIEN), TgenMonedaDal.GetDecimales(operacion.cmoneda), MidpointRounding.AwayFromZero);

                    // Saldos comprometidos de prestamos
                    decimal saldocomprometido = Constantes.CERO;
                    if (!rq.Mdatos.ContainsKey("essimulacion") || !(bool)rq.Mdatos["essimulacion"])
                    {
                        List<tcaroperacion> loperaciones = TcarOperacionDal.FindOperacionesAportes((long)operacion.cpersona);
                        foreach (tcaroperacion op in loperaciones)
                        {
                            Operacion ope = OperacionFachada.GetOperacion(op.coperacion, true);
                            Saldo saldo = new Saldo(ope, rq.Fconatable);
                            saldo.Calculacuotaencurso();
                            saldocomprometido = decimal.Add(saldocomprometido, saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas() - saldo.Cxp);
                        }
                        // Saldos por absorcion
                        saldocomprometido = decimal.Subtract(saldocomprometido, montoabsorcionaportes);
                        if (saldocomprometido < Constantes.CERO)
                        {
                            saldocomprometido = Constantes.CERO;
                        }
                    }

                    // Valida saldo de aportes
                    saldoaportes = decimal.Subtract(maxaportes, saldocomprometido);
                    if (saldoaportes < Constantes.CERO)
                    {
                        saldoaportes = Constantes.CERO;
                    }
                    if (saldoaportes < (decimal)operacion.montooriginal)
                    {
                        throw new AtlasException("CAR-0026", "MONTO DE LA SOLICITUD NO PUEDE SER MAYOR A: {0}", saldoaportes);
                    }
                }
            }



        }
    }
}
