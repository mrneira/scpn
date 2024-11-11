using dal.cartera;
using util.dto.interfaces.lote;
using util.dto.lote;

namespace cartera.lote.fin {
    /// <summary>
    /// Clase que se encarga de obtener e insertar saldos 
    /// </summary>
    public class SaldoCierre : ITareaFin {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            // Crea Saldos de cierre de cartera
            TcarSaldoCierreDal.InsertarSaldos(requestmodulo, ctarea, orden);

            // Actualiza saldos de cobranzas
            TcarSaldoCierreDal.ActualizarCobranzas(requestmodulo, ctarea, orden);
        }
    }
}
