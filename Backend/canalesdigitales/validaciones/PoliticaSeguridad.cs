using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;

namespace canalesdigitales.validaciones {
    public class PoliticaSeguridad {
        /* Caracteres en mayusculas. */
        private static readonly string UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZÑÁÉÍÓÚ";
        /** Caracteres en minusculas. */
        private static readonly string LOWER = "abcdefghijklmnopqrstuvwxyzñáéíóú";
        /** Caracteres numericos. */
        private static readonly string NUMBERS = "0123456789";
        /** Numero de caracteres numericos. */
        private int contadornumeros = 0;
        /** Numero de mayusculas. */
        private int contadormayusculas = 0;
        /** Numero de minusculas. */
        private int contadorminusculas = 0;
        /** Numero de caraceres especiales. */
        private int contadorcaracteresespeciales = 0;

        private string nuevoPasswdencriptado = "";

        public void Validate(tsegpolitica politica, string cusuario, string value) {
            nuevoPasswdencriptado = EncriptarPassword.Encriptar(value);
            PoliticaSeguridad.ValidateLength(politica, value);
            for (int i = 0; i < value.Count(); i++) {
                string c = value.Substring(i, 1);
                this.Compute(c);
            }
            this.ValidateNumbers(politica);
            this.ValidateUppercase(politica);
            this.ValidateLowercase(politica);
            this.ValidateSpecial(politica);
            this.ValidateNotrepeated(cusuario, politica);
        }

        private static void ValidateLength(tsegpolitica politica, string value) {
            if (politica.longitud != null && value.Count() < politica.longitud) {
                throw new AtlasException("SEG-008", "LONGITUD MINIMA DEL PASSWORD DEBE SER DE {0} CARACTERES", politica.longitud);
            }
        }

        private void ValidateNumbers(tsegpolitica politica) {
            if (politica.numeros != null && politica.numeros > 0 && politica.numeros > this.contadornumeros) {
                throw new AtlasException("SEG-009", "EL PASSWORD DEBE TENER POR LO MENOS {0} NUMEROS", politica.numeros);
            }
        }

        private void ValidateUppercase(tsegpolitica politica) {
            if (politica.mayusculas != null && politica.mayusculas > 0 && politica.mayusculas > this.contadormayusculas) {
                throw new AtlasException("SEG-010", "EL PASSWORD DEBE TENER POR LO MENOS {0} LETRAS MAYUSCULAS", politica.mayusculas);
            }
        }

        private void ValidateLowercase(tsegpolitica politica) {
            if (politica.minusculas != null && politica.minusculas > 0 && politica.minusculas > this.contadorminusculas) {
                throw new AtlasException("SEG-011", "EL PASSWORD DEBE TENER POR LO MENOS {0} LETRAS MINUSCULAS", politica.minusculas);
            }
        }

        private void ValidateSpecial(tsegpolitica politica) {
            if (politica.especiales != null && politica.especiales > 0 && politica.especiales > this.contadorcaracteresespeciales) {
                throw new AtlasException("SEG-012", "EL PASSWORD DEBE TENER POR LO MENOS {0} CARACTERES ESPECIALES", politica.especiales);
            }
        }

        public void ValidateNotrepeated(string cusuario, tsegpolitica politica) {
            if (politica.repeticiones == null || politica.repeticiones.Equals(0)) {
                return;
            }
            IList<Dictionary<string, object>> ldata = TcanUsuarioClaveDal.FindPasswords(cusuario, politica.ccanal, politica.repeticiones ?? 0);
            if (ldata == null || !ldata.Any()) {
                return;
            }
            foreach (Dictionary<string, object> usuarioClave in ldata) {
                if (usuarioClave["password"].ToString().CompareTo(nuevoPasswdencriptado) == 0) {
                    throw new AtlasException("SEG-013", "NO PUEDE REPETIR LOS ULTIMOS: {0} PASSWORDS", politica.repeticiones);
                }
            }
        }

        private void Compute(string c) {
            if (PoliticaSeguridad.Esnumerico(c)) {
                this.contadornumeros++;
                return;
            }
            if (PoliticaSeguridad.Esmayuscula(c)) {
                this.contadormayusculas++;
                return;
            }
            if (PoliticaSeguridad.Esminuscula(c)) {
                this.contadorminusculas++;
                return;
            }
            // Si no es numero, mayuscula o minuscula es un caractwer especial
            this.contadorcaracteresespeciales++;
        }

        private static Boolean Esnumerico(string value) {
            if (PoliticaSeguridad.NUMBERS.Contains(value)) {
                return true;
            }
            return false;
        }

        private static Boolean Esmayuscula(string value) {
            if (PoliticaSeguridad.UPPER.Contains(value)) {
                return true;
            }
            return false;
        }

        private static Boolean Esminuscula(string value) {
            if (PoliticaSeguridad.LOWER.Contains(value)) {
                return true;
            }
            return false;
        }
    }
}
