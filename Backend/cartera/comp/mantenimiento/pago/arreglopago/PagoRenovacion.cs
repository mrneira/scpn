using cartera.cobro;
using cartera.cobro.helper;
using cartera.saldo;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.pago.arreglopago {

    /// <summary>
    /// Clase que se encarga de ejecutar cobros en arreglo de pagos, transacciones de renovacion.
    /// </summary>
    public class PagoRenovacion : PagoHelper {

        /// <summary>
        /// Ejecuta renovacion de operacion cobrando los valores adeudados a la fecha.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            // Inicializa variables utilizadas en el cobro.
            Saldo saldo = base.Inicializar(rqmantenimiento, true);

            // Calcula valores adeudados de cuotas vencidas mas saldo tipo ACC a hoy.
            saldo.Calculasaldohoy();
            saldo.CalculaCuotasfuturas();

            // validaciones iniciales.
            Validapagomaximo(saldo);

            // Ejecuta el cobro de cuotas.
            Cobro cobro = new Cobro(saldo, (decimal)valorpagado, fcobro);
            decimal montopagoextraordinario = cobro.Ejecutar(rqmantenimiento, true, true);
            rqmantenimiento.AddDatos("__montopagoextraordinario", montopagoextraordinario);

            // Baja de cuotas futuras.
            BajaCuotasFuturas bc = new BajaCuotasFuturas(saldo, fcobro);
            bc.EjecutarBajacuotas(rqmantenimiento);

            decimal nuevosaldo = saldo.Capitalporvencer - montopagoextraordinario;

            Cambiacondicionesoperacion(rqmantenimiento, saldo.Cuotaencurso, nuevosaldo, bc.GetNumcuotaencurso());
        }

        /// <summary>
        /// Cambia los condiciones para la generacion de la nueva tabla de pagos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="cuotaencurso">Objeto que contiene informacion de la cuota en curso a la fecha de arreglo de pagos.</param>
        /// <param name="nuevosaldo">Saldo de capital con el que se genera la nueva tabla de pagos.</param>
        /// <param name="cuotainicio">Numero de cuota desde la cual se genera la nueva tabla de pagos.</param>
        private void Cambiacondicionesoperacion(RqMantenimiento rqmantenimiento, tcaroperacioncuota cuotaencurso, decimal nuevosaldo,
                    int cuotainicio) {
            tcaroperacion tco = base.operacion.tcaroperacion;
            TcarOperacionHistoriaDal.CreaHistoria(tco, rqmantenimiento.Mensaje, rqmantenimiento.Fconatable);
            tco.monto = nuevosaldo;
            tco.cuotainicio = cuotainicio;
            if (cuotaencurso != null) {
                tco.fgeneraciontabla = cuotaencurso.finicio;
            } else {
                tco.fgeneraciontabla = rqmantenimiento.Fconatable;
            }
            tco.finiciopagos = this.GetFinicio(rqmantenimiento);

            String mantieneplazo = rqmantenimiento.GetString("mantieneplazo");
            if (mantieneplazo == null) {
                mantieneplazo = tco.mantieneplazo == null ? "0" : tco.mantieneplazo == true ? "1" : "0";
            }
            if (Constantes.EsUno(mantieneplazo)) {
                tco.valorcuota = null;
            }

            decimal? valorcuota = rqmantenimiento.GetDecimal("valorcuota");
            if (valorcuota != null && valorcuota > 0) {
                tco.valorcuota = valorcuota;
            }
        }

        /// <summary>
        /// Entrega la fecha de inicio de generacion de la nueva tabla de amortizacion.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <returns></returns>
        private int? GetFinicio(RqMantenimiento rqmantenimiento) {
            int? finicio = null;
            if (!rqmantenimiento.Mdatos.ContainsKey("finiciopagos")) {
                return finicio;
            }
            Object finiciopagos = rqmantenimiento.Mdatos["finiciopagos"];
            if (finiciopagos is DateTime) {
                finicio = Fecha.DateToInteger((DateTime)finiciopagos);
            } else {
                finicio = Int32.Parse( rqmantenimiento.Mdatos["finiciopagos"].ToString());
            }
            return finicio;
        }

        /// <summary>
        /// Valida que la operacion no tenga cuotas vencidas.
        /// </summary>
        private void ValidarCuotasVencidasd() {
            if (operacion.TieneCuotasConVencimientoPasado(fcobro)) {
                throw new AtlasException("CAR-0023", "TRANSACCION NO PERMITIDA OPERACION TIENE CUOTAS VENCIDAS");
            }
        }

        /// <summary>
        /// Valida que la operacion no este castigada y que no pague mas que el valor adeudado.
        /// </summary>
        /// <param name="saldo"></param>
        private void Validapagomaximo(Saldo saldo) {
            // las cxc estan en el totalpendiente de pago
            if (valorpagado > (saldo.Totalpendientepago + saldo.Capitalporvencer)) {
                throw new AtlasException("CAR-0008", "EL MONTO DEL PAGO NO DEBE SER SUPERIOR A LA DEUDA TOTAL DE LA OPERACION");
            }
        }
    }

}
