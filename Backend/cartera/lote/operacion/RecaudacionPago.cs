using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.servicios.mantenimiento;
using dal.cartera;
using dal.contabilidad.conciliacionbancaria;
using dal.tesoreria;
using modelo;
using monetario.util;
using System;
using System.Collections.Generic;
using tesoreria.enums;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.enums;
using util.servicios.ef;

namespace cartera.lote.operacion {
    /// <summary>
    /// Clase que se encarga de cargar operaciones a ttesrecaudacion.
    /// </summary>
    public class RecaudacionPago : ITareaOperacion {

        bool pagoextraordinario = false;
        decimal montodevolucion = Constantes.CERO;

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            int particion = Constantes.GetParticion((int)requestoperacion.Ftrabajo);
            ttesrecaudaciondetalle rec = TtesRecaudacionDetalleDal.FindByCodigoOperacionPago(7, 70, operacion.Coperacion, ((int)EnumTesoreria.EstadoRecaudacionCash.AutorizadoAplicar).ToString());

            // Valida estado de operacion
            if (operacion.tcaroperacion.cestatus.Equals(EnumEstatus.CANCELADA.Cestatus)) {
                montodevolucion = (decimal)rec.valorprocesado;
            } else {
                decimal montopago = this.Saldo(rqmantenimiento, operacion.Coperacion, (decimal)rec.valorprocesado);
                if (montopago > rec.valorprocesado) {
                    EjecutaPago(rqmantenimiento, operacion.Coperacion, (decimal)rec.valorprocesado, rec.crecaudacion.ToString());
                } else {
                    EjecutaPagoPrecancelacion(rqmantenimiento, operacion.Coperacion, montopago, rec.crecaudacion.ToString());
                }
            }

            // Devoluciones de valores recuperados.
            if (montodevolucion > Constantes.CERO) {
                this.EjecutaDevolucion(rqmantenimiento, operacion, montodevolucion);
            }

            TtesRecaudacionDal.ActualizarCobrosPagadoDetalle(((int)EnumTesoreria.EstadoRecaudacionCash.Cobrado).ToString(), rec.crecaudaciondetalle);
            // crea libro bancos, utilizado en la conciliacion bancaria para el banco del Pichincha.
            //tconbanco tcb = TconBancoDal.Find(((int)EnumRecaudacion.BancosConciliacion.PIC).ToString());
            //if (tcb != null)
            //{
            //    TconLibroBancosDal.Crear(tcb.ccuentabanco, rqmantenimiento.Fconatable, null, rqmantenimiento.Cmodulotranoriginal, rqmantenimiento.Ctranoriginal,
            //        rec.valorprocesado.Value,0, rec.numerodocumento.ToString());
            //}
            rqmantenimiento.Grabar();
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

            // Valor devolucion
            if (totaldeuda < valorpago) {
                montodevolucion = decimal.Subtract(valorpago, totaldeuda);
            } else {
                // Valida tipo de pago
                tcarproducto producto = TcarProductoDal.Find((int)operacion.tcaroperacion.cmodulo, (int)operacion.tcaroperacion.cproducto, (int)operacion.tcaroperacion.ctipoproducto);
                producto.mincuotaspagoextraordinario = producto.mincuotaspagoextraordinario ?? Constantes.CERO;
                if (decimal.Subtract(valorpago, deudapago) > saldo.GetSaldoCapitalPorVencer((int)producto.mincuotaspagoextraordinario)) {
                    pagoextraordinario = true;
                }
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
        private void EjecutaPago(RqMantenimiento rq, string coperacion, decimal valor, string documento)
        {
            // Transaccion a ejecutar
            int ctransaccionpago = pagoextraordinario ? 14 : 13;

            // Ejecuta pago
            rq.Coperacion = coperacion;
            rq.Monto = valor;
            rq.Documento = documento;
            rq.Cambiartransaccion(rq.Cmodulo, ctransaccionpago);
            Mantenimiento.ProcesarAnidado(rq, EnumModulos.CARTERA.Cmodulo, ctransaccionpago);

            // Ejecuta monetario
            this.EjecutaMonetario(rq, coperacion, valor, false);
        }

        /// <summary>
        /// Ejecuta transaccion de pago de precancelacion de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="valor">Valor de pago.</param>
        private void EjecutaPagoPrecancelacion(RqMantenimiento rq, string coperacion, decimal valor, string documento)
        {
            // Transaccion a ejecutar
            int ctransaccionpago = 16;

            // Ejecuta pago
            rq.Coperacion = coperacion;
            rq.Monto = valor;
            rq.Documento = documento;
            rq.Cambiartransaccion(rq.Cmodulo, ctransaccionpago);
            Mantenimiento.ProcesarAnidado(rq, EnumModulos.CARTERA.Cmodulo, ctransaccionpago);

            // Ejecuta monetario
            this.EjecutaMonetario(rq, coperacion, valor, false);
        }

        /// <summary>
        /// Ejecuta transaccion de pago de precancelacion de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="operacion">Instancia de operacion de cartera.</param>
        /// <param name="montodevolucion">Valor de devolucion.</param>
        private void EjecutaDevolucion(RqMantenimiento rq, Operacion operacion, decimal montodevolucion)
        {
            // Control de secuencia
            long secuencia = TcarDevolucionDal.GetSecuencia();

            // Registro de devolucion
            tcardevolucion devolucion = new tcardevolucion();
            //devolucion.cdevolucion = secuencia + 1;
            devolucion.fcontable = rq.Fconatable;
            devolucion.cpersona = (long)operacion.tcaroperacion.cpersona;
            devolucion.ccompania = operacion.tcaroperacion.ccompania;
            devolucion.cmodulo = rq.Cmodulotranoriginal;
            devolucion.ctransaccion = rq.Ctranoriginal;
            devolucion.cusuarioing = rq.Cusuario;
            devolucion.fingreso = rq.Freal;
            devolucion.monto = montodevolucion;
            Sessionef.Grabar(devolucion);

            // Ejecuta monetario
            rq.Coperacion = operacion.Coperacion;
            this.EjecutaMonetario(rq, operacion.Coperacion, montodevolucion, true);
            this.EjecutaMonetario(rq, operacion.Coperacion, montodevolucion, false);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <param name="monto">Valor de la transaccion.</param>
        /// <param name="esdevolucion">Indicador de devolucion.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, string coperacion, decimal monto, bool esdevolucion)
        {
            // Valida evento a ejecutar
            tcarevento evento = null;
            if (esdevolucion) {
                evento = TcarEventoDal.Find(EnumEventos.COBRO_DEVOLUCION.Cevento);
            } else {
                evento = TcarEventoDal.Find(EnumEventos.COBRO_RECAUDACION.Cevento);
            }

            // Ejecuta monetario
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, evento.cevento);
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

