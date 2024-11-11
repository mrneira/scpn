using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using core.servicios.mantenimiento;
using dal.cartera;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.arreglopago
{

    /// <summary>
    /// Clase que se encarga de realizar la valiacion y registro de arreglo de pagos por operacion.
    /// </summary>
    public class SolicitudArregloPago : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            tcaroperacionarreglopago arreglopago = (tcaroperacionarreglopago)rqmantenimiento.GetTabla("TCAROPEARREGLOPAGO").Lregistros.ElementAt(0);
            tcaroperacion operacion = TcarOperacionDal.FindSinBloqueo(arreglopago.coperacion);

            // Crea solicitud de credito
            List<IBean> lrubrosarreglo = rqmantenimiento.GetTabla("RUBROSARREGLOPAGO").Lregistros;
            this.CreaSolicitud(rqmantenimiento, arreglopago, operacion);
            this.CreaRenovacion(rqmantenimiento, operacion.coperacion);
            this.CreaCargos(rqmantenimiento, lrubrosarreglo, operacion);

            // Ejecuta transaccion de ingreso de solicitud
            Mantenimiento.ProcesarAnidado(rqmantenimiento, 7, 98);

            // Completa codigo de solicitud en operacion de arreglo de pago
            long csolicitud = SolicitudFachada.GetSolicitud().Tcarsolicitud.csolicitud;
            tcartipoarreglopago tipoarreglo = TcarTipoArregloPagoDal.Find(arreglopago.ctipoarreglopago);
            if (!tipoarreglo.cestadooperacion.Equals(EnumEstadoOperacion.NOVADA.CestadoOperacion))
            {
                this.CreaGarantias(rqmantenimiento, operacion.coperacion, csolicitud);
            }
            this.CompletaPk(rqmantenimiento, arreglopago, csolicitud);
            this.CompletaPk(rqmantenimiento, lrubrosarreglo, csolicitud);
        }

        /// <summary>
        /// Crea instancia de solicitud lo adiciona al request de mantenimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="tcaroperacionarreglopago">Objeto que contiene datos la opeacion de arreglo de pago.</param>
        /// <param name="tcaroperacion">Objeto que contiene datos la opeacion operacion.</param>
        private void CreaSolicitud(RqMantenimiento rqmantenimiento, tcaroperacionarreglopago tcaroperacionarreglopago, tcaroperacion tcaroperacion)
        {
            List<tcarsolicitud> lsolicitud = new List<tcarsolicitud>();
            if (tcaroperacion.cproducto == 1 && tcaroperacion.ctipoproducto == 21) //CCA 20220418
            {
                tcarsolicitud sol = new tcarsolicitud
                {
                    csolicitud = Constantes.CERO,
                    cpersona = tcaroperacion.cpersona,
                    cmodulo = tcaroperacion.cmodulo,
                    cproducto = tcaroperacion.cproducto,
                    ctipoproducto = tcaroperacion.ctipoproducto,
                    ccompania = tcaroperacion.ccompania,
                    cmoneda = tcaroperacion.cmoneda,
                    cagencia = tcaroperacion.cagencia,
                    csucursal = tcaroperacion.csucursal,
                    ctipocredito = tcaroperacion.ctipocredito,
                    cusuarioingreso = rqmantenimiento.Cusuario,
                    cfrecuecia = tcaroperacion.cfrecuecia,
                    cestatussolicitud = EnumEstatus.INGRESADA.Cestatus,
                    ctabla = tcaroperacionarreglopago.GetInt("ctabla"),
                    cbasecalculo = tcaroperacion.cbasecalculo,
                    fingreso = rqmantenimiento.Fconatable,
                    periodicidadcapital = tcaroperacion.periodicidadcapital,
                    tasareajustable = tcaroperacion.tasareajustable,
                    numerocuotasreajuste = tcaroperacion.numerocuotasreajuste,
                    fgeneraciontabla = rqmantenimiento.Fconatable,
                    montooriginal = rqmantenimiento.Monto,
                    monto = rqmantenimiento.Monto,
                    valorcuota = tcaroperacionarreglopago.valorcuota,
                    diapago = tcaroperacion.diapago,
                    numerocuotas = tcaroperacionarreglopago.numerocuotas,
                    mantieneplazo = tcaroperacion.mantieneplazo,
                    tasa = tcaroperacion.tasa,
                    csegmento = tcaroperacion.csegmento,
                    cuotasgracia = (tcaroperacionarreglopago.numerocuotas) - 1,
                    cestadooperacion = "N" // CCA 20220418 TcarTipoArregloPagoDal.Find(tcaroperacionarreglopago.ctipoarreglopago).cestadooperacion
                };
                lsolicitud.Add(sol);

            }
            else
            {
                tcarsolicitud sol = new tcarsolicitud
                {
                    csolicitud = Constantes.CERO,
                    cpersona = tcaroperacion.cpersona,
                    cmodulo = tcaroperacion.cmodulo,
                    cproducto = tcaroperacion.cproducto,
                    ctipoproducto = tcaroperacion.ctipoproducto,
                    ccompania = tcaroperacion.ccompania,
                    cmoneda = tcaroperacion.cmoneda,
                    cagencia = tcaroperacion.cagencia,
                    csucursal = tcaroperacion.csucursal,
                    ctipocredito = tcaroperacion.ctipocredito,
                    cusuarioingreso = rqmantenimiento.Cusuario,
                    cfrecuecia = tcaroperacion.cfrecuecia,
                    cestatussolicitud = EnumEstatus.INGRESADA.Cestatus,
                    ctabla = tcaroperacionarreglopago.GetInt("ctabla"),
                    cbasecalculo = tcaroperacion.cbasecalculo,
                    fingreso = rqmantenimiento.Fconatable,
                    periodicidadcapital = tcaroperacion.periodicidadcapital,
                    tasareajustable = tcaroperacion.tasareajustable,
                    numerocuotasreajuste = tcaroperacion.numerocuotasreajuste,
                    fgeneraciontabla = rqmantenimiento.Fconatable,
                    montooriginal = rqmantenimiento.Monto,
                    monto = rqmantenimiento.Monto,
                    valorcuota = tcaroperacionarreglopago.valorcuota,
                    diapago = tcaroperacion.diapago,
                    numerocuotas = tcaroperacionarreglopago.numerocuotas,
                    mantieneplazo = tcaroperacion.mantieneplazo,
                    tasa = tcaroperacion.tasa,
                    csegmento = tcaroperacion.csegmento,
                    cestadooperacion = "N" // CCA 20220418

                };
                lsolicitud.Add(sol);
            }

            // Adiciona tabla para creacion de solicitud
            rqmantenimiento.AdicionarTabla("TCARSOLICITUD", lsolicitud, false);
        }

        /// <summary>
        /// Crea instancia de absorcion de solicitud y lo adiciona al request de mantenimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="coperacion">Codigo de numero de operacion de cartera.</param>
        private void CreaRenovacion(RqMantenimiento rqmantenimiento, string coperacion)
        {
            List<tcarsolicitudabsorcion> lrenovacion = null;
            if (rqmantenimiento.GetTabla("OPERACIONESPORPERSONA") != null)
            {
                if (rqmantenimiento.GetTabla("OPERACIONESPORPERSONA").Lregistros.Count() > 0)
                {
                    lrenovacion = rqmantenimiento.GetTabla("OPERACIONESPORPERSONA").Lregistros.Cast<tcarsolicitudabsorcion>().ToList();
                }
                else
                {
                    lrenovacion = new List<tcarsolicitudabsorcion>();
                }
            }
            else
            {
                lrenovacion = new List<tcarsolicitudabsorcion>();
            }

            // Adiciona la operacion de negociacion de pagos
            tcarsolicitudabsorcion ren = new tcarsolicitudabsorcion
            {
                coperacion = coperacion
            };
            lrenovacion.Add(ren);

            rqmantenimiento.AdicionarTabla("OPERACIONESPORPERSONA", lrenovacion, false);
        }

        /// <summary>
        /// Crea instancia de cargos de solicitud y lo adiciona al request de mantenimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="coperacion">Codigo de numero de operacion de cartera.</param>
        private void CreaCargos(RqMantenimiento rqmantenimiento, List<IBean> lrubrosarreglo, tcaroperacion tcaroperacion)
        {
            List<tcarsolicitudcargostabla> lcargos = new List<tcarsolicitudcargostabla>();
            Dictionary<String, Decimal> mcargos = new Dictionary<string, decimal>();

            Operacion operacion = OperacionFachada.GetOperacion(tcaroperacion.coperacion, true);
            Saldo saldo = new Saldo(operacion, rqmantenimiento.Fconatable);
            saldo.Calculacuotaencurso();

            List<tcaroperacioncuota> lcuotas = operacion.Lcuotas;
            foreach (tcaroperacionarrepagorubro rubroarreglo in lrubrosarreglo)
            {
                Decimal valor = Constantes.CERO;

                foreach (tcaroperacioncuota cuota in lcuotas)
                {
                    foreach (tcaroperacionrubro rubro in cuota.GetRubros())
                    {
                        if (rubroarreglo.csaldo.Equals(rubro.csaldo) && !rubroarreglo.pagoobligatorio.Value)
                        {
                            valor = mcargos.ContainsKey(rubroarreglo.csaldodestino) ? mcargos[rubroarreglo.csaldodestino] : Constantes.CERO;

                            decimal montorubro = (rubro.saldo - rubro.cobrado - rubro.descuento) ?? Constantes.CERO;
                            if ((rubro.esaccrual != null && (bool)rubro.esaccrual) || rubro.fpago != null)
                            {
                                if (rubro.GetPendiente().CompareTo(Decimal.Zero) <= 0)
                                {
                                    continue;
                                }
                                montorubro = rubro.GetPendiente();
                            }
                            valor = Decimal.Add(valor, montorubro);
                            mcargos[rubroarreglo.csaldodestino] = valor;
                            break;
                        }
                    }
                }

                if (valor > 0)
                {
                    tcarsolicitudcargostabla cargo = new tcarsolicitudcargostabla
                    {
                        cpersona = (long)tcaroperacion.cpersona,
                        csolicitud = Constantes.CERO,
                        csaldo = rubroarreglo.csaldodestino,
                        ccompania = tcaroperacion.ccompania,
                        monto = valor,
                        modificable = (false)
                    };
                    lcargos.Add(cargo);
                }
            }
            rqmantenimiento.AdicionarTabla(typeof(tcarsolicitudcargostabla).Name.ToUpper(), lcargos, false);
        }

        /// <summary>
        /// Crea instancia de garantias de solicitud y lo adiciona al request de mantenimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="coperacion">Codigo de numero de operacion de cartera.</param>
        /// <param name="csolicitud">Codigo de la solicitud.</param>
        private void CreaGarantias(RqMantenimiento rqmantenimiento, string coperacion, long csolicitud)
        {
            List<tcarsolicitudgarantias> lsolgar = new List<tcarsolicitudgarantias>();
            foreach (tcaroperaciongarantias opegar in TcarOperacionGarantiasDal.Find(coperacion))
            {
                tcarsolicitudgarantias gar = new tcarsolicitudgarantias
                {
                    coperaciongarantia = opegar.coperaciongarantia,
                    csolicitud = csolicitud
                };
                lsolgar.Add(gar);
            }
            rqmantenimiento.AdicionarTabla(typeof(tcarsolicitudgarantias).Name.ToUpper(), lsolgar, false);
        }

        /// <summary>
        /// Completa el pk de la solicitud.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="arreglopago">Objeto de arreglo de pago para completar el pk.</param>
        /// <param name="csolicitud">Codigo de la solicitud.</param>
        private void CompletaPk(RqMantenimiento rqmantenimiento, tcaroperacionarreglopago arreglopago, long csolicitud)
        {
            arreglopago.csolicitud = csolicitud;
        }

        /// <summary>
        /// Completa el pk de la solicitud.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="lrubrosarreglo">Lista de rubros de arreglo de pago a completar el pk.</param>
        /// <param name="csolicitud">Codigo de la solicitud.</param>
        private void CompletaPk(RqMantenimiento rqmantenimiento, List<IBean> lrubrosarreglo, long csolicitud)
        {
            foreach (tcaroperacionarrepagorubro rubro in lrubrosarreglo)
            {
                rubro.csolicitud = csolicitud;
            }
        }

    }
}
