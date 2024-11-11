using cartera.datos;
using core.componente;
using modelo;
using System.Linq;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de completar datos para reincorporado.
    /// </summary>
    public class CompletarSolicitudReincorporado : ComponenteMantenimiento {

        /// <summary>
        /// Completa informacion para reincorporado
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("SOLICITUDREINCORPORADO") == null || rqmantenimiento.GetTabla("SOLICITUDREINCORPORADO").Lregistros.Count() < 0) {
                return;
            }
            tcarsolicitudreincorporado reincorporado = (tcarsolicitudreincorporado)rqmantenimiento.GetTabla("SOLICITUDREINCORPORADO").Lregistros.ElementAt(0);

            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            // Completa datos del pk
            CompletaPk(reincorporado, tcarsolicitud);
        }

        /// <summary>
        /// Completa el pk en instancia de reincorporado de la solicitud.
        /// </summary>
        /// <param name="reincorporado">Instancia de reincorporado a completar el pk.</param>
        /// <param name="tcarsolicitud">Objeto de contiene los datos de solicitud del credito.</param>
        private static void CompletaPk(tcarsolicitudreincorporado reincorporado, tcarsolicitud tcarsolicitud)
        {
            reincorporado.csolicitud = tcarsolicitud.csolicitud;
        }

    }
}
