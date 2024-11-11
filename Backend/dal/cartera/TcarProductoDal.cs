using System;
using modelo;
using System.Linq;
using util.servicios.ef;
using util;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarProducto.
    /// </summary>
    public class TcarProductoDal {

        /// <summary>
        /// Metodo que entrega la definicion de un producto de cartera.Busca los datos en cahce, si no encuentra los datos en cache busca en la
        /// base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>

        public static tcarproducto Find(int cmodulo, int cproducto, int ctipoproducto) {
            try {
                tcarproducto obj = null;
                string key = "" + "" + cmodulo + "^" + cproducto + "^" + ctipoproducto;
                CacheStore cs = CacheStore.Instance;
                obj = (tcarproducto)cs.GetDatos("tcarproducto", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarproducto");
                    obj = FindInDataBase(cmodulo, cproducto, ctipoproducto);
                    m[key] = obj;
                    cs.PutDatos("tcarproducto", m);
                }
                return obj;
            } catch {
                return null;
            }
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de un producto de cartera.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        public static tcarproducto FindInDataBase(int cmodulo, int cproducto, int ctipoproducto) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarproducto obj = obj = contexto.tcarproducto.AsNoTracking().Where(x => x.cmodulo == cmodulo &&
                    x.cproducto == cproducto && x.ctipoproducto == ctipoproducto && x.verreg == 0).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Consulta todos los productos que se encuentran en la base de datos para el módulo seleccionado
        /// </summary>
        /// <param name="cmodulo"></param>        
        /// <returns></returns>
        public static List<tcarproducto> FindAllInModule(int cmodulo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcarproducto> obj = contexto.tcarproducto.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.verreg == 0).ToList();
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos el tipo de operacion.
        /// </summary>
        /// <returns>IList<TcarOperacionDto></returns>
        public static tcarproducto FindTipoOperacion(String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarproducto pro = null;
            tcaroperacion obj = contexto.tcaroperacion.AsNoTracking().Where(x => x.coperacion == coperacion).SingleOrDefault();
            if (obj == null) {
                return pro;
            }

            pro = contexto.tcarproducto.AsNoTracking().Where(x => x.cmodulo == obj.cmodulo &&
                                                                               x.cproducto == obj.cproducto &&
                                                                               x.ctipoproducto == obj.ctipoproducto &&
                                                                               x.verreg == 0).SingleOrDefault();
            return pro;
        }
    }
}
