using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarPerfilTipoProducto.
    /// </summary>
    public class TcarPerfilTipoProductoDal {

        /// <summary>
        ///  Metodo que entrega la definicion de una frecuencia. Busca los datos en cahce, si no encuentra los datos en cache busca en la base,
        ///  alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cmodulo"></param>
        /// <param name="cproducto"></param>
        /// <param name="ctipoproducto"></param>
        /// <param name="csaldo"></param>
        /// <returns>tcarperfiltipoproducto</returns>
        public static tcarperfiltipoproducto Find(int cmodulo, int cproducto, int ctipoproducto, string csaldo) {
            tcarperfiltipoproducto obj = null;
            string key = "" + cmodulo + "^" + cproducto + "^" + ctipoproducto + "^" + csaldo;
            CacheStore cs = CacheStore.Instance;

            obj = (tcarperfiltipoproducto)cs.GetDatos("tcarperfiltipoproducto", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarperfiltipoproducto");
                obj = FindInDataBase(cmodulo, cproducto, ctipoproducto, csaldo);
                m[key] = obj;
                cs.PutDatos("tcarperfiltipoproducto", m);
            }
            return obj;
        }

        /// <summary>
        /// Entrega la definicion de un perfil contable del tipo de producto.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo</param>
        /// <param name="cproducto">Codigo de producto</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto</param>
        /// <param name="csaldo">Codigo de rubro</param>
        /// <returns></returns>
        public static tcarperfiltipoproducto FindInDataBase(int cmodulo, int cproducto, int ctipoproducto, string csaldo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarperfiltipoproducto obj = contexto.tcarperfiltipoproducto.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.cproducto == cproducto && x.ctipoproducto == ctipoproducto && x.csaldo.Equals(csaldo) ).SingleOrDefault();
            if (obj == null) {
                throw new AtlasException("BCAR-0031", "PERFIL CONTABLE NO DEFINIDO EN TCARPERFILTIPOPRODUCTO MODULO: {0} PRODUCTO: {1} TIPO PRODUCTO: {2} RUBRO: {3}", cmodulo, cproducto, ctipoproducto, csaldo);
            }
            return obj;
        }

    }
}
