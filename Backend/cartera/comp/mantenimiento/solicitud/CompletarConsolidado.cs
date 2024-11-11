using cartera.datos;
using core.componente;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de completar datos de las operaciones de cartera que seran pagadas por la nueva solicitud.
    /// </summary>
    public class CompletarConsolidado : ComponenteMantenimiento {

        /// <summary>
        /// Completa informacion de las operaciones de cartera que seran pagadas
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("DETALLECONSOLIDADO") == null || rqmantenimiento.GetTabla("DETALLECONSOLIDADO").Lregistros.Count() < 0) {
                return;
            }

            List<IBean> loperaciones = rqmantenimiento.GetTabla("DETALLECONSOLIDADO").Lregistros;

            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            // Completa datos del pk
            CompletaPk(loperaciones, tcarsolicitud);
        }

        /// <summary>
        /// Completa el pk en la lista de operaciones a pagar en la solicitud.
        /// </summary>
        /// <param name="loperaciones">Lista de operaciones a completar el pk.</param>
        /// <param name="tcarsolicitud">Objeto de contiene los datos de solicitud del credito.</param>
        private static void CompletaPk(List<IBean> loperaciones, tcarsolicitud tcarsolicitud)
        {
            foreach (tcarsolicitudconsolidado p in loperaciones) {
                if (p.csolicitud == 0) {
                    p.csolicitud = tcarsolicitud.csolicitud;
                }
            }
        }

    }
}
