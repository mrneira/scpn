using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera
{
    public class TcarCuentaPorCobrarDal {

        /// <summary>
        /// Metodo que entrega la definicion de una estatus de una operacion de cartera. Busca los datos en cahce, si no encuentra los datos en
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        public static tcarcuentaporcobrar Find(string csaldo) {
            tcarcuentaporcobrar obj = null;
            String key = csaldo;
            CacheStore cs = CacheStore.Instance;
            obj = (tcarcuentaporcobrar)cs.GetDatos("tcarcuentaporcobrar", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarcuentaporcobrar");
                obj = FindInDataBase(csaldo);
                m[key] = obj;
                cs.PutDatos("tcarcuentaporcobrar", m);
            }
            return obj;
        }


        /// <summary>
        /// Busca en la base de datos la definicion de una cuenta por cobrar.
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        public static tcarcuentaporcobrar FindInDataBase(string csaldo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarcuentaporcobrar obj = contexto.tcarcuentaporcobrar.AsNoTracking().Where(x => x.csaldo == csaldo).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

    }

}
