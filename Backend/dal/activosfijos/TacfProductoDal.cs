using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.activosfijos {

    public class TacfProductoDal
    {

        /// <summary>
        /// Metodo que entrega un registro de tacfproducto. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ckardex">Codigo kardex.</param>
        /// <returns></returns>
        public static tacfproducto Find(int cproducto){
            tacfproducto obj = null;
            String key = "" + cproducto;
            CacheStore cs = CacheStore.Instance;
            obj = (tacfproducto)cs.GetDatos("tacfproducto", key);
            if (obj == null){
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tacfproducto");
                obj = FindInDatabase(cproducto);
                m[key] = obj;
                cs.PutDatos("tacfproducto", m);
            }
            return obj;
        }

        /// <summary>
        /// Entrega un objeto tacfproducto desde la bdd
        /// </summary>
        /// <param name="cproducto">Codigo de product.</param>
        /// <returns>tacfproducto</returns>
        public static tacfproducto FindInDatabase(int cproducto){
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfproducto obj = null;
            obj = contexto.tacfproducto.Where(x => x.cproducto == cproducto).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega un objeto tacfproducto desde la bdd con el campo padre de grupo codificable
        /// </summary>
        /// <param name="cproducto">Codigo de product.</param>
        /// <returns>tacfproducto</returns>
        public static tacfproducto FindGrCodificable(int cproducto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfproducto obj = null;
            obj = contexto.tacfproducto.Where(x => x.cproducto == cproducto).SingleOrDefault();
            if (obj!=null && obj.grcodificable== false && obj.padre!=null )
            {
                return FindGrCodificable(obj.padre.Value);
            }
            else {
                return obj;
            }
            
        }

        /// <summary>
        /// Calcula el costo promedio de un producto con el nuevo movimiento
        /// </summary>
        public static decimal CalcularCostoPromedio(int cproducto, decimal cantidad, decimal valor)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            tacfproducto producto = Find(cproducto);
            if (producto == null){
                return 0;
            }else {
                valor += (producto.vunitario.Value * producto.stock.Value);
                cantidad += producto.stock.Value;
                
                return decimal.Round(valor/cantidad,5);
            }
        }        

    }

}
