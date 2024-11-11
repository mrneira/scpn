using cartera.datos;
using cartera.enums;
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
    public class CompletarSolicitudAbsorcion : ComponenteMantenimiento {

        /// <summary>
        /// Completa informacion de las operaciones de cartera que seran pagadas
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("OPERACIONESPORPERSONA") == null || rqmantenimiento.GetTabla("OPERACIONESPORPERSONA").Lregistros.Count() < 0) {
                return;
            }

            List<IBean> loperaciones = rqmantenimiento.GetTabla("OPERACIONESPORPERSONA").Lregistros;

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
            foreach (tcarsolicitudabsorcion p in loperaciones) {
                //if (p.csolicitud == 0) {
                    p.csolicitud = tcarsolicitud.csolicitud;
                    p.esarreglopago = tcarsolicitud.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion) ? false : true;
                //}
            }
        }

    }
}
