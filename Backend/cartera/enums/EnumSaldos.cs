using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace cartera.enums {
    /// <summary>
    /// Enumeracion que almacena codigos de saldo de cartera.
    /// </summary>
    public class EnumSaldos {

        public static readonly EnumSaldos CAPITAL = new EnumSaldos("CAP-CAR");
        public static readonly EnumSaldos INTERES = new EnumSaldos("INT-CAR");
        public static readonly EnumSaldos CUENTAXPAGAR = new EnumSaldos("CXP-CAR");
        public static readonly EnumSaldos MORA = new EnumSaldos("MORA-CAR");
        /// <summary>
        /// Codigo de saldo de una operacion de cartera.
        /// </summary>
        private String csaldo;

        /// <summary>
        ///  Crea una instancia de EnumSaldos.
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <returns></returns>
        private EnumSaldos(String csaldo) {
            this.csaldo = csaldo;
        }

        /// <summary>
        ///  Entrega el valor de: csaldo
        /// </summary>
        /// <returns>String</returns>
        public String GetCsaldo() {
            return csaldo;
        }

        /// <summary>
        /// Fija el valor de: csaldo
        /// </summary>
        /// <param name="csaldo">Valor a fijar en el atributo</param>
        /// <returns></returns>
        public void SetCsaldo(String csaldo) {
            this.csaldo = csaldo;
        }

    }

}
