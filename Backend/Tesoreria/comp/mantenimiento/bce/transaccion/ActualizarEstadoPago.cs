using core.componente;
using util.dto.mantenimiento;
using System.Threading;
using System.Globalization;

namespace tesoreria.comp.mantenimiento.bce.transaccion
{
    /// <summary>
    /// Actualizar Estado Pago
    /// </summary>
    /// <param name="rm"></param>
    public class ActualizarEstadoPago : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
        }
    }
}
