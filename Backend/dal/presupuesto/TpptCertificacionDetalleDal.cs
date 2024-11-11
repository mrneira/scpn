using dal.generales;
using dal.monetario;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.presupuesto {

    public class TpptCertificacionDetalleDal
    {

        public static void Completar(RqMantenimiento rqmantenimiento, tpptcertificaciondetalle detalle, string ccertificacion)
        {
            detalle.ccertificacion = ccertificacion;
            if (detalle.cusuarioing == null)
            {
                detalle.cusuarioing = rqmantenimiento.Cusuario;
                detalle.fingreso = rqmantenimiento.Freal;
                detalle.cpartidagasto = detalle.Mdatos["cpartidagasto"].ToString();
                detalle.aniofiscal = int.Parse( detalle.Mdatos["aniofiscal"].ToString());
            }
            else
            {
                detalle.cusuariomod = rqmantenimiento.Cusuario;
                detalle.fmodificacion = rqmantenimiento.Freal;
                detalle.cpartidagasto = detalle.Mdatos["cpartidagasto"].ToString();
                //detalle.aniofiscal = rqmantenimiento;
             }
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle)
        {
            string ccertificacion = rqmantenimiento.Mdatos["ccertificacion"].ToString();
            foreach (tpptcertificaciondetalle obj in ldetalle)
            {
                TpptCertificacionDetalleDal.Completar(rqmantenimiento, obj, ccertificacion);
            }
        }

        public static List<tpptcertificaciondetalle> FindXCcertificacion(string ccertificacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpptcertificaciondetalle> lista = new List<tpptcertificaciondetalle>();
            lista = contexto.tpptcertificaciondetalle.AsNoTracking().Where(x => x.ccertificacion == ccertificacion).OrderBy(x => x.secuencia).ToList();
            return lista;
        }

        //public static tpptcompromisodetalle Find(string ccompromiso, string cpartidagasto)
        //{
        //    AtlasContexto contexto = Sessionef.GetAtlasContexto();
        //    tpptcompromisodetalle obj = null;
        //    obj = contexto.tpptcompromisodetalle.Where(x => x.ccompromiso.Equals(ccompromiso) && x.cpartidagasto.Equals(cpartidagasto)).SingleOrDefault();
        //    if (obj != null)
        //    {
        //        EntityHelper.SetActualizar(obj);
        //    }
        //    return obj;
        //}
    }

}
