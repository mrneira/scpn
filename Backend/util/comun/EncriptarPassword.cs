using System;
using System.Security.Cryptography;
using System.Text;

namespace util {

    /// <summary>
    /// Clase que se encarga de encriptar un string.
    /// </summary>
    public class EncriptarPassword {

        /// <summary>
        /// Entrega un string encriptado.
        /// </summary>
        /// <param name="password"></param>
        /// <returns></returns>
        public static string Encriptar(string password) {
            SHA256 sha1 = new SHA256CryptoServiceProvider();

            byte[] inputBytes = (new UnicodeEncoding()).GetBytes(password);
            byte[] hash = sha1.ComputeHash(inputBytes);

            return BitConverter.ToString(sha1.ComputeHash(Encoding.UTF8.GetBytes(password))).ToLower().Replace("-", "");
        }
    }
}
