using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    public class Ruc {

        private static int NUM_PROVINCIAS = 24;
        private static int[] coeficientes = { 4, 3, 2, 7, 6, 5, 4, 3, 2 };
        private static int constante = 11;
        private static int tamanoRucPublica = 13;

        /// <summary>
        /// Valida si el ruc es valido.
        /// </summary>
        /// <param name="ruc">Numero de ruc a validar.</param>
        /// <returns>bool</returns>
        public static bool Validar(String ruc) {
            bool isRucPrivada = Ruc.RucSociedadPrivada(ruc);
            bool isRucPublica = Ruc.RucSociedadPublica(ruc);
            bool isRucNatural = Ruc.RucPersonaNatural(ruc);

            return isRucPrivada || isRucPublica || isRucNatural;
        }

        /// <summary>
        /// Valida RUC de persona natural .
        /// </summary>
        /// <param name="ruc">Ruc a validar.</param>
        /// <returns>bool</returns>
        public static bool RucPersonaNatural(String ruc) {
            long isNumeric;
            string establecimiento = "001";
            int tamanioPersona = 13;
            if (long.TryParse(ruc, out isNumeric) && ruc.Length == tamanioPersona)
            {
                var numeroProv = Convert.ToInt32(string.Concat(ruc[0] + string.Empty, ruc[1] + string.Empty));
                var personaNatural = Convert.ToInt32(ruc[2] + string.Empty);
                if ((numeroProv >= 1 && numeroProv <= NUM_PROVINCIAS) &&
                   personaNatural >= 0 && personaNatural < 6)
                {
                    string est = ruc.Substring(10, 3);
                    string cedularuc = ruc.Substring(0, 10);
                    bool cedula = Cedula.Validar(cedularuc);
                    
                    return ruc.Substring(10, 3) == establecimiento && Cedula.Validar(ruc.Substring(0, 10));
                }
            }
            return false;
            }
        /// <summary>
        /// Valida RUC de persona juridico o extranjero.
        /// </summary>
        /// <param name="ruc">Ruc a validar.</param>
        /// <returns>bool</returns>
        public static bool RucSociedadPublica(String ruc)
        {
            long isNumeric;
            const int tercerDigito = 6;
            var total = 0;
            string establecimiento = "001";
            int[] coeficientesruc = { 3, 2, 7, 6, 5, 4, 3, 2 };
            string val = ruc.Substring(10, 3);
            if (long.TryParse(ruc, out isNumeric) && ruc.Length.Equals(tamanoRucPublica)) {
                var numeroProv = Convert.ToInt32(string.Concat(ruc[0] + string.Empty, ruc[1] + string.Empty));
                var sociPublica = Convert.ToInt32(ruc[2] + string.Empty);
                if ((numeroProv >= 1 && numeroProv <= NUM_PROVINCIAS) &&
                    sociPublica == tercerDigito && ruc.Substring(10, 3) == establecimiento) {
                    var digitoverificadorRecibido = Convert.ToInt32(ruc[8] + string.Empty);
                    for (var i = 0; i < coeficientesruc.Length; i++) {
                        total = total + (coeficientesruc[i] * Convert.ToInt32(ruc[i] + string.Empty));

                    }
                    var digitoverificadorObtenido = constante - (total % constante);
                    if (digitoverificadorRecibido == 0 || digitoverificadorObtenido == digitoverificadorRecibido)
                        return true;
                }

            }

            return false;

        }
        public static bool RucSociedadPrivada(String ruc)
        {
            long isNumeric;
            const int tercerDigito = 9;
            var total = 0;
            string establecimiento = "001";
            int[] coeficientesruc = { 4, 3, 2, 7, 6, 5, 4, 3,2 };
            string val = ruc.Substring(10, 3);
            if (long.TryParse(ruc, out isNumeric) && ruc.Length.Equals(tamanoRucPublica))
            {
                var numeroProv = Convert.ToInt32(string.Concat(ruc[0] + string.Empty, ruc[1] + string.Empty));
                var sociPublica = Convert.ToInt32(ruc[2] + string.Empty);
                if ((numeroProv >= 1 && numeroProv <= NUM_PROVINCIAS) &&
                    sociPublica == tercerDigito && ruc.Substring(10, 3) == establecimiento)
                {
                    var digitoverificadorRecibido = Convert.ToInt32(ruc[9] + string.Empty);
                    for (var i = 0; i < coeficientesruc.Length; i++)
                    {
                        total = total + (coeficientesruc[i] * Convert.ToInt32(ruc[i] + string.Empty));

                    }
                    var digitoverificadorObtenido = constante - (total % constante);
                    if(digitoverificadorRecibido == 0 || digitoverificadorObtenido == digitoverificadorRecibido)
                    return true;
                }

            }

            return false;

        }
        /// <summary>
        /// Valida RUC de persona juridico o extranjero.
        /// </summary>
        /// <param name="ruc">Ruc a validar.</param>
        /// <returns>bool</returns>
        public static bool ValidaRUCEmpresaPublica(String ruc) {
            try {
                long.Parse(ruc);
            } catch (Exception ) {
                return false;
            }
            int prov = Int32.Parse(ruc.Substring(0, 2));
            bool resp = false;
            if (!(prov > 0 && prov <= Ruc.NUM_PROVINCIAS)) {
                resp = false;
            }
            // boolean val = false;
            int v1, v2, v3, v4, v5, v6, v7, v8, v9;
            int sumatoria, modulo, digito;
            int[] d = new int[ruc.Length];
            for (int i = 0; i < d.Length; i++) {
                d[i] = Int32.Parse(ruc.ElementAt(i) + "");
            }
            v1 = d[0] * 3;
            v2 = d[1] * 2;
            v3 = d[2] * 7;
            v4 = d[3] * 6;
            v5 = d[4] * 5;
            v6 = d[5] * 4;
            v7 = d[6] * 3;
            v8 = d[7] * 2;
            v9 = d[8];
            sumatoria = v1 + v2 + v3 + v4 + v5 + v6 + v7 + v8;
            modulo = sumatoria % 11;
            if (modulo == 0) {
                return true;
            }
            digito = 11 - modulo;

            if (digito.Equals(v9)) {
                resp = true;
            } else {
                resp = false;
            }
            return resp;
        }

        /// <summary>
        /// Valida ruc de una empresa privada.
        /// </summary>
        /// <param name="ruc">Ruc a validar.</param>
        /// <returns>bool</returns>
        public static bool ValidaRUCEmpresaPrivada(String ruc) {
            try {
                long.Parse(ruc);
            } catch (Exception ) {
                return false;
            }
            bool rucCorrecto = false;
            int prov = Int32.Parse(ruc.Substring(0, 2));
            if (!(prov > 0 && prov <= Ruc.NUM_PROVINCIAS)) {
                rucCorrecto = false;
            }
            int[] d = new int[10];
            int suma = 0;
            for (int i = 0; i < d.Length; i++) {
                d[i] = Int32.Parse(ruc.ElementAt(i) + "");
            }
            for (int i = 0; i < d.Length - 1; i++) {
                d[i] = d[i] * Ruc.coeficientes[i];
                suma += d[i];
            }
            int aux, resp;
            aux = suma % Ruc.constante;
            resp = Ruc.constante - aux;
            resp = aux == 0 ? 0 : resp;
            if (resp == d[9]) {
                rucCorrecto = true;
            } else {
                rucCorrecto = false;
            }
            return rucCorrecto;
        }

        /// <summary>
        /// Valida ruc de una persona natural.
        /// </summary>
        /// <param name="ruc">Ruc a validar.</param>
        /// <returns>bool</returns>
        public static bool ValidaRUCNatural(string ruc) {
            try {
                long.Parse(ruc);
            } catch (Exception ) {
                return false;
            }
            bool isValid = false;
            if (ruc == null || ruc.Length != 10) {
                isValid = false;
            }
            int prov = Int32.Parse(ruc.Substring(0, 2));
            if (!(prov > 0 && prov <= Ruc.NUM_PROVINCIAS)) {
                isValid = false;
            }
            int[] d = new int[10];
            for (int i = 0; i < d.Length; i++) {
                d[i] = Int32.Parse(ruc.ElementAt(i) + "");
            }
            int imp = 0;
            int par = 0;
            for (int i = 0; i < d.Length; i += 2) {
                d[i] = d[i] * 2 > 9 ? d[i] * 2 - 9 : d[i] * 2;
                imp += d[i];
            }
            for (int i = 1; i < d.Length - 1; i += 2) {
                par += d[i];
            }
            int suma = imp + par;
            int d10 = Int32.Parse((suma + 10).ToString().Substring(0, 1) + "0") - suma;
            d10 = d10 == 10 ? 0 : d10;
            if (d10 == d[9]) {
                isValid = true;
            } else {
                isValid = false;
            }
            return isValid;
        }
    }

}
