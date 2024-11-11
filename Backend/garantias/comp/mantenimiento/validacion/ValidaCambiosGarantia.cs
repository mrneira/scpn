using cartera.enums;
using core.componente;
using dal.cartera;
using modelo;
using util;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.validacion {

    /// <summary>
    /// Clase que se encarga de completar informacion de una garantia.
    /// </summary>
    public class ValidaCambiosGarantia : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string coperaciongarantia = rqmantenimiento.Coperacion;

            if (string.IsNullOrEmpty(coperaciongarantia)) {
                throw new AtlasException("GAR-002", "NÚMERO DE OPERACIÓN DE GARANTÍA NO ENVIADO");
            }

            tcarsolicitud solicitud = TcarSolicitudGarantiasDal.FindSolicitud(coperaciongarantia);
            if (solicitud!=null) {
                if (solicitud.cestatussolicitud.CompareTo(EnumEstatus.APROVADA.Cestatus) ==0) {
                    throw new AtlasException("GAR-001", "LA GARANTÍA ESTÁ ASOCIADA A UNA SOLICITUD APROBADA");
                }
            }

        }

    }
}
