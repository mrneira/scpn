using cartera.cobro;
using cartera.cobro.helper;
using dal.cartera;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.pagoextraordinario {


    /// <summary>
    /// Clase que se encarga de ejecutar una abono o pago extraordinario en una operacion de cartera.
    /// </summary>
    public class PagoExtraordinario : PagoHelper {

        private decimal valorcuotaencurso = Constantes.CERO;
        /// <summary>
        /// Ejecuta pago extraordinario, cobra valores vencidos mas tipo acc hasta hoy y regenera la tabla.
        /// </summary>
        /// <param name="rqmantenimiento"></param>}
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Inicializa variables utilizadas en el cobro.
            saldo.Saldo saldo = base.Inicializar(rqmantenimiento);
            // Calcula valores adeudados de cuotas vencidas mas saldo tipo ACC a hoy.
            valorcuotaencurso = saldo.Cuotaencurso == null ? Constantes.CERO : saldo.GetValorCuota(saldo.Cuotaencurso);
            // aplica montos a favor del cliente que estan en cxc.
            base.valorpagado = this.Sumavalorescxp(rqmantenimiento, saldo, (decimal)base.valorpagado);
            // validaciones iniciales.
            Validapagoextraordinario(saldo);

            // Ejecuta el cobro de cuotas.
            Cobro cobro = new Cobro(saldo, (decimal)valorpagado, fcobro);
            decimal montopagoextraordinario = cobro.Ejecutar(rqmantenimiento, true, true);
            rqmantenimiento.AddDatos("__montopagoextraordinario", montopagoextraordinario);

            // valida pago minimo, el k de n cuotas por vencer incluye la cuota en curso.
            Validarpagominimo(saldo);
            // Baja de cuotas futuras.
            BajaCuotasFuturas bc = new BajaCuotasFuturas(saldo, fcobro);
            bc.EjecutarBajacuotas(rqmantenimiento);

            decimal nuevosaldo = saldo.Capitalporvencer - montopagoextraordinario;

            Cambiacondicionesoperacion(rqmantenimiento, nuevosaldo, bc.GetNumcuotaencurso());
        }

        /// <summary>
        /// Cambia los condiciones para la generacion de la nueva tabla de pagos
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="nuevosaldo">Saldo de capital con el que se genera la nueva tabla de pagos.</param>
        /// <param name="cuotainicio">Numero de cuota desde la cual se genera la nueva tabla de pagos.</param>
        private void Cambiacondicionesoperacion(RqMantenimiento rqmantenimiento, decimal nuevosaldo, int cuotainicio)
        {
            tcaroperacion tco = base.operacion.Tcaroperacion;
            TcarOperacionHistoriaDal.CreaHistoria(tco, rqmantenimiento.Mensaje, rqmantenimiento.Fconatable);
            if (tco.ctabla.Equals(2)) {
                decimal valorcuotaoriginal = Math.Round(((decimal)tco.montooriginal / (int)tco.numerocuotas), 2, MidpointRounding.AwayFromZero);
                int nuevonumerocuotas = (int)Math.Round((nuevosaldo / valorcuotaoriginal), 0, MidpointRounding.AwayFromZero) + (cuotainicio - 1);
                if (nuevonumerocuotas < cuotainicio) {
                    nuevonumerocuotas = cuotainicio;
                }
                tco.numerocuotas = nuevonumerocuotas;

            }
            tco.monto = nuevosaldo;
            tco.cuotainicio = (cuotainicio);
            tco.fgeneraciontabla = (rqmantenimiento.Fconatable);
            tco.finiciopagos = this.GetFinicio(rqmantenimiento);
            String mantieneplazo = rqmantenimiento.GetString("mantieneplazo");
            if (mantieneplazo == null) {
                mantieneplazo = tco.mantieneplazo == null ? "0" : tco.mantieneplazo == true ? "1" : "0";
            }
            if (Constantes.EsUno(mantieneplazo)) {
                tco.valorcuota = (null);
            }
            decimal? valorcuota = Constantes.CERO;
            if (rqmantenimiento.Mdatos.ContainsKey("valorcuota") && rqmantenimiento.GetDatos("valorcuota") == null) {
                valorcuota = valorcuotaencurso;
            }
            if ((valorcuota != null) && (valorcuota > 0)) {
                tco.valorcuota = valorcuota;
            }
        }

        /// <summary>
        /// Entrega la fecha de inicio de generacion de la nueva tabla de amortizacion.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <returns></returns>
        private int? GetFinicio(RqMantenimiento rqmantenimiento)
        {
            int? finicio = null;
            if (!rqmantenimiento.Mdatos.ContainsKey("finiciopagos") || (rqmantenimiento.Mdatos["finiciopagos"] == null)) {
                return finicio;
            }
            Object finiciopagos = rqmantenimiento.Mdatos["finiciopagos"];
            if (finiciopagos is DateTime) {
                finicio = Fecha.DateToInteger((DateTime)finiciopagos);
            } else {
                finicio = Int32.Parse(rqmantenimiento.Mdatos["finiciopagos"].ToString());
            }
            return finicio;
        }

        /// <summary>
        /// Valida que la operacion no este castigada y que no pague mas que el valor adeudado.
        /// </summary>
        /// <param name="saldo">Objeto que contiene los saldos de una operacion.</param>
        private void Validapagoextraordinario(saldo.Saldo saldo)
        {
            tcaroperacion tcaroperacion = base.operacion.Tcaroperacion;
            // valida que la operacion no este castigada.
            TcarOperacionDal.ValidaOperacionNoCastigada(tcaroperacion);
            // las cxc estan en el totalpendiente de pago
            saldo.Calculacuotaencurso();
            if (valorpagado > (saldo.Totalpendientepago + saldo.Capitalporvencer)) {
                throw new AtlasException("CAR-0008", "EL MONTO DEL PAGO EXTRADORNIARIO NO DEBE SER SUPERIOR A LA DEUDA TOTAL DE LA OPERACION");
            }
        }

        /// <summary>
        /// Valida que el valor de pago extraordinario se mayor o igual al saldo de capital de n cuotas por vencer.        /// </summary>
        /// <param name="saldo">Objeto que contiene los saldos de una operacion.</param>
        private void Validarpagominimo(saldo.Saldo saldo)
        {
            tcaroperacion tcaroperacion = base.operacion.Tcaroperacion;
            tcarproducto producto = TcarProductoDal.Find((int)tcaroperacion.cmodulo, (int)tcaroperacion.cproducto,
                        (int)tcaroperacion.ctipoproducto);
            if ((producto.mincuotaspagoextraordinario == null) || (producto.mincuotaspagoextraordinario == 0)) {
                return;
            }
            decimal saldoabono = base.cxp.GetSaldo() + (decimal)base.valorpagado - (saldo.Totalpendientepago);
            decimal capitalfuturo = saldo.GetSaldoCapitalPorVencer((int)producto.mincuotaspagoextraordinario);
            if (saldoabono < capitalfuturo) {
                throw new AtlasException("CAR-0007",
                        "PARA EJECUTAR EL PAGO EXTRADORNIARIO DEBE CANCELAR AL MENOS EL CAPITAL DE {0} CUOTAS POR VENCER",
                        producto.mincuotaspagoextraordinario);
            }
        }

        /// <summary>
        /// Si tiene cuentas por cobrar aplica el cobro y el monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="saldo">Objeto que contiene el saldo de la operacion de cartera.</param>
        /// <param name="valorpagado">Valor pagado en la transaccion.</param>
        /// <returns></returns>
        private decimal Sumavalorescxp(RqMantenimiento rqmantenimiento, saldo.Saldo saldo, decimal valorpagado)
        {
            decimal montocxp = saldo.Cxp;
            // Busca fondos en cuentas por pagar.
            if (montocxp <= Constantes.CERO) {
                return valorpagado;
            }
            decimal valorcxp = cxp.BuscamontoDebita(rqmantenimiento, Math.Abs(montocxp));
            valorpagado += valorcxp;
            return valorpagado;
        }

    }
}
