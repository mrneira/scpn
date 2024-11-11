using core.componente;
using dal.cartera;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.util {

    /// <summary>
    /// Clase que llena informacion en la tabla tcaroperaciontransaccion. Esta tabla 
    /// sirve para hacer conultas de transacciones a reversar.
    /// </summary>
    public class Transaccion : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            String coperacion = rqmantenimiento.Coperacion;
            // El cobro se aplica con fecha de trabajo, ejempl sabado se cobra mora hasta ese día.

            // Distribuye el valor pagago y ejecuta el monetario del cobro.
            decimal? monto = rqmantenimiento.Monto;
            if (monto == null || monto < Constantes.CERO) {
                throw new AtlasException("CAR-0019", "MONTO TOTAL DE LA TRANSACCION NO ENVIADO");
            }
            TcarOperacionTransaccionDal.Crear(rqmantenimiento, coperacion, rqmantenimiento.Fconatable, (int)rqmantenimiento.Ftrabajo, (decimal)monto);

        }

    }

}
