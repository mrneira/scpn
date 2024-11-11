using amortizacion.dto;
using dal.generales;
using System;
using System.Collections.Generic;
using System.Text;
using util;
namespace amortizacion.helper {
    class AjusteCuotaFija {

        /// <summary>
        /// Base de calculo que se aplicado a la tabla de amortizacion
        /// </summary>
        private BaseDeCalculo baseCalculo;

        /// <summary>
        /// Numero de dias al anio de la base de calculo.
        /// </summary>
        private decimal diasanio;

        /// <summary>
        /// Tasa total del credito incluye interese, comisiones, seguros. etc. 
        /// </summary>
        private decimal tasa;

        /// <summary>
        /// Capital original del credito. 
        /// </summary>
        private decimal capital;
        /// <summary>
        /** Valor de la cuota. */
        /// </summary>
        private decimal valorcuota;

        /// <summary>
        /// Referencia a Installment, que contiene datos necesarios para generacion de tabla de amortizacion, incluye la tabla de amortizacion
        /// generada previamente
        /// </summary>
        private Parametros parametros;

        /// <summary>
        /// Lista de cuotas de la tabla de amortizacion con la cual se ajusta el valor de la cuota.
        /// </summary>
        private List<TablaAuxiliar> auxInstallmentTable;

        /// <summary>
        /// Numero de cuotas deudoras. 
        /// </summary>
        private int cuotasdeudoras;

        /// <summary>
        /// Factor acumulativo utilizado en calculo de cuotas en aproximaciones sucesivas. 
        /// </summary>
        private decimal factortotal = 0;

        /// <summary>
        /// Ajusta el valor de la cuota fija, si el valor de la ultima cuota es mayor a la cuota fija.
        /// </summary>
        /// <param name="parametros"> Referencia a Parametros, que contiene datos necesarios para generacion de tabla de amortizacion.</param>
        /// <param name="cuotas"> Tabla de amortizacion con la cual se obiene el valor de la cuota fija con aproximaciones sucesivas.</param>
        /// <param name="tasa"> Tasa total de la operacion, incluye seguros, intereses, comisiones etc.</param>
        public decimal GetFixedQuota(Parametros parametros, List<Cuota> cuotas, decimal tasa) {
            this.parametros = parametros;
            valorcuota = (decimal)this.parametros.Valorcuota;
            capital = (decimal)this.parametros.Monto;
            this.tasa = Math.Round((tasa / 100), 6, MidpointRounding.AwayFromZero);
            baseCalculo = this.parametros.Basedecalculo;
            diasanio = new decimal(baseCalculo.GetDiasAnio());
            cuotasdeudoras = 0;

            this.LlenaTablaAuxiliar(cuotas);
            // primera aproximacion sin interes deudor
            this.Primeraaproximacion();
            // Busca cuotas que tengan interes deudor.
            this.Cuotasinteresdeudor();
            // segunda aproximacion considera interes deudor.
            this.Segundaaproximacion();
            // aproximacion final
            this.Calculaultimaaproximacion();
            return valorcuota;
        }

        /// <summary>
        /// Crea una lista de cuotas no pagadas y los dias que sumados me permiten hallar el valor presente de una anualidad que no toma en
        /// consideracion periodos de interes deudor..
        /// </summary>
        /// <param name="cuotas"> Tabla de amortizacion con la cual se obiene el valor de la cuota fija con aproximaciones sucesivas.</param>
        private void LlenaTablaAuxiliar(List<Cuota> cuotas) {
            auxInstallmentTable = new List<TablaAuxiliar>();
            int dayaccum = 0;
            int quotanumber = 1;
            int? grace = parametros.Cuotasgracia;
            foreach (Cuota obj in cuotas) {
                if (grace >= obj.Numero) {
                    continue;
                }
                dayaccum += obj.Dias;
                TablaAuxiliar auxq = new TablaAuxiliar(obj, dayaccum);
                auxq.SetNumerocuota(quotanumber);
                auxInstallmentTable.Add(auxq);
                quotanumber++;
            }
        }

        /// <summary>
        /// Calculo de la primera aproximacion sin tomar en cuenta el interes deudor.
        /// </summary>
        private void Primeraaproximacion() {
            decimal factor = new decimal(1);
            // factortotal := coalesce(factor,0) + factortotal;
            foreach (TablaAuxiliar obj in auxInstallmentTable) {
                factor = this.GetFactor(obj.GetCuota().Dias, factor);
                factortotal = factortotal + factor;
            }
            // quotavalue := capital/factortotal;
            valorcuota = Math.Round((capital / factortotal), 12, MidpointRounding.AwayFromZero);
        }

        /// <summary>
        /// Segunda aproximacion cuando tiene intereses dudores.
        /// </summary>
        private void Segundaaproximacion() {
            // Factor que me permite hallar el valor presente de una anualidad en el periodo que toma en cuenta periodos con
            // interes deudor.
            decimal factor = new decimal(1);
            int auxdebtorquotas = cuotasdeudoras + 2;
            TablaAuxiliar obj = this.GetTablaAuxiliar(auxdebtorquotas);
            factor = this.GetFactor(obj.GetCuota().Dias, new decimal(1));
            factortotal = factor;
            auxdebtorquotas = cuotasdeudoras + 3;
            for (int i = auxdebtorquotas - 1; i < auxInstallmentTable.Count; i++) {
                TablaAuxiliar auxquota = auxInstallmentTable[i];
                factor = this.GetFactor(auxquota.GetCuota().Dias, factor);
                factortotal = factortotal + factor;
            }
            obj = this.GetTablaAuxiliar(cuotasdeudoras + 1);
            this.Calculavalorcuota(obj.GetDiasacumulados());
        }

        /// <summary>
        /// Ultimaaproximaccion para encontrar el valor de una cuota fija.
        /// </summary>
        private void Calculaultimaaproximacion() {
            int j, p = 0;
            decimal factor = new decimal(1);
            while ((valorcuota * factortotal) - (capital) > 0) {
                j = p;
                cuotasdeudoras = cuotasdeudoras + 2 * j + 1;
                factor = this.GetFactor(cuotasdeudoras);

                factortotal = new decimal(0);
                for (int i = cuotasdeudoras + 2; i < auxInstallmentTable.Count; i++) {
                    factor = this.GetFactor(auxInstallmentTable[i].GetCuota().Dias, factor);
                    factortotal = factortotal + factor;
                }
                TablaAuxiliar obj = this.GetTablaAuxiliar(cuotasdeudoras + 1);
                this.Calculavalorcuota(obj.GetCuota().Dias);
                if ((valorcuota * factortotal) - capital > 0) {
                    cuotasdeudoras = cuotasdeudoras - (2 * j + 2);
                    factor = this.GetFactor(cuotasdeudoras);

                    factortotal = new decimal(0);
                    for (int i = cuotasdeudoras + 2; i < auxInstallmentTable.Count; i++) {
                        factor = this.GetFactor(auxInstallmentTable[i].GetCuota().Dias, factor);
                        factortotal = factortotal + factor;
                    }
                    TablaAuxiliar auxquota = GetTablaAuxiliar(cuotasdeudoras + 1);
                    this.Calculavalorcuota(auxquota.GetDiasacumulados());
                }
                p++;
            }// end while
            valorcuota = Math.Round((valorcuota / 1), TgenMonedaDal.GetDecimales(parametros.Cmoneda), MidpointRounding.AwayFromZero);
        }

        /// <summary>
        /// Cacula el valor de una cuota con periodos deudores.
        /// </summary>
        /// <param name="diascuota"> Numero de dias de la cuota</param>

        private void Calculavalorcuota(int diascuota) {
            // cuota := (capital*(1+(Vtasa/diasbase*Vnumdias))) / (1+Vcuotasdeudoras+VsumFactor);
            // cuota = capital *(i)/j
            decimal i = Math.Round((tasa / diasanio), 12, MidpointRounding.AwayFromZero) * diascuota;
            i = capital * (i + 1);
            decimal j = new decimal(1 + cuotasdeudoras) + factortotal;
            valorcuota = Math.Round((i / j), 12, MidpointRounding.AwayFromZero);

        }

        /// <summary>
        /// Entrega un factor para calcular valores de cuotas en aproximaciones sucesivas.
        /// </summary>
        /// <param name="diascuota"> Numero de dias de una cuota.</param>
        /// <param name="factor"> Factor previo.</param>
        private decimal GetFactor(int diascuota, decimal factor) {
            decimal auxfactor = new decimal(0);
            // factor := (daysyear/(daysyear+pRate*cuotadays))*factor;
            // (daysyear+pRate*cuotadays)
            auxfactor = (tasa * diascuota) + diasanio;
            auxfactor = Math.Round((diasanio / auxfactor), 12, MidpointRounding.AwayFromZero);
            auxfactor = auxfactor * factor;
            return auxfactor;
        }

        /// <summary>
        /// Enterga el factor de las cuotas con interes deudor.
        /// </summary>
        /// <param name="cuotasinteresdeudor"> Numero de cuotas con interes deudor.</param>
        private decimal GetFactor(int cuotasinteresdeudor) {
            decimal auxfactor = new decimal(0);
            // factor := diasbase/(diasbase+(Vtasa*(Vcuotasdeudoras+2)));
            auxfactor = diasanio + (tasa + cuotasinteresdeudor + 2);
            auxfactor = Math.Round((diasanio / auxfactor), 12, MidpointRounding.AwayFromZero);
            return auxfactor;
        }

        /// <summary>
        /// Entrega el numero de cuotas que tienen interes deudor.
        /// </summary>
        private void Cuotasinteresdeudor() {
            decimal aux = new decimal(0);
            int j = 1;
            foreach (TablaAuxiliar auxquota in auxInstallmentTable) {
                // if (((Vcapital*Vtasa/diasbase)*Vnumdiasj) - (quotanumber * Vcuota)) < 0 then
                aux = Math.Round(((capital * tasa) / baseCalculo.GetDiasAnio()), 12, MidpointRounding.AwayFromZero);
                aux = aux * auxquota.GetDiasacumulados();
                aux = aux - (valorcuota * j);
                if (aux < 0) {
                    cuotasdeudoras = j - 1;
                    break;
                }
                j++;
            }
        }

        /// <summary>
        /// Entrega una cuota auxiliar dado un numero de cuota.
        /// @param  
        /// </summary>
        /// <param name="numerocuota"> Numero de cuota a buscar.</param>
        private TablaAuxiliar GetTablaAuxiliar(int numerocuota) {
            TablaAuxiliar auxiliarQuota = null;
            foreach (TablaAuxiliar obj in auxInstallmentTable) {
                if (obj.GetNumerocuota() == numerocuota) {
                    auxiliarQuota = obj;
                    break;
                }
            }
            return auxiliarQuota;
        }
    }
}
