using modelo;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera
{
    public class TcarSolicitudDescuentosDal
    {
        /// <summary>
        /// Consulta en la base de datos las condiciones de descuento de la solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>TcarSolicitudDescuentos</returns>
        public static tcarsolicituddescuentos Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarsolicituddescuentos obj = null;
            obj = contexto.tcarsolicituddescuentos.AsNoTracking().Where(x => x.csolicitud == csolicitud).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            return obj;
        }
    }
}
