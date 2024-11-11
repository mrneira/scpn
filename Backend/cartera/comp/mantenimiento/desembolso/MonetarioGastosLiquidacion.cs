using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.componente;
using dal.cartera;
using modelo;
using monetario.util;
using monetario.util.rubro;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.desembolso {

    /// <summary>
    /// Clase que se encarga de ejecutar contabilizacion de gastos de liquidacion o gastos de cierre.
    /// </summary>
    public class MonetarioGastosLiquidacion : ComponenteMantenimiento {

        // Listado de gastos de liquidacion a persistir
        List<tcaroperaciongastosliquida> lgastosliquidacion = new List<tcaroperaciongastosliquida>();

        /// <summary>
        /// Ejecuta transaccion monetaria de gastos de liquidacion.
        /// </summary>
        /// <param name="rqmantenimiento">Datos con el que se ejecuta el monetario.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            decimal totalgastos = Constantes.CERO;
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcaroperacion tcaroperacion = operacion.tcaroperacion;
            List<tcaroperaciongastosliquida> lgastos = TcarOperacionGastosLiquidaDal.Find(tcaroperacion.coperacion);
            if ((lgastos == null) || lgastos.Count < 1) {
                return;
            }
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();

            tcarevento evento = MonetarioHelper.FijaTransaccion(rq, EnumEventos.GASTOSLIQUIDACION.Cevento);
            TransaccionRubro trubro = new TransaccionRubro((int)evento.cmodulo, (int)evento.ctransaccion);

            foreach (tcaroperaciongastosliquida gastos in lgastos) {
                tmonrubro tmonrubro = trubro.GetRubro(gastos.csaldo);
                totalgastos = totalgastos + this.ProcesaPorGasto(rq, tcaroperacion, gastos, tmonrubro);
            }

            rq.AdicionarTabla("TCAROPERACIONGASTOSLIQUIDA", lgastosliquidacion, false);

            // actualiza monto con el que se genera la tabla de amortizacion.
            //tcaroperacion.monto = tcaroperacion.montooriginal + totalgastos;
            // ejecuta monetario de gastos de liquidacion
            new ComprobanteMonetario(rq);
        }

        /// <summary>
        /// Adiciona rubos de los gatos de liquidacion al request.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto a adicionar rubros de gastos de liquidacion.</param>
        /// <param name="tcaroperacion">Objeto que contiene informacion de una operacion de cartera.</param>
        /// <param name="tcarOperacionGastosLiquida">Objeto que contiene informacion de los gastos de liquidacion.</param>
        /// <param name="tmonrubro">Defincion de un rurbro monetario asociado al codigo de saldo del gasto de liquidacion.</param>
        /// <returns>decimal</returns>
        private decimal ProcesaPorGasto(RqMantenimiento rqmantenimiento, tcaroperacion tcaroperacion,
                tcaroperaciongastosliquida tcarOperacionGastosLiquida, tmonrubro tmonrubro)
        {
            decimal monto = Constantes.CERO;

            // Gastos a descontar en la liquidacion
            if ((tcarOperacionGastosLiquida.fpago == null)) {
                monto = (decimal)tcarOperacionGastosLiquida.monto;
                tcarOperacionGastosLiquida.Actualizar = true;
                tcarOperacionGastosLiquida.fpago = rqmantenimiento.Fconatable;
                tcarOperacionGastosLiquida.mensaje = rqmantenimiento.Mensaje;
                lgastosliquidacion.Add(tcarOperacionGastosLiquida);
            }

            // adiciona rubros al request de mantenimiento.
            RubroHelper.AdicionarRubro(rqmantenimiento, (int)tmonrubro.crubro, null, (decimal)tcarOperacionGastosLiquida.monto,
                                       tcaroperacion.coperacion, tcaroperacion.cmoneda, null);
            if (tmonrubro.crubropar != null) {
                RubroHelper.AdicionarRubro(rqmantenimiento, (int)tmonrubro.crubropar, (decimal)tcarOperacionGastosLiquida.monto,
                                           tcaroperacion.coperacion, tcaroperacion.cmoneda, null);
            }

            return monto;
        }
    }
}
