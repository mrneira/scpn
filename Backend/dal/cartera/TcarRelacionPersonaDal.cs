using modelo;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarRelacionPersonaDal {

        /// <summary>
        /// Metodo que entrega la definicion de una persona de una operacion de cartera. Busca los datos en cahce, si no encuentra los datos en
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="crelacion">Codigo de relacion.</param>
        /// <returns>TcarRelacionPersonaDto</returns>
        public static tcarrelacionpersona Find(int crelacion)
        {
            tcarrelacionpersona obj = null;
            string key = crelacion.ToString();
            CacheStore cs = CacheStore.Instance;
            try {
                obj = (tcarrelacionpersona)cs.GetDatos("tcarrelacionpersona", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarrelacionpersona");
                    obj = FindInDataBase(crelacion);
                    m[key] = obj;
                    cs.PutDatos("tcarrelacionpersona", m);
                }
                return obj;
            }
            catch {
                return null;
            }
        }


        /// <summary>
        /// Consulta en la base de datos la definicion de relacion de personas.
        /// </summary>
        /// <param name="crelacion">Codigo de estatus.</param>
        /// <returns>TcarRelacionPersonaDto</returns>
        public static tcarrelacionpersona FindInDataBase(int crelacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarrelacionpersona obj = obj = contexto.tcarrelacionpersona.AsNoTracking().Where(x => x.crelacion == crelacion).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega el nombre asociado a una relacion de persona.
        /// </summary>
        /// <param name="crelacion">Codigo de estatus de relacion de persona.</param>
        /// <returns>String</returns>
        public static String GetNombre(int crelacion)
        {
            return TcarRelacionPersonaDal.Find(crelacion).nombre;
        }
    }
}
