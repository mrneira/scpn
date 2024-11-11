using cartera.enums;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.interfaces.lote;
using util.dto.lote;

namespace cartera.lote.fin {
    /// <summary>
    /// Clase que se encarga de cerrar la aplicacion de descuentos.
    /// </summary>
    public class DescuentosPago : ITareaFin {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            tcardescuentos descuento = TcarDescuentosDal.FindNoPagada();
            if (descuento == null) {
                return;
            }

            // Si existen registros por procesar no cerrar aplicacion de descuentos.
            if (this.VerificaFaltantes(descuento.particion)) {
                return;
            }

            // Archivos de descuentos.
            TcarDescuentosDal.Actualizar(descuento.particion, EnumEstatus.PAGADO.Cestatus, requestmodulo.Fconatble, requestmodulo.Cusuario);
        }

        /// <summary>
        /// Metodo que se encarga de verificar la existencia de registros faltantes de ejecucion.
        /// </summary>
        private Boolean VerificaFaltantes(int particion)
        {
            List<tcardescuentosdetalle> ldescuentos = TcarDescuentosDetalleDal.FindPendiente(particion);
            if (ldescuentos.Count > 0) {
                return true;
            }
            return false;
        }
    }
}
