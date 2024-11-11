using amortizacion.dto;
using amortizacion.helper;
using dal.generales;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;

namespace amortizacion.tipos {

    /// <summary>
    /// Clase que implementa la tabla de amortizacion alemana, tambien conocida como tabla de capital.
    /// </summary>
    public class TablaAlemana : amortizacion.helper.Tabla {

        /** Objeto que contien los datos necesarios para genrar la tabla de pagos. */
        private Parametros parametros;

        /** Monto del capital reducido. */
        private decimal capitalreducido = 0;

        /** Valor de capital distribuido en las cuotas de la tabla de amortizacion. */
        private decimal capitalencuotas = 0;

        /** Valor total de cargos fijos por cuota. */
        private decimal cargosfijos = 0;

        /** Numero de cuota, a generar. */
        private int numerocuota = 0;

        /** Indica que la tabla de amortizacion se realiza con tasa nominal */
        private bool tasanominal = true;

        /** Valor del capital en las cuotas */
        private decimal cuotacapital;

        /// <summary>
        /// Genra tabla de amortizacion alemana.
        /// </summary>
        /// <param name="parametros">Parametros con los que se genera la tala de amortizacion.</param>
        /// <returns></returns>
        public override List<Cuota> Generar(Parametros parametros) {
            LlenaVariables(parametros);
            numerocuota = (int)this.parametros.Cuotainicio;

            GenerateGraceQuotas();

            this.Generartabla();
            base.AdicionaRubrosArregloPagos(parametros);
            base.AdicionaRubrosCxC(parametros);
            return base.cuotas;
        }

        /// <summary>
        /// Encera variables necesarias para generar tabla de pagos.
        /// </summary>
        /// <param name="parametros">Parametros utilizados en la generacion de la tabla de pagos. Ejemplo, lista de tasas, cargos, valor cuota, cpaital, numero de cuotas, fecha de inicio de pagos etc.</param>
        private void LlenaVariables(Parametros parametros) {
            this.parametros = parametros;
            capitalreducido = (decimal)parametros.Monto;
            tasanominal = Constantes.EsUno(TgenParametrosDal.GetValorTexto("TASANOMINAL", 1));
            if (this.parametros.Numerocuotas == null || this.parametros.Numerocuotas == 0) {
                throw new AtlasException("AMORT-0002", "PARA GENERAR LA TABLA DE PAGOS ALEMANA ES REQUERIDO EL NUMERO DE CUOTAS");
            }
            Caluclatotalcargosporcuota();
        }

        /// <summary>
        /// Calcula el valor de cargos total a asociar a la tabla de pagos.
        /// </summary>
        private decimal Caluclatotalcargosporcuota() {
            decimal cargo = 0;
            foreach (Cargos obj in parametros.Cargos) {
                cargo = cargo + obj.Valor;
            }
            cargosfijos = cargo;
            return cargosfijos;
        }

        /// <summary>
        /// Genera cuotas de gracia de capital, en cada cuota de gracia unicamente se cobra intereses.
        /// </summary>
        private void GenerateGraceQuotas() {
            if (parametros.Cuotainicio != 1) {
                return;
            }
            if ((parametros.Cuotasgracia != null) && (parametros.Cuotasgracia > 0)) {
                for (int i = 0; i < parametros.Cuotasgracia; i++) {
                    Calcualfechascuota(); // Calcual fecha de inicio y vencimeinto de la cuota.
                    Calculatipoacc(capitalreducido, false); // Calcula interes, cargos, comisiones tipo ACC.
                    Adicionacuota(parametros, numerocuota, Constantes.CERO, capitalreducido, true, true);
                    numerocuota++;
                }
            }
        }

        /// <summary>
        /// Calcula valores a asociar a la tabla tipo accrual, ejemplo intereses.
        /// </summary>
        /// <param name="monto">Monto base con el cual se calcula accral de la cuota.</param>
        /// <param name="acumular">true, Indica que al valor se la cuota se suma el valor calculado.</param>
        public void Calculatipoacc(decimal monto, Boolean acumular) {
            CalculaAccrual(parametros, monto, acumular);
        }

        /// <summary>
        /// Calcula fechas de inicio y vecimiento de la cuota.
        /// </summary>
        public void Calcualfechascuota() {
            Calculafechas(parametros);
        }

        /// <summary>
        /// Calcula y genera una cuota de la tabla de amortizacion.
        /// </summary>
        /// <param name="pEnd"></param>
        private void Generacuota(bool pEnd) {
            decimal capital = this.cuotacapital;

            // Si se trata de la ultima cuota
            if (pEnd) {
                // Define el valor de Intereses mas Comisiones de la cuota por si hay un residuo en la ultima cuota
                // Carga todo el capital reducido al capital de la cuota
                capital = capitalreducido;
            }
            bool charges = false;
            if (cargosfijos > 0) {
                charges = true;
            }
            if (capitalreducido.CompareTo(capital) < 0) {
                // Ejemplo cuotas mensuales y fecha de inicio de pagos da un numero de dias de la cuota menor a los dias de la frecuencia.
                capital = capitalreducido;
            }
            Adicionacuota(parametros, numerocuota, capital, capitalreducido, true, charges);
            if (!pEnd) {
                capitalreducido = capitalreducido - capital;
            }
            capitalencuotas = capitalencuotas + capital;
        }

        /// <summary>
        /// Genra tabla cuotas de la tabla de amortizacion.
        /// </summary>
        public void Generartabla() {
            // calcula valor de capital si la periodicidad de pago de capital es diferente a 1.
            Calculacuotacapital();
            bool end = false;
            int size = (int)parametros.Numerocuotas;
            int j = (int)parametros.Cuotainicio;

            if (j == 1) {
                j = j + (parametros.Cuotasgracia == null ? 0 : (int)parametros.Cuotasgracia);
            }
            if (j > size) {
                size = size + j;
            }
            for (int i = j; i <= size; i++) {

                Calcualfechascuota();
                if (i == size) {
                    end = true;
                }
                // calcula intereses, comiones,seguros para la cuota.
                decimal monto = capitalreducido;
                // Calcula tipos ACC
                Calculatipoacc(monto, false);

                Generacuota(end);
                numerocuota++;
            } // end for
        }

        /// <summary>
        /// Calcula el valor de capital fijo de la tabla alemana.
        /// </summary>
        private void Calculacuotacapital() {
            int i = (int)parametros.Numerocuotas + 1;
            int j = (int)parametros.Cuotainicio;
            int k = i - j;
            cuotacapital = (decimal)Math.Round(((double)parametros.Monto / k), TgenMonedaDal.GetDecimales(parametros.Cmoneda), MidpointRounding.AwayFromZero);
        }


    }
}
