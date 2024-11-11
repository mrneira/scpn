using contabilidad.saldo;
using core.componente;
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

namespace contabilidad.comp.mantenimiento.comprobante.ajustesfindemes {

    /// <summary>
    /// Clase que se encarga de actualziar saldos contables de un comprobante contable en línea
    /// </summary>
    public class SaldoEnLinea : ComponenteMantenimiento {

        /// <summary>
        /// Actualiza saldos contables del movimiento, se debe usar esta lógica 
        /// cuando el comprobante contable no se encuentra almacenado
        /// en la BD,
        /// </summary> 
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.ContainsKey("actualizarsaldos")) {
                return;
            }

            if (!(bool)rqmantenimiento.Mdatos["actualizarsaldos"]) {
                return;
            }

            tconcomprobante comprobante = (tconcomprobante)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);

            List<tconcomprobantedetalle> lista = TconComprobanteDetalleDal.Find(comprobante.ccomprobante, comprobante.fcontable, comprobante.ccompania);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();
            if (rqmantenimiento.GetTabla("DETALLE") != null) {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0) {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
                if (rqmantenimiento.GetTabla("DETALLE").Lregeliminar.Count > 0) {
                    leliminar = rqmantenimiento.GetTabla("DETALLE").Lregeliminar;
                }
            }

            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);
            TconComprobanteDetalleDal.validarComprobanteDetalle(ldetalle);

            //int fcontable = int.Parse(rqmantenimiento.Mdatos["fcontable"].ToString());
            tconperiodocontable fperiodofin = TconPeriodoContableDal.GetPeriodoXfperiodofin(comprobante.fcontable);
            if (fperiodofin.periodocerrado) {
                throw new AtlasException("CONTA-014", "ERROR: PERIODO CERRADO PARA AREA CONTABLE Y/O FECHA CONTABLE NO SE ENCUENTRA DEFINIDA PARA EL PERIODO DE AJUSTE");
            }

            if (comprobante.cuadrado.Value && !comprobante.actualizosaldo.Value) {
                //mayorización de detalle del asiento contable
                SaldoHelper sh = new SaldoHelper();

                sh.Actualizar(rqmantenimiento.Response, comprobante, ldetalle.ToList<IBean>());
                comprobante.Actualizar = true;
                comprobante.actualizosaldo = true;
                rqmantenimiento.Response["mayorizado"] = "OK";
                //SaldoPresupuesto.ActualizarSaldoPresupuesto(rqmantenimiento, comprobante, ldetalle.ToList<IBean>());
            }

            //if (!rqmantenimiento.Mdatos.ContainsKey("actualizarsaldosenlinea") ) {
            //    return;
            //}

            //if (rqmantenimiento.GetTabla("TCONCOMPROBANTE") == null) return;

            //tconcomprobante cabecera = (tconcomprobante)rqmantenimiento.GetTabla("TCONCOMPROBANTE").Registro;
            //List<IBean> ldetalle = rqmantenimiento.GetTabla("TCONCOMPROBANTEDETALLE").Lregistros;
            //List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();

            //TconComprobanteDetalleDal.validarComprobanteDetalle(ldetalle);




            //bool periodoActivo;
            //periodoActivo = TconPeriodoContableDal.ValidarPeriodoContableActivo(Fecha.GetAnio(cabecera.fcontable), String.Format("{0:00}", Fecha.GetMes(cabecera.fcontable)));
            //if (!periodoActivo){
            //    rqmantenimiento.Response["mayorizado"] = "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO";
            //    throw new AtlasException("CONTA-009", "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO");
            //}

            //SaldoHelper sh = new SaldoHelper();
            //sh.Actualizar(rqmantenimiento.Response, ldetalle.ToList<IBean>());
            //rqmantenimiento.Response["mayorizado"] = "OK";

            //bool actualizarsaldopresupuesto = true;
            //if (!rqmantenimiento.Mdatos.ContainsKey("noactualizarsaldopresupuesto")) {
            //    SaldoPresupuesto.ActualizarSaldoPresupuesto(rqmantenimiento, cabecera, ldetalle);
            //}

        }

    }

}
