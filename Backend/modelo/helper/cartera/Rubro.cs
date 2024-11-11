using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace modelo.helper.cartera {

    /// <summary>
    /// Clase que que contiene valores volatiles de rubros asociados a cuotas de una tabla de pagos.
    /// </summary>
    public class Rubro : AbstractDto {
        /// <summary>
        /// Valor pendiente de pago asociado al rubro.
        /// </summary>
        private decimal pendiente;

        /// <summary>
        /// Monto pagado en la transaccion.
        /// </summary>
        private decimal pagadoentransaccion;

        /// <summary>
        /// Indica desde cuando se calcual el accrual, I Inico, V vencimiento.
        /// </summary>
        private string accrualdesde;

        /// <summary>
        /// Indica hasta cuando se calcula el accrual, V vencimiento, P pago.
        /// </summary>
        private string accrualhasta;

        /// <summary>
        /// Bandera que indica que inerto un registro para reverso en la transaccion.
        /// </summary>
        private bool registroregistrosreverso = false;

        public virtual bool Registroregistrosreverso { get => registroregistrosreverso; set => registroregistrosreverso = value; }

        /// <summary>
        /// Entrega el valor de: pendiente
        /// </summary>
        /// <returns></returns>
        public virtual decimal GetPendiente() {
            return this.pendiente;
        }

        /// <summary>
        /// Fija el valor de: pendiente
        /// </summary>
        /// <param name="pendiente">Valor pendiente de pago asociado al rubro.</param>
        public virtual void SetPendiente(decimal pendiente) {
            this.pendiente = pendiente;
        }

        /// <summary>
        /// Entrega el valor de: pagadoentransaccion
        /// </summary>
        /// <returns></returns>
        public virtual decimal GetPagadoentransaccion() {
            return this.pagadoentransaccion;
        }

        /// <summary>
        /// Fija el valor de: pagadoentransaccion
        /// </summary>
        /// <param name="pagadoentransaccion">Monto pagado en la transaccion.</param>
        public virtual void SetPagadoentransaccion(decimal pagadoentransaccion) {
            this.pagadoentransaccion = pagadoentransaccion;
        }

        /// <summary>
        /// Entrega el valor de: accrualdesde
        /// </summary>
        /// <returns></returns>
        public virtual string GetAccrualdesde() {
            return this.accrualdesde;
        }

        /// <summary>
        /// Fija el valor de: accrualdesde
        /// </summary>
        /// <param name="accrualdesde"></param>
        public virtual void SetAccrualdesde(string accrualdesde) {
            this.accrualdesde = accrualdesde;
        }

        /// <summary>
        /// Entrega el valor de: accrualhasta
        /// </summary>
        /// <returns></returns>
        public virtual string GetAccrualhasta() {
            return this.accrualhasta;
        }

        /// <summary>
        /// Fija el valor de: accrualhasta
        /// </summary>
        /// <param name="accrualhasta"></param>
        public virtual void SetAccrualhasta(string accrualhasta) {
            this.accrualhasta = accrualhasta;
        }
    }

}
