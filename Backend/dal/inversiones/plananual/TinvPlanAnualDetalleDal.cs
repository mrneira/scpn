using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.inversiones.plananual
{
   public class TinvPlanAnualDetalleDal
    {
        public static IList<tinvplananualdetalle> Find(string tipocdetalle, int anio, int cmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
           IList<tinvplananualdetalle> obj = null;
            obj = contexto.tinvplananualdetalle.Where(x => x.tipocdetalle.Equals(tipocdetalle) && x.anio == anio && x.cmodulo == cmodulo).ToList();
            tgencatalogodetalle cat = TgenCatalogoDetalleDal.Find(1226, tipocdetalle);
            if (obj == null)
            {
                throw new AtlasException("INV-012", "NO SE HA DEFINIDO UN DETALLE PLAN ANUAL PARA {0}", cat.nombre);
            }
            
            return obj;
        }
        /// <summary>
        /// Retorna un plan anual detalle de inversiones por tipo de producto
        /// </summary>
        /// <param name="tipocdetalle"></param>
        /// <param name="anio"></param>
        /// <param name="cmodulo"></param>
        /// <param name="cproducto"></param>
        /// <param name="ctipoproducto"></param>
        /// <returns></returns>
        public static tinvplananualdetalle Find(string tipocdetalle, int anio, int cmodulo,int cproducto,int ctipoproducto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvplananualdetalle obj = null;
            obj = contexto.tinvplananualdetalle.Where(x => x.tipocdetalle.Equals(tipocdetalle) && x.anio == anio && x.cmodulo == cmodulo && x.cproducto== cproducto && x.ctipoproducto == ctipoproducto).FirstOrDefault();
            tgencatalogodetalle cat = TgenCatalogoDetalleDal.Find(1226, tipocdetalle);
            tgentipoproducto tp = TgenTipoProductoDal.Find(cmodulo, cproducto, ctipoproducto);
            if (obj == null)
            {
                throw new AtlasException("INV-013", "NO SE HA DEFINIDO UN DETALLE PLAN ANUAL DE {0} PARA EL PRODUCTO {1}", cat.nombre,tp.nombre);
            }

            return obj;
        }

    }
}
