using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.reverso.arreglopago {

    /// <summary>
    /// Clase que se encarga de reversar en pago de arreglo de pagos en la tabla tcaroperacionarreglopago.
    /// </summary>
    public class ReversoPagoArregloPago : ComponenteMantenimientoReverso {

        /// <summary>
        /// Ejecuta reverso de cobro de arreglo de pagos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void EjecutarReverso(RqMantenimiento rqmantenimiento) {
            // Marcar como reversada la transaccion.
            tcaroperacion tcarOperacion = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;
            TcarOperacionArregloPagoDal.ReversarPago(tcarOperacion.coperacion);
        }
    }
}