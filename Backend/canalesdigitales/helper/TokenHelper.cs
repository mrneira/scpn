using System;
using util;

namespace canalesdigitales.helper {
    internal class TokenHelper {
        /// <summary>
        /// Método que genera token
        /// </summary>
        /// <returns></returns>
        public static string GenerarToken() {
            string strEncriptado = EncriptarPassword.Encriptar(Convert.ToString(Fecha.GetFechaSistema().Ticks)).ToUpper();
            return strEncriptado.Substring(0, 30);
        }
    }
}
