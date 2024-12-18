﻿using contabilidad.saldo;
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

namespace contabilidad.comp.mantenimiento {

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

            if (!rqmantenimiento.Mdatos.ContainsKey("actualizarsaldosenlinea") ) {
                return;
            }

            if (rqmantenimiento.GetTabla("TCONCOMPROBANTE") == null) return;

            tconcomprobante cabecera;
            if (rqmantenimiento.GetTabla("TCONCOMPROBANTE").Lregistros.Count > 0) {
                cabecera = (tconcomprobante)rqmantenimiento.GetTabla("TCONCOMPROBANTE").Lregistros.ElementAt(0);
            }else {
                cabecera = (tconcomprobante)rqmantenimiento.GetTabla("TCONCOMPROBANTE").Registro;
            }
            List<IBean> ldetalle = rqmantenimiento.GetTabla("TCONCOMPROBANTEDETALLE").Lregistros;
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();

            TconComprobanteDetalleDal.validarComprobanteDetalle(ldetalle);



            bool periodoActivo;
            periodoActivo = TconPeriodoContableDal.ValidarPeriodoContableActivo(Fecha.GetAnio(cabecera.fcontable), String.Format("{0:00}", Fecha.GetMes(cabecera.fcontable)));
            if (!periodoActivo){
                rqmantenimiento.Response["mayorizado"] = "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO";
                throw new AtlasException("CONTA-009", "ERROR: PERIODO INACTIVO O NO HA SIDO CREADO");
            }

            SaldoHelper sh = new SaldoHelper();
            sh.Actualizar(rqmantenimiento.Response, cabecera, ldetalle.ToList<IBean>());
            rqmantenimiento.Response["mayorizado"] = "OK";

            //bool actualizarsaldopresupuesto = true;
            if (!rqmantenimiento.Mdatos.ContainsKey("noactualizarsaldopresupuesto")) {
                SaldoPresupuesto.ActualizarSaldoPresupuesto(rqmantenimiento, cabecera, ldetalle);
            }

        }

    }

}
