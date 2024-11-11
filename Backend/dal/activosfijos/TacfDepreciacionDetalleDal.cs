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

namespace dal.activosfijos {

    public class TacfDepreciacionDetalleDal
    {

        public static void Completar(RqMantenimiento rqmantenimiento, tacfhistorialdepreciacion detalle, int cdepreciacion)
        {
           
        }

        public static void Completar(RqMantenimiento rqmantenimiento, List<IBean> ldetalle)
        {
            int cdepreciacion = int.Parse(rqmantenimiento.Mdatos["cdepreciacion"].ToString());
   
            foreach (tacfhistorialdepreciacion obj in ldetalle)
            {

                obj.cdepreciacion = cdepreciacion;
                obj.vidautil = Convert.ToInt32( obj.Mdatos["vidautil"]);
                obj.valorcompra = Convert.ToDecimal(obj.Mdatos["valorcompra"]);
                obj.valorresidual = Convert.ToDecimal(obj.Mdatos["valorresidual"]);
                obj.valordepreciable = Convert.ToDecimal(obj.Mdatos["valordepreciacion"]);
                obj.valdepperiodo = Convert.ToDecimal(obj.Mdatos["valordepperiodo"]);
                obj.ccuentadepreciacion = obj.Mdatos["ccuentadepreciacion"].ToString();
                obj.ccuentadepreciacionacum = obj.Mdatos["ccuentadepreciacionacum"].ToString();
                obj.centrocostoscdetalle = obj.Mdatos["centrocostoscdetalle"].ToString();

                obj.valorlibros = Convert.ToDecimal(obj.Mdatos["valorlibros"]);
            }

          
        }

        /// <summary>
        /// Entrega listado de las depreciaciones 
        /// </summary>
        /// <param name="cdepreciacion"></param>
        /// <returns></returns>
        public static List<tacfhistorialdepreciacion> FindXCdepreciacion(int cdepreciacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfhistorialdepreciacion> lista = new List<tacfhistorialdepreciacion>();
            lista = contexto.tacfhistorialdepreciacion.AsNoTracking().Where(x => x.cdepreciacion == cdepreciacion).OrderBy(x => x.secuencia).ToList();
            return lista;
        }

        /// <summary>
        /// Metodo de Busqueda para historial de depreciaciones 
        /// </summary>
        /// <param name="cdepreciacion"></param>
        /// <returns></returns>

        public static tacfhistorialdepreciacion Find(int cdepreciacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfhistorialdepreciacion obj = null;
            obj = contexto.tacfhistorialdepreciacion.Where(x => x.cdepreciacion == cdepreciacion).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        

    }

}
