using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    /// <summary>
    /// Clase que se encarga de validar que una cedula sea valida.
    /// </summary>
    public class Cedula {

        /// <summary>
        /// Valida una cedula.
        /// </summary>
        /// <param name="cedula">Numero de cedula a validar que sea correcta.</param>
        /// <returns></returns>
        public static bool Validar(String cedula) {
            int digitos = 10;
            bool cedulaCorrecta = false;
            if (cedula == null || cedula.Length != digitos) {
                return cedulaCorrecta;
            }
            try {
                //int tercerDigito = Int32.Parse(cedula.Substring(2, 1)); //RNI 20231220
                //if (tercerDigito < 6) {
                    // Coeficientes de validación cédula
                    // El decimo digito se lo considera dígito verificador
                    int[] coefValCedula = { 2, 1, 2, 1, 2, 1, 2, 1, 2 };
                    int verificador = Int32.Parse(cedula.Substring(9, 1));
                    int suma = 0;
                    int digito = 0;
                    for (int i = 0; i < cedula.Length - 1; i++) {
                        digito = Int32.Parse(cedula.Substring(i, 1)) * coefValCedula[i];
                        suma += digito % 10 + digito / 10;
                    }

                    if (suma % 10 == 0 && suma % 10 == verificador) {
                        cedulaCorrecta = true;
                    } else if (10 - suma % 10 == verificador) {
                        cedulaCorrecta = true;
                    } else {
                        cedulaCorrecta = false;
                    }
                /*} else {
                    cedulaCorrecta = false;
                }*/
            } catch (Exception ) {
                cedulaCorrecta = false;
            }
            return cedulaCorrecta;
        }
    }
}
