using cartera.cobro.helper;
using dal.cartera;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.arreglopago {

    /// <summary>
    /// Clase que se encarga de realizar la valiacion y registro de arreglo de pagos por operacion.
    /// </summary>
    public class IngresoArregloPagoOperacion : PagoHelper {

        public override void Ejecutar(RqMantenimiento rqm)
        {
            if (rqm.GetTabla("TCAROPEARREGLOPAGO") == null || !rqm.GetTabla("TCAROPEARREGLOPAGO").Lregistros.Any()) {
                return;
            }

            tcaroperacionarreglopago ap = (tcaroperacionarreglopago)rqm.GetTabla("TCAROPEARREGLOPAGO").Lregistros.ElementAt(0);
            // TODO Valida opreacion arrelgo de pago existente
            List<tcaroperacionarreglopago> l = TcarOperacionArregloPagoDal.Find(ap.coperacion);
            if (l.Any()) {
                throw new AtlasException("CAR-0053", "YA EXISTE UN ARREGLO DE PAGOS PARA LA OPERACIÓN: {0}", ap.coperacion);
            }
            ap.cestatus = "ING";
            ap.cusuarioingreso = rqm.Cusuario;
            ap.fingreso = rqm.Fproceso;

            Boolean pagoobligatorio = false;
            List<IBean> lrubros = rqm.GetTabla("RUBROSARREGLOPAGO").Lregistros;
            foreach (tcaroperacionarrepagorubro rubro in lrubros) {
                if (rubro.pagoobligatorio != null && rubro.pagoobligatorio == true) {
                    pagoobligatorio = true;
                    break;
                }
            }
            if (!pagoobligatorio) {
                ap.cestatus = "PAG";
                ap.fpago = rqm.Ftrabajo;
            }
        }

    }
}
