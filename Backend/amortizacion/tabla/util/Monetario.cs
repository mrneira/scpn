using System;
using System.Collections.Generic;
using System.Text;
using util;

namespace amortizacion.tabla.util {
    /// <summary>
    /// Calse utilitaria, que se usa para la contabilizacion de tabla de de pagos acumulada por codigo contable, tipo de saldo.
    /// </summary>
    public class Monetario {

        /** Codigo contable */
        private String codigocontable;
        /** Codigo de tipo de saldo. */
        private String csaldo;
        /** Valor a contabilizar. */
        private decimal valor = Constantes.CERO;
        /** Numero de operacion, ejemplo prestamo o certificado de deposito. */
        private String coperacion;
        /** Codigo de rubro con el cual se ejecuta la transaccion monetaria. */
        private int rubro;
        /** Codigo de estatus de la cuota. */
        private String cestatus;
        
        /// <summary>
        /// Crea una instancia de Monetario.
        /// </summary>
        /// <param name="codigocontable">Codigo contable.</param>
        /// <param name="csaldo">Codigo de tipo de saldo.</param>
        public Monetario(String codigocontable, String csaldo) {
            this.codigocontable = codigocontable;
            this.csaldo = csaldo;
        }
        
        /// <summary>
        /// Entrega el valor de: codigocontable
        /// </summary>
        public String GetCodigocontable() {
            return this.codigocontable;
        }
        
        /// <summary>
        /// Fija el valor de: codigocontable
        /// </summary>
        public void SetCodigocontable(String codigocontable) {
            this.codigocontable = codigocontable;
        }
        
        /// <summary>
        /// Entrega el valor de: csaldo
        /// </summary>
        public String GetCsaldo() {
            return this.csaldo;
        }

        /// <summary>
        /// Fija el valor de: csaldo
        /// </summary>
        public void SetCsaldo(String csaldo) {
            this.csaldo = csaldo;
        }
        
        /// <summary>
        /// Entrega el valor de: valor
        /// </summary>
        public decimal GetValor() {
            return this.valor;
        }
        
        /// <summary>
        /// Fija el valor de: valor
        /// </summary>
        public void SetValor(decimal valor) {
            this.valor = valor;
        }
        
        /// <summary>
        /// Entrega el valor de: coperacion
        /// </summary>
        public String GetCoperacion() {
            return this.coperacion;
        }
        
        /// <summary>
        /// Fija el valor de: coperacion
        /// </summary>
        public void SetCoperacion(String coperacion) {
            this.coperacion = coperacion;
        }
        
        /// <summary>
        /// Entrega el valor de: rubro
        /// </summary>
        public int GetRubro() {
            return this.rubro;
        }
        
        /// <summary>
        /// Fija el valor de: rubro
        /// </summary>
        public void SetRubro(int rubro) {
            this.rubro = rubro;
        }
        
        /// <summary>
        /// Entrega el valor de: cestatus
        /// </summary>
        public String GetCestatus() {
            return this.cestatus;
        }
        
        /// <summary>
        /// Fija el valor de: cestatus
        /// </summary>
        public void SetCestatus(String cestatus) {
            this.cestatus = cestatus;
        }

    }
}
