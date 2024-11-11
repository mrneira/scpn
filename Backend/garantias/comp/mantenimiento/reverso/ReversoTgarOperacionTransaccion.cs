using core.componente;
using dal.garantias;
using garantias.datos;
using modelo;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.reverso {

    /// <summary>
    /// Clase que se encarga de reversar datos de tabla TgarOperacionTransaccion.
    /// </summary>
    public class ReversoTgarOperacionTransaccion : ComponenteMantenimientoReverso {

        public override void EjecutarReverso(RqMantenimiento rqmantenimiento)
        {
            tgaroperacion tgarOperacion = OperacionFachada.GetOperacion(rqmantenimiento).getTgaroperacion();
            TgarOperacionTransaccionDal.Reverso(rqmantenimiento.Mensajereverso, tgarOperacion.coperacion);
        }

    }
}
