using cartera.datos;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace cartera.lote.operacion {
    /// <summary>
    /// Clase que se encarga del calculo de mora por operación. Se ejecuta el dia de vencimiento de la cuota ejemplo si la cuota vence viernes se
    /// calcula el día viernes, si la cuota vence sabado o domingo se ejecuta la proxima fecha contable, Dando oportinidad de pago al cliente la
    /// proxima fecha habil.La mora se calcula desde el día de vencimeinto de la cuota.Condiderar la fecha habil de la agencia.
    /// </summary>
    public class Mora : ITareaOperacion {

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            operacion.CalcularMora(rqmantenimiento, requestoperacion.Fconatble ?? 0, rqmantenimiento.Mensaje, rqmantenimiento.Csucursal, rqmantenimiento.Ccompania, true);
        }


    }
}
