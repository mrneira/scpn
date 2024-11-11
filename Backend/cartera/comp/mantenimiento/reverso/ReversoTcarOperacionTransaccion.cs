using core.componente;
using dal.cartera;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.reverso {
    /// <summary>
    /// Clase que se encarga de reversar datos de tabla TcarOperacionTransaccion.
    /// </summary>
    public class ReversoTcarOperacionTransaccion : ComponenteMantenimientoReverso {
        public override void EjecutarReverso(RqMantenimiento rqmantenimiento)
        {
            // Reversa la operacion al estado anterior si se paga la operacion completa.
            // Marcar como reversada la transaccion.
            TcarOperacionTransaccionDal.Reverso(rqmantenimiento.Coperacion, rqmantenimiento.Mensajereverso);
        }
    }
}
