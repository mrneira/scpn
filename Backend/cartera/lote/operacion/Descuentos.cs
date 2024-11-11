using cartera.datos;
using cartera.descuentos;
using modelo;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace cartera.lote.operacion {
    /// <summary>
    /// Clase que se encarga de ejecutar los descuentos.
    /// </summary>
    public class Descuentos : ITareaOperacion {

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            int particion = Constantes.GetParticion((int)requestoperacion.Ftrabajo);

            VerificarDescuentos descuentos = new VerificarDescuentos();
            descuentos.Verificar(rqmantenimiento, operacion, particion, false);
        }
    }
}


