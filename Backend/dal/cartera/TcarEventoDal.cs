using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera
{
    public class TcarEventoDal
    {

        /// <summary>
        /// Metodo que entrega la definicion de un evento de cartera. Busca los datos en cahce, si no encuentra los datos en cache busca en la  base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cevento">Codigo de evento.</param>
        /// <returns>TcarEventoDto</returns>
        public static tcarevento Find(String cevento) {
            tcarevento obj = null;
            String key = cevento;
            CacheStore cs = CacheStore.Instance;
            obj = (tcarevento)cs.GetDatos("tcarevento", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarevento");
                obj = FindInDataBase(cevento);
                m[key] = obj;
                cs.PutDatos("TcarEventoDto", m);
            }
            return obj;
        }


        /// <summary>
        /// Consulta en la base de datos la definicion de un evento.
        /// </summary>
        /// <param name="cevento">Codigo de evento.</param>
        /// <returns>TcarEventoDto</returns>
        public static tcarevento FindInDataBase(String cevento) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarevento obj = contexto.tcarevento.AsNoTracking().Where(x => x.cevento == cevento).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

    }

}
