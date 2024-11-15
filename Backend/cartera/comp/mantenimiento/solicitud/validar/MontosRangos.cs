using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using dal.cartera;
using dal.generales;
using modelo;
using socio.datos;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de montos en la solicitud.
    /// </summary>
    public class MontosRangos : ComponenteMantenimiento {

        /// <summary>
        /// Validación de montos de Solicitud
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            List<tcarproductorangos> lrangos = TcarProductoRangosDal.find((int)rqmantenimiento.Cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto, (decimal)tcarsolicitud.montooriginal);

            if (lrangos.Count() != 1) {
                throw new AtlasException("CAR-0031", "MONTO NO SE ENCUENTRA PARAMETRIZADO");
            }
            if (rqmantenimiento.Cmodulotranoriginal == 7 && rqmantenimiento.Ctranoriginal == 52)
            {
                if ((!tcarsolicitud.cestadooperacion.Equals(EnumEstadoOperacion.RESTRUCTURADA.CestadoOperacion) && !tcarsolicitud.cestadooperacion.Equals(EnumEstadoOperacion.REFINANCIADA.CestadoOperacion)) && ((int)lrangos[0].plazomaximo) < ((int)tcarsolicitud.numerocuotas))
                {
                    throw new AtlasException("CAR-0032", "NÚMERO DE CUOTAS MÁXIMO NO PUEDE SER MAYOR A: {0}", lrangos[0].plazomaximo);
                }
            }
            else if (((int)lrangos[0].plazomaximo) < ((int)tcarsolicitud.numerocuotas)) {
                throw new AtlasException("CAR-0032", "NÚMERO DE CUOTAS MÁXIMO NO PUEDE SER MAYOR A: {0}", lrangos[0].plazomaximo);
            }
            CalculaMontoMaximo(rqmantenimiento, tcarsolicitud);
        }


        /// <summary>
        /// Valida el monto máximo.
        /// </summary>
        /// <param name="aportesparam">Parametro de aportes por garante</param>
        /// <param name="lgarantes">Lista de datos de aportes de garantes</param>
        /// <param name="aportesdeudor">Aportes del deudor</param>
        public static void CalculaMontoMaximo(RqMantenimiento rqmantenimiento, tcarsolicitud tcarsolicitud)
        {
            decimal maxaportes = Constantes.CERO;
            decimal montoabsorcionaportes = Constantes.CERO;
            if (rqmantenimiento.Mdatos.ContainsKey("montoabsorcionaportes")) {
                montoabsorcionaportes = (decimal)rqmantenimiento.GetDecimal("montoabsorcionaportes");
            }
            tcarproducto producto = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);

            if ((producto.montoporaportaciones != null) && (bool)producto.montoporaportaciones) {
                Socios socio = new Socios((long)tcarsolicitud.cpersona, rqmantenimiento);
                if (socio.GetTotalAportes() < 240) {
                    decimal saldoaportes = Constantes.CERO;
                    decimal montoaportes = Math.Round(decimal.Parse(socio.GetAcumAportes().ToString()), 2, MidpointRounding.AwayFromZero);
                    maxaportes = Math.Round(((montoaportes * (decimal)producto.porcentajeaportaciones) / Constantes.CIEN), TgenMonedaDal.GetDecimales(tcarsolicitud.cmoneda), MidpointRounding.AwayFromZero);

                    // Saldos comprometidos de prestamos
                    decimal saldocomprometido = Constantes.CERO;
                    if (!rqmantenimiento.Mdatos.ContainsKey("essimulacion") || !(bool)rqmantenimiento.Mdatos["essimulacion"]) {
                        List<tcaroperacion> loperaciones = TcarOperacionDal.FindOperacionesAportes((long)tcarsolicitud.cpersona);
                        foreach (tcaroperacion op in loperaciones) {
                            Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);
                            Saldo saldo = new Saldo(operacion, rqmantenimiento.Fconatable);
                            saldo.Calculacuotaencurso();
                            saldocomprometido = decimal.Add(saldocomprometido, saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas() - saldo.Cxp);
                        }
                        // Saldos por absorcion
                        saldocomprometido = decimal.Subtract(saldocomprometido, montoabsorcionaportes);
                        if (saldocomprometido < Constantes.CERO) {
                            saldocomprometido = Constantes.CERO;
                        }
                    }

                    // Valida saldo de aportes
                    saldoaportes = decimal.Subtract(maxaportes, saldocomprometido);
                    if (saldoaportes < Constantes.CERO) {
                        saldoaportes = Constantes.CERO;
                    }
                    if (saldoaportes < (decimal)tcarsolicitud.montooriginal) {
                        throw new AtlasException("CAR-0026", "MONTO DE LA SOLICITUD NO PUEDE SER MAYOR A: {0}", saldoaportes);
                    }
                }
            }
        }

    }
}