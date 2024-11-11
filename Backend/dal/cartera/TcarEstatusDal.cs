using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarEstatusDal {

        /// <summary>
        /// Metodo que entrega la definicion de una estatus de una operacion de cartera. Busca los datos en cahce, si no encuentra los datos en
        /// cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <returns>TcarEstatusDto</returns>
        public static tcarestatus Find(string cestatus) {
            tcarestatus obj = null;
            string key = cestatus;
            CacheStore cs = CacheStore.Instance;
            try {
                obj = (tcarestatus)cs.GetDatos("tcarestatus", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarestatus");
                    obj = FindInDataBase(cestatus);
                    m[key] = obj;
                    cs.PutDatos("tcarestatus", m);
                }
                return obj;
            } catch {
                return null;
            }
        }


        /// <summary>
        /// Consulta en la base de datos la definicion de un estatus de cartera.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <returns>TcarEstatusDto</returns>
        public static tcarestatus FindInDataBase(string cestatus) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarestatus obj = obj = contexto.tcarestatus.AsNoTracking().Where(x => x.cestatus == cestatus).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

        /// <summary>
        /// Retorna la lista de todos los estatus
        /// </summary>
        /// <returns></returns>
        public static IList<tcarestatus> FindAll() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcarestatus> ldata = contexto.tcarestatus.AsNoTracking().ToList();
            return ldata;
        }

        /// <summary>
        /// Metodo que entrega el nombre asociado a un estatus de operacion de cartera.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus de la operacion.</param>
        /// <returns>String</returns>
        public static String GetNombre(String cestatus) {
            return TcarEstatusDal.Find(cestatus).nombre;
        }
    }
}
