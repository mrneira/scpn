using cartera.cobro;
using cartera.cobro.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.pago {
    /// <summary>
    ///     Clase que se encarga de ejecutar el cobro normal de operaciones.
    ///     Cobra el valor de cuotas vencidas, si existe un saldo a favor del cliente se envia a una cuenta por pagar, la cual es utilizada en el
    ///     batch en el vencimiento de la proxima cuota, o se aplica en proximo pago.
    /// </summary>
    public class PagoNormal : PagoHelper {

        /// <summary>
        /// Ejecuta el cobro normar de una operacion de cartera.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            // Inicializa variables utilizadas en el cobro.
            saldo.Saldo saldo = base.Inicializar(rqmantenimiento);

            // En pagos normales se cobra el valor de cuotas vencidas, si existe un saldo va a CXP.
            base.valorpagado = this.Sumavalorescxp(rqmantenimiento, saldo, (decimal)base.valorpagado);
            // Ejecuta el cobro de cuotas.
            Cobro cobro = new Cobro(saldo, (decimal)valorpagado, fcobro);

            decimal valornoaplicado = cobro.Ejecutar(rqmantenimiento, false, true);

            //credito a cxp, de valores no aplicados a la operacion.
            if (valornoaplicado > Constantes.CERO) {
                base.cxp.Credito(rqmantenimiento, valornoaplicado);
            }
            // Marca la operacion como pagada si se cancela todas las cuotas.
            cobro.MarcaOperacionPagada();
        }

        /// <summary>
        /// Si el valor pendiente de pago para la operacion es mayor al pagado. Si tiene un saldo en CXP debita y 
        /// adiciona el valor al valor a aplicar a la operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="saldo">Objeto que contiene los saldos de la operacion.</param>
        /// <param name="valorpagado">Monto pagado.</param>
        /// <returns>decimal</returns>
        private decimal Sumavalorescxp(RqMantenimiento rqmantenimiento, saldo.Saldo saldo, decimal valorpagado) {
            decimal faltante = valorpagado - saldo.Totalpendientepago;
            // Busca fondos en cuentas por pagar.
            if (faltante > Constantes.CERO) {
                return valorpagado;
            }
            decimal valorcxp = cxp.BuscamontoDebita(rqmantenimiento, Math.Abs(faltante));
            valorpagado += valorcxp;
            return valorpagado;
        }

    }

}
