using modelo;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarConvenioDal {

        /// <summary>
        /// Metodo que entrega la definicion de los convenios de cartera. Busca los datos en cache, si no encuentra los datos en
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        public static tcarconvenio Find(int cconvenio)
        {
            tcarconvenio obj = null;
            String key = cconvenio.ToString();
            CacheStore cs = CacheStore.Instance;
            obj = (tcarconvenio)cs.GetDatos("tcarconvenio", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarconvenio");
                obj = FindInDataBase(cconvenio);
                m[key] = obj;
                cs.PutDatos("tcarconvenio", m);
            }
            return obj;
        }


        /// <summary>
        /// Busca en la base de datos la definicion de convenios.
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        public static tcarconvenio FindInDataBase(int cconvenio)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarconvenio obj = contexto.tcarconvenio.AsNoTracking().Where(x => x.cconvenio == cconvenio).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

    }

}
