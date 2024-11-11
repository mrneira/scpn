using dal.tesoreria;
using modelo;
using System.Collections.Generic;
using tesoreria.enums;
using util.dto.interfaces.lote;
using util.dto.lote;

namespace cartera.lote.fin {
    /// <summary>
    /// Clase que se encarga de totalizar la generacion de descuentos.
    /// </summary>
    public class RecaudacionPago : ITareaFin {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            ttesrecaudacion recaudacion = TtesRecaudacionDal.Find((int)requestmodulo.Ftrabajo, 7, 70);
            List<ttesrecaudaciondetalle> ldetalle = TtesRecaudacionDetalleDal.FindByCodigoCabecera(recaudacion.crecaudacion, ((int)EnumTesoreria.EstadoRecaudacionCash.Cobrado).ToString());
            if (recaudacion.registrosrecibido == ldetalle.Count) {
                // Actualiza registro de recaudacion
                TtesRecaudacionDal.ActualizarCobrosPagado(recaudacion, ldetalle, requestmodulo);
            }
        }
    }
}
