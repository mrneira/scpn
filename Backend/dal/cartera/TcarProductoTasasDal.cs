using modelo;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarProductoTasasDal {
        /// <summary>
        /// Metodo que entrega la definicion de TcarProductoTasas asociadas a un tipo de producto de cartera. Busca los datos en cahce, si no 
        /// encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <param name="cmoneda">Codigo de tipo de moneda.</param>
        /// <returns></returns>
        public static IList<tcarproductotasas> Find(int cmodulo, int cproducto, int ctipoproducto, string cmoneda) {
            IList<tcarproductotasas> ldatos = null;
            string key = "" + cmodulo + "^" + cproducto + "^" + ctipoproducto + "^" + cmoneda;
            CacheStore cs = CacheStore.Instance;
            ldatos = (List<tcarproductotasas>)cs.GetDatos("tcarproductotasas", key);
            if (ldatos == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarproductotasas");
                ldatos = FindInDataBase(cmodulo, cproducto, ctipoproducto, cmoneda);
                m[key] = ldatos;
                cs.PutDatos("TcarProductoTasasDto", m);
            }
            return ldatos;

        }

        /// <summary>
        /// Consulta en la base de datos la definicion tasas asociadas a un producto de cartera.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <param name="cmoneda">Codigo de tipo de moneda.</param>
        /// <returns></returns>
        public static IList<tcarproductotasas> FindInDataBase(int cmodulo, int cproducto, int ctipoproducto, string cmoneda) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarproductotasas.AsNoTracking().Where(x => x.cmodulo == cmodulo &&
                                                            x.cproducto == cproducto &&
                                                            x.ctipoproducto == ctipoproducto &&
                                                            x.cmoneda.Equals(cmoneda) &&
                                                            x.verreg == 0 &&
                                                            x.activo.Value.Equals(true)).ToList();
        }

    }

}
