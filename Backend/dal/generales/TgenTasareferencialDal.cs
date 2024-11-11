using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TgenTasareferencial.
    /// </summary>
    public class TgenTasareferencialDal {

        /// <summary>
        /// Metodo que entrega la definicion de una tasa referencial. Busca los datos en cahce, si no encuentra los datos en cache busca en la 
        /// base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ctasareferencial">Codigo de tasa referencial.</param>
        /// <param name="cmoneda">Codigo de moneda.</param>
        /// <returns></returns>
        public static tgentasareferencial Find(int ctasareferencial, string cmoneda) {
            tgentasareferencial obj = null;
            String key = "" + ctasareferencial + "^" + cmoneda;
            CacheStore cs = CacheStore.Instance;
            obj = (tgentasareferencial)cs.GetDatos("tgentasareferencial", key);
            if (obj == null) {
                ConcurrentDictionary<String, Object> m = cs.GetMapDefinicion("tgentasareferencial");
                obj = FindInDataBase(ctasareferencial, cmoneda);
                m[key] = obj;
                cs.PutDatos("tgentasareferencial", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una tasa refencial.
        /// </summary>
        /// <param name="ctasareferencial">Codigo de tasa referencial.</param>
        /// <param name="cmoneda">Codigo de moneda.</param>
        /// <returns></returns>
        public static tgentasareferencial FindInDataBase(int ctasareferencial, string cmoneda) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgentasareferencial obj = null;

            obj = contexto.tgentasareferencial.AsNoTracking().Where(x => x.ctasareferencial == ctasareferencial && x.cmoneda == cmoneda).SingleOrDefault();
            if (obj == null)
            {
                throw new AtlasException("BGEN-008", "TASA REFERENCIAL NO DEFINIDA CTASAREFERENCIAL: {0} COMONEDA: {1}", ctasareferencial, cmoneda);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

    }

}
