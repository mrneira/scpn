using cartera.datos;
using core.componente;
using dal.cartera;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.reverso {
    /// <summary>
    /// Clase que se encarga de reversar datos de tabla TcarOperacionGastosLiquida marca como reversada.
    /// </summary>
    public class ReversoTcarOperacionGastosLiquidacion : ComponenteMantenimientoReverso {

        public override void EjecutarReverso(RqMantenimiento rqmantenimiento)
        {
            TcarOperacionGastosLiquidaDal.Reversar(OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion.coperacion, rqmantenimiento.Mensajereverso);
        }
    }
}
