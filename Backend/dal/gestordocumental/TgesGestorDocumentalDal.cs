using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using util.servicios.ef;

namespace dal.gestordocumental
{
    public class TgesGestorDocumentalDal
    {
        public static tgesarchivo FindByCodigoArchivo(long cgesarchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            tgesarchivo tgesarchivo = null;
            try
            {
                tgesarchivo = contexto.tgesarchivo
                    .Where(x => x.cgesarchivo == cgesarchivo)
                    .SingleOrDefault();
            }
            catch (Exception err) {
                tgesarchivo = null;
            }
            return tgesarchivo;
        }

    }
}
