using cartera.comp.mantenimiento.util;
using cartera.enums;
using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.pagoextraordinario {

    /// <summary>
    /// Clase que se encarga de ejecutar transaccion monetaria de la regeneracion de tabla en el pago extraordinaro en operaciones de credito.
    /// </summary>
    public class MonetarioRegeneracionTabla : ComponenteMantenimiento {

        /// <summary>
        /// Genera y contabiliza nueva tabla de amortizacion.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            new MonetarioTablaPagos(rqmantenimiento, EnumEventos.REGENERATABLAPAGEXTRAORDINARIO.Cevento);
        }
    }
}
