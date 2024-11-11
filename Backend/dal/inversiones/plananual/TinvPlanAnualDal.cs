using dal.generales;
using modelo;
using modelo.helper;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.inversiones.plananual
{
   public class TinvPlanAnualDal
    {
        /// <summary>
        /// Método que entrega un plan anual por tipo, año y módulo
        /// </summary>
        /// <param name="tipocdetalle"></param>
        /// <param name="anio"></param>
        /// <param name="cmodulo"></param>
        /// <returns></returns>
        public static tinvplananual Find(string tipocdetalle,int anio,int cmodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvplananual obj = null;
            obj = contexto.tinvplananual.Where(x => x.tipocdetalle.Equals(tipocdetalle) && x.anio==anio && x.cmodulo==cmodulo).SingleOrDefault();
            tgencatalogodetalle cat = TgenCatalogoDetalleDal.Find(1226, tipocdetalle);
            if (obj == null)
            {
                throw new AtlasException("INV-012", "NO SE HA DEFINIDO UN PLAN ANUAL PARA {0}", cat.nombre);
            }
         
            return obj;
        }
        public static decimal getSaldoTipoProducto(int cmodulo,int cproducto,int ctipoproducto)
        {
            decimal total = 0;
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string lSQL = "EXEC sp_CarConSaldoPlanAnual @cmodulo,@cproducto,@ctipoproducto";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros.Add("@cmodulo", cmodulo);
            parametros.Add("@cproducto", cproducto);
            parametros.Add("@ctipoproducto", ctipoproducto);
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSQL);
          
            IList<Dictionary<string, object>> lista = ch.GetRegistrosDictionary();

            if (lista != null && lista.Count > 0)
            {
                total = decimal.Parse(lista[0]["saldo"].ToString());
            }
            return total;
        }


    }
}
