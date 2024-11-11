using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.gestordocumental
{
   public class TgesArchivoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de una tgesarchivo.
        /// </summary>
        /// <param name="carchivo">Codigo de archivo al que pertenece la registro.</param>
        /// <returns></returns>
        public static tgesarchivo FindArchivo(long carchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgesarchivo obj = null;

            obj = contexto.tgesarchivo.AsNoTracking().Where(x => x.cgesarchivo == carchivo).SingleOrDefault();
            return obj;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de una tgenmodulo.
        /// </summary>
        /// <returns></returns>
        public static IList<tgesarchivo> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tgesarchivo> obj = null;
            try
            {
                obj = contexto.tgesarchivo.AsNoTracking().ToList();

            }
            catch (Exception er)
            {
                obj = null;
            }
            return obj;
        }
    }
}
