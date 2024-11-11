using cartera.datos;
using core.componente;
using dal.tesoreria;
using modelo;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de pago de prendario.
    /// </summary>
    public class PagoPrendario : ComponenteMantenimiento {

        /// <summary>
        /// Validación de pago prendario de Solicitud
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;

            if (tcarsolicitud.cproducto.Equals(2)) {
                ttesrecaudaciondetalle recaudacion = TtesRecaudacionDetalleDal.FindByCodigoOperacionPago(7, 95, tcarsolicitud.csolicitud.ToString(), "3"); // PAGADO
                if (recaudacion == null) {
                    throw new AtlasException("CAR-0078", "NO SE HA REGISTRADO EL PAGO DE ANTICIPO DE VEHÍCULO");
                }
            }
        }

    }
}