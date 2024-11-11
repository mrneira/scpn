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

namespace dal.seguridades {

    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TsegPoliticaDal {
        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="ccanal">Codigo de canal</param>
        /// <returns></returns>
        public static tsegpolitica Find(int ccompania, string ccanal) {
            tsegpolitica obj = null;
            string key = "" + ccompania + "^" + ccanal;
            CacheStore cs = CacheStore.Instance;

            obj = (tsegpolitica)cs.GetDatos("tsegpolitica", key);
            if(obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tsegpolitica");
                obj = FindInDataBase(ccompania, ccanal);
                Sessionef.GetAtlasContexto().Entry(obj).State = System.Data.Entity.EntityState.Detached;
                m.TryAdd(key, obj);
                cs.PutDatos("tsegpolitica", m);
            }
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de una transaccion.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo al que pertenece la transaccion.</param>
        /// <param name="ctransaccion">Codigo de transaccion</param>
        /// <returns></returns>
        public static tsegpolitica FindInDataBase(int ccompania, string ccanal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegpolitica obj = null;

            obj = contexto.tsegpolitica.AsNoTracking().Where(x => x.ccompania == ccompania && x.ccanal == ccanal).SingleOrDefault();
            if(obj == null) {
                throw new AtlasException("BSEG-002", "POLITICA DE SEGURIDAD NO DEFINIDA");
            }
            return obj;
        }

        public static tsegpolitica FindPorCanal(string ccanal) {
            tsegpolitica obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsegpolitica.AsNoTracking().Where(x => x.ccanal == ccanal).SingleOrDefault();
            return obj;
        }
    }
}
