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
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenCargaArchivoDal {


        /// <summary>
        /// Metodo que entrega la definicion de un tipo de archvio. Si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <returns>TgenCargaArchivoDto</returns>
        public static tgencargaarchivo Find(int cmodulo,int ctipoarchivo) {

            tgencargaarchivo obj = null;
            string key = "" +cmodulo +ctipoarchivo;
            CacheStore cs = CacheStore.Instance;

            obj = (tgencargaarchivo)cs.GetDatos("tgencargaarchivo", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tgencargaarchivo");
                obj = FindInDataBase(cmodulo,ctipoarchivo);
                //Sessionhb.GetSession().Evict(obj);
                m.TryAdd(key, obj);
                cs.PutDatos("tgencargaarchivo", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de un tipo de archivo.
        /// </summary>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <returns>TgenCargaArchivoDto</returns>
        public static tgencargaarchivo FindInDataBase(int cmodulo,int ctipoarchivo)
        {
            tgencargaarchivo obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tgencargaarchivo.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.ctipoarchivo == ctipoarchivo).SingleOrDefault();
            if (obj == null)
            {
                throw new AtlasException("BGEN-017", "TIPO DE ARCHVIO: {0} NO DEFINIDO", ctipoarchivo);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

    }

}
