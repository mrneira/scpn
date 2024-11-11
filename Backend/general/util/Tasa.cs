using dal.generales;
using modelo;
using System;
using util;

namespace general.util {

    /// <summary>
    /// Clase utilitaria que entraga la tasa a aplicar en una operacion considerando la tasa referencial y la relacion matematica a aplicar.
    /// </summary>
    public class Tasa {

        /// <summary>
        /// Crea una instancia por default.
        /// </summary>
        private Tasa() {
        }

        /// <summary>
        /// Entrega la tasa a aplicar:
        /// Proceso.
        /// Obtiene la tasa referencial.
        /// a la tasa base se suma, resta o obtiene el porcentaje dado el operado y el margen.
        /// </summary>
        /// <param name="ctasareferencial">Codigo de tasa referencial.</param>
        /// <param name="cmoneda">Codigo de moneda con la cual se obtiene la tasa base</param>
        /// <param name="operador">Codigo de operador de la tasa base (+), (-), (%)</param>
        /// <param name="margen">Margen a aplicar a la tasa base.</param>
        /// <returns></returns>
        public static decimal GetTasa(int ctasareferencial, string cmoneda, string operador, decimal margen) {
            tgentasareferencial tasaref = TgenTasareferencialDal.Find(ctasareferencial, cmoneda);
            decimal tasa = (decimal)tasaref.tasa;
            return Tasa.GetTasa(tasa, margen, operador);
        }

        /// <summary>
        /// Metodo que entrega una tasa aplicando un margen dado el operador.
        /// </summary>
        /// <param name="tasareferencial">Valor de la tasa referencial.</param>
        /// <param name="margen">Margen a aplicar a la tasa base.</param>
        /// <param name="operador">Codigo de operador de la tasa base (+), (-), (%)</param>
        /// <returns>decimal</returns>
        public static decimal GetTasa(decimal tasareferencial, decimal margen, String operador) {
            decimal rate = 0;
            if (operador.CompareTo("+") == 0) {
                rate = tasareferencial + margen;
            }
            if (operador.CompareTo("-") == 0) {
                rate = tasareferencial - margen;
            }
            if (operador.CompareTo("%") == 0) {
                rate = tasareferencial * margen;
                rate = rate / 100;
                rate = Math.Round(rate, 6, MidpointRounding.AwayFromZero);
            }
            return rate;
        }

        /// <summary>
        /// Entrega el margen con el cual se obtuvo una tasa.
        /// </summary>
        /// <param name="tasareferencial">Valor de la tasa referencial.</param>
        /// <param name="tasa">Valor de la tasa.</param>
        /// <param name="operador">Operador matematico.</param>
        /// <returns>decimal</returns>
        public static decimal GetMargen(decimal tasareferencial, decimal tasa, string operador) {
            decimal margen = 0;
            if (operador.CompareTo("+") == 0) {
                margen = tasa - tasareferencial;
            }
            if (operador.CompareTo("-") == 0) {
                margen = tasareferencial - tasa;
            }
            if (operador.CompareTo("%") == 0) {
                margen = tasa / tasareferencial;
                margen = Math.Round(margen, 6, MidpointRounding.AwayFromZero);
                margen = margen * Constantes.CIEN;
            }
            return margen;
        }

        /// <summary>
        /// Metodo que entrega el valor de la tasa efectiva dada una tasa nominal y un codio de frequencia.
        /// </summary>
        /// <param name="tasanominal">Tasa nominal.</param>
        /// <param name="cfrecuencia">Codigo de frequencia.</param>
        /// <returns>decimal</returns>
        public static decimal GetTasaEfectiva(decimal tasanominal, int cfrecuencia) {
            tgenfrecuencia freq = TgenFrecuenciaDal.Find(cfrecuencia);
            if (freq.dias == 0) {
                return Tasa.GetTasaEfectivaNoPeriodica(tasanominal);
            }
            decimal tasaefectiva = 0;
            int p = 360 / freq.dias;
            decimal r = tasanominal / Constantes.CIEN;
            r = Math.Round(r, 9, MidpointRounding.AwayFromZero);
            r = r / p;
            r = Math.Round(r, 9, MidpointRounding.AwayFromZero);
            r = r + 1;
            tasaefectiva = (decimal)Math.Pow((double)r, p);
            tasaefectiva = tasaefectiva - 1;
            tasaefectiva = tasaefectiva * Constantes.CIEN;
            tasaefectiva = Math.Round(tasaefectiva, 2, MidpointRounding.AwayFromZero);
            return tasaefectiva;
        }

        /// <summary>
        /// Calcula tasa efectiva de creditos no periodicos, de acuerdo a la formual del BCE.
        /// </summary>
        /// <param name="tasanominal"></param>
        /// <returns></returns>
        public static decimal GetTasaEfectivaNoPeriodica(decimal tasanominal) {
            // tea = ([ 1+ tasanominal(1/365)] ^ 365 ) - 1
            decimal r = tasanominal / Constantes.CIEN;
            r = Math.Round(r, 9, MidpointRounding.AwayFromZero);
            decimal tea = 1 / 365;
            tea = Math.Round(tea, 12, MidpointRounding.AwayFromZero);
            tea = r * tea;
            tea = tea + 1;
            tea = (decimal)Math.Pow((double)tea, 365);
            tea = tea - 1;
            tea = tea * Constantes.CIEN;
            tea = Math.Round(tea, 2, MidpointRounding.AwayFromZero);
            return tea;
        }

        /// <summary>
        /// Metodo que entrega el valor de la tasa nominal dada una tasa efectiva y un codio de frequencia.
        /// </summary>
        /// <param name="tasaefectiva">Tasa efectiva.</param>
        /// <param name="cfrecuencia">Codigo de frequencia.</param>
        /// <returns></returns>
        public static decimal GetTasaNominal(decimal tasaefectiva, int cfrecuencia) {
            // TN = [(1+tea)^(1/n) - 1]n
            // n numero de periodos del anio == 360 / dias de la frecuencia
            tgenfrecuencia freq = TgenFrecuenciaDal.Find(cfrecuencia);
            if (freq.dias == 0) {
                return tasaefectiva; // Si la frecuencia es al vencimiento la tasa nominal es igual a la efectiva.
            }
            decimal r = tasaefectiva / Constantes.CIEN;
            r = Math.Round(r, 9, MidpointRounding.AwayFromZero);
            r = r + 1;
            int p = 360 / freq.dias;
            double aux = 1 / p;
            r = (decimal)Math.Pow((double)r, aux);
            r = r - 1;
            r = r * p * Constantes.CIEN;
            r = Math.Round(r, 2, MidpointRounding.AwayFromZero);
            return r;
        }

    }
}
