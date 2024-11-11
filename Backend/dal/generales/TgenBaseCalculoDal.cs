using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TgenBaseCalculo.
    /// </summary>
    public class TgenBaseCalculoDal {

        /// <summary>
        /// Metodo que entrega la definicion de base de calculo. Busca los datos en cahce, si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="codigo">Codigo de parametro.</param>
        /// <param name="compania">Codigo de compania.</param>
        /// <returns></returns>
        public static tgenbasecalculo Find(string cbasecalculo) {
            tgenbasecalculo obj = null;
            string key = "" + cbasecalculo;
            CacheStore cs = CacheStore.Instance;

            obj = (tgenbasecalculo)cs.GetDatos("tgenbasecalculo", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgenbasecalculo");
                obj = FindInDataBase(cbasecalculo);
                m.TryAdd(key, obj);
                cs.PutDatos("tgenbasecalculo", m);
            }
            return obj;
        }

        /// <summary>
        /// Entrega la defincion de la base de calculo.
        /// </summary>
        /// <param name="cbasecalculo">Codigo de base de calculo.</param>
        /// <returns></returns>
        public static tgenbasecalculo FindInDataBase(string cbasecalculo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tgenbasecalculo.AsNoTracking().Where(x => x.cbasecalculo == cbasecalculo).SingleOrDefault();
        }

    }

}
