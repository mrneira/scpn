using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.cartera;
using dal.tesoreria;
using modelo;
using monetario.util;
using System;
using System.Collections.Generic;
using System.Linq;
using tesoreria.enums;
using util;
using util.dto.mantenimiento;
using util.enums;
using util.thread;

namespace cartera.comp.mantenimiento.recaudacion {
    class PagoCash : ComponenteMantenimiento {

        // Variable que indica que el pago a aplicar sea extraordinario
        bool pagoextraordinario = false;

        /// <summary>
        /// Metodo que ejecuta el pago de las operaciones de cash
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            List<ttesrecaudacion> lrecaudacion = rqmantenimiento.GetTabla("AUTORIZARAPLICACION").Lregistros.Cast<ttesrecaudacion>().ToList();
            if (lrecaudacion == null || lrecaudacion.Count() <= 0) {
                return;
            }

            foreach (ttesrecaudacion rec in lrecaudacion) {
                List<ttesrecaudaciondetalle> ldetalle = TtesRecaudacionDetalleDal.FindByCodigoCabecera(rec.crecaudacion, ((int)EnumTesoreria.EstadoRecaudacionCash.AutorizadoAplicar).ToString());

                foreach (ttesrecaudaciondetalle det in ldetalle) {
                    if (this.Saldo(rqmantenimiento, det.coperacion, (decimal)det.valorprocesado) == det.valorprocesado) {
                        EjecutaPagoPrecancelacion(rqmantenimiento, det.coperacion, (decimal)det.valorprocesado, det.crecaudacion.ToString());
                    } else {
                        EjecutaPago(rqmantenimiento, det.coperacion, (decimal)det.valorprocesado, det.crecaudacion.ToString());
                    }
                }

                // Actualiza registro de recaudacion
                TtesRecaudacionDal.ActualizarCobrosModulo(rec, ldetalle, rqmantenimiento, null);
            }
        }

        /// <summary>
        /// Consulta el valor a pagar en una precancelacion de operaciones de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera</param>
        private decimal Saldo(RqMantenimiento rm, string coperacion, decimal valorpago)
        {
            pagoextraordinario = false;

            Operacion operacion = OperacionFachada.GetOperacion(coperacion, true);
            int fcobro = (int)rm.Fconatable;
            saldo.Saldo saldo = new saldo.Saldo(operacion, fcobro);
            saldo.Calculacuotaencurso();
            Decimal saldofuturo = saldo.GetSaldoCuotasfuturas();

            Dictionary<String, Object> m = new Dictionary<String, Object>();
            decimal totaldeuda = saldo.Totalpendientepago;
            if (saldo.Cxp > 0) {
                totaldeuda = totaldeuda - saldo.Cxp;
            }
            decimal deudapago = totaldeuda;
            totaldeuda = totaldeuda + saldofuturo;
            if (totaldeuda < 0) {
                totaldeuda = 0;
            }

            // Valida tipo de pago
            tcarproducto producto = TcarProductoDal.Find((int)operacion.tcaroperacion.cmodulo, (int)operacion.tcaroperacion.cproducto, (int)operacion.tcaroperacion.ctipoproducto);
            producto.mincuotaspagoextraordinario = producto.mincuotaspagoextraordinario ?? Constantes.CERO;
            if (decimal.Subtract(valorpago, deudapago) > saldo.GetSaldoCapitalPorVencer((int)producto.mincuotaspagoextraordinario)) {
                pagoextraordinario = true;
            }

            // Encera valores pendientes de pago de rubros
            saldo.EncerarValoresPorCobrar();

            return totaldeuda;
        }

        /// <summary>
        /// Ejecuta transaccion de pago de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="valor">Valor de pago.</param>
        private void EjecutaPago(RqMantenimiento rqmantenimiento, string coperacion, decimal valor, string documento)
        {
            // Transaccion a ejecutar
            int ctransaccionpago = pagoextraordinario ? 14 : 13;

            // Ejecuta pago
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
            rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
            rq.Coperacion = coperacion;
            rq.Monto = valor;
            rq.Documento = documento;
            rq.Cambiartransaccion(rqmantenimiento.Cmodulo, ctransaccionpago);
            Mantenimiento.ProcesarAnidado(rq, EnumModulos.CARTERA.Cmodulo, ctransaccionpago);

            // Ejecuta monetario
            this.EjecutaMonetario(rq, coperacion, valor);
        }

        /// <summary>
        /// Ejecuta transaccion de pago de precancelacion de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="valor">Valor de pago.</param>
        private void EjecutaPagoPrecancelacion(RqMantenimiento rqmantenimiento, string coperacion, decimal valor, string documento)
        {
            // Transaccion a ejecutar
            int ctransaccionpago = 16;

            // Ejecuta pago
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
            rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
            rq.Coperacion = coperacion;
            rq.Monto = valor;
            rq.Documento = documento;
            rq.Cambiartransaccion(rqmantenimiento.Cmodulo, ctransaccionpago);
            Mantenimiento.ProcesarAnidado(rq, EnumModulos.CARTERA.Cmodulo, ctransaccionpago);

            // Ejecuta monetario
            this.EjecutaMonetario(rq, coperacion, valor);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <param name="monto">Valor de la transaccion.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, string coperacion, decimal monto)
        {
            // Ejecuta monetario
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, EnumEventos.COBRO_RECAUDACION.Cevento);
            rqconta.EncerarRubros();

            RqRubro rqrubro = new RqRubro(Constantes.UNO, monto, rqmantenimiento.Cmoneda);
            rqrubro.Coperacion = coperacion;
            rqrubro.Actualizasaldo = false;
            rqconta.AdicionarRubro(rqrubro);

            // Ejecuta la transaccion monetaria anidada.
            if (rqconta.Rubros != null && !(rqconta.Rubros.Count < 1)) {
                new ComprobanteMonetario(rqconta);
            }
        }
    }
}
