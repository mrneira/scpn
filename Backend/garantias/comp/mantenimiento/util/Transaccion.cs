using core.componente;
using dal.garantias;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.util {

    /// <summary>
    /// Clase que se encarga de completar informacion del avaluo de una garantia.
    /// </summary>
    public class Transaccion : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string coperacion = rqmantenimiento.Coperacion;
            // El cobro se aplica con fecha de trabajo, ejempl sabado se cobra mora hasta ese día.

            // Distribuye el valor pagago y ejecuta el monetario del cobro.
            Decimal monto = rqmantenimiento.Monto;
            if ((monto.CompareTo(Decimal.Zero) < 0)) {
                throw new AtlasException("GAR-0003", "MONTO TOTAL DE LA TRANSACCION NO ENVIADO");
            }
            TgarOperacionTransaccionDal.Crear(rqmantenimiento, coperacion, rqmantenimiento.Fconatable, rqmantenimiento.Ftrabajo??0,
                    monto);
        }

    }
}
