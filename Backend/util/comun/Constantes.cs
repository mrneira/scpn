using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    /// <summary>
    /// Clase que define constantes y metodos utilitarios.
    /// </summary>
    public class Constantes {

        /// <summary>
        /// Retorna true si ek valor del parameteo es 1, si es diferente de 1 retorna alse.
        /// </summary>
        /// <param name="valor">Valor a verificar si es 1.</param>
        /// <returns></returns>
        public static bool EsUno(String valor) {
            bool result = false;
            if (valor == null) {
                return false;
            }
            if (valor.CompareTo("1") == 0) {
                return true;
            }
            return result;
        }

        public static int GetParticion(int pDate) {
            return Int32.Parse(pDate.ToString().Substring(0, 6));
        }
        public const int CIEN = 100;

        public const int CERO = 0;

        public const int UNO = 1;
    }
}
