using modelo;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.garantias.parametros
{
    public class TgarEstatusDal {

        /// <summary>
        /// Metodo que entrega la definicion de una estatus de una operacion de garantia. Busca los datos en cahce, si no encuentra los datos en
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <returns>TcarEstatusDto</returns>
        public static tgarestatus Find(string cestatus) {
            tgarestatus obj = null;
            string key = cestatus;
            CacheStore cs = CacheStore.Instance;
            try { 
                obj = (tgarestatus)cs.GetDatos("tgarestatus", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgarestatus");
                    obj = FindInDataBase(cestatus);
                    m[key] = obj;
                    cs.PutDatos("tcarestatus", m);
                }
                return obj;
            }
            catch
            {
                return null;
            }
        }


        /// <summary>
        /// Consulta en la base de datos la definicion de un estatus de cartera.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <returns>TcarEstatusDto</returns>
        public static tgarestatus FindInDataBase(string cestatus) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgarestatus obj = obj = contexto.tgarestatus.AsNoTracking().Where(x => x.cestatus == cestatus).SingleOrDefault();
            if(obj == null) {
                return obj;
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega el nombre asociado a un estatus de operacion de garantia.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus de la operacion.</param>
        /// <returns>String</returns>
        public static String GetNombre(String cestatus) {
            return TgarEstatusDal.Find(cestatus).nombre;
        }
    }
}
