using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.depreciacion
{

    /// <summary>
    /// Clase que se encarga de completar información del detalle de un depreciacion .
    /// </summary>
    public class DatosDetalle : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            int cdepreciacion = int.Parse(rqmantenimiento.Mdatos["cdepreciacion"].ToString());
            List<tacfhistorialdepreciacion> lista = TacfDepreciacionDetalleDal.FindXCdepreciacion(cdepreciacion);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();
            if (rqmantenimiento.GetTabla("DETALLE") != null)
            {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0)
                {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
                if (rqmantenimiento.GetTabla("DETALLE").Lregeliminar.Count > 0)
                {
                    leliminar = rqmantenimiento.GetTabla("DETALLE").Lregeliminar;
                }
                TacfDepreciacionDetalleDal.Completar(rqmantenimiento, lmantenimiento);
                List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);
            }



        }

    }
}
