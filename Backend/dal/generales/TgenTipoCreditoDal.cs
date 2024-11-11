using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenTipoCreditoDal {

        public static tgentipocredito Find(String ctipocredito) {
            tgentipocredito obj = null;
            String key = "" + ctipocredito;
            CacheStore cs = CacheStore.Instance;
		    obj = (tgentipocredito) cs.GetDatos("tgentipocredito", key);
		    if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgentipocredito");
                obj = FindInDataBase(ctipocredito);
                m[key] = obj;
                cs.PutDatos("tgentransaccion", m);
            }
		    return obj;
	}

        public static tgentipocredito FindInDataBase(string ctipocredito) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgentipocredito obj = null;

            obj = contexto.tgentipocredito.AsNoTracking().Where(x => x.ctipocredito == ctipocredito).SingleOrDefault();
            EntityHelper.SetActualizar(obj);
            return obj;
        }

    }
}
