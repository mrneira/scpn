using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarSolicitudEtapaDal {

        /// <summary>
        /// Entrega la etapas de la solicitud.
        /// </summary>
        /// <param name="csolicitud">Codigo de solicitud.</param>
        /// <returns>List</returns>
        public static List<tcarsolicitudetapa> Find(int csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudetapa.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
        }

        /// <summary>
        /// Entrega la etapa actual de la solicitud.
        /// </summary>
        /// <param name="csolicitud">Codigo de solicitud.</param>
        /// <returns>tcarsolicitudetapa</returns>
        public static tcarsolicitudetapa FindActual(int csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarsolicitudetapa obj = null;
            obj = contexto.tcarsolicitudetapa.AsNoTracking().Where(x => x.csolicitud == csolicitud
                                                                     && x.cetapa == contexto.tcarsolicitudetapa.Where(e => e.csolicitud == csolicitud)
                                                                                                               .Max(m => m.cetapa)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
    }
}

