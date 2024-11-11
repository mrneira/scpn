
using dal.generales;
using System;
using System.Collections.Generic;
using System.Text;
using util;

namespace amortizacion.helper {

    public class CuotaFija {
        
        /// <summary>
        /// Metodo que calcula el valor de la cuota fija con interes vencido.
        /// </summary>
        /// <param name="basecalculo">Codigo de base de calculo.</param>
        /// <param name="monto">Monto del prestamo.</param>
        /// <param name="tasatotal">Tasa total de la operacion.</param>
        /// <param name="diascuota">Numero de dias por cuota.</param>
        /// <param name="numcuotas">Numero de quotas del prestamo.</param>
        /// <param name="cmoneda">Moneda del prestamo.</param>
        /// <returns>decimal</returns>
        public static decimal CalcularInteresVencido(BaseDeCalculo basecalculo, decimal monto, decimal tasatotal, int diascuota,
                int numcuotas, String cmoneda) {

            decimal valorcuota = Constantes.CERO;

            tasatotal = Math.Round((tasatotal / 100), 12, MidpointRounding.AwayFromZero);

            // pr = rate of period
            decimal tasaperiodo = CuotaFija.GetTasaPeriodo(basecalculo, tasatotal, diascuota);

            // FORMULA ==> quotavalue = k*(tasaperiodo) / [(1-(1+tasaperiodo)^(-numcuotas))]

            // k*(tasaperiodo)
            valorcuota = monto * tasaperiodo;
            // [(1+tasaperiodo)]
            decimal tasamasuno = Constantes.UNO + tasaperiodo;
            // [(1+tasaperiodo)^(-numcuotas)]
            double aux = numcuotas * -1;
            decimal i = new decimal(Math.Pow((Double)tasamasuno, aux));

            // 1 - [(1+tasaperiodo)^(-totalquotas)]
            i = Constantes.UNO - i;
            valorcuota = Math.Round((valorcuota / i), TgenMonedaDal.GetDecimales(cmoneda), MidpointRounding.AwayFromZero);
            return valorcuota;

        }
        
        /// <summary>
        /// Metodo que calcula y entrega la tasa del periodo.
        /// </summary>
        /// <param name="basecalculo">Codigo de base de calculo, asociado a la solicitud.</param>
        /// <param name="tasatotal">Tasa total con la cual se calcula la cuota fija.</param>
        /// <param name="diascuota">Numero de dias por cuota.</param>
        /// <returns>decimal</returns>
        private static decimal GetTasaPeriodo(BaseDeCalculo basecalculo, decimal tasatotal, int diascuota) {
            if (diascuota == 0) {
                return tasatotal;
            }
            decimal rate = 0;
            rate = Math.Round(((decimal)basecalculo.GetDiasAnio() / diascuota), 12, MidpointRounding.AwayFromZero);
            rate = Math.Round((tasatotal / rate), 12, MidpointRounding.AwayFromZero);
            return rate;
        }
        
        /// <summary>
        /// Metodo que calcula el valor de cuota fija con interes anticipado cuota = K/((1-(1-i)^p)/i).
        /// La tasa i esta expresada en la frecuencia de intereses.
        /// </summary>
        /// <param name="basecalculo">Codigo de base de calculo, asociado a la solicitud.</param>
        /// <param name="monto">Capital de la operacion.</param>
        /// <param name="tasatotal">Tasa total de la operacion.</param>
        /// <param name="diascuota">Dias por cuota, asociados a la frecuencia de interes.</param>
        /// <param name="numcuotas">Numero de cuotas totales a generar en la tabla de amortizacion.</param>
        /// <param name="cmoneda">Codigo de moneda.</param>
        /// <returns>decimal</returns>
        public static decimal CalculaInteresAnticipado(BaseDeCalculo basecalculo, decimal monto, decimal tasatotal, int diascuota,
                int numcuotas, String cmoneda) {
            double rate = (double)CuotaFija.GetTasaPeriodoInteresAnticipado(basecalculo, tasatotal, diascuota);
            double aux = (1 - rate);
            aux = Math.Pow(aux, numcuotas);
            aux = (1 - aux) / rate;
            // K/((1-(1-i)^p)/i)
            return Math.Round((monto / new decimal(aux)), TgenMonedaDal.GetDecimales(cmoneda), MidpointRounding.AwayFromZero);

        }
        
        /// <summary>
        /// Metodo que calcula y entrega la tasa de interes anticipado del periodo.
        /// </summary>
        /// <param name="basecalculo">Base de calculo.</param>
        /// <param name="tasatotal">Tasa total con la cual se calcula la cuota fija.</param>
        /// <param name="diascuota">Numero de dias por cuota.</param>
        /// <returns>decimal</returns>
        private static decimal GetTasaPeriodoInteresAnticipado(BaseDeCalculo basecalculo, decimal tasatotal, int diascuota) {
            //double rate = ((tasatotal/ 100) * diascuota) / basecalculo.GetDiasAnio;
            double rate = (double)(((tasatotal / 100) * diascuota));
            rate = (double)(new decimal(rate) / basecalculo.GetDiasAnio());
            rate = rate / (1 + rate);
            return new decimal(Math.Round((rate / Constantes.UNO), 6, MidpointRounding.AwayFromZero));
        }
    }
}
