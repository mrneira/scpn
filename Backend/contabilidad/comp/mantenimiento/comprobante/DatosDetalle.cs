using core.componente;
using dal.contabilidad;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.comprobante {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class DatosDetalle : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            string ccomprobante = (string)rqmantenimiento.Mdatos["ccomprobante"];
            int fcontable = int.Parse(rqmantenimiento.Mdatos["fcontable"].ToString());
            List<tconcomprobantedetalle> lista  = TconComprobanteDetalleDal.Find(ccomprobante, fcontable, rqmantenimiento.Ccompania);
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

            TconComprobanteDetalleDal.Completar(rqmantenimiento, lmantenimiento);
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);
            
        }
    }
}
