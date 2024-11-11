using System;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.Remoting;
using System.Text;
using util;

namespace amortizacion.helper {
    
    /// <summary>
    /// Clase utilitaria utilizada en el calculo de una tabla de amortizacion..
    /// </summary>
    public class TablaHelper {

        /** Numero de dias de la cuota. */
        public int diascuota;

        /** Numero de dias reales de la cuota. */
        protected int diasreales;

        /** Plazo de la operacion. */
        public int plazo = 0;

        /** Fecha de vencimiento de la cuota. */
        public int? fvencimiento;

        /** Fecha de inicio de la cuota. */
        public int? finicio;

        /** Periodicidad de capital se utiliza para enviar el monto de capital a una cuota. */
        public int periodicidadcapital = 1;


        /// <summary>
        /// Calcula proxima de vencimiento de la cuota.
        /// </summary>
        /// <param name="parametros">Referencia a Parametros, que contiene datos necesarios para generacion de tabla de amortizacion.</param>
        public void Calculafechas(Parametros parametros) {
            if (finicio == null) {
                plazo = 0;
                finicio = (int)parametros.Fgeneraciontabla;
                // fija dia fijo de pago en meses calendario y frecuencia mensual.
                FijaDiaPagoBase365(parametros);
                fvencimiento = parametros.Finiciopagos;
                // Calculate pay date and days for quota of first quota.
                if (fvencimiento == null) {
                    Calculafechacuotainicial(parametros);
                }
            } else {
                CalculatePaymentdate(parametros);
            }

            diasreales = Fecha.Resta365((int)fvencimiento, (int)finicio);
            if (parametros.Cfrecuencia != 0) {
                diascuota = Fecha.Restar(parametros.Basedecalculo, (int)fvencimiento, (int)finicio);
            } else {
                diascuota = diasreales;
            }
            plazo = plazo + diasreales;
            // manejo de mes no genera cuota.
            AjustarMesNoGneraCuota(parametros);
        }

        /// <summary>
        /// Metodo que se encarga de calcular fechas de inicio y venciemnto de la cuota, considerando el mes de no pago.
        /// </summary>
        /// <param name="parametros">Referencia a Parametros, que contiene datos necesarios para generacion de tabla de amortizacion.</param>
        private void AjustarMesNoGneraCuota(Parametros parametros) {
            int finicioaux = (int)finicio;
            int diascuotaaux = diascuota;
            int diasrealesaux = diasreales;
            int? mesnocuota = parametros.Mesnogeneracuota;
            int mes = Fecha.GetMes((int)fvencimiento);
            if ((mesnocuota == null) || (mes != mesnocuota)) {
                return;
            }

            CalculatePaymentdate(parametros);
            // manejo de valores anteriores.
            finicio = finicioaux;
            plazo = plazo + diasreales;
            diascuota = diascuotaaux + diascuota;
            diasreales = diasrealesaux + diasreales;
        }

        /// <summary>
        /// Calcula fecha de fecha de vencimiento de la primera cuota.
        /// </summary>
        /// <param name="parametros">Referencia a Parametros, que contiene datos necesarios para generacion de tabla de amortizacion.</param>
        private void Calculafechacuotainicial(Parametros parametros) {
            //int days = 0;
            BaseDeCalculo baseaux = parametros.Basedecalculo;
            fvencimiento = (int)parametros.Fgeneraciontabla;
            if ((parametros.Diapago != null) && (parametros.Diapago > 0)) {
                // baseaux = BaseDeCalculo.B360360;
                fvencimiento = Fecha.SetDiadelMes((int)fvencimiento, (int)parametros.Diapago);
                //if (fvencimiento >= finicio) {
                //    // days = Fecha.restar(baseaux, fvencimiento, finicio);
                //    days = Fecha.Resta365((int)fvencimiento, (int)finicio);
                //} else {
                //    // days = Fecha.restar(baseaux, finicio, fvencimiento);
                //    days = Fecha.Resta365((int)finicio, (int)fvencimiento);
                //}
            }

            if (Fecha.GetDia((int)finicio) > parametros.DiaCuotaMesSiguiente) {
                fvencimiento = Fecha.Adicionadias(baseaux, (int)fvencimiento, (int)parametros.Diasfrecuencia, parametros.Diapago);
            }

            //if (days < parametros.Diasfrecuencia && days <= parametros.DiascuotaIndependiente) {
            //    fvencimiento = Fecha.Adicionadias(baseaux, (int)fvencimiento, (int)parametros.Diasfrecuencia, parametros.Diapago);
            //}
            if (parametros.Cfrecuencia == 0) {
                // si es al vencimiento respeta los dias que llegan desde el parametro.
                fvencimiento = Fecha.AdicionaDias365((int)fvencimiento, (int)parametros.Plazo);
            }
        }

        /**
         * 
         * @param  
         * @throws Exception
         */
        /// <summary>
        /// Calcula fecha de inicio y vencimiento de las cuotas de la tabla de amortizacion.
        /// </summary>
        /// <param name="parametros">Referencia a Parametros, que contiene datos necesarios para generacion de tabla de amortizacion.</param>
        private void CalculatePaymentdate(Parametros parametros) {
            finicio = fvencimiento;
            BaseDeCalculo baseCalc = parametros.Basedecalculo;
            // Si no es dia fijo de pago la cuota se genera cada n dias de la frecuencia.
            if (!((parametros.Diapago != null) && (parametros.Diapago == 31))) {
                // baseCalc = BaseDeCalculo.B360360;
            }
            Boolean normal = true;
            if (parametros.Diapago != null) {
                normal = Cambiadiapago(parametros);
            }
            if (normal) {
                fvencimiento = Fecha.Adicionadias(baseCalc, (int)fvencimiento, (int)parametros.Diasfrecuencia, parametros.Diapago);
            }
        }

        /// <summary>
        /// En meses calendario y frecuancia mensual fija dia de pago, el dia de inicio de generacion de la tabla de amortizacion.
        /// </summary>
        /// <param name="parametros">Referencia a Parametros, que contiene datos necesarios para generacion de tabla de amortizacion.</param>
        private void FijaDiaPagoBase365(Parametros parametros) {
            if ((parametros.Diapago > 0) || parametros.Basedecalculo.GetDiasmes() != 365 || parametros.Cfrecuencia != 4) {
                return;
            }
            int? faux = finicio;
            if (parametros.Finiciopagos != null) {
                faux = parametros.Finiciopagos;
            }
            parametros.Diapago = Fecha.GetDia((int)faux);
        }

        private void CambiaDiaPagoCuotaInicio(Parametros parametros) {
            if ((parametros.Diapago == 31) && (parametros.Cfrecuencia == 4)) {
                DateTime gc = Fecha.GetFecha((int)fvencimiento);
                int valor = Fecha.UltimoDiaMes(DateTime.Now);
                int maxday = Fecha.UltimoDiaMes(gc);
                if (valor > maxday) {
                    valor = maxday;
                }
                gc = new DateTime(gc.Year, gc.Month, valor);
                fvencimiento = Fecha.GetFechaDesde(gc);
            }
        }

        /// <summary>
        /// Cambia el día de pago según los parámetros recibidos.
        /// </summary>
        /// <param name="parametros">Referencia a Parametros, que contiene datos necesarios para generacion de tabla de amortizacion.</param>
        private Boolean Cambiadiapago(Parametros parametros) {
            if ((parametros.Diapago == 31) && (parametros.Cfrecuencia == 4)) {
                //DateTime gc = Fecha.GetFecha((int)fvencimiento);
                //gc.AddMonths(1);
                DateTime gc = Fecha.GetFecha(Fecha.AdicionaMes365((int)fvencimiento, 1));
                int valor = Fecha.UltimoDiaMes(gc);//CCa cambios tabla ---- =1;
                gc = new DateTime(gc.Year, gc.Month, valor);
                fvencimiento = Fecha.GetFechaDesde(gc);
                return false;
            }
            if (parametros.Diasfrecuencia >= 30) {
                int months = (int)parametros.Diasfrecuencia / 30;
                DateTime gc = Fecha.GetFecha(Fecha.AdicionaMes365((int)fvencimiento, months));
                //DateTime gc = Fecha.GetFecha((int)fvencimiento);
                //gc.AddMonths(months);

                if (gc.Day != parametros.Diapago) {
                    if (Fecha.UltimoDiaMes(gc) >= parametros.Diapago) {
                        // si el dia de pago es 29, 30 y es febrero no se pone el dia fijo, la cuota se genera el 28 de febrero
                        gc = new DateTime(gc.Year, gc.Month, (int)parametros.Diapago);
                    }
                }
                fvencimiento = Fecha.GetFechaDesde(gc);
                return false;
            }
            return true;
        }
        
        /// <summary>
        /// Entrega el valor de: plazo
        /// </summary>
        public int GetPlazo() {
            return plazo;
        }

        /// <summary>
        /// Entrega el valor de: fvencimiento
        /// </summary>
        public int GetFvencimiento() {
            return (int)fvencimiento;
        }
        
        /// <summary>
        /// Entrega una instancia de la clase que se encarga de generar la tabla de pagos, de acuerdo al tipo de tabla a generar.
        /// </summary>
        /// <param name="ctipotabla">Tipo Tabla.</param>
        public static Tabla GetInstancia(String ctipotabla) {
            Tabla t = null;
            try {
                string assembly = ctipotabla.Substring(0, ctipotabla.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, ctipotabla);
                object comp = handle.Unwrap();
                t = (Tabla)comp;
                return t;
            } catch (Exception e) {
                throw e;
            }
            

        }
    }

}
