using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.solicitud.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones de montos en la solicitud.
    /// </summary>
    public class Montos : ComponenteMantenimiento {
        
        /// <summary>
        /// Validación de montos de Solicitud
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            tcarproducto p = TcarProductoDal.Find((int)tcarsolicitud.cmodulo, (int)tcarsolicitud.cproducto, (int)tcarsolicitud.ctipoproducto);
            if (p.montominimo > (tcarsolicitud.montooriginal)) {
                throw new AtlasException("CAR-0025", "MONTO DE LA SOLICITUD NO PUEDE SER MENOR A: {0}", p.montominimo);
            }

            if (p.montomaximo < (tcarsolicitud.montooriginal)) {
                throw new AtlasException("CAR-0026", "MONTO DE LA SOLICITUD NO PUEDE SER MAYOR A: {0}", p.montomaximo);
            }
        }
    }
}
