using contabilidad.saldo;
using core.componente;
using core.servicios;
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

namespace contabilidad.comp.mantenimiento {

    /// <summary>
    /// Clase que se encarga de actualziar saldos contables de un comprobante contable.
    /// </summary>
    public class Saldo : ComponenteMantenimiento {

        /// <summary>
        /// Actualiza saldos contables del movimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.ContainsKey("actualizarsaldos") ) {
                return;
            }

            if (!(bool)rqmantenimiento.Mdatos["actualizarsaldos"])
            {
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

            bool periodoActivo;
            periodoActivo = TconPeriodoContableDal.ValidarPeriodoContableActivo(Fecha.GetAnio(comprobante.fcontable), String.Format("{0:00}", Fecha.GetMes(comprobante.fcontable)));
            if (!periodoActivo){
                rqmantenimiento.Response["mayorizado"] = "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO";
                throw new AtlasException("CONTA-009", "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO");
            }

            if (comprobante.cuadrado.Value && !comprobante.actualizosaldo.Value)
            {
                //mayorización de detalle del asiento contable
                SaldoHelper sh = new SaldoHelper();

                sh.Actualizar(rqmantenimiento.Response, comprobante, ldetalle.ToList<IBean>());
                comprobante.Actualizar = true;
                comprobante.actualizosaldo = true;
                rqmantenimiento.Response["mayorizado"] = "OK";
                SaldoPresupuesto.ActualizarSaldoPresupuesto(rqmantenimiento, comprobante, ldetalle.ToList<IBean>());
            }

        }
    }

}
