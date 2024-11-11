using modelo;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarPrelacionProductoDto.
    /// </summary>
    public class TcarPrelacionProductoDal {

        /// <summary>
        /// Metodo que entrega la definicion de prelacion de cobro de productos de cartera. Busca los datos en cache, 
        /// si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <returns>TcarPrelacionProductoDto</returns>
        public static tcarprelacionproducto Find(int cmodulo, int cproducto, int ctipoproducto)
        {
            try {
                tcarprelacionproducto obj = null;
                string key = "" + "" + cmodulo + "^" + cproducto + "^" + ctipoproducto;
                CacheStore cs = CacheStore.Instance;
                obj = (tcarprelacionproducto)cs.GetDatos("tcarprelacionproducto", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarprelacionproducto");
                    obj = FindInDataBase(cmodulo, cproducto, ctipoproducto);
                    m[key] = obj;
                    cs.PutDatos("tcarprelacionproducto", m);
                }
                return obj;
            }
            catch {
                return null;
            }
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de prelacion de cobro de productos de operaciones de cartera.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// /// <returns>TcarPrelacionProductoDto</returns>
        public static tcarprelacionproducto FindInDataBase(int cmodulo, int cproducto, int ctipoproducto)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarprelacionproducto obj = obj = contexto.tcarprelacionproducto.AsNoTracking().Where(x => x.cmodulo == cmodulo &&
                    x.cproducto == cproducto && x.ctipoproducto == ctipoproducto && x.verreg == 0).SingleOrDefault();
            return obj;
        }

    }

}
