using core.componente;
using core.servicios;
using dal.activosfijos;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.contabilidad.cuentasporpagar.liquidacionviaticos;
using dal.presupuesto;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar.liquidacionviaticos {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de una liquidacion de viaticos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }
            tconliquidaciongastos cabecera = (tconliquidaciongastos)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            if (cabecera.cliquidaciongastos == 0) {
                cabecera.cliquidaciongastos = Secuencia.GetProximovalor("CON_LIQGASTO");
                rqmantenimiento.Response["cliquidaciongastos"] = cabecera.cliquidaciongastos;
            }else rqmantenimiento.Response["cliquidaciongastos"] = cabecera.cliquidaciongastos;

            if (string.IsNullOrEmpty(cabecera.comprobanteliquidacion))
            {
                cabecera.comprobanteliquidacion = string.Format("{0}-{1}", cabecera.fliquidacion.Year, Secuencia.GetProximovalor("LIQGASTOOR").ToString());
                rqmantenimiento.Response["comprobanteliquidacion"] = cabecera.comprobanteliquidacion;
            }
            else rqmantenimiento.Response["comprobanteliquidacion"] = cabecera.comprobanteliquidacion;


            // Eliminar una cuenta por pagar y si existe el comprobante contable también se lo elimina (cambio de estados)
            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar")) {
                cabecera.eliminado = true;
                cabecera.estadocdetalle = "ELIMIN";
                this.Eliminar(rqmantenimiento, cabecera);
                return;
            }

            ////Asociar una cuenta por pagar a un ingreso
            //if (rqmantenimiento.Mdatos.ContainsKey("cingreso")) {
            //    int cingreso = int.Parse(rqmantenimiento.Mdatos["cingreso"].ToString());
            //    tacfingreso ingreso = TacfIngresoDal.FindIngreso(cingreso);
            //    ingreso.cctaporpagar = cctaporpagar;
            //    rqmantenimiento.AdicionarTabla("tacfingreso", ingreso, false);
            //}
            //rqmantenimiento.Response["cctaporpagar"] = cctaporpagar;
            //TconCuentaporpagarDal.Completar(rqmantenimiento, cabecera, cctaporpagar);
            // fija el numero de comprobante para utilizarlo en clases adicionales del mantenimiento.

        }

        /// <summary>
        /// Eliminar liquidacion de viaticos.
        /// Pasos:
        /// Anula el comprobante contable, si este NO esta mayorizado.
        /// Solo anula liquidaciones en estatus CONTAB o INGRES.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cabecera"></param>
        private void Eliminar(RqMantenimiento rqmantenimiento, tconliquidaciongastos cabecera) {
            if(cabecera.ccomprobante != null) {
                // si el comprobante ya fue generado.
                tconcomprobante c = TconComprobanteDal.Find(cabecera.ccomprobante, rqmantenimiento.Ccompania);
                List<tconcomprobantedetalle> ldetalle = TconComprobanteDetalleDal.Find(c.ccomprobante, c.ccompania);
                c.eliminado = true;
                rqmantenimiento.AdicionarTabla("tconcomprobante", c, false);
                this.ReversarPartidaGasto(rqmantenimiento, ldetalle);
            }
        }

        /// <summary>
        /// Reversa saldos de partida gasto, elimina el compromiso.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion</param>
        /// <param name="ldetalle">Lista que contien detalle de comprobante contable.</param>
        private void ReversarPartidaGasto(RqMantenimiento rqmantenimiento, List<tconcomprobantedetalle> ldetalle) {
            foreach(tconcomprobantedetalle obj in ldetalle) {
                if(obj.ccompromiso != null || obj.cpartida != null) {
                    int anio = int.Parse( obj.particion.ToString().Substring(0, 4));
                    this.ReversalPartida(rqmantenimiento, obj.monto, obj.ccompromiso, obj.cpartida, anio);
                }
            }
        }

        /// <summary>
        /// Actualiza saldos de la partida gasto, y marca como eliminado el compromiso.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="monto">Monto del comprobante contable</param>
        /// <param name="ccompromiso">Numero de compromiso a eliminar</param>
        /// <param name="cpartida">Numero de partida presupuestaria</param>
        /// <param name="aniofiscal">Anio fiscal</param>
        private void ReversalPartida(RqMantenimiento rqmantenimiento, decimal? monto, string ccompromiso, string cpartida, int anio) {
            bool existeCompromiso = false;
            if(ccompromiso != null && ccompromiso != "") {
                tpptcompromiso c = TpptCompromisoDal.FindCompromiso(ccompromiso);
                tpptcompromisodetalle cd = TpptCompromisoDetalleDal.Find(ccompromiso, cpartida);
                TpptCompromisoDal.Eliminar(rqmantenimiento, c);
                anio = cd.aniofiscal;
                existeCompromiso = true;
            }
            if(cpartida == null || cpartida.Equals("")) {
                return; // si no tiene numero de partida no hacer nada.
            }

            // actualiza devengado y saldo compromiso.
            tpptpartidagasto pg = TpptPartidaGastoDal.Find(cpartida, anio);
            TpptPartidaGastoHistoriaDal.CreaHistoria(pg, rqmantenimiento.Fconatable);
            pg.Actualizar = true;
            rqmantenimiento.AdicionarTabla("tpptpartidagasto", pg, false);
            // reverso compromiso
            if(existeCompromiso) {
                pg.vcomprometido -= monto;
                pg.vsaldoporcomprometer = pg.vcodificado - pg.vcomprometido;
            }
            // reverso afectacion presupuestaria viaticos y transporte
            pg.vdevengado -= monto;
            pg.vsaldoporpagar = pg.vcomprometido - pg.vpagado;
            pg.vsaldopordevengar = pg.vcomprometido - pg.vdevengado;

        }

    }
}
