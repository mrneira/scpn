using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarSolicitudReincorporadoDal {

        /// <summary>
        /// Consulta los datos de reincorporado en la solicitud
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns></returns>
        public static tcarsolicitudreincorporado Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudreincorporado.AsNoTracking().Where(x => x.csolicitud == csolicitud).SingleOrDefault();
        }

        /// <summary>
        /// Consulta el valor de reincorporado de la solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>valor</returns>
        public static decimal ValorReincorporado(long csolicitud)
        {
            decimal valor = Constantes.CERO;
            tcarsolicitudreincorporado reincorporado = Find(csolicitud);
            if (reincorporado != null) {
                valor = reincorporado.monto;
            }
            return valor;
        }
    }
}
