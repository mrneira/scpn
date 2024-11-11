using amortizacion.helper;
using System.Collections.Generic;
using amortizacion.dto;
using System;
using util;
using dal.generales;

namespace amortizacion.tipos {

    /// <summary>
    /// Clase que implementa la tabla de amortizacion francesa, tambien conocida como amortizacion gradual.
    /// </summary>
    public class TablaFrancesa : amortizacion.helper.Tabla {

        // public helper.Tabla tabla = null; // new helper.Tabla();

        /** Objeto que contien los datos necesarios para genrar la tabla de pagos. */
        internal Parametros parametros;

        /** Tasa total a aplicar en la tabla de amortizacion. */
        internal decimal tasatotal = Constantes.CERO;

        /** Valor de la cuota fija con la cual se genera la tabla de amortizacion. */
        internal decimal? cuotafija;

        /** Monto del capital reducido. */
        internal decimal capitalreducido;

        /** Valor de capital distribuido en las cuotas de la tabla de amortizacion. */
        internal decimal capitalencuotas = Constantes.CERO;

        /** Valor total de cargos fijos por cuota. */
        internal decimal cargosfijos = Constantes.CERO;

        /** Valor del interes deudor total de la cuota. */
        internal decimal interesdeudor = Constantes.CERO;

        /** Indica si se realizo o no el ajuste de una cuota fija. */
        internal Boolean ajustocuota = false;

        /** Numero de cuota, a generar. */
        internal int numerocuota = 0;

        /** Indica que la tabla de amortizacion se realiza con tasa nominal */
        internal Boolean tasanominal = true;

        /** Valor del capital en las cuotas, si la periodicidad es mayor a 1. */
        internal decimal cuotacapital; // Si la periodicidad de capital es > 1

        /** Numero de cuotas de capital, si la periodicidad de capital es mayor a 1. */
        internal int numerocuotascapital;

        /** Numero de cuotas de capital, si la periodicidad de capital es mayor a 1. */
        internal int numerocuotascapitalaux = 0;

        public override List<Cuota> Generar(Parametros parametros) {
            LlenaVariables(parametros);
            if (this.parametros.Valorcuota != null) {
                this.parametros.Cuotafija = false;
            }
            numerocuota = (int)this.parametros.Cuotainicio;
            GenerateGraceQuotas();

            if (((this.parametros.Valorcuota == null) || (this.parametros.Valorcuota == 0)) || (this.parametros.Periodicidadcapital > 1)) {
                Numerocuotas nc = new Numerocuotas(this);
                nc.Generartabla();
            } else {
                Valorcuota vc = new Valorcuota(this);
                vc.Generartabla();
            }
            base.AdicionaRubrosArregloPagos(parametros);
            base.AdicionaRubrosCxC(parametros);
            return cuotas;
        }

        /// <summary>
        /// Encera variables necesarias para generar tabla de pagos.
        /// </summary>
        /// <param name="parametros">Parametros utilizados en la generacion de la tabla de pagos. Ejemplo, lista de tasas, cargos, valor cuota, cpaital, numero de cuotas, fecha de inicio de pagos etc.</param>
        internal void LlenaVariables(Parametros parametros) {
            this.parametros = parametros;
            capitalreducido = (decimal)parametros.Monto;
            cuotafija = parametros.Valorcuota;
            tasanominal = Constantes.EsUno(TgenParametrosDal.GetValorTexto("TASANOMINAL", 1));
            Caluclatotalcargosporcuota();
            tasatotal = Tasas.CalculaTasatotal(parametros.Tasas);
        }

        /// <summary>
        /// Calcula el valor de cargos total a asociar a la tabla de pagos.
        /// </summary>
        internal decimal Caluclatotalcargosporcuota() {
            decimal cargo = Constantes.CERO;
            foreach (Cargos obj in parametros.Cargos) {
                cargo = cargo + obj.Valor;
            }
            cargosfijos = cargo;
            return cargosfijos;
        }

        /// <summary>
        /// Genera cuotas de gracia de capital, en cada cuota de gracia unicamente se cobra intereses.
        /// </summary>
        public void GenerateGraceQuotas() {
            if (this.parametros.Cuotainicio != 1) {
                return;
            }
            if ((this.parametros.Cuotasgracia != null) && (this.parametros.Cuotasgracia > 0)) {
                for (int i = 0; i < this.parametros.Cuotasgracia; i++) {
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
        
        public void Generacuota(Boolean pEnd)
        { 
            decimal capital = Constantes.CERO;
            // Si el valor total de intereses y comisiones excede del valor de la cuota fija
            if (interestotalcuota > cuotafija) {
                // Se acumula el valor de intereses y comisiones excedente de la cuota y se asume como el
                // valor de intereses y comisiones de la cuota el valor de la cuota
                interesdeudor = interesdeudor + (interestotalcuota - ((decimal)cuotafija + cargosfijos));
                interestotalcuota = (decimal)cuotafija;
                // Si se tiene un valor acumulado de intereses y comisiones proveniente de cuotas anteriores
            } else if (interesdeudor > 0) {
                decimal aux = (decimal)cuotafija - interestotalcuota;
                decimal valor = interesdeudor;
                if (interesdeudor > aux) {
                    valor = aux;
                }
                interesdeudor = interesdeudor - (valor);
                interestotalcuota = interestotalcuota + (valor);
            }
            // Distribuye el interes deudor si exitiera.
            Manejainteresdeudor(pEnd, interestotalcuota);
            // Si se trata de la ultima cuota
            if (pEnd) {
                // Define el valor de Intereses mas Comisiones de la cuota por si hay un residuo en la ultima cuota
                // Carga todo el capital reducido al capital de la cuota
                capital = capitalreducido;
            } else {
                if (periodicidadcapital < parametros.Periodicidadcapital) {
                    periodicidadcapital++;
                } else {
                    periodicidadcapital = 1;
                    if (parametros.Periodicidadcapital > 1) {
                        capital = cuotacapital;
                        numerocuotascapitalaux = numerocuotascapitalaux + 1;
                        if (numerocuotascapitalaux == numerocuotascapital) {
                            capital = capitalreducido;
                        }
                    } else {
                        // Obtiene el valor de capital de la cuota
                        capital = (decimal)cuotafija - (interestotalcuota);
                        if (capital >= cargosfijos) {
                            capital = capital - (cargosfijos);
                        } else {
                            capital = Constantes.CERO;
                        }
                    }
                }
            }
            Boolean charges = false;
            if (cargosfijos > Constantes.CERO) {
                charges = true;
            }
            if (capitalreducido < capital) {
                // Ejemplo cuotas mensuales y fecha de inicio de pagos da un numero de dias de la cuota menor a los dias de la frecuencia.
                capital = capitalreducido;
            }
            Adicionacuota(parametros, numerocuota, capital, capitalreducido, true, charges);
            if (!pEnd) {
                capitalreducido = capitalreducido - (capital);
            }
            capitalencuotas = capitalencuotas + capital;
        }

        internal void Manejainteresdeudor(Boolean pEnd, decimal interestotalcuota) {
            decimal interesadistribuir = interestotalcuota;
            foreach (Tasas obj in parametros.Tasas) {
                // Se obtiene el nuevo valor de interes a distribuir
                interesadistribuir = obj.Actualizavalorcuota(pEnd, interesadistribuir);
            }
        }
        
        /// <summary>
        /// Clase que se encarga de calcular tabla de amortizacion dado el valor de la cuota, en este caso calcula el numero de cuotas.
        /// </summary>
        internal class Valorcuota {
            private TablaFrancesa tablaFrancesa;

            public Valorcuota(TablaFrancesa tablaFrancesa) {
                this.tablaFrancesa = tablaFrancesa;
            }

            public void Generartabla() {
                Boolean end = false;
                while (!end) {
                    tablaFrancesa.interestotalcuota = Constantes.CERO;

                    tablaFrancesa.Calcualfechascuota();
                    if (tablaFrancesa.parametros.Monto - tablaFrancesa.capitalencuotas < tablaFrancesa.cuotafija) {
                        end = true;
                    }
                    // calcula intereses, comiones,seguros para la cuota.
                    decimal amount = tablaFrancesa.capitalreducido;
                    // para peru amount = amount.add(debtorInterest); //se calcula interese sobre el capital mas interes deudor
                    // Calcula tipos ACC
                    tablaFrancesa.Calculatipoacc(amount, false);

                    tablaFrancesa.Generacuota(end);
                    tablaFrancesa.numerocuota++;
                }
                /* Fija el numero de cuotas de la tabla se resta 1 al numero de cuotas */
                tablaFrancesa.parametros.Numerocuotas = --tablaFrancesa.numerocuota;
            }
        }

    }
}
