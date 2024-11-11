using contabilidad.saldo;
using core.componente;
using core.servicios;
//using core.servicios;
using dal.contabilidad;
using dal.generales;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace contabilidad.comp.mantenimiento {

    /// <summary>
    /// Clase que se encarga de actualziar saldos de las cuentas de presupuesto.
    /// </summary>
    public class SaldoPresupuesto {

        /// <summary>
        /// Actualiza saldos presupuestarios del movimiento en linea
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public static void ActualizarSaldoPresupuesto(RqMantenimiento rqmantenimiento, tconcomprobante comprobante, List<IBean> ldetalle) {
            List<tpptpartidaingreso> lpartidaingreso = new List<tpptpartidaingreso>();
            List<tpptcedulaingreso> lcedulaingreso = new List<tpptcedulaingreso>();
            List<tpptcompromisodetalle> lcompromisodetalle = new List<tpptcompromisodetalle>();
            List<tpptcompromiso> lcompromiso = new List<tpptcompromiso>();
            List<tpptpartidagasto> lpartidagasto = new List<tpptpartidagasto>();
            List<tppthistorialpartidagasto> lhistorialpg = new List<tppthistorialpartidagasto>();

            tpptpartidaingreso partidaingreso;
            tpptpartidagasto partidagasto;


            foreach (tconcomprobantedetalle detalle in ldetalle) {
                if (string.IsNullOrEmpty(detalle.cpartida)) continue;
                if (detalle.cpartida.Trim().Equals("")) continue;
                //afecta a partida de ingresos
                partidaingreso = TpptPartidaIngresoDal.Find(detalle.cpartida, Fecha.GetAnio(comprobante.fcontable));
                if (partidaingreso != null) {
                    ActualizarPartidaIngreso(rqmantenimiento, detalle, partidaingreso, lpartidaingreso, lcedulaingreso);
                    continue;
                }
                //afecta a partidas de gastos
                partidagasto = TpptPartidaGastoDal.Find(detalle.cpartida, Fecha.GetAnio(comprobante.fcontable));
                if (partidagasto != null) {
                    if (detalle.ccompromiso != null && !detalle.ccompromiso.Equals("") ) {
                        ActualizarPartidaGasto(rqmantenimiento, detalle, partidagasto, lcompromisodetalle, lcompromiso, lpartidagasto, lhistorialpg, comprobante);
                        continue;
                    } else {
                        continue;
                    }
                    throw new AtlasException("PPTO-001", "PPTO-002", "ERROR: COMPROMISO {0} NO EXISTE O SE ENCUENTRA EN ESTADO DEVENGADO, LIBERADO O PAGADO", detalle.ccompromiso);
                }
                throw new AtlasException("PPTO-001", "ERROR: PARTIDA PRESUPUESTARIA {0} NO EXISTE", detalle.cpartida);
            }
            if (lcedulaingreso.Count > 0) {
                rqmantenimiento.AdicionarTablaExistente("tpptcedulaingreso", lcedulaingreso, false);
                rqmantenimiento.AdicionarTablaExistente("tpptpartidaingreso", lpartidaingreso, false);
            }
            if (lcompromiso.Count > 0) {
                rqmantenimiento.AdicionarTablaExistente("tpptcompromiso", lcompromiso, false);
                rqmantenimiento.AdicionarTablaExistente("tpptcompromisodetalle", lcompromisodetalle, false);
                rqmantenimiento.AdicionarTablaExistente("tpptpartidagasto", lpartidagasto, false);
                rqmantenimiento.AdicionarTablaExistente("tppthistorialpartidagasto", lhistorialpg, false);
            }

        }


        /// <summary>
        /// Actualiza datos de partida de gasto
        /// </summary>
        /// <param name="rqMantenimiento"></param>
        /// <param name="detalle"></param>
        /// <param name="partidagasto"></param>
        /// <param name="lcompromisodetalle"></param>
        /// <param name="lcompromiso"></param>
        /// <param name="lpartidagasto"></param>
        public static void ActualizarPartidaGasto(RqMantenimiento rqMantenimiento, tconcomprobantedetalle detalle, tpptpartidagasto partidagasto,
                                    List<tpptcompromisodetalle> lcompromisodetalle,List<tpptcompromiso> lcompromiso,List<tpptpartidagasto> lpartidagasto,
                                    List<tppthistorialpartidagasto> lhistorialpg, tconcomprobante comprobante) {
            tpptcompromiso compromiso = TpptCompromisoDal.FindCompromisoXEstado(detalle.ccompromiso, "DEVENG");
            if (compromiso == null) {
                throw new AtlasException("PPTO-002", "ERROR: COMPROMISO {0} NO EXISTE O SE ENCUENTRA EN ESTADO DEVENGADO, LIBERADO O PAGADO", detalle.ccompromiso);
            }
            compromiso.estadoccatalogo = 1601;
            compromiso.estadocdetalle = "PAGADO";
            lcompromiso.Add(compromiso);

            tpptcompromisodetalle detcompromiso = TpptCompromisoDetalleDal.Find(detalle.ccompromiso, detalle.cpartida);
            if (detcompromiso == null) {
                throw new AtlasException("PPTO-002", "ERROR: COMPROMISO {0} NO EXISTE O SE ENCUENTRA EN ESTADO DEVENGADO, LIBERADO O PAGADO", detalle.ccompromiso);
            }
            detcompromiso.valorpagado = detalle.monto;
            lcompromisodetalle.Add(detcompromiso);

            partidagasto.vpagado += detalle.monto;
            partidagasto.vsaldoporpagar = partidagasto.vdevengado - partidagasto.vpagado;
            partidagasto.porcenejecucion = partidagasto.vpagado / partidagasto.vcodificado;
            lpartidagasto.Add(partidagasto);

            tppthistorialpartidagasto hpg = TpptHistorialPartidaGastoDal.Crear(partidagasto, compromiso.ccompromiso,null,null,null, 
                comprobante.ccomprobante, ConstantesPresupuesto.CONCEPTO_PAGADO_COMPROMISO, comprobante.comentario, rqMantenimiento,0, detalle.monto.Value);
            lhistorialpg.Add(hpg);
        }

        /// <summary>
        /// Actualiza datos de partida de ingreso
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public static void ActualizarPartidaIngreso(RqMantenimiento rqMantenimiento, tconcomprobantedetalle detalle, 
                                tpptpartidaingreso partidaingreso, List<tpptpartidaingreso> lpartidaingreso,List<tpptcedulaingreso> lcedulaingreso) {
            //actualización partida de ingresos
            partidaingreso.valordevengado += detalle.debito.Value? -detalle.monto.Value: detalle.monto.Value;
            decimal total = ((partidaingreso.porcenparticipacion.Value * partidaingreso.valordevengado.Value));

            if (partidaingreso.montototal == 0) {
                partidaingreso.porcenejecucion =  0;

            }
            else {
                partidaingreso.porcenejecucion = total / partidaingreso.montototal;

            }
            partidaingreso.Actualizar = true;

            lcedulaingreso.Add(CrearCedulaIngreso(rqMantenimiento, detalle, partidaingreso));
            lpartidaingreso.Add(partidaingreso);
        }

        /// <summary>
        /// Crea el registro para la cedula de partidas de ingresos
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public static tpptcedulaingreso CrearCedulaIngreso(RqMantenimiento rqMantenimiento, tconcomprobantedetalle detalle, tpptpartidaingreso partidaingreso) {
            //actualización de saldos de presupuesto de ingresos
            tpptcedulaingreso cedulaingreso;
            cedulaingreso = TpptCedulaIngresoDal.Crear(rqMantenimiento, partidaingreso.cpartidaingreso, detalle.ccomprobante, detalle.ccompania, detalle.debito.Value ? -detalle.monto.Value : detalle.monto.Value, Fecha.GetAnio(rqMantenimiento.Fconatable));
            cedulaingreso.ccedulaingreso = (int)Secuencia.GetProximovalor("PPTCEDULAING");
            return cedulaingreso;
        }



        /// <summary>
        /// Actualiza saldos presupuestarios del movimiento en proceso batch
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public static void ActualizarSaldoPresupuestoLote(RqMantenimiento rqmantenimiento, tconcomprobante comprobante, List<IBean> ldetalle)
        {
            List<tpptpartidaingreso> lpartidaingreso = new List<tpptpartidaingreso>();
            List<tpptcedulaingreso> lcedulaingreso = new List<tpptcedulaingreso>();
            List<tpptcompromisodetalle> lcompromisodetalle = new List<tpptcompromisodetalle>();
            List<tpptcompromiso> lcompromiso = new List<tpptcompromiso>();
            List<tpptpartidagasto> lpartidagasto = new List<tpptpartidagasto>();
            List<tppthistorialpartidagasto> lhistorialpg = new List<tppthistorialpartidagasto>();

            tpptpartidaingreso partidaingreso;
            tpptpartidagasto partidagasto;


            foreach (tconcomprobantedetalle detalle in ldetalle)
            {
                if (string.IsNullOrEmpty(detalle.cpartida)) continue;
                if (detalle.cpartida.Trim().Equals("")) continue;
                //afecta a partida de ingresos
                partidaingreso = TpptPartidaIngresoDal.Find(detalle.cpartida, Fecha.GetAnio(comprobante.fcontable));
                if (partidaingreso != null)
                {
                    ActualizarPartidaIngresoLote(rqmantenimiento, detalle, partidaingreso, lpartidaingreso, lcedulaingreso);
                    continue;
                }
                //afecta a partidas de gastos
                partidagasto = TpptPartidaGastoDal.Find(detalle.cpartida, Fecha.GetAnio(comprobante.fcontable));
                if (partidagasto != null)
                {
                    if (detalle.ccompromiso != null)
                    {
                        ActualizarPartidaGastoLote(rqmantenimiento, detalle, partidagasto, lcompromisodetalle, lcompromiso, lpartidagasto, lhistorialpg, comprobante);
                        continue;
                    }
                }
                throw new AtlasException("PPTO-001", "ERROR: PARTIDA PRESUPUESTARIA {0} NO EXISTE", detalle.cpartida);
            }
            if (lcedulaingreso.Count > 0)
            {
                rqmantenimiento.AdicionarTabla("tpptcedulaingreso", lcedulaingreso, false);
            }
            if (lcompromiso.Count > 0)
            {
                rqmantenimiento.AdicionarTabla("tpptcompromiso", lcompromiso, false);
                rqmantenimiento.AdicionarTabla("tpptcompromisodetalle", lcompromisodetalle, false);
                rqmantenimiento.AdicionarTabla("tpptpartidagasto", lpartidagasto, false);
                rqmantenimiento.AdicionarTabla("tppthistorialpartidagasto", lhistorialpg, false);
            }
        }


        /// <summary>
        /// Actualiza datos de partida de gasto
        /// </summary>
        /// <param name="rqMantenimiento"></param>
        /// <param name="detalle"></param>
        /// <param name="partidagasto"></param>
        /// <param name="lcompromisodetalle"></param>
        /// <param name="lcompromiso"></param>
        /// <param name="lpartidagasto"></param>
        public static void ActualizarPartidaGastoLote(RqMantenimiento rqMantenimiento, tconcomprobantedetalle detalle, tpptpartidagasto partidagasto,
                                    List<tpptcompromisodetalle> lcompromisodetalle, List<tpptcompromiso> lcompromiso, List<tpptpartidagasto> lpartidagasto,
                                    List<tppthistorialpartidagasto> lhistorialpg, tconcomprobante comprobante)
        {
            tpptcompromiso compromiso = TpptCompromisoDal.FindCompromisoXEstado(detalle.ccompromiso, "DEVENG");
            if (compromiso == null)
            {
                throw new AtlasException("PPTO-002", "ERROR: COMPROMISO {0} NO EXISTE O SE ENCUENTRA EN ESTADO DEVENGADO, LIBERADO O PAGADO", detalle.ccompromiso);
            }
            compromiso.estadoccatalogo = 1601;
            compromiso.estadocdetalle = "PAGADO";
            lcompromiso.Add(compromiso);

            tpptcompromisodetalle detcompromiso = TpptCompromisoDetalleDal.Find(detalle.ccompromiso, detalle.cpartida);
            if (detcompromiso == null)
            {
                throw new AtlasException("PPTO-002", "ERROR: COMPROMISO {0} NO EXISTE O SE ENCUENTRA EN ESTADO DEVENGADO, LIBERADO O PAGADO", detalle.ccompromiso);
            }
            detcompromiso.valorpagado = detalle.monto;
            lcompromisodetalle.Add(detcompromiso);

            partidagasto.vpagado += detalle.monto;
            partidagasto.vsaldoporpagar -= detalle.monto;
            partidagasto.porcenejecucion = partidagasto.vpagado / partidagasto.vcodificado;
            lpartidagasto.Add(partidagasto);

            tppthistorialpartidagasto hpg = TpptHistorialPartidaGastoDal.Crear(partidagasto, compromiso.ccompromiso, null, null, null,
                comprobante.ccomprobante, ConstantesPresupuesto.CONCEPTO_PAGADO_COMPROMISO, comprobante.comentario, rqMantenimiento, 0, detalle.monto.Value);
            lhistorialpg.Add(hpg);
        }

        /// <summary>
        /// Actualiza datos de partida de ingreso
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public static void ActualizarPartidaIngresoLote(RqMantenimiento rqMantenimiento, tconcomprobantedetalle detalle,
                                tpptpartidaingreso partidaingreso, List<tpptpartidaingreso> lpartidaingreso, List<tpptcedulaingreso> lcedulaingreso)
        {
            //actualización partida de ingresos
            partidaingreso.valordevengado += detalle.debito.Value ? -detalle.monto.Value : detalle.monto.Value;
            partidaingreso.porcenejecucion = (partidaingreso.porcenparticipacion * partidaingreso.valordevengado) / partidaingreso.montototal;
            partidaingreso.Actualizar = true;

            lcedulaingreso.Add(CrearCedulaIngresoLote(rqMantenimiento, detalle, partidaingreso));
            lpartidaingreso.Add(partidaingreso);
        }

        /// <summary>
        /// Crea el registro para la cedula de partidas de ingresos
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public static tpptcedulaingreso CrearCedulaIngresoLote(RqMantenimiento rqMantenimiento, tconcomprobantedetalle detalle, tpptpartidaingreso partidaingreso)
        {
            //actualización de saldos de presupuesto de ingresos
            tpptcedulaingreso cedulaingreso;
            cedulaingreso = TpptCedulaIngresoDal.Crear(rqMantenimiento, partidaingreso.cpartidaingreso, detalle.ccomprobante, detalle.ccompania, detalle.debito.Value ? -detalle.monto.Value : detalle.monto.Value, Fecha.GetAnio(rqMantenimiento.Fconatable));
            cedulaingreso.ccedulaingreso = (int)Secuencia.GetProximovalor("PPTCEDULAING");
            Sessionef.Grabar(cedulaingreso);
            return cedulaingreso;
        }
    }

}
