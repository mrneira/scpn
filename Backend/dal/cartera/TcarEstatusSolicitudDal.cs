using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera
{
    public class TcarEstatusSolicitudDal
    {
        /// <summary>
        /// Metodo que entrega la definicion de una estatus de una operacion de cartera. Busca los datos en cahce, si no encuentra los datos en
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <returns>TcarEstatusSolicitudDto</returns>
        public static tcarestatussolicitud Find(String cestatus)
        {
            tcarestatussolicitud obj = null;
            String key = cestatus;
            CacheStore cs = CacheStore.Instance;
            obj = (tcarestatussolicitud)cs.GetDatos("tcarestatussolicitud", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarestatussolicitud");
                obj = FindInDataBase(cestatus);
                m[key] = obj;
                cs.PutDatos("tcarestatussolicitud", m);
            }
            return obj;
        }


        /// <summary>
        /// Consulta en la base de datos la definicion de un estatus de solictudes de cartera.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <returns>TcarEstatusSolicitudDto</returns>
        public static tcarestatussolicitud FindInDataBase(string cestatus) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarestatussolicitud obj = contexto.tcarestatussolicitud.Where(x => x.cestatussolicitud.Equals(cestatus)).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }
    }
}

