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
    /// Clase que implemeta, consultas manuales de la tabla TgenFrecuenciaDto.
    /// </summary>
    public class TgenFrecuenciaDal
    {
        /// <summary>
        ///  Metodo que entrega la definicion de una frecuencia. Busca los datos en cahce, si no encuentra los datos en cache busca en la base,
        ///  alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="cfrecuencia">Codigo de frecuencia.</param>
        /// <returns>TgenFrecuenciaDto</returns>
        public static tgenfrecuencia Find(int cfrecuencia) {
            tgenfrecuencia obj = null;
            string key = "" + cfrecuencia;
            CacheStore cs = CacheStore.Instance;

            obj = (tgenfrecuencia)cs.GetDatos("tgenfrecuencia", key);
            if (obj == null)
            {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgenfrecuencia");
                obj = FindInDataBase(cfrecuencia);
                m[key] = obj;
                cs.PutDatos("tgenfrecuencia", m);
            }
            return obj;
        }
        
        /// <summary>
        ///  Consulta en la base de datos la definicion de una frecuencia.
        /// </summary>
        /// <param name="cfrecuencia">Codigo de frecuencia.</param>
        /// <returns>TgenFrecuenciaDto</returns>
        public static tgenfrecuencia FindInDataBase(int cfrecuencia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenfrecuencia obj = null;

            obj = contexto.tgenfrecuencia.AsNoTracking().Where(x => x.cfrecuecia == cfrecuencia).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        ///  Consulta en la base de datos la definicion de una frecuencia.
        /// </summary>
        /// <param name="clegal">Codigo con el que se reporta a los organismos de control..</param>
        /// <returns>tgenfrecuencia</returns>
        public static tgenfrecuencia FindByLegal(String clegal)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenfrecuencia obj = null;

            obj = contexto.tgenfrecuencia.AsNoTracking().Where(x => x.clegal == clegal).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
         }
    }

}
