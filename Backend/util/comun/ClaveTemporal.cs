using System;
using System.Security.Cryptography;
using System.Text;

namespace util {

    /// <summary>
    /// Clase que utilitaria, encargada de crear y entregar una clave temporal para banca enlinea.
    /// </summary>
    public class ClaveTemporal {

        private static readonly Random getrandom = new Random();

        private static readonly object syncLock = new object();

        /// <summary>
        /// Entrega calve temporal.
        /// </summary>
        /// <returns></returns>
        public static string GetClave(bool modo = false) {
            lock (syncLock) { // synchronize
                if (!modo)
                    return getrandom.Next(100000, 999999).ToString();
                else
                    return getrandom.Next(1000, 9999).ToString();
            }
        }

    }
}
