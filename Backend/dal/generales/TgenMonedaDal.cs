using modelo;
using modelo.helper;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales
{
    public class TgenMonedaDal
    {
        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="modulo">Codigo de modulo al que pertenece la transaccion.</param>
        /// <param name="transaccion">Codigo de transaccion</param>
        /// <returns>TgenMonedaDto</returns>
        public static tgenmoneda Find(string cmoneda)
        {
            tgenmoneda obj = null;
            string key = "" + cmoneda;
            CacheStore cs = CacheStore.Instance;

            obj = (tgenmoneda)cs.GetDatos("tgenmoneda", key);
            if (obj == null)
            {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgentransaccion");
                obj = FindInDataBase(cmoneda);
                m[key] = obj;
                cs.PutDatos("tgenmoneda", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una transaccion.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo al que pertenece la transaccion.</param>
        /// <param name="ctransaccion">Codigo de transaccion</param>
        /// <returns></returns>
        public static tgenmoneda FindInDataBase(string cmoneda)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenmoneda obj = null;

            obj = contexto.tgenmoneda.AsNoTracking().Where(x => x.cmoneda == cmoneda).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }


        /**
		 * Metodo que entrega el numero de decimales de una moneda.
		 * @param cmoneda Codigo de moneda.
		 * @return Integer
		 * @throws Exception
		 */
        public static int GetDecimales(String cmoneda)
        {
            return (int)TgenMonedaDal.Find(cmoneda).decimales;
        }
    }
}
