using core.componente;
using dal.seguridades;
using modelo;
using modelo.helper;
using modelo.interfaces;
using seguridad.util;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.man {

    /// <summary>
    /// Clase encargada de validar la politica de seguridad de la institucion financiera.
    /// </summary>
    public class PoliticaSeguridad : ComponenteMantenimiento {

        /* Caracteres en mayusculas. */
        public static string UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZÑÁÉÍÓÚ";
        /** Caracteres en minusculas. */
        public static string LOWER = "abcdefghijklmnopqrstuvwxyzñáéíóú";
        /** Caracteres numericos. */
        public static string NUMBERS = "0123456789";
        /** Numero de caracteres numericos. */
        private int contadornumeros = 0;
        /** Numero de mayusculas. */
        private int contadormayusculas = 0;
        /** Numero de minusculas. */
        private int contadorminusculas = 0;
        /** Numero de caraceres especiales. */
        private int contadorcaracteresespeciales = 0;

        private static string nuevoPasswdencriptado = "";

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string cusuario = rqmantenimiento.Cusuario;
            int ccompania = rqmantenimiento.Ccompania;
            string valor = rqmantenimiento.GetDatos("bas64") != null ? rqmantenimiento.GetDatos("bas64").ToString() : "";
            nuevoPasswdencriptado = EncriptarPassword.Encriptar(valor);

            tsegpolitica tsegPolitica = TsegPoliticaDal.Find(rqmantenimiento.Ccompania, rqmantenimiento.Ccanal);
            tsegusuariodetalle det = null;
            if (rqmantenimiento.GetTabla("CAMBIOCONTRASENIA") != null) {
                det = (tsegusuariodetalle)rqmantenimiento.GetTabla("CAMBIOCONTRASENIA").Lregistros.ElementAt(0);
                if (det != null) {
                    if (det.Esnuevo) {
                        det = TsegUsuarioDetalleDal.Find(cusuario, ccompania);
                        Sessionef.Grabar(det);
                    } else {
                        this.ValidaPassword(rqmantenimiento, det);
                        this.Validate(tsegPolitica, valor);
                        // Valida que no se repitan los ultimos n passwords
                        PoliticaSeguridad.ValidateNotrepeated(det, tsegPolitica);
                        det.password = nuevoPasswdencriptado;
                    }
                }
            } else {
                det = TsegUsuarioDetalleDal.Find(cusuario, ccompania);
                this.ValidaPassword(rqmantenimiento, det);
                this.Validate(tsegPolitica, valor);
                // Valida que no se repitan los ultimos n passwords
                PoliticaSeguridad.ValidateNotrepeated(det, tsegPolitica);
                det.password = nuevoPasswdencriptado;
                Sessionef.Actualizar(det);
            }


            rqmantenimiento.Response["cambioexitoso"] = true;
        }

        /// <summary>
        /// Valida el password anterior ingresado.
        /// </summary>
        /// <param name="rqmantenimiento">Requerimiento.</param>
        /// <param name="det">Objeto tsegusuariodetalle</param>
        private void ValidaPassword(RqMantenimiento rqmantenimiento, tsegusuariodetalle det) {
            string anteriorPassword = rqmantenimiento.GetDatos("anteriorcon") != null ? rqmantenimiento.GetDatos("anteriorcon").ToString() : "";
            string anteriorPasswdencriptado = EncriptarPassword.Encriptar(anteriorPassword);

            // Valida password anterior y nuevo
            if (det.password.CompareTo(anteriorPasswdencriptado) != 0) {
                throw new AtlasException("SEG-022", "LA CONTRASEÑA ANTERIOR NO COINCIDE CON LA REGISTRADA");
            }
        }

        /// <summary>
        /// Metodo que valida la politica de seguridad del password.
        /// </summary>
        /// <param name="det">Objeto tsegusuariodetalle</param>
        /// <param name="tsegPolitica">Objeto tsegpolitica</param>
        /// <param name="value">Password en plano</param>
        private void Validate(tsegpolitica tsegPolitica, string value) {
            // OBTIENE EL PASSWORD EN CARACTER
            // value = Base64Input.decodificar(value);
            PoliticaSeguridad.ValidateLength(tsegPolitica, value);
            for (int i = 0; i < value.Count(); i++) {
                string c = value.Substring(i, 1);
                this.Compute(c);
            }
            this.ValidateNumbers(tsegPolitica);
            this.ValidateUppercase(tsegPolitica);
            this.ValidateLowercase(tsegPolitica);
            this.ValidateSpecial(tsegPolitica);
        }

        /// <summary>
        /// Metodo que valida la longitud del password.
        /// </summary>
        /// <param name="tsegPolitica">Objeto tsegpolitica</param>
        /// <param name="value">Password en base64</param>
        private static void ValidateLength(tsegpolitica tsegPolitica, string value) {
            if (tsegPolitica.longitud != null && value.Count() < tsegPolitica.longitud) {
                throw new AtlasException("SEG-008", "LONGITUD MINIMA DEL PASSWORD DEBE SER DE {0} CARACTERES", tsegPolitica.longitud);
            }
        }

        /// <summary>
        /// Metodo que valida numeros minimos en el password.
        /// </summary>
        /// <param name="tsegPolitica">Objeto que contiene la politica de seguridad</param>
        private void ValidateNumbers(tsegpolitica tsegPolitica) {
            if (tsegPolitica.numeros != null && tsegPolitica.numeros > 0
                    && tsegPolitica.numeros > this.contadornumeros) {
                throw new AtlasException("SEG-009", "EL PASSWORD DEBE TENER POR LO MENOS {0} NUMEROS", tsegPolitica.numeros);
            }
        }

        /// <summary>
        /// Metodo que valida letras mayusculas minimas en el password.
        /// </summary>
        /// <param name="tsegPolitica">Objeto que contiene la politica de seguridad</param>
        private void ValidateUppercase(tsegpolitica tsegPolitica) {
            if (tsegPolitica.mayusculas != null && tsegPolitica.mayusculas > 0
                    && tsegPolitica.mayusculas > this.contadormayusculas) {
                throw new AtlasException("SEG-010", "EL PASSWORD DEBE TENER POR LO MENOS {0} LETRAS MAYUSCULAS",
                        tsegPolitica.mayusculas);
            }
        }

        /// <summary>
        /// Metodo que valida letras minusculas minimas en el password.
        /// </summary>
        /// <param name="tsegPolitica">Objeto que contiene la politica de seguridad</param>
        private void ValidateLowercase(tsegpolitica tsegPolitica) {
            if (tsegPolitica.minusculas != null && tsegPolitica.minusculas > 0
                    && tsegPolitica.minusculas > this.contadorminusculas) {
                throw new AtlasException("SEG-011", "EL PASSWORD DEBE TENER POR LO MENOS {0} LETRAS MINUSCULAS",
                        tsegPolitica.minusculas);
            }
        }

        /// <summary>
        /// Metodo que valida los caracteres especiales.
        /// </summary>
        /// <param name="tsegPolitica">Objeto que contiene la politica de seguridad</param>
        private void ValidateSpecial(tsegpolitica tsegPolitica) {
            if (tsegPolitica.especiales != null && tsegPolitica.especiales > 0
                    && tsegPolitica.especiales > this.contadorcaracteresespeciales) {
                throw new AtlasException("SEG-012", "EL PASSWORD DEBE TENER POR LO MENOS {0} CARACTERES ESPECIALES",
                        tsegPolitica.especiales);
            }
        }

        /// <summary>
        /// Valida que el password no se repita en las ultimas n veces.
        /// </summary>
        /// <param name="tsegPolitica">Objeto que contiene la politica de seguridad</param>
        public static void ValidateNotrepeated(tsegusuariodetalle usuariodetalle, tsegpolitica tsegPolitica) {
            if (tsegPolitica.repeticiones == null || tsegPolitica.repeticiones.Equals(0)) {
                return;
            }
            IList<Dictionary<string, object>> ldata = TsegUsuarioDetalleDal.FindPasswords(usuariodetalle.cusuario, usuariodetalle.ccompania, tsegPolitica.repeticiones ?? 0);
            if (ldata == null || !ldata.Any()) {
                return;
            }
            foreach (Dictionary<string, object> pass in ldata) {
                if (pass["password"].ToString().CompareTo(nuevoPasswdencriptado) == 0) {
                    throw new AtlasException("SEG-013", "NO PUEDE REPETIR LOS ULTIMOS: {0} PASSWORDS", tsegPolitica.repeticiones);
                }
            }
        }

        /// <summary>
        /// Metodo que se encarga de acumular, numeros, mayusculas y/o minusculas.
        /// </summary>
        /// <param name="c">Datoa a verificar</param>
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

        /// <summary>
        /// Metdo que verifica si el caracter es un numero.
        /// </summary>
        /// <param name="value">Dato a verificar si es un numero</param>
        private static Boolean Esnumerico(string value) {
            if (PoliticaSeguridad.NUMBERS.Contains(value)) {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Metdo que verifica si el caracter es una mayuscula, incluye tildes.
        /// </summary>
        /// <param name="value">Dato a verificar si es mayuscula</param>
        private static Boolean Esmayuscula(string value) {
            if (PoliticaSeguridad.UPPER.Contains(value)) {
                return true;
            }
            return false;
        }

        /// <summary>
        /// Metdo que verifica si el caracter es una minuscula incluye tildes.
        /// </summary>
        /// <param name="value">Dato a verificar si es minuscula</param>
        private static Boolean Esminuscula(string value) {
            if (PoliticaSeguridad.LOWER.Contains(value)) {
                return true;
            }
            return false;
        }

    }
}
