using cartera.cobro;
using cartera.cobro.helper;
using cartera.saldo;
using cartera.cobro.precancelacion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.cartera;
using cartera.enums;
using util;
using modelo;

namespace cartera.comp.mantenimiento.pago.precancelacion {

    public class Precancelacion : PagoHelper {

        bool esarreglopagos = false;
        decimal totaldeuda = 0;

        /// <summary>
        /// Metodo que ejecuta la precancelacion de una operacion de cartera.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            // Inicializa variables utilizadas en el cobro.
            Saldo saldo = this.Iniciar(rqmantenimiento);
            // Calcula valores adeudados de cuotas vencidas mas saldo tipo ACC a hoy.
            saldo.Calculacuotaencurso();

            // aplica montos a favor del cliente que estan en cxc.
            base.valorpagado = this.Sumavalorescxp(rqmantenimiento, saldo, (decimal)base.valorpagado);

            this.ValidarEstatus();
            if (!esarreglopagos) {
                ValidarValorPagado(saldo);
            }

            // fija el monto de valores de cobro que no son capital de cuotas con vencimiento futuro.
            saldo.CalculaCuotasfuturas();
            // Ejecuta el cobro de cuotas.
            Cobro cobro = new Cobro(saldo, (decimal)valorpagado, fcobro);
            cobro.precancelacionArregloPagos = esarreglopagos; // Precancelacion de arreglo de pagos cobra todos los rubros sin tener un valor pagado.
            // true pone el valor pagado en TcarOperacionTransaccionRubro en el rubro de capital.
            cobro.Ejecutar(rqmantenimiento, true, true);

            // Map con los valores cobrados por codigo de saldo.
            Dictionary<string, decimal> mcobro = cobro.GetMcobro();

            // va en este sitio porque el cobro aplica cargos, cuentas por cobrar rubros diferente a capital y accrual
            totaldeuda = saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas();

            // Baja de cuotas futuras los rubros a contabilizar se definen en tmonsaldo, transaccion 7-28.
            PrecancelacionCuotasFuturas pc = new PrecancelacionCuotasFuturas(saldo, fcobro);
            pc.Ejecutar(rqmantenimiento, mcobro);


            if (esarreglopagos) {
                ValidarValorPagadoArregloPagos(rqmantenimiento, totaldeuda, mcobro);
            }

            // Marca operacion como cancelada
            //TcarOperacionDal.MarcaOperacionCancelada(base.operacion.tcaroperacion, rqmantenimiento, fcobro);
            cobro.MarcaOperacionPagadaPrecancelacion();
            rqmantenimiento.AddDatos("MSALDOS-ARREGLO-PAGOS", mcobro);

            rqmantenimiento.AddDatos("MSALDOS-ARREGLO-PAGOS-TABLA", this.CrearRubrosArregloPagos(mcobro));
        }

        /// <summary>
        /// LLena variables iniciales y crea una instancia del Saldo.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        private Saldo Iniciar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Ctransaccion.CompareTo(51) == 0) {
                // la transaccion 51 es de aprobacion del arreglo de pagos.
                esarreglopagos = true;
            }
            // Inicializa variables utilizadas en el cobro.
            Saldo saldo = null;
            if (esarreglopagos) {
                saldo = base.Inicializar(rqmantenimiento, true);
            } else {
                saldo = base.Inicializar(rqmantenimiento, false);
            }
            return saldo;
        }

        /// <summary>
        /// Valida el estatus de la operacion.
        /// </summary>
        private void ValidarEstatus()
        {
            String estatus = base.operacion.Tcaroperacion.cestatus;
            if (estatus.Equals(EnumEstatus.APROVADA.Cestatus) || estatus.Equals(EnumEstatus.CANCELADA.Cestatus) || estatus.Equals(EnumEstatus.JUDICIAL.Cestatus)) {
                throw new AtlasException("CAR-0018", "ESTATUS DE LA OPERACION NO PERMITE PRECANCELACIÓN");
            }
        }

        /// <summary>
        /// Valida condiciones de precancelacion.
        /// </summary>
        /// <param name="saldo">Objeto que contiene los saldos de la operacion.</param>
        private void ValidarValorPagado(Saldo saldo)
        {
            decimal totaldeuda = saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas();
            if (totaldeuda.CompareTo(valorpagado) != 0) {
                throw new AtlasException("CAR-0017", "MONTO DE LA PRECANCELACIÓN DIFIERE DEL VALOR A APLICAR");
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="totaldeuda"></param>
        /// <param name="mcobro"></param>
        private void ValidarValorPagadoArregloPagos(RqMantenimiento rqmantenimiento, decimal totaldeuda, Dictionary<string, decimal> mcobro)
        {
            decimal valoraplicado = this.getValorCobrado(mcobro);
            if (totaldeuda.CompareTo(valoraplicado) != 0) {
                throw new AtlasException("CAR-0017", "MONTO DE LA PRECANCELACION DIFIERE DEL VALOR A APLICAR");
            }
            rqmantenimiento.Monto = valoraplicado;
        }

        /// <summary>
        /// Entrega el valor aplicado en la precancelacion de arreglo de pagos.
        /// </summary>
        /// <param name="mcobro">mcobro Map que contiene por CSALDO el valor valor cobrado.</param>
        /// <returns>Total dado de baja en precancelacion</returns>
        private decimal getValorCobrado(Dictionary<string, decimal> mcobro)
        {
            decimal totalcobrado = 0;
            foreach (string key in mcobro.Keys) {
                decimal aplicado = mcobro[key];
                totalcobrado = totalcobrado + aplicado;
            }
            return totalcobrado;
        }

        /// <summary>
        /// Crea rubros a adicionar a tabla de amortizacion como cargos adicionales.
        /// </summary>
        /// <param name="mcobro">Map que contien valores no pagados y que tienen que adicionarse a la tabla de pagos.</param>
        /// <returns>Dictionary<string, decimal></returns>
        private Dictionary<string, decimal> CrearRubrosArregloPagos(Dictionary<string, decimal> mcobro)
        {
            Dictionary<string, decimal> mrubros = new Dictionary<string, decimal>();
            List<tcaroperacionarrepagorubro> lrubrosarreglo = TcarOperacionArrePagoRubroDal.FindAprobacion(base.operacion.Coperacion, (long)base.operacion.tcaroperacion.csolicitud);

            foreach (string key in mcobro.Keys) {
                if (!esarreglopagos || key.StartsWith("CAP-CAR")) {
                    continue;
                }
                tcaroperacionarrepagorubro rubro = TcarOperacionArrePagoRubroDal.Find(lrubrosarreglo, key);
                decimal monto = mcobro[key];
                decimal acumulado = 0;
                if (mrubros.ContainsKey(rubro.csaldodestino)) {
                    acumulado = mrubros[rubro.csaldodestino];
                }
                acumulado = acumulado + monto;
                mrubros[rubro.csaldodestino] = acumulado;
            }
            return mrubros;
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
            decimal totaldeuda = saldo.Totalpendientepago + saldo.GetSaldoCuotasfuturas();
            decimal montocxp = saldo.Cxp;
            // Busca fondos en cuentas por pagar.
            if (montocxp <= Constantes.CERO) {
                return valorpagado;
            }
            if (montocxp > totaldeuda) {
                montocxp = totaldeuda;
            }
            decimal valorcxp = cxp.BuscamontoDebita(rqmantenimiento, Math.Abs(montocxp));
            valorpagado += valorcxp;
            return valorpagado;
        }

    }
}
