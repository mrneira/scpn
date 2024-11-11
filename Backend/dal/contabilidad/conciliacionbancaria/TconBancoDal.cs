using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.contabilidad.conciliacionbancaria {

    public class TconBancoDal {

        /// <summary>
        /// Busca en cache la defincicon de un banco, si no existe busca en la base de datos, si no exite en la base retorna null.
        /// </summary>
        /// <param name="ccuenta">Numero de cuenta contable a buscar en tcajbanco, si no existe retorna null.</param>
        /// <returns></returns>
        public static tconbanco Find(string ccuenta) {
            try {
                tconbanco obj = null;
                string key = "" + ccuenta;
                CacheStore cs = CacheStore.Instance;
                obj = (tconbanco)cs.GetDatos("tconbanco", key);
                if (obj == null) {
                    obj = FindInDataBase(ccuenta);
                }
                if (obj == null) {
                    return obj; // si no existe en la base de datos retorna null esto indica que la cuneta contable no es de conciliacion, NO CAMBIAR.
                }
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tconbanco");
                m[key] = obj;
                cs.PutDatos("tconbanco", m);
                return obj;
            } catch {
                return null;
            }
        }

        /// <summary>
        /// Busca en la base de datos  definicion de una cuenta banco.
        /// </summary>
        /// <param name="ccuenta">Numero de cuenta contable a buscar en la definicion de bancos.</param>
        /// <returns></returns>
        public static tconbanco FindInDataBase(string ccuenta) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconbanco obj = obj = contexto.tconbanco.AsNoTracking().Where(x => x.ccuenta == ccuenta).SingleOrDefault();
            return obj;
        }

    }

}
