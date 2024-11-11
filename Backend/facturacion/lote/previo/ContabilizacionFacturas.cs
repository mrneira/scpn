using facturacion.util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.dto.mantenimiento;

namespace facturacion.lote.previo {

    /// <summary>
    /// Clase que se encarga de contabilizar facturas.
    /// </summary>
    public class ContabilizacionFacturas : ITareaPrevia {

        /// <summary>
        /// Ejecuta la contabilizacion de facuras consolida en un comprobante por sucursal, agencia y transaccion origen.
        /// </summary>
        /// <param name="requestmodulo"></param>
        /// <param name="ctarea"></param>
        /// <param name="orden"></param>
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden) {
            ContabilizaFacturaConsolidada cf = new ContabilizaFacturaConsolidada();
            cf.Ejecutar((RqMantenimiento)requestmodulo.GetDatos("RQMANTENIMIENTO"));
        }
    }
}
