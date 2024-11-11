using modelo;
using modelo.helper;
using System.Linq;
using util.servicios.ef;


namespace dal.ArchivosBI
{
   public class TgenDocumentosBIDal
    {
        /// <summary>
        /// Entrega Documento de Inteligencia de Negocio.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cdocumento">Codigo de documento.</param>
        /// <returns></returns>
        public static tgendocumentosbi Find(int cmodulo, int cdocumento)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgendocumentosbi obj = null;

            obj = contexto.tgendocumentosbi.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.cdocumento == cdocumento).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
    }
}
