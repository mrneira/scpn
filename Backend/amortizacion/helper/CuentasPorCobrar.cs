using System;

namespace amortizacion.helper {

    /// <summary>
    /// Clase utilitaria que contiene cargos fijos a asociar a una cuota.
    /// </summary>
    public class CuentasPorCobrar {

        /// <summary>
        /// Codigo de saldo asociado a una cuenta por cobrar.
        /// </summary>
        private String csaldo;

        /// <summary>
        /// Numero de cuota.
        /// </summary>
        private decimal numcuota;

        /// <summary>
        /// Monto de la cuenta por cobrar asociada a una cuota.
        /// </summary>
        private decimal valor;

        [Newtonsoft.Json.JsonProperty(PropertyName = "csaldo")]
        public string Csaldo { get => csaldo; set => csaldo = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "numcuota")]
        public decimal Numcuota { get => numcuota; set => numcuota = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "valor")]
        public decimal Valor { get => valor; set => valor = value; }
    }
}
