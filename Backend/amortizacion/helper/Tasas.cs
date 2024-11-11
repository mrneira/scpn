using general.util;
using System;
using System.Collections.Generic;
using System.Text;
using util;

namespace amortizacion.helper {

    /// <summary>
    /// Clase utilitaria que contiene las tasas, impuestos, comisiones a calcular asociadas a una cuota de la tabla de amortizacion.
    /// </summary>
    public class Tasas {

        /** Codigo de saldo a calular valor de la cuota, Interes, Comision, Seguro etc. */
        private String csaldo;

        /** Codigo de saldo de capital sobre el cual se calcula valores tipo ACC como interes, comision, seguros. */
        private String csaldocapital;

        /** Tasa con la cual se calcula el valor de la cuota de intereses, seguros, cargos, impuestos,comisiones. */
        private decimal tasa;

        /** Tasa con la cual se calcula el valor de la cuota de intereses, seguros, cargos, impuestos,comisiones. */
        private decimal tasadia;

        /** Valor calculado de interes, comision, seguro, que se calcual dado una tasa y un valor de capital */
        private decimal valorcuota = Constantes.CERO;

        /** Valor de capital sobre el cual se aplica la tasa y se calula el valor de la cuota. */
        private decimal montotasa;

        /** Valor del interes deudor del saldo. */
        private decimal interesdeudor = Constantes.CERO;

        /** Valor del interes inicial, en reajuste de tasas es el interes hasta hoy de la cuota actual. */
        private decimal? interesinicial = Constantes.CERO;
        private decimal interesajuste = Constantes.CERO;

        private AccrualHelper accrualhelper = null;

        [Newtonsoft.Json.JsonProperty(PropertyName = "csaldo")]
        public string Csaldo { get => csaldo; set => csaldo = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "csaldocapital")]
        public string Csaldocapital { get => csaldocapital; set => csaldocapital = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "tasa")]
        public decimal Tasa { get => tasa; set => tasa = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "tasadia")]
        public decimal Tasadia { get => tasadia; set => tasadia = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "valorcuota")]
        public decimal Valorcuota { get => valorcuota; set => valorcuota = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "montotasa")]
        public decimal Montotasa { get => montotasa; set => montotasa = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "interesdeudor")]
        public decimal Interesdeudor { get => interesdeudor; set => interesdeudor = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "interesinicial")]
        public decimal? Interesinicial { get => interesinicial; set => interesinicial = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "interesajuste")]
        public decimal Interesajuste { get => interesajuste; set => interesajuste = value; }

        public decimal Calcular(Tasas tasas, decimal monto, int diascuota, Parametros parametros, Boolean acumular) {
            decimal valorcalculado = Constantes.CERO;

            if (accrualhelper == null) {
                accrualhelper = new AccrualHelper(parametros.Basedecalculo);
            }
            if (parametros.DecimalesTasa != null) {
                accrualhelper.SetDecimalesTasa((int)parametros.DecimalesTasa);
            }
            // Si se cobra un valor de interes fijo en cada cuota cuando tiene operaciones que cobran el interes flat.
            if (parametros.CuotaInteres != null) {
                valorcalculado = (decimal)parametros.CuotaInteres;
            }
            if (valorcalculado <= Constantes.UNO) {
                // calcula el valor de la cuota.
                valorcalculado = accrualhelper.CalculaDividendo(monto, tasas.GetTasa(), diascuota, parametros.Cmoneda);
            }

            if (tasas.GetInteresinicial() != null && tasas.GetInteresinicial() > 0) {
                valorcalculado = valorcalculado + (decimal)tasas.GetInteresinicial();
            }
            if (!acumular) {
                valorcuota = valorcalculado;
            } else {
                valorcuota = valorcuota + valorcalculado;
            }
            montotasa = monto;
            return valorcalculado;
        }

        public decimal Actualizavalorcuota(Boolean pEnd, decimal interesadistribuir) {
            decimal interestotal;
            interestotal = GetValorcuota() + GetInteresdeudor();
            // Si el valor total de interes o comision de la categoria excede el valor total definido de interes a
            // distribuir y no se trata de la ultima cuota
            if (interestotal > interesadistribuir && !pEnd) {
                // Se acumula el valor de interes excedente de la categoria y se asume como el valor de interes de la
                // categoria el valor total definido de interes a distribuir
                SetInteresdeudor(interestotal - interesadistribuir);
                SetValorcuota(interesadistribuir);
            } else {
                SetValorcuota(interestotal);
                SetInteresdeudor(interestotal - GetValorcuota());
            }
            // Se obtiene el nuevo valor de interes a distribuir
            interesadistribuir = interesadistribuir - GetValorcuota();
            return interesadistribuir;
        }

        /// <summary>
        /// Metodo que se encarga de calcular la tasa total con la que se genera la tabla de amortizacion, esta tasa se utiliza para el calculo
        /// de cuota fija con aproximaciones sucesivas.
        /// </summary>
        public static decimal CalculaTasatotal(List<Tasas> ltasas) {
            decimal tasatotal = Constantes.CERO;
            foreach (Tasas obj in ltasas) {
                tasatotal = tasatotal + obj.GetTasa();
            }
            return tasatotal;
        }

        /// <summary>
        /// Entrega el valor de: csaldo
        /// </summary>
        public String GetCsaldo() {
            return csaldo;
        }

        /// <summary>
        /// Fija el valor de: csaldo
        /// </summary>
        public void SetCsaldo(String csaldo) {
            this.csaldo = csaldo;
        }

        /// <summary>
        /// Entrega el valor de: csaldocapital
        /// </summary>
        public String GetCsaldocapital() {
            return csaldocapital;
        }

        /// <summary>
        /// Fija el valor de: csaldocapital
        /// </summary>
        public void SetCsaldocapital(String csaldocapital) {
            this.csaldocapital = csaldocapital;
        }

        /// <summary>
        /// Entrega el valor de: tasa
        /// </summary>
        public decimal GetTasa() {
            return tasa;
        }

        /// <summary>
        /// Fija el valor de: tasa
        /// </summary>
        public void SetTasa(decimal tasa) {
            this.tasa = tasa;
        }

        /// <summary>
        /// Entrega el valor de: tasadia
        /// </summary>
        public decimal GetTasadia() {
            return tasadia;
        }

        /// <summary>
        /// Fija el valor de: tasadia
        /// </summary>
        public void SetTasadia(decimal tasadia) {
            this.tasadia = tasadia;
        }

        /// <summary>
        /// Entrega el valor de: montotasa
        /// </summary>
        public decimal GetMontotasa() {
            return montotasa;
        }

        /// <summary>
        /// Fija el valor de: montotasa
        /// </summary>
        public void SetMontotasa(decimal montotasa) {
            this.montotasa = montotasa;
        }

        /// <summary>
        /// Fija el valor de: valorcuota
        /// </summary>
        public void SetValorcuota(decimal valorcuota) {
            this.valorcuota = valorcuota;
        }

        /// <summary>
        /// Entrega el valor de: valorcuota
        /// </summary>
        public decimal GetValorcuota() {
            return valorcuota;
        }

        /// <summary>
        /// Fija el valor de: interesdeudor
        /// </summary>
        public void SetInteresdeudor(decimal interesdeudor) {
            this.interesdeudor = interesdeudor;
        }

        /// <summary>
        /// Entrega el valor de: interesdeudor
        /// </summary>
        public decimal GetInteresdeudor() {
            return interesdeudor;
        }

        /// <summary>
        /// Fija el valor de: interesinicial
        /// </summary>
        public void SetInteresinicial(decimal interesinicial) {
            this.interesinicial = interesinicial;
        }

        /// <summary>
        /// Entrega el valor de: interesinicial
        /// </summary>
        public decimal? GetInteresinicial() {
            return interesinicial;
        }

        /// <summary>
        /// Entrega el valor de: interesajuste
        /// </summary>
        public decimal GetInteresajuste() {
            return interesajuste;
        }

        /// <summary>
        /// Fija el valor de: interesajuste
        /// </summary>
        public void SetInteresajuste(decimal interesajuste) {
            this.interesajuste = interesajuste;
        }

    }

}
