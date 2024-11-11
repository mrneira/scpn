using dal.cartera;
using modelo;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;

namespace cartera.lote.fin {
    /// <summary>
    /// Clase que se encarga de totalizar la generacion de descuentos.
    /// </summary>
    public class Descuentos : ITareaFin {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            // Valida fecha de ejecucion
            tcardescuentoscalendario calendario = TcarDescuentosCalendarioDal.FindEjecucion(requestmodulo.Fconatble);
            if (calendario != null) {

                int particion = Constantes.GetParticion((int)requestmodulo.Ftrabajo);

                // Datos consolidados de descuentos
                TcarDescuentosDal.Eliminar(particion);
                TcarDescuentosDal.InsertDescuentos(particion, requestmodulo.Fconatble);

                // Archivos de descuentos
                TcarDescuentosArchivoDal.Eliminar(particion);
                TcarDescuentosArchivoDal.InsertArchivos(particion, requestmodulo.Fconatble);
            }
        }

    }
}
