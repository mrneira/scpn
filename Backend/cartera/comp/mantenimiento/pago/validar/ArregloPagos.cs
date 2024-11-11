using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.pago.validar
{
    /// <summary>
    /// Clase que se encarga de ejecutar validacion por arreglo de pagos
    /// </summary>
    public class ArregloPagos : ComponenteMantenimiento
    {

        /// <summary>
        /// Validación de existencia de arreglo de pagos
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<tcaroperacionarreglopago> larreglo = TcarOperacionArregloPagoDal.Find(rqmantenimiento.Coperacion);

            if (larreglo.Any())
            {
                throw new AtlasException("CAR-0054", "OPERACIÓN TIENE INGRESADO UN ARREGLO DE PAGOS, NO SE PERMITE EJECUTAR TRANSACCIÓN");
            }
        }

    }
}
