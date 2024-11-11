using cartera.datos;
using cartera.saldo;
using core.componente;
using modelo;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.arreglopago.validar
{
    /// <summary>
    /// Clase que se encarga de ejecutar validacion de cuentas por pagar.
    /// </summary>
    public class CuentasPorPagar : ComponenteMantenimiento
    {

        /// <summary>
        /// Validación de valores de cuentas por pagar de la operación
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            tcaroperacion tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;

            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento.Coperacion, true);
            int fcobro = (int)rqmantenimiento.Ftrabajo;
            Saldo saldo = new Saldo(operacion, fcobro);

            if (saldo.Cxp > 0)
            {
                throw new AtlasException("CAR-0055", "OPERACIÓN REGISTRA CUENTAS POR PAGAR SIN APLICAR, APLÍQUELOS PRIMERO");
            }
        }

    }
}
