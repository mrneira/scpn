using amortizacion.dto;
using dal.generales;
using System;
using System.Collections.Generic;
using System.Text;
using util;

/// <summary>
/// Clase que se encarga de realizar el ajuste de cuota fija cuando la tabla de amortizacion se genera con tasa efectiva.
/// </summary>
namespace amortizacion.helper {
    public class AjusteCuotaFijaCapitalizacion {
        
        /// <summary>
        /// Base de calculo que se aplicado a la cuota
        /// </summary>
        private BaseDeCalculo baseCalc;
        
        /// <summary>
        /// Tasa total del credito incluye comisiones.
        /// </summary>
        private decimal tasa;

        /// <summary>
        /// Factor acumulativo utilizado en calculo de cuotas en aproximaciones sucesivas.
        /// </summary>
        private decimal factor = 0;
        
        /// <summary>
        /// Ajusta el valor de la cuota fija, si el valor de la ultima cuota es mayor a la cuota fija.
        /// </summary>
        /// <param name="parametros">Referencia a Parametros, que contiene datos necesarios para generacion de tabla de amortizacion.</param>
        /// <param name="cuotas">Tabla de amortizacion con la cual se obiene el valor de la cuota fija con aproximaciones sucesivas.</param>
        /// <param name="tasatotal">Tasa total de la operacion, incluye seguros, intereses, comisiones etc.</param>
        /// <returns>decimal</returns>
        public decimal GetValorcuotafija(Parametros parametros, List<Cuota> cuotas, decimal tasatotal) {
            decimal quotavalue = (decimal)parametros.Valorcuota;
            this.tasa = Math.Round((tasatotal/Constantes.CIEN), 6, MidpointRounding.AwayFromZero);
            this.baseCalc = parametros.Basedecalculo;
            this.Obtienefactor(cuotas);
            quotavalue = (decimal)Math.Round((double)(parametros.Monto / factor), TgenMonedaDal.GetDecimales(parametros.Cmoneda), MidpointRounding.AwayFromZero);
            return quotavalue;
        }

        /// <summary>
        /// Crea una lista de cuotas no pagadas y los factores que sumados me permiten hallar el valor presente de una anualidad que no toma en
        /// consideracion perioodos de interess deudor..
        /// </summary>
        /// <param name="cuotas">Lista de cuotas original.</param>
        private void Obtienefactor(List<Cuota> cuotas) {
            /* = 1/(1+TEA)^(DiasdesDeInicioPrestamoHastaFvenCuota/360) */
            this.tasa = this.tasa+Constantes.UNO;
            double days = 0.0;
            foreach (Cuota obj in cuotas) {
                days = days + obj.Dias;
                double factor = Math.Pow((Double) this.tasa, (days /this.baseCalc.GetDiasAnio()));
                factor = 1 / factor;
                this.factor = this.factor + (Decimal)factor;
            }
            this.factor = Math.Round((factor / Constantes.UNO), 6, MidpointRounding.AwayFromZero);
        }
    }
}
