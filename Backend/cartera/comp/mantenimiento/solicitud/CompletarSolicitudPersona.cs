using cartera.datos;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de completar datos de las personas asociadas a la solicitud.
    /// </summary>
    public class CompletarSolicitudPersona : ComponenteMantenimiento {
        /// <summary>
        /// Objeto de contiene los datos de solicitud del credito.
        /// </summary>
        private tcarsolicitud tcarsolicitud;

        /// <summary>
        /// Completa informacion de las personas asociadas a la solicitud de credito.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("TCARSOLICITUDPERSONA") == null || rqmantenimiento.GetTabla("TCARSOLICITUDPERSONA").Lregistros.Count() < 0) {
                return;
            }

            List<IBean> lpersona = rqmantenimiento.GetTabla("TCARSOLICITUDPERSONA").Lregistros;

            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud = solicitud.Tcarsolicitud;
            // Completa datos del pk de las personas aso
            CompletarSolicitudPersona.CompletaPk(lpersona, solicitud);
            // Fija el cliente principal a la solicitud.
            SetCpersonaEnSolicitud(rqmantenimiento, lpersona);
            // Valida que la solicitud tenga asociado un tutular.
            if (tcarsolicitud.cpersona == null) {
                throw new AtlasException("CAR-0001", "SOLICITUD: {0} NO TIENE ASOCIADA UNA PERSONA", tcarsolicitud.csolicitud);
            }
        }

        /// <summary>
        /// Completa el pk en la lista de personas asociadas a la solicitud.
        /// </summary>
        /// <param name="lpersona">Lista de personas a completar el pk.</param>
        /// <param name="solicitud">Objeto que contiene informacion de la solicitud.</param>
        private static void CompletaPk(List<IBean> lpersona, Solicitud solicitud)
        {
            foreach (tcarsolicitudpersona p in lpersona) {
                if (p.csolicitud == 0) {
                    p.csolicitud = solicitud.Tcarsolicitud.csolicitud;
                }
            }
        }

        private void SetCpersonaEnSolicitud(RqMantenimiento rqmantenimiento, List<IBean> lpersona)
        {
            List<IBean> leliminados = rqmantenimiento.GetTabla("TCARSOLICITUDPERSONA").Lregeliminar;
            IList<tcarsolicitudpersona> lbasedatos = TcarSolicitudPersonaDal.Find(tcarsolicitud.csolicitud, (int)tcarsolicitud.ccompania);

            // Obtiene los registros almaceados previamente en la base.
            List<IBean> lfinal = DtoUtil.GetMergedList(lbasedatos.Cast<IBean>().ToList(), lpersona.Cast<IBean>().ToList(), leliminados);

        }
    }
}
