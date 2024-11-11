using dal.generales;
using modelo;
using System;
using util;

namespace general.util {

    /// <summary>
    /// Calse utilitaria que se encarga de calcular valor diario de accrual o valor de una cuota, trabaja con tasa nominal o tasa efectiva la
    /// cual se parametriza en la tabla tgenparametros campo TASANOMINAL.
    /// </summary>
    public class AccrualHelper {

        /// <summary>
        /// CaBase de calculo a aplicar en el calculo
        /// </summary>
        private BaseDeCalculo basecalculo;

        /// <summary>
        /// Tasa de interes diaria.
        /// </summary>
        private decimal? tasadiaria;

        /** true, indica que los calculos se hacen con tasa nominal, false el calculos e hace con tasa efectiva */
        private Boolean tasanominal = true;
        /// <summary>
        /// NUmero de decimales con el que se calcula la tasa diaria.
        /// </summary>
        private int decimalesTasa = 12;

        /// <summary>
        /// Crea una instancia de InterestManager dada la base de calculo.
        /// </summary>
        /// <param name="basecalculo">Base de calculo, con la cual se calcula el valor de la cuota o el valor del accrual diario.</param>
        public AccrualHelper(BaseDeCalculo basecalculo)
        {
            this.basecalculo = basecalculo;
            this.tasanominal = Constantes.EsUno(TgenParametrosDal.GetValorTexto("TASANOMINAL", 1));
        }

        /// <summary>
        /// Entrega el valor de accrual diario de intereses.
        /// </summary>
        /// <param name="capital">Capital sobre el cual se calcula el valor de la cuota.</param>
        /// <param name="tasa">Tasa de interes anual</param>
        /// <param name="fdesde">Fecha de inicio de una cuota.</param>
        /// <param name="fhasta">Fecha de vencimiento de una cuota.</param>
        /// <param name="cmoneda">Codigo de moneda.</param>
        /// <returns>decimal</returns>
        public decimal CalcularAccrualDiario(decimal capital, decimal tasa, int fdesde, int fhasta, String cmoneda)
        {
            this.tasadiaria = this.GetTasadiaria(tasa);
            decimal dias = this.GetDias(fdesde, fhasta);
            decimal diasreales = AccrualHelper.GetDiasReales(fdesde, fhasta);
            // i = ((k*tasa*plazo)*dias / diasanio)/diasreales
            decimal accural;
            if (this.tasanominal) {
                accural = this.CalculaDividendo(capital, tasa, (int)dias, cmoneda);
            } else {
                accural = capital * (decimal)this.tasadiaria * dias;
            }
            accural = Math.Round((accural / diasreales), 7, MidpointRounding.AwayFromZero);
            return accural;
        }

        /// <summary>
        /// Calcula el valor de un dividendo de los saldo que tiene un accrual diario.
        /// </summary>
        /// <param name="capital">Capital sobre el cual se calcula el valor de la cuota.</param>
        /// <param name="tasa">Tasa de interes anual, esta tasa puede ser nominal o efectiva.</param>
        /// <param name="diascuota">Numero de dias de la cuota.</param>
        /// <param name="cmoneda">Codigo de moneda, utilizada para redondear el valor calculado del valor cuota segun los decimales de la moneda.</param>
        /// <returns>decimal</returns>
        public decimal CalculaDividendo(decimal capital, decimal tasa, int diascuota, String cmoneda)
        {
            // Calcula la tasa de interes diaria.
            this.tasadiaria = this.GetTasadiaria(tasa);
            // i = (k*tasa*plazo) / diasanio
            tgenmoneda moneda = TgenMonedaDal.Find(cmoneda);
            // provision de un dia.
            decimal interes;
            if (this.tasanominal) {
                interes = capital * ((decimal)this.tasadiaria) * new decimal(diascuota);
            } else {
                // interest = provdia1(( 1 + ted)^(dias) -1))/ ted
                interes = capital * (decimal)this.tasadiaria;
                decimal rate = (decimal)this.tasadiaria + Constantes.UNO;
                interes = interes * (decimal)((Math.Pow((double)rate, diascuota)) - Constantes.UNO);
                interes = interes / (decimal)this.tasadiaria;
            }
            if (diascuota > 1) {
                // Si el numero de dias es 1 no hacer la divison ejemplo el calculo de la mora de prestamos.
                interes = (decimal)Math.Round((interes / Constantes.UNO), (int)moneda.decimales, MidpointRounding.AwayFromZero);
            }
            return interes;
        }

        /// <summary>
        /// Metodo que entrega el numero de dias entre 2 fechas considerando la base de calculo, dias mes, comercial meses de 30 dias, o real
        ///  meses calendario.
        /// </summary>
        /// <param name="fdesde">Fecha inicial a restar de la fecha final.</param>
        /// <param name="fhasta">Fecha final de la cual se resta la fecha inicial.</param>
        /// <returns>decimal</returns>
        private decimal GetDias(int fdesde, int fhasta)
        {
            int dias = Constantes.UNO;
            if (this.basecalculo.GetDiasmes() == 360) {
                dias = Fecha.Resta360(fhasta, fdesde);
            } else {
                dias = Fecha.Resta365(fhasta, fdesde);
            }
            if (dias == 0) {
                // Si los dias reales son 0, se devuelve 1 para los calculos.
                dias = Constantes.UNO;
            }
            return new decimal(dias);
        }

        /// <summary>
        /// Metodo que entrega el numero de dias reales entre 2 fechas.
        /// </summary>
        /// <param name="fdesde">Fecha inicial a restar de la fecha final.</param>
        /// <param name="fhasta">Fecha final de la cual se resta la fecha inicial.</param>
        /// <returns>decimal</returns>
        private static decimal GetDiasReales(int fdesde, int fhasta)
        {
            int dias = Fecha.Resta365(fhasta, fdesde);
            if (dias == 0) {
                // Si los dias reales son 0, se devuelve 1 para los calculos.
                dias = Constantes.UNO;
            }
            return new decimal(dias);
        }

        /// <summary>
        /// Entrega una tasa de interes diaria dada una tasa de interes Anual, esta puede ser nominal o efectiva.
        /// </summary>
        /// <param name="tasaanual">Tasa de interes anual.</param>
        /// <returns>decimal</returns>
        public decimal GetTasadiaria(decimal tasaanual)
        {
            if (this.tasadiaria != null) {
                return (decimal)this.tasadiaria;
            }
            // Tasa diaria cuando se trabaja con tasa nominal.
            if (this.tasanominal) {
                decimal baseCalc = new decimal(this.basecalculo.GetDiasAnio());
                decimal tasa = Math.Round((tasaanual / Constantes.CIEN), decimalesTasa, MidpointRounding.AwayFromZero);
                tasa = Math.Round((tasa / baseCalc), 9, MidpointRounding.AwayFromZero);
                return tasa;
            }
            if (this.basecalculo.GetDiasmes() == 360) {
                throw new AtlasException("FIN054", "EN TASA CON CAPITALIZACION DIARIA SOLO SE PERMITE DIAS AÃ‘O 365");
            }
            // Tasa diaria dada una tasa Efectiva Anual
            // TID = (1+TEA)^(1/dias mes)-1
            tasaanual = tasaanual / Constantes.CIEN;
            tasaanual = tasaanual + Constantes.UNO;
            double rate = Math.Pow((double)tasaanual, (1.0 / this.basecalculo.GetDiasmes()));
            tasaanual = new decimal(rate);
            tasaanual = tasaanual - Constantes.UNO;
            return Math.Round((tasaanual / Constantes.UNO), 12, MidpointRounding.AwayFromZero);
        }

        /// <summary>
        /// Entrega el valor de la tasa diaria de interes con la cual se calcula el accrual.
        /// </summary>
        /// <returns>decimal</returns>
        public decimal GetTasadiaria()
        {
            return (decimal)this.tasadiaria;
        }

        /// <summary>
        /// Entrega el valor de: decimalesTasa
        /// </summary>
        /// <returns>int</returns>
        public int GetDecimalesTasa()
        {
            return decimalesTasa;
        }

        /// <summary>
        /// Fija el valor de: decimalesTasa
        /// </summary>
        /// <param name="decimalesTasa">Valor a fijar en el atributo.</param>
        public void SetDecimalesTasa(int decimalesTasa)
        {
            this.decimalesTasa = decimalesTasa;
        }

    }

}
