using cartera.datos;
using cartera.descuentos;
using core.componente;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.descuentos {

    /// <summary>
    /// Clase que se encarga de ejecutar la simulacion de descuentos.
    /// </summary>
    public class Simulacion : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            int particion = Constantes.GetParticion((int)rqmantenimiento.Ftrabajo);

            VerificarDescuentos descuentos = new VerificarDescuentos();
            descuentos.Verificar(rqmantenimiento, operacion, particion, true);
        }

    }
}
