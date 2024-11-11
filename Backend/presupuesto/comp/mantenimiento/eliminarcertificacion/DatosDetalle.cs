using core.componente;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace presupuesto.comp.mantenimiento.eliminarcertificacion
{
    class DatosDetalle : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetDatos("ccertificacion") == null)
            {
                // cuando da mantenimiento del valor de certificacion.
                return;
            }
            string ccertificacion = rqmantenimiento.Mdatos["ccertificacion"].ToString();
            List<tpptcertificaciondetalle> lista = TpptCertificacionDetalleDal.FindXCcertificacion(ccertificacion);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();
            tpptpartidagasto pg = null;
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
            }
            TpptCertificacionDetalleDal.Completar(rqmantenimiento, lmantenimiento);

            if (pg == null && lbase.Count > 0)
            {
                foreach (IBean bean in lbase)
                {
                    tpptcertificaciondetalle cd = (tpptcertificaciondetalle)bean;
                    pg = TpptPartidaGastoDal.Find(cd.cpartidagasto, cd.aniofiscal);
                    if (rqmantenimiento.GetDatos("actualizarvalorcertificacion") != null)
                    {
                        string actualizarvalorcertificacion = rqmantenimiento.Mdatos["actualizarvalorcertificacion"].ToString();
                        TpptPartidaGastoDal.ActulizarAfectaEliminarCertificacion(rqmantenimiento, pg, cd);
                    }
                }
            }
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);
        }
    }
}
