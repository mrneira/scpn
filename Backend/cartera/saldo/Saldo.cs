using cartera.datos;
using dal.cartera;
using dal.generales;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.enums;

namespace cartera.saldo
{
    /// <summary>
    /// Clase que se encarga del manejo de saldos de cuotas en operaciones de cartra.
    /// </summary>
    public class Saldo
    {

        /// <summary>
        ///  Referencia a una operacion de cartera.
        /// </summary>
        private Operacion operacion;

        /// <summary>
        /// Fecha a la cual se calcula los valores adeudados.
        /// </summary>
        private int fproceso;

        /// <summary>
        /// Numero de decimales para la moneda de la operacion.
        /// </summary>
        private int decimales;

        /// <summary>
        /// Saldo de capital vencido.
        /// </summary>
        private decimal capitalvencido = Constantes.CERO;

        /// <summary>
        /// Saldo de capital por vencer.
        /// </summary>
        private decimal capitalporvencer = Constantes.CERO;

        /// <summary>
        /// Valor epndiente de pago, incluye capital, interes, seguros, cargos etc.
        /// </summary>
        private decimal totalpendientepago = Constantes.CERO;

        /// <summary>
        /// Valor a favor del cliente en cuentas por pagar a favor del cliente.
        /// </summary>
        private decimal cxp = Constantes.CERO;

        /// <summary>
        /// Referencia a la cuota en curso.
        /// </summary>
        private tcaroperacioncuota cuotaencurso;

        /// <summary>
        /// Lista de codigos de saldo tipo accrual a calcular en la operacion.
        /// </summary>
        private List<tcaraccrual> lacrual;

        /// <summary>
        /// Indica si el clculo se realiza en la cuota en curso.
        /// </summary>
        private bool escuotaencurso = false;
        /// <summary>
        /// true consulta saldos solo de los rubros de arrego de pagos que son obligatorios de pago.
        /// </summary>
        public bool esarreglopago = false;
        /// <summary>
        /// Lista de rubros a pagar en arreglo de pagos.
        /// </summary>
        private List<tcaroperacionarrepagorubro> lArregloPagosRubros;

        public Operacion Operacion { get => operacion; set => operacion = value; }
        public int Fproceso { get => fproceso; set => fproceso = value; }
        public int Decimales { get => decimales; set => decimales = value; }
        public decimal Capitalvencido { get => capitalvencido; set => capitalvencido = value; }
        public decimal Capitalporvencer { get => capitalporvencer; set => capitalporvencer = value; }
        public decimal Totalpendientepago { get => totalpendientepago; set => totalpendientepago = value; }
        public decimal Cxp { get => cxp; set => cxp = value; }
        public tcaroperacioncuota Cuotaencurso { get => cuotaencurso; set => cuotaencurso = value; }
        public List<tcaraccrual> Lacrual { get => lacrual; set => lacrual = value; }
        public bool Escuotaencurso { get => escuotaencurso; set => escuotaencurso = value; }

        public Saldo(Operacion operacion, int fproceso) : this(operacion, fproceso, false, null) { }

        /// <summary>
        /// Crea una instancia de Saldo y calcula valores de cuotas vencidas.
        /// </summary>
        /// <param name="operacion">Objeto que contiene información de una operacion de cartera.</param>
        /// <param name="fproceso">Fecha a la cual se calcula el valor de la deuda de una operacion.</param>
        public Saldo(Operacion operacion, int fproceso, bool esarreglopago, long? csolicitud)
        {
            this.Operacion = operacion;
            this.Fproceso = fproceso;
            this.esarreglopago = esarreglopago;
            Decimales = TgenMonedaDal.GetDecimales(operacion.tcaroperacion.cmoneda);
            Lacrual = TcarAccrualDal.FindAll().Cast<tcaraccrual>().ToList();
            if (this.esarreglopago)
            {
                // Lista de rubros a pagar en el arreglo de pagos.
                lArregloPagosRubros = TcarOperacionArrePagoRubroDal.Find(operacion.tcaroperacion.coperacion, (long)csolicitud);
            }
            CalcularCuentaPorPagar();
            CalculaCuotasVencidas();
        }

        /// <summary>
        /// Calcula el monto a favor del cliente en cuentas por pagar.
        /// </summary>
        private void CalcularCuentaPorPagar()
        {
            tcaroperacioncxp obj = TcarOperacionCxPDal.Find(this.operacion.Coperacion);
            if (obj != null && obj.saldo > 0)
            {
                cxp = (decimal)obj.saldo;
            }
        }

        /// <summary>
        /// Calcula el valor pendiente de pago para las cuotas cuya fecha de vencimiento sea menor o igual a la fecha de proceso.
        /// </summary>
        private void CalculaCuotasVencidas()
        {
            foreach (tcaroperacioncuota cuota in Operacion.GetLcuotas())
            {
                if (cuota.fvencimiento > Fproceso)
                {
                    if (cuota.finicio != Fproceso)
                    {
                        // si la cuota actual inicia hoy no se la considera para el calculo, el cobro se hace mañana el valor de hoy.
                        Cuotaencurso = cuota;
                    }
                    // Si una cuota vence hoy e inicia otra el capital por vencer esta en la cuota que inicia.
                    Capitalporvencer = (decimal)cuota.capitalreducido;
                    break;
                }
                CalculaValoresPorCuota(cuota);
            }
        }

        /// <summary>
        /// Calcula valores de CXC de cuotas con vencimiento futuro, se utiliza en el pago extraordinario.
        /// </summary>
        public void CalculaCuotasfuturas()
        {
            foreach (tcaroperacioncuota cuota in Operacion.Lcuotas)
            {
                if (cuota.fvencimiento > Fproceso)
                {
                    foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros())
                    {
                        CalculaValorCuotasFuturas(cuota, rubro);
                    }
                }
            }
        }

        /// <summary>
        /// Calcula valores de cuotas con vencimiento futuro no considera los tipos ACC, se utiliza en la precancelacion de la operacion.
        /// </summary>
        /// <returns>decimal</returns>
        public decimal GetSaldoCuotasfuturas()
        {
            decimal saldofuturo = Constantes.CERO;
            foreach (tcaroperacioncuota cuota in Operacion.Lcuotas)
            {
                if (cuota.fvencimiento > Fproceso)
                {
                    foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros())
                    {
                        // No incluye los tipo ACC.
                        if ((rubro.esaccrual != null && (bool)rubro.esaccrual) || rubro.fpago != null)
                        {
                            continue;
                        }
                        saldofuturo = saldofuturo + (decimal)rubro.saldo - (decimal)rubro.cobrado - (decimal)rubro.descuento;
                    }
                }
            }
            return saldofuturo;
        }

        public decimal GetValorCuota(tcaroperacioncuota cuota)
        {
            decimal valorcuota = Constantes.CERO;
            foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros())
            {
                valorcuota = decimal.Add(valorcuota, rubro.valorcuota.Value);
            }
            return valorcuota;
        }

        public tcaroperacioncuota GetPrimracuotaFutura()
        {
            tcaroperacioncuota obj = null;
            foreach (tcaroperacioncuota cuota in Operacion.Lcuotas)
            {
                if (cuota.fvencimiento >= Fproceso)
                { //CCA 20220607
                    obj = cuota;
                    break;
                }
            }
            return obj;
        }

        /// <summary>
        /// Calcula el valor de los sados tipo ACC, de la cuota en curso.
        /// </summary>
        public void Calculacuotaencurso()
        {
            Escuotaencurso = true;
            if (Cuotaencurso != null)
            {
                CalculaValoresPorCuota(Cuotaencurso);
            }
            Escuotaencurso = false;
        }

        /// <summary>
        /// Calcula el valor a pagar de la cuota actual utilizado en pago anticipado de la cuota en este caso se cobra el 
        /// valor de la cuota para todos los saldos, capital, interes etc.
        /// </summary>
        /// <param name="numcuotasPagarAdelantado"></param>
        public void CalculacuotaencursoPagoAnticipado(int numcuotasPagarAdelantado)
        {
            List<tcaroperacioncuota> lcuotas = Operacion.Lcuotas;
            if (Cuotaencurso == null)
            {
                for (int i = 0; i < numcuotasPagarAdelantado; i++)
                {
                    CalculaValoresPorCuota(lcuotas[i]);
                }
                return;
            }
            int? cuotadesde = Cuotaencurso.numcuota;
            int? cuotahasta = cuotadesde + numcuotasPagarAdelantado;
            foreach (tcaroperacioncuota cuota in lcuotas)
            {
                if (cuota.numcuota < cuotadesde)
                {
                    continue;
                }
                if (cuota.numcuota >= cuotahasta)
                {
                    break;
                }
                CalculaValoresPorCuota(cuota);
            }
        }

        /// <summary>
        /// Calcula el valor adeudado de cuotas vencidas mas el valor de tipos ACC, hasta hoy.
        /// </summary>
        public void Calculasaldohoy()
        {
            Calculacuotaencurso();
        }

        /// <summary>
        /// Calcula el valor pendiente de pago de una cuota Recorre la lista de rubros y calcula el 
        /// valor pendiente de pago de cada uno de ellos.
        /// </summary>
        /// <param name="cuota"></param>
        /// <returns>decimal</returns>
        public decimal CalculaDeudaPorCuota(tcaroperacioncuota cuota)
        {
            decimal totalcuota = Constantes.CERO;
            bool aux = Escuotaencurso;
            Escuotaencurso = false;
            foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros())
            {
                decimal pendiente = CalculaValorRubro(cuota, rubro);
                totalcuota = totalcuota + pendiente;
            }
            Escuotaencurso = aux;
            return totalcuota;
        }

        /// <summary>
        /// Calcula el valor pendiente de pago de una cuota Recorre la lista de rubros y calcula el valor pendiente 
        /// de pago de cada uno de ellos.
        /// </summary>
        /// <param name="cuota"></param>
        private void CalculaValoresPorCuota(tcaroperacioncuota cuota)
        {
            foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros())
            {
                CalculaValorRubro(cuota, rubro);
            }
        }

        /// <summary>
        /// Calcula el valor pendiente de pago de un rubro de una cuota.
        /// </summary>
        /// <param name="cuota"></param>
        /// <param name="rubro">Objeto que contiene los datos del rubro a calcular el valor pendiente de pago.</param>
        /// <returns></returns>
        private decimal CalculaValorRubro(tcaroperacioncuota cuota, tcaroperacionrubro rubro)
        {
            if (rubro.fpago != null)
            {
                return Constantes.CERO;
            }
            tmonsaldo tmonsaldo = TmonSaldoDal.Find(rubro.csaldo);
            // null indica que el valor del rubro no se cobra ejemplo capital de la cuota en curso, a la fecha solo se cobra los tipo ACC.
            decimal? pendiente = 0;
            bool esaccrual = (bool)((tmonsaldo.esaccrual != null) ? tmonsaldo.esaccrual : false);
            if (!Escuotaencurso && !esaccrual && this.Pagar(rubro))
            {
                pendiente = rubro.saldo - rubro.cobrado - rubro.descuento;
            }
            if (esaccrual && this.Pagar(rubro))
            {
                pendiente = TcarOperacionRubroDal.GetSaldoAccrual(cuota, rubro, GetFechacalculoaccrual(cuota, rubro), Decimales);
                if (pendiente < 0)
                {
                    pendiente = Constantes.CERO;
                }
            }
            if (pendiente != null)
            {
                if (EnumTipoSaldo.EsCapital(tmonsaldo.ctiposaldo))
                {
                    Capitalvencido += (decimal)pendiente;
                }
                rubro.SetPendiente((decimal)pendiente);
                Totalpendientepago += (decimal)pendiente;
            }

            return pendiente == null ? 0 : (decimal)pendiente;
        }

        /// <summary>
        /// Valida si exige el pago del rubro en arreglo de pagos.
        /// </summary>
        /// <param name="rubro">Rubro de la tabla de amortización.</param>
        /// <returns></returns>
        private bool Pagar(tcaroperacionrubro rubro)
        {
            if (!this.esarreglopago)
            {
                return true;
            }
            bool pagar = false;
            foreach (tcaroperacionarrepagorubro rubarreglo in lArregloPagosRubros)
            {
                if ((bool)rubarreglo.pagoobligatorio && rubarreglo.csaldo.Equals(rubro.csaldo))
                {
                    pagar = true;
                    break;
                }
            }
            return pagar;
        }

        /// <summary>
        /// Calcula el valor de cuentas por cobrar con vencimiento futuro se utiliza en el pago extraordinario.
        /// </summary>
        /// <param name="cuota"></param>
        /// <param name="rubro">Objeto que contiene los datos del rubro a calcular el valor pendiente de pago.</param>
        private void CalculaValorCuotasFuturas(tcaroperacioncuota cuota, tcaroperacionrubro rubro)
        {
            tmonsaldo tmonsaldo = TmonSaldoDal.Find(rubro.csaldo);
            if (tmonsaldo.ctiposaldo.Equals("CAP") || (rubro.esaccrual != null && (bool)rubro.esaccrual))
            {
                return; // si no es cxc no calcular valor adeudado.
            }
            decimal? pendiente = rubro.saldo - rubro.cobrado - rubro.descuento;
            if (pendiente != null)
            {
                rubro.SetPendiente((decimal)pendiente);
                Totalpendientepago += (decimal)pendiente;
            }
        }

        /// <summary>
        /// Metodo que busca la fecha hasta la cual se calcula el saldo pendiente de pago de un rubro tipo ACC.
        /// </summary>
        /// <param name="cuota">Cabecera de la cuota.</param>
        /// <param name="rubro">Rubro perteneciente a la cuota.</param>
        /// <returns></returns>
        private int GetFechacalculoaccrual(tcaroperacioncuota cuota, tcaroperacionrubro rubro)
        {
            int fecha = Fproceso;
            tcaraccrual tcaraccrual = TcarAccrualDal.Find(Lacrual, rubro.csaldo);
            if (tcaraccrual == null)
            {
                throw new AtlasException("CAR-0047", "RUBRO [{0}] NO DEFINIDO EN LA TABLA [TCARACCRUAL]", rubro.csaldo);
            }
            rubro.SetAccrualdesde(tcaraccrual.accrualdesde);
            rubro.SetAccrualhasta(tcaraccrual.accrualhasta);
            if (Escuotaencurso)
            {
                // En interes de la cuota en curso se calcula hasta la fecha de proceso o de consulta.
                return fecha;
            }
            if (tcaraccrual.accrualhasta.Equals("V"))
            {
                fecha = (int)cuota.fvencimiento;
            }

            return fecha;
        }

        /// <summary>
        /// Entrega el saldo de capital de n cuotas por vencer.
        /// </summary>
        /// <param name="numerocuotas"Numero de cuotas por vencer a obtener el saldo de capital.></param>
        /// <returns>decimal</returns>
        public decimal GetSaldoCapitalPorVencer(int numerocuotas)
        {
            decimal saldo = Constantes.CERO;
            int i = 1;
            foreach (tcaroperacioncuota cuota in Operacion.Lcuotas)
            {
                if (cuota.fvencimiento < Fproceso)
                {
                    continue;
                }
                if (i > numerocuotas)
                {
                    break;
                }
                i++;
                saldo += Saldo.CalculaSaldoCapitalPorVencer(cuota);
            }
            return saldo;
        }

        /// <summary>
        /// Calcula el valor de capital de una cuota. Recorre la lista de rubros y obtiene le valor de capital de la cuota.
        /// </summary>
        /// <param name="cuota">Datos de la cuota a obtener el saldo de capital.</param>
        /// <returns>decimal</returns>
        private static decimal CalculaSaldoCapitalPorVencer(tcaroperacioncuota cuota)
        {
            decimal? saldocapital = Constantes.CERO;
            List<tcaroperacionrubro> lrubros = cuota.GetRubros();
            foreach (tcaroperacionrubro rubro in lrubros)
            {
                if (EnumTipoSaldo.EsCapital(TmonSaldoDal.Find(rubro.csaldo).ctiposaldo))
                {
                    saldocapital = rubro.saldo;
                    break;
                }
            }
            return (decimal)saldocapital;
        }

        /// <summary>
        /// Entrega una lista de cuotas vencidas con los valores de cada rubro.
        /// </summary>
        /// <returns>TcarOperacionCuotaDto</returns>
        public List<tcaroperacioncuota> GetCuotasVencidas()
        {
            List<tcaroperacioncuota> lcuotasvencidas = new List<tcaroperacioncuota>();
            foreach (tcaroperacioncuota cuota in Operacion.GetLcuotas())
            {
                if (cuota.fvencimiento > Fproceso)
                {
                    break;
                }
                lcuotasvencidas.Add(cuota);
            }
            return lcuotasvencidas;
        }

        /// <summary>
        /// Entrega los días de morosidad de una operacion de cartera.
        /// </summary>
        /// <returns>int</returns>
        public int GetDiasMorosidad()
        {
            int diasmorosidad = 0;
            if (Operacion.Lcuotas != null && !(Operacion.Lcuotas.Count < 1)
                    && this.Fproceso > Operacion.Lcuotas[0].fvencimiento)
            {
                diasmorosidad = Fecha.Resta365(this.Fproceso, (int)Operacion.Lcuotas[0].fvencimiento);
            }
            return diasmorosidad;
        }

        /// <summary>
        /// Entrega los días de morosidad de una operacion de cartera.
        /// </summary>
        /// <returns>int</returns>
        public int GetDiasMorosidad360()
        {
            int diasmorosidad = 0;
            if (Operacion.Lcuotas != null && !(Operacion.Lcuotas.Count < 1)
                    && this.Fproceso > Operacion.Lcuotas[0].fvencimiento)
            {
                diasmorosidad = Fecha.Resta360(this.Fproceso, (int)Operacion.Lcuotas[0].fvencimiento);
            }
            return diasmorosidad;
        }


        public void EncerarValoresPorCobrar()
        {
            foreach (tcaroperacioncuota cuota in Operacion.Lcuotas)
            {
                if (cuota.fpago != null)
                {
                    continue;
                }
                foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros())
                {
                    rubro.SetPendiente(Constantes.CERO);
                    rubro.SetPagadoentransaccion(Constantes.CERO);
                }
            }
        }
    }
}