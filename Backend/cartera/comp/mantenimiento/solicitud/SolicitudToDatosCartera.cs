using cartera.datos;
using core.componente;
using core.servicios;
using dal.cartera;
using modelo;
using System.Linq;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud {

    /// <summary>
    /// Clase que se encarga de crear un objeto solicitud, que se almacena en el threadlocal DatosCartera, adicionalmente completa el numero de solicitud.
    /// </summary>
    public class SolicitudToDatosCartera : ComponenteMantenimiento {

        /// <summary>
        /// Completa numero de solicitud, o obtiene de la base el numero de solicitud cuando se esta dando mantenimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            Solicitud existesolicitud = SolicitudFachada.GetSolicitud();
            if (existesolicitud != null) {
                return;
            }

            tcarsolicitud tcarsolicitud = null;
            if (rqmantenimiento.GetTabla("TCARSOLICITUD") == null) {
                tcarsolicitud = TcarSolicitudDal.FindWithLock((long)rqmantenimiento.GetLong("csolicitud"));
            } else {
                tcarsolicitud = (tcarsolicitud)rqmantenimiento.GetTabla("TCARSOLICITUD").Lregistros.ElementAt(0);
            }
            if (tcarsolicitud.csolicitud == 0) {
                SolicitudToDatosCartera.SetNumeroSolicitud(rqmantenimiento, tcarsolicitud);
            }

            Solicitud solicitud = new Solicitud(tcarsolicitud);
            SolicitudFachada.SetSolicitud(solicitud);
            rqmantenimiento.AddDatos("csolicitud", tcarsolicitud.csolicitud);
            rqmantenimiento.Response["csolicitud"] = tcarsolicitud.csolicitud;
        }

        /// <summary>
        /// Completa el numero de solicitud, crea una instancia e TgenSolicitudDto y lo adiciona al request de mantenimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el que se ejecuta la transaccion.</param>
        /// <param name="tcarsolicitud">Objeto que contiene datos de una solicitud de cartera.</param>
        private static void SetNumeroSolicitud(RqMantenimiento rqmantenimiento, tcarsolicitud tcarsolicitud) {
            // Simulacion retorna tabla
            if ((rqmantenimiento.Mdatos.ContainsKey("essimulacion") && (bool)rqmantenimiento.Mdatos["essimulacion"]) &&
                (rqmantenimiento.Mdatos.ContainsKey("rollback") && (bool)rqmantenimiento.Mdatos["rollback"])) {
                tcarsolicitud.csolicitud = 999999999;
            } else {
                tcarsolicitud.csolicitud = Secuencia.GetProximovalor("SOLICITUD");
            }

            tgensolicitud tgs = new tgensolicitud();
            tgs.csolicitud = tcarsolicitud.csolicitud;
            rqmantenimiento.AdicionarTabla("TGENSOLICITUD", tgs, false);
        }

    }
}
