using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace talentohumano.enums
{
    
    /// <summary>
    /// Enumeracion que almacena tipo  de ingreso en nomina.
    /// </summary>
    public class EnumSaldo
    {

        public static readonly EnumSaldo FONDORESERVA = new EnumSaldo("FONRES");
        public static readonly EnumSaldo HORAEXTRA = new EnumSaldo("HOREXT");
        public static readonly EnumSaldo DTERCERO = new EnumSaldo("DECTER");
        public static readonly EnumSaldo DCUARTO = new EnumSaldo("DECCUA");
        public static readonly EnumSaldo SUELDO = new EnumSaldo("SUELDO");
        public static readonly EnumSaldo APORTEIESS = new EnumSaldo("APOIES");
        public static readonly EnumSaldo IMPUESTORENTA = new EnumSaldo("RETIRE");
        public static readonly EnumSaldo OTRING = new EnumSaldo("OTRBON");
        public static readonly EnumSaldo OTRDES = new EnumSaldo("OTRDES");

        /// <summary>
        /// Codigo de estado de nomina.
        /// </summary>
        private String valor;

        /// <summary>
        /// Entrega o fija el valor de: estado
        /// </summary>
        public string Value{ get => valor; set => valor = value; }

        /// <summary>
        /// Crea una instancia de EnumsIngreso.
        /// </summary>
        /// <param name="cestatus">Codigo de estado de nomina.</param>
        private EnumSaldo(String valor)
        {
            this.Value = valor;
        }
    }
}
