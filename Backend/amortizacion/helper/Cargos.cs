using System;
using System.Collections.Generic;
using System.Text;

namespace amortizacion.helper
{
    
    /// <summary>
    /// Clase utilitaria que contiene cargos fijos a asociar a una cuota.
    /// </summary>
    public class Cargos {
        
        /// <summary>
        /// Codigo de saldo asociado a un cargo.
        /// </summary>
        private String csaldo;
        
        /// <summary>
        /// Monto del cargo fijo a asociar a una cuota.
        /// </summary>
        private decimal valor;

        [Newtonsoft.Json.JsonProperty(PropertyName = "csaldo")]
        public string Csaldo { get => csaldo; set => csaldo = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "valor")]
        public decimal Valor { get => valor; set => valor = value; }
    }
}
