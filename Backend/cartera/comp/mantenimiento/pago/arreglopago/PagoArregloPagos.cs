using cartera.cobro;
using cartera.cobro.helper;
using cartera.enums;
using cartera.saldo;
using dal.cartera;
using modelo;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.pago.arreglopago {

    /// <summary>
    /// Clase que se encarga de ejecutar cobros en arreglo de pagos, transacciones de refinanciacion, restructuracion.
    /// </summary>
    public class PagoArregloPagos : PagoHelper {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Inicializa variables utilizadas en el cobro.
            Saldo saldo = base.Inicializar(rqmantenimiento, false);

            // Calcula valores adeudados de cuotas vencidas mas saldo tipo ACC a hoy.
            saldo.Calculasaldohoy();
            saldo.CalculaCuotasfuturas();
            // aplica valores a favor del cliente.
            this.valorpagado = this.valorpagado + saldo.Cxp;

            // validaciones iniciales.
            Validapagomaximo(saldo);

            // Ejecuta el cobro de cuotas.
            tcaroperacionarreglopago arreglo = TcarOperacionArregloPagoDal.Find(saldo.Operacion.Coperacion, EnumEstatus.INGRESADA.Cestatus);
            Cobro cobro = new Cobro(saldo, (decimal)valorpagado, fcobro, true, arreglo.csolicitud);
            decimal montopagoextraordinario = cobro.Ejecutar(rqmantenimiento, true, true);
            if (montopagoextraordinario > 0) {
                throw new AtlasException("CAR-0044", "EN ARREGLO DE PAGOS NO SE PERMITE PAGAR VALORES ADICIONALES");
            }

            // Marca como pagado el arreglo de pagos.
            if (decimal.Parse(rqmantenimiento.Mdatos["monto"].ToString()) == decimal.Parse(rqmantenimiento.Mdatos["valor"].ToString())) {
                arreglo.cestatus = "PAG";
                arreglo.fpago = rqmantenimiento.Fconatable;
            }
        }

        /// <summary>
        /// Valida que la operacion no este castigada y que no pague mas que el valor adeudado.
        /// </summary>
        /// <param name="saldo">Objeto que contiene los saldos de una operacion.</param>
        private void Validapagomaximo(Saldo saldo)
        {
            // las cxc estan en el totalpendiente de pago
            if (valorpagado > (saldo.Totalpendientepago + saldo.Capitalporvencer)) {
                throw new AtlasException("CAR-0008", "EL MONTO DEL PAGO NO DEBE SER SUPERIOR A LA DEUDA TOTAL DE LA OPERACION");
            }
        }

    }
}
