using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarSolicitudAbsorcionDal {

        /// <summary>
        /// Consulta los datos de las operaciones de cartera que seran pagadas por la nueva operacion
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns></returns>
        public static IList<tcarsolicitudabsorcion> Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudabsorcion.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
        }
    }
}
