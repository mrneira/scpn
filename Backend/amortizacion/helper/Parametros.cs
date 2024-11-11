using System;
using System.Collections.Generic;
using System.Text;
using util;

namespace amortizacion.helper {
    public class Parametros {

        /// <summary>
        /// Monto de la operacion con la cual se genera la tabla.
        /// </summary>
        private decimal? monto;

        /// <summary>
        /// Indica que la tabla de amortizacion hace ajuste del valor de la cuota con aproximaciones sucesivas. */
        private Boolean? cuotafija = true;

        /** Valor de cuota fija. */
        private decimal? valorcuota;

        /// <summary>
        /// Indica que la tabla de amortizacion se genera en un dia fijo, si no se genera en dia fijo la tabla se genera cada n dias de la
        /// fecuencia.
        /// </summary>
        private Boolean? diafijo;

        /// <summary>
        /// Numero de cuotas a generar en la tabla de amortizacion. */
        /// </summary>
        private int? numerocuotas;

        /// <summary>
        /// Numero de cuota con la cual se genera la tabla de pagos. */
        /// </summary>
        private int? cuotainicio;

        /// <summary>
        /// Dia fijo de pago. */
        private int? diapago;

        /// <summary>
        /// Fecha de inicio de pagos de la tabla de amortizacion. */
        /// </summary>
        private int? finiciopagos;

        /// <summary>
        /// Fecha de inicio de la primera cuota con la cual se genera la tabla de amortizacion. */
        /// </summary>
        private int? fgeneraciontabla;

        /// <summary>
        /// Codigo de tabla de amortizacion a generar. */
        /// </summary>
        private String ctabla;

        /// <summary>
        /// Codigo de modulo asociado al tipo de tabla de amortizacion a generar. */
        /// </summary>
        private String cmodule;

        /// <summary>
        /// Base de calculo a utilizar para el calculo de dias de la cuota y el valor de interese de la cuota.
        /// los dias mes se utiliza para el calculo de dias.
        /// los dias anio se utiliza para calcular valor sobre los cuales se aplica una tasa.
        /// </summary>
        private BaseDeCalculo basedecalculo;


        /// <summary>
        /// Codigo de frecuencia de pagos.
        /// </summary>
        private int? cfrecuencia;

        /// <summary>
        /// Numero de dias de la frecuencia de la tabla. 
        /// </summary>
        private int? diasfrecuencia;

        /// <summary>
        /// Periodicidad de generacion de cuotas de capital aplica en amortizacion gradual. 
        /// </summary>
        private int? periodicidadcapital = 1;

        /// <summary>
        /// Numero de cuotas de gracia de capital. 
        /// </summary>
        private int? cuotasgracia;

        /// <summary>
        /// Codigo de moeneda de la operacion. 
        /// </summary>
        private String cmoneda;


        /// <summary>
        /// Plazo de la tabla de amoritzacion cuando es al vencimiento. 
        /// </summary>
        private int? plazo;

        /// <summary>
        /// Numero de dias para generar cuota inpendiente ejemplo si el valor es 8 y los dias de la primera cuota son 10 genera una cuota de 10
        /// dias, si el valor es 7 se suma a la proxima cuota.
        /// </summary>
        private int? diascuotaIndependiente = 0;

        /// <summary>
        /// Lista de tasas a asociar a la tabla de amortizacion.
        /// </summary>
        private List<Tasas> tasas = new List<Tasas>();

        /// <summary>
        /// Lista de cargos a asociar la o las cuotas de la tabla de amortizacion.
        /// </summary>
        private List<Cargos> cargos = new List<Cargos>();

        /// <summary>
        /// Lista de cargos a asociar la o las cuotas de la tabla de amortizacion.
        /// </summary>
        private List<CuentasPorCobrar> cuentasporcobrar = new List<CuentasPorCobrar>();

        /// <summary>
        /// Mes del anio en el cual no se genera cotas en la tabla de amortizacion, ejemplo en Panama para ciertos productos no se genera cuotas
        /// en diciembre.
        /// </summary>
        private int? mesnogeneracuota;

        /// <summary>
        /// Monto a cobrar en cada cuota por concepto de interes.
        /// </summary>
        private decimal? cuotaInteres;

        /// <summary>
        /// Numero de decimales con los que se calcula la tasa diaria.
        /// </summary>
        private int? decimalesTasa = 12;

        /// <summary>
        /// Map que contien rubros a adiconar en la tabla de pagos como cargos resultado de un arreglo de pagos.
        /// </summary>
        Dictionary<string, decimal> marreglopago;

        /// <summary>
        /// Existe el producto
        /// </summary>
        private bool existeProducto; //RRO 20210331 Crea la variable

        /// <summary>
        /// Dia del mes del que a partir se genera la cuota en el mes siguiente.
        /// Ejemplo: Si el dia del mes es 8 y la fecha de generacion de la tabla es 10, la primera cuota se genera al mes siguiente
        /// </summary>
        private int? diacuotamessiguiente = 0;

        [Newtonsoft.Json.JsonProperty(PropertyName = "monto")]
        public decimal? Monto { get => monto; set => monto = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cuotafija")]
        public bool? Cuotafija { get => cuotafija; set => cuotafija = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "valorcuota")]
        public decimal? Valorcuota { get => valorcuota; set => valorcuota = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "diafijo")]
        public bool? Diafijo { get => diafijo; set => diafijo = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "numerocuotas")]
        public int? Numerocuotas { get => numerocuotas; set => numerocuotas = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cuotainicio")]
        public int? Cuotainicio { get => cuotainicio; set => cuotainicio = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "diapago")]
        public int? Diapago { get => diapago; set => diapago = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "finiciopagos")]
        public int? Finiciopagos { get => finiciopagos; set => finiciopagos = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "fgeneraciontabla")]
        public int? Fgeneraciontabla { get => fgeneraciontabla; set => fgeneraciontabla = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "ctabla")]
        public string Ctabla { get => ctabla; set => ctabla = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cmodule")]
        public string Cmodule { get => cmodule; set => cmodule = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "basedecalculo")]
        public BaseDeCalculo Basedecalculo { get => basedecalculo; set => basedecalculo = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cfrecuencia")]
        public int? Cfrecuencia { get => cfrecuencia; set => cfrecuencia = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "diasfrecuencia")]
        public int? Diasfrecuencia { get => diasfrecuencia; set => diasfrecuencia = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "periodicidadcapital")]
        public int? Periodicidadcapital { get => periodicidadcapital; set => periodicidadcapital = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cuotasgracia")]
        public int? Cuotasgracia { get => cuotasgracia; set => cuotasgracia = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cmoneda")]
        public string Cmoneda { get => cmoneda; set => cmoneda = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "plazo")]
        public int? Plazo { get => plazo; set => plazo = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "diascuotaIndependiente")]
        public int? DiascuotaIndependiente { get => diascuotaIndependiente; set => diascuotaIndependiente = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "tasas")]
        public List<Tasas> Tasas { get => tasas; set => tasas = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cargos")]
        public List<Cargos> Cargos { get => cargos; set => cargos = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "mesnogeneracuota")]
        public int? Mesnogeneracuota { get => mesnogeneracuota; set => mesnogeneracuota = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cuotaInteres")]
        public decimal? CuotaInteres { get => cuotaInteres; set => cuotaInteres = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "decimalesTasa")]
        public int? DecimalesTasa { get => decimalesTasa; set => decimalesTasa = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "marreglopago")]
        public Dictionary<string, decimal> Marreglopago { get => marreglopago; set => marreglopago = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "diacuotamessiguiente")]
        public int? DiaCuotaMesSiguiente { get => diacuotamessiguiente; set => diacuotamessiguiente = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "cuentasporcobrar")]
        //RRO 20210331 Crear la funcion
        public bool ExisteProducto { get => existeProducto; set => existeProducto = value; }
        [Newtonsoft.Json.JsonProperty(PropertyName = "existeProducto")]
        public List<CuentasPorCobrar> CuentasporCobrar { get => cuentasporcobrar; set => cuentasporcobrar = value; }
    }
}
