using amortizacion.dto;
using amortizacion.helper;
using dal.generales;
using System;
using System.Collections.Generic;
using util;

namespace amortizacion.tipos {
    
    /// <summary>
    /// Clase que se encarga de calcular tabla de amortizacion dado el numero de cuotas, en este caso calcula el valor de la cuota.
    /// </summary>
    internal class Numerocuotas {
        public TablaFrancesa francesa;

        public Numerocuotas(TablaFrancesa francesa) {
            this.francesa = francesa;
        }

        public TablaFrancesa Francesa { get => francesa; set => francesa = value; }

        public void Generartabla() {
            CalculaCuotaFija();
            // calcula valor de capital si la periodicidad de pago de capital es diferente a 1.
            Calculacuotacapital();
            Boolean end = false;
            int size = (int)francesa.parametros.Numerocuotas;
            int j = (int)francesa.parametros.Cuotainicio;

            if (j == 1) {
                j = j + (int)(francesa.parametros.Cuotasgracia == null ? 0 : francesa.parametros.Cuotasgracia);
            }
            if (j > size) {
                size = size + j;
            }
            for (int i = j; i <= size; i++) {
                francesa.interestotalcuota = Constantes.CERO;

                francesa.Calcualfechascuota();
                if (i == size) {
                    end = true;
                }
                // calcula intereses, comiones,seguros para la cuota.
                decimal monto = francesa.capitalreducido;
                if (!francesa.tasanominal) {
                    monto = monto + francesa.interesdeudor;// se calcula interese sobre el capital mas interes deudor
                }
                // Calcula tipos ACC
                francesa.Calculatipoacc(monto, false);
                francesa.Generacuota(end);
                if (francesa.interesdeudor < 0) {
                    francesa.parametros.Numerocuotas = francesa.numerocuota;
                    break;
                }
                francesa.numerocuota++;
            }// end for
            if (!francesa.ajustocuota && (francesa.parametros.Periodicidadcapital == 1)) {

                Ajustecuotaproximacionessucesivas(); // Ajuste de valor de cuota fija con aproximaciones sucesivas.
            }
        }
        
        /// <summary>
        /// Calcula el valor de una cuota.
        /// </summary>
        private void CalculaCuotaFija() {
            if (francesa.cuotafija == null) {
                int cuotas = (int)francesa.parametros.Numerocuotas;
                if ((francesa.parametros.Cuotasgracia != null) && (francesa.parametros.Cuotasgracia > 0)) {
                    cuotas = cuotas - (int)francesa.parametros.Cuotasgracia;
                }
                francesa.cuotafija = CuotaFija.CalcularInteresVencido(francesa.parametros.Basedecalculo, (decimal)francesa.parametros.Monto, francesa.tasatotal,
                        (int)francesa.parametros.Diasfrecuencia, cuotas, francesa.parametros.Cmoneda);
                francesa.cuotafija = francesa.cuotafija + francesa.Caluclatotalcargosporcuota();
                francesa.parametros.Valorcuota = francesa.cuotafija;
            }
        }
        
        /// <summary>
        /// Calcula el valor de capital, si la fecuencia es mayor a 1.
        /// </summary>
        private void Calculacuotacapital() {
            if (francesa.parametros.Periodicidadcapital == 1) {
                return;
            }
            int i = (int)francesa.parametros.Numerocuotas;
            if ((francesa.parametros.Cuotainicio == (1)) && (francesa.parametros.Cuotasgracia != null)) {
                i = i - (int)francesa.parametros.Cuotasgracia;
            }
            i = i / (int)francesa.parametros.Cuotasgracia;
            francesa.numerocuotascapital = i;

            francesa.cuotacapital = (decimal)Math.Round(((double)francesa.parametros.Monto / i), TgenMonedaDal.GetDecimales(francesa.parametros.Cmoneda), MidpointRounding.AwayFromZero);
        }

        private void Ajustecuotaproximacionessucesivas() {
            // cuotas de 1 dia no tienen aproximaciones.
            int cuotasgracia = francesa.parametros.Cuotasgracia == null ? 0 : (Int16)francesa.parametros.Cuotasgracia;
            int numcuotas = (int)francesa.parametros.Numerocuotas;
            int numuotasfijas = numcuotas - cuotasgracia;
            if (francesa.parametros.Numerocuotas <= 1 || numuotasfijas == 1) {
                return;
            }
            francesa.diascuota = 0;
            francesa.interesdeudor = Constantes.CERO;
            if (Getmontoultimacuota()!=(francesa.cuotafija)) {
                if (!francesa.tasanominal) {
                    // Ajusta cuota con tasa nominal.
                    AjusteCuotaFijaCapitalizacion adjust = new AjusteCuotaFijaCapitalizacion();
                    francesa.cuotafija = adjust.GetValorcuotafija(francesa.parametros, francesa.cuotas, francesa.tasatotal);
                } else {
                    // Ajusta cuota con tasa efectiva que tiene capitalizacion diaria.
                    AjusteCuotaFija adjust = new AjusteCuotaFija();
                    francesa.cuotafija = adjust.GetFixedQuota(francesa.parametros, francesa.cuotas, francesa.tasatotal);
                }
                Encerartabla();
                francesa.GenerateGraceQuotas();
                Generartabla();
            }
        }

        private void Encerartabla() {
            francesa.cuotafija = francesa.cuotafija+(francesa.cargosfijos);
            francesa.parametros.Valorcuota = (decimal)francesa.cuotafija;
            francesa.capitalreducido = (decimal)francesa.parametros.Monto;
            francesa.cuotas.Clear();
            francesa.finicio = null;
            francesa.fvencimiento = null;
            francesa.plazo = 0;
            francesa.ajustocuota = true;
            francesa.numerocuota = (int)francesa.parametros.Cuotainicio;
        }

        private decimal Getmontoultimacuota() {
            decimal valor = Constantes.CERO;
            int size = francesa.cuotas.Count - 1;
            List<CuotaRubro> cuotasrubro = francesa.cuotas[size].GetCuotarubros();
            foreach (CuotaRubro obj in cuotasrubro) {
                valor = valor + (obj.Valor);
            }
            return valor;
        }
    }

}
