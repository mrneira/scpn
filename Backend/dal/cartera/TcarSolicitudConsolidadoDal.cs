using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacion.
    /// </summary>
    public class TcarSolicitudConsolidadoDal {
        /// <summary>
        /// Consulta en la base de datos la definicion de una operacion de cartera, y bloquea el registro en la base de datos.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud de cartera.</param>
        /// <returns>TcarOperacionDto</returns>
        public static List<tcarsolicitudconsolidado> FindBySolicitud(long? csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcarsolicitudconsolidado> ldatos = contexto.tcarsolicitudconsolidado.AsNoTracking().Where(x => x.csolicitud.Equals(csolicitud)).ToList();
            return ldatos;
        }
    }
}
