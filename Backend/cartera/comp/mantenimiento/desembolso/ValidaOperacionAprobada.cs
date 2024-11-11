using cartera.datos;
using core.componente;
using dal.cartera;
using util;
using modelo;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.desembolso {
    /// <summary>
    /// Clase que se valida que la solicitud este en estatus aprobada para realizar el desembolso.
    /// </summary>
    public class ValidaOperacionAprobada : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tcaroperacion tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            // En el desembolso el estatus de la operacion tiene que ser aprobada.
            if (!tcaroperacion.cestatus.Equals("APR")) {
                throw new AtlasException("CAR-0003", "OPERACION: {0} ESTA EN ESTATUS: {1}", tcaroperacion.coperacion,
                        TcarEstatusDal.GetNombre(tcaroperacion.cestatus));
            }
        }
    }
}
