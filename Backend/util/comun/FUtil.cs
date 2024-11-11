using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace util {

    /// <summary>
    /// Clase que define constantes y metodos utilitarios.
    /// </summary>
    public class FUtil {

        /// <summary>
        /// Metodo que reemplaza variables de entorno
        /// </summary>
        public static String ReemplazarVariablesAmbiente(string texto, string keyvariable) {
            if (string.IsNullOrEmpty(texto)) {
                return texto;
            }
            string valorvariable = Environment.GetEnvironmentVariable(keyvariable);
            if (valorvariable == null) {
                valorvariable = "C:\\"+ keyvariable; // en el servidor no se instancia la variable de entorno por el momento se quema el path
            }
            if (keyvariable.Contains("${")) {
                texto = texto.Replace(keyvariable, valorvariable);
            } else {
                //texto = texto.Replace("\\$\\{" + keyvariable + "\\}", valorvariable);
                texto = texto.Replace("${" + keyvariable + "}", valorvariable);  // Tiene que ser esta linea la anterior no funciona.
            }
            return texto;
        }

        /// <summary>
        /// Metodo que reemplaza variables de entorno
        /// </summary>
        public static String ReemplazarVariablesAmbiente(string texto) {
            if (string.IsNullOrEmpty(texto)) {
                return texto;
            }

            Dictionary<string, string> dictvariables = (Dictionary<string, string>)Environment.GetEnvironmentVariables();

            Dictionary<string, string>.KeyCollection s = dictvariables.Keys;
            foreach (String key in s) {
                string value = dictvariables[key];
                texto = texto.Replace("\\$\\{" + key + "\\}", value);
            }
            return texto;
        }

        public static void ValidaFechas(DateTime? fcampo1, string ncampo1, DateTime? fcampo2, string ncampo2) {
            if (fcampo1 != null && fcampo1 > DateTime.Now) {
                throw new AtlasException("GEN-016", "EL CAMPO [{0}] NO PUEDE SE MAYOR A LA FECHA ACTUAL ", ncampo1);
            }
            if (fcampo2 != null && fcampo2 > DateTime.Now) {
                throw new AtlasException("GEN-016", "EL CAMPO [{0}] NO PUEDE SE MAYOR A LA FECHA ACTUAL ", ncampo2);
            }
            if (fcampo1 != null && fcampo2 != null && fcampo1 > fcampo2) {
                throw new AtlasException("GEN-017", "EL CAMPO [{0}] NO DEBE SER MAYOR AL CAMPO [{1}]", ncampo1, ncampo2);
            }
        }

        public static void ValidaRangoFechas(DateTime? fcampo1, String ncampo1, DateTime? fcampo2, String ncampo2) {
            if (fcampo1 != null && fcampo1 > DateTime.Now) {
                throw new AtlasException("GEN-016", "EL CAMPO [{0}] NO PUEDE SE MAYOR A LA FECHA ACTUAL ", ncampo1);
            }
            if (fcampo2 != null && fcampo2 > DateTime.Now) {
                throw new AtlasException("GEN-016", "EL CAMPO [{0}] NO PUEDE SE MAYOR A LA FECHA ACTUAL ", ncampo2);
            }
            if (fcampo1 != null && fcampo2 != null && fcampo1 > fcampo2) {
                throw new AtlasException("GEN-017", "EL CAMPO [{0}] NO DEBE SER MAYOR AL CAMPO [{1}]", ncampo1, ncampo2);
            }
        }
        public static void ValidaTraslapeMontos(String ncampo1, String ncampo2, Decimal montomin1, Decimal montomax1, Decimal montomin2, Decimal montomax2) {
            if (montomin1 >= montomax1) {
                throw new AtlasException("GEN-021", "EL {0}: [{1}] DEBE SER MAYOR AL {2}: [{3}]", ncampo1, montomin1, ncampo2, montomax1);
            }

            if (montomin2 >= montomax2) {
                throw new AtlasException("GEN-021", "EL {0}: [{1}] DEBE SER MAYOR AL {2}: [{3}]", ncampo1, montomin2, ncampo2, montomax2);
            }

            if (montomin1 <= montomax2 && montomin1 >= montomin2
                    || montomin1 >= montomin2 && montomax1 <= montomax2
                    || montomin1 <= montomin2 && montomax1 >= montomax2
                    || montomax1 >= montomin2 && montomax1 <= montomax2) {
                throw new AtlasException("GEN-020", "EL RANGO DE MONTOS: [{0}] y [{1}] SE TRASLAPAN", montomin1 + "-" + montomax1, montomin2 + "-" + montomax2);
            }
        }


    }
}
