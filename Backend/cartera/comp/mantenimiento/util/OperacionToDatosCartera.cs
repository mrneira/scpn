using cartera.datos;
using core.componente;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.util {

    /// <summary>
    /// Clase que se encarga de crear un objeto Operacion, que se almacena en el threadlocal DatosCartera, 
    /// el numero de operacion lo toma del request.
    /// </summary>
    public class OperacionToDatosCartera : ComponenteMantenimiento {

        /// <summary>
        /// Obtiene los datos de la operacion, si no esta en el threadlocal lee informacion de base y alamcena en el threadlocal.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            operacion.Coperacion = operacion.tcaroperacion.coperacion;
        }
    }
}
