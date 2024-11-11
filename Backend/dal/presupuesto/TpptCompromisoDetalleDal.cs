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

    public class TpptCompromisoDetalleDal
    {

        public static void Completar(RqMantenimiento rqmantenimiento, tpptcompromisodetalle detalle, string ccompromiso)
        {
            detalle.ccompromiso = ccompromiso;
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
                detalle.aniofiscal = int.Parse(detalle.Mdatos["aniofiscal"].ToString());
             }
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle)
        {
            string ccompromiso = rqmantenimiento.Mdatos["ccompromiso"].ToString();
            foreach (tpptcompromisodetalle obj in ldetalle)
            {
                TpptCompromisoDetalleDal.Completar(rqmantenimiento, obj, ccompromiso);
            }
        }

        public static List<tpptcompromisodetalle> FindXCcompromiso(string ccompromiso)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpptcompromisodetalle> lista = new List<tpptcompromisodetalle>();
            lista = contexto.tpptcompromisodetalle.AsNoTracking().Where(x => x.ccompromiso == ccompromiso).OrderBy(x => x.secuencia).ToList();
            return lista;
        }

        public static tpptcompromisodetalle Find(string ccompromiso, string cpartidagasto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpptcompromisodetalle obj = null;
            obj = contexto.tpptcompromisodetalle.Where(x => x.ccompromiso.Equals(ccompromiso) && x.cpartidagasto.Equals(cpartidagasto)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
    }

}
