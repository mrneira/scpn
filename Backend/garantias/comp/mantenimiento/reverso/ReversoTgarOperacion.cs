using core.componente;
using dal.garantias;
using garantias.datos;
using modelo;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.reverso {

    /// <summary>
    /// Clase que se encarga de reversar datos de tabla TgarOperacion marca como reversada.
    /// </summary>
    public class ReversoTgarOperacion : ComponenteMantenimientoReverso {

        public override void EjecutarReverso(RqMantenimiento rqmantenimiento)
        {
            tgaroperacion tgarOperacion = OperacionFachada.GetOperacion(rqmantenimiento).getTgaroperacion();
            if (rqmantenimiento.Mensajereverso.CompareTo(tgarOperacion.mensaje) == 0) {
                TgarOperacionDal.Reversar(tgarOperacion);
            }
        }

    }
}
