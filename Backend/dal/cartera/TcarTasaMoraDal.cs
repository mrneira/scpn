using modelo;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    public class TcarTasaMoraDal {

        /// <summary>
        /// Metodo que entrega la definicion de tasa de mora de cartera. Busca los datos en cahce, si no encuentra los datos en cache busca en la 
        /// base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="csaldomora">Codigo de saldo de mora.</param>
        /// <param name="cestatus">Codigo se estatus a buscar tasa de mora.</param>
        /// <returns></returns>
        public static tcartasamora Find(string csaldomora, string cestatus) {
            try {
                tcartasamora obj = null;
                string key = csaldomora + "^" + cestatus;
                CacheStore cs = CacheStore.Instance;
                obj = (tcartasamora)cs.GetDatos("tcartasamora", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcartasamora");
                    obj = FindInDataBase(csaldomora, cestatus);
                    //Sessionhb.GetSession().Evict(obj);
                    m[key] = obj;
                    cs.PutDatos("tcartasamora", m);
                }
                return obj;
            } catch {
                return null;
            }

        }


        /// <summary>
        /// Consulta en la base de datos la definicion de TcarTasaMora.
        /// </summary>
        /// <param name="csaldomora">Codigo de saldo de mora.</param>
        /// <param name="cestatus">Codigo se estatus a buscar tasa de mora.</param>
        /// <returns></returns>
        public static tcartasamora FindInDataBase(string csaldomora, string cestatus) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcartasamora obj = null;
            obj = contexto.tcartasamora.AsNoTracking().Where(x => x.csaldomora.Equals(csaldomora) &&
                                                    x.cestatus.Equals(cestatus)).SingleOrDefault();

            if (obj == null) {
                throw new AtlasException("BCAR-0007", "TASA DE MORA NO DEFINIDA EN TCARTASAMORA CSALDO: {0} CESTATUS: {1}", csaldomora, cestatus);
            }
            return obj;
        }


    }

}
