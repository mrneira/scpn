using modelo;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarEstadoOperacionDal {

        /// <summary>
        /// Metodo que entrega la definicion de un estado de operacion de cartera. Busca los datos en cache, si no encuentra los datos busca en la
        /// base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cestadooperacion">Codigo de estado de operacion.</param>
        /// <returns></returns>
        public static tcarestadooperacion Find(string cestadooperacion)
        {
            try {
                tcarestadooperacion obj = null;
                CacheStore cs = CacheStore.Instance;
                string key = "" + cestadooperacion;
                obj = (tcarestadooperacion)cs.GetDatos("tcarestadooperacion", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarestadooperacion");
                    obj = TcarEstadoOperacionDal.FindInDataBase(cestadooperacion);
                    m.TryAdd(key, obj);
                    cs.PutDatos("tcarestadooperacion", m);
                }
                return obj;
            }
            catch {
                return null;
            }
        }


        /// <summary>
        /// Entrega la defincion de estado de operacion de cartera.
        /// </summary>
        /// <param name="cestadooperacion">Codigo de estado de operacion</param>
        /// <returns></returns>
        public static tcarestadooperacion FindInDataBase(string cestadooperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarestadooperacion.AsNoTracking().Where(x => x.cestadooperacion.Equals(cestadooperacion)).SingleOrDefault();
        }

    }

}
