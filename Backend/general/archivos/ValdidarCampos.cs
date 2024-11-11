using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace general.archivos {
    public class ValdidarCampos {
        string Errores = string.Empty;
        public string ValidarString(string campo, string ncampo) {
            string mensaje = string.Empty;
            if (string.IsNullOrEmpty(campo)) {
                mensaje = " VACÍA ";
                Errores = ncampo + mensaje;
            }
            return Errores;
        }

        public string ValidarInt(string campo, string ncampo) {
            string mensaje = string.Empty;
            int intValor = 0;
            Errores = this.ValidarString(campo, ncampo);
            if (Errores != string.Empty) {
                return Errores;
            }
            if (!int.TryParse(campo, out intValor)) {
                mensaje = " NO CORRESPONDE A UN VALOR ENTERO ";
                Errores = ncampo + " " + campo + mensaje;
            } else {
                if (intValor < 0) {
                    mensaje = " NO PUEDE SER MENOR O IGUAL QUE CERO ";
                    Errores = ncampo + " " + campo + mensaje;
                }
            }
            return Errores;
        }

        public string ValidarLong(string campo, string ncampo) {
            string mensaje = string.Empty;
            long longValor = 0;
            Errores = this.ValidarString(campo, ncampo);
            if (Errores != string.Empty) {
                return Errores;
            }

            if (!long.TryParse(campo, out longValor)) {
                mensaje = " NO CORRESPONDE A UN VALOR LONG ";
                Errores = ncampo + " " + campo + mensaje;
            } else {
                if (longValor < 0) {
                    mensaje = " NO PUEDE SER MENOR O IGUAL QUE CERO ";
                    Errores = ncampo + " " + campo + mensaje;
                }
            }
            return Errores;
        }

        public string ValidarDecimal(string campo, string ncampo) {
            string mensaje = string.Empty;
            decimal longValor = 0;
            Errores = this.ValidarString(campo, ncampo);
            if (Errores != string.Empty) {
                return Errores;
            }

            if (!decimal.TryParse(campo, out longValor)) {
                mensaje = " NO CORRESPONDE A UN VALOR DECIMAL ";
                Errores = ncampo + " " + campo + mensaje;
            } else {
                if (longValor < 0) {
                    mensaje = " NO PUEDE SER MENOR O IGUAL QUE CERO ";
                    Errores = ncampo + " " + campo + mensaje;
                }
            }
            return Errores;
        }
    }
}
