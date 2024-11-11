using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.servicios;
using core.servicios.mantenimiento;
using dal.cartera;
using dal.monetario;
using modelo;
using monetario.util;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace cartera.lote.operacion {
    /// <summary>
    /// Clase que se encarga de cargar operaciones a descuentos.
    /// </summary>
    public class DescuentosPago : ITareaOperacion {

        // Variables
        decimal totalvencido = Constantes.CERO;
        decimal totaldeuda = Constantes.CERO;
        decimal totaldevolucion = Constantes.CERO;
        saldo.Saldo saldo;

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcarevento evento = TcarEventoDal.Find(EnumEventos.COBRO_DESCUENTOS.Cevento);

            // Saldos de operacion
            totalvencido = Constantes.CERO;
            totaldeuda = Constantes.CERO;
            totaldevolucion = Constantes.CERO;
            Operacion op = OperacionFachada.GetOperacion(operacion.Coperacion, true);
            this.Saldo((int)requestoperacion.Ftrabajo, op);

            // Descuentos
            tcardescuentos des = TcarDescuentosDal.FindNoPagada();
            List<tcardescuentosdetalle> ldescuentos = TcarDescuentosDetalleDal.FindOperacion(des.particion, operacion.Coperacion);
            foreach (tcardescuentosdetalle descuento in ldescuentos) {
                if (descuento.montorespuesta == null || descuento.montorespuesta <= 0) {
                    continue;
                }
                if (descuento.montopago != null || descuento.montodevolucion != null) {
                    continue;
                }

                // Encera valores pendientes de pago de rubros
                saldo.EncerarValoresPorCobrar();

                // Request
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
                ThreadNegocio.GetDatos().Request = rq;
                ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;

                // Estado de operacion
                if (op.tcaroperacion.cestatus.Equals(EnumEstatus.CANCELADA.Cestatus)) {
                    // Si deuda total de la operacion es igual a cero, se ejecuta devoluciones de valores recuperados.
                    decimal montodevolucion = (decimal)descuento.montorespuesta;
                    this.EjecutaDevolucion(rq, descuento, montodevolucion);
                    totaldevolucion += montodevolucion;

                    descuento.fdevolucion = rq.Fconatable;
                    descuento.montodevolucion = montodevolucion;
                    descuento.mensajedevolucion = rq.Mensaje;

                    // Actualiza descuento
                    Sessionef.Actualizar(descuento);
                } else {
                    // Aplicacion de pago
                    rq.EncerarRubros();
                    this.Pago(rq, evento, descuento);
                }

                // Ejecuta monetario
                string csaldo = "";
                if (descuento.archivoinstituciondetalle.Equals(EnumDescuentos.BANCOS.Cinstitucion)) {
                    csaldo = EnumDescuentos.BANCOS.Csaldo;
                }
                if (descuento.archivoinstituciondetalle.Equals(EnumDescuentos.ISSPOL.Cinstitucion)) {
                    csaldo = EnumDescuentos.ISSPOL.Csaldo;
                }
                if (descuento.archivoinstituciondetalle.Equals(EnumDescuentos.COMANDANCIA.Cinstitucion)) {
                    csaldo = EnumDescuentos.COMANDANCIA.Csaldo;
                }
                tmonrubro rubro = TmonRubroDal.FindPorSaldo(evento.cmodulo, evento.ctransaccion, csaldo);
                this.EjecutaMonetario(rq, evento, rubro.crubro, operacion.Coperacion, (decimal)descuento.montorespuesta);
            }

            //rqmantenimiento.Grabar();
        }


        /// <summary>
        /// Consulta el valor a pagar en una precancelacion de operaciones de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera</param>
        private void Saldo(int fcobro, Operacion operacion)
        {
            saldo = new saldo.Saldo(operacion, fcobro);
            saldo.Calculacuotaencurso();
            Decimal saldofuturo = saldo.GetSaldoCuotasfuturas();

            totalvencido = saldo.Totalpendientepago;
            if (saldo.Cxp > 0) {
                totalvencido = Decimal.Subtract(totalvencido, saldo.Cxp);
            }

            if (totalvencido < 0) {
                totalvencido = Constantes.CERO;
            }

            totaldeuda = Decimal.Add(totalvencido, saldofuturo);
            if (totaldeuda < 0) {
                totaldeuda = Constantes.CERO;
            }
        }

        /// <summary>
        /// Ejecuta transacciones de descuentos
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="evento">Registro de evento.</param>
        /// <param name="descuento">Registro de descuento.</param>
        private void Pago(RqMantenimiento rq, tcarevento evento, tcardescuentosdetalle descuento)
        {
            decimal montorespuesta = (decimal)descuento.montorespuesta;
            decimal diferenciavencido = (Decimal.Subtract(totalvencido, montorespuesta) < 0) ? ((Decimal.Subtract(totalvencido, montorespuesta)) * (-Constantes.UNO)) : 0;
            decimal diferenciadeuda = (Decimal.Subtract(totaldeuda, montorespuesta) < 0) ? 0 : (Decimal.Subtract(totaldeuda, montorespuesta));
            decimal montopago = Decimal.Subtract(montorespuesta, diferenciavencido);
            decimal montodevolucion = Decimal.Subtract(montorespuesta, montopago);

            // Si es deudor se aplica el monto devolucion como abono a la operacion.
            if (descuento.crelacion.Equals(EnumPersonas.DEUDOR.Ctipo) && montodevolucion > 0 && diferenciadeuda > 0) {
                montopago = Decimal.Add(montopago, montodevolucion);
                montodevolucion = Constantes.CERO;
            }

            // Monto de pago se aplica con pago normal
            if (montopago > 0) {
                this.EjecutaPago(rq, evento, descuento.coperacion, (decimal)descuento.montorespuesta, montopago);
                totalvencido = Decimal.Subtract(totalvencido, montopago);
                totaldeuda = Decimal.Subtract(totaldeuda, montopago);

                descuento.fpago = rq.Fconatable;
                descuento.montopago = montopago;
                descuento.mensajepago = rq.Mensaje;
            }

            // Si deuda total de la operacion es igual a cero, se ejecuta devoluciones de valores recuperados.
            if (montodevolucion > 0) {
                this.EjecutaDevolucion(rq, descuento, montodevolucion);
                totaldevolucion += montodevolucion;

                descuento.fdevolucion = rq.Fconatable;
                descuento.montodevolucion = montodevolucion;
                descuento.mensajedevolucion = rq.Mensaje;
            }

            // Actualiza descuento
            Sessionef.Actualizar(descuento);
        }

        /// <summary>
        /// Ejecuta transaccion de pago de normal de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="evento">Registro de evento.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="monto">Valor de transaccion.</param>
        /// <param name="montopago">Valor de pago.</param>
        private void EjecutaPago(RqMantenimiento rq, tcarevento evento, string coperacion, decimal monto, decimal montopago)
        {
            // Ejecuta pago
            rq.Cambiartransaccion((int)evento.cmodulo, (int)evento.ctransaccion);
            rq.Coperacion = coperacion;
            rq.Monto = montopago;
            Mantenimiento.ProcesarAnidado(rq, (int)evento.cmodulo, (int)evento.ctransaccion);
        }

        /// <summary>
        /// Ejecuta transaccion de pago de precancelacion de cartera
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="valor">Valor de pago.</param>
        private void EjecutaDevolucion(RqMantenimiento rq, tcardescuentosdetalle descuento, decimal montodevolucion)
        {
            // Control de secuencia
            long secuencia = TcarDevolucionDal.GetSecuencia();

            // Registro de devolucion
            tcardevolucion devolucion = new tcardevolucion();
            //devolucion.cdevolucion = secuencia + 1;
            devolucion.fcontable = rq.Fconatable;
            devolucion.cpersona = descuento.cpersona;
            devolucion.ccompania = descuento.ccompania;
            devolucion.cmodulo = rq.Cmodulotranoriginal;
            devolucion.ctransaccion = rq.Ctranoriginal;
            devolucion.cusuarioing = rq.Cusuario;
            devolucion.fingreso = rq.Freal;
            devolucion.monto = montodevolucion;
            Sessionef.Grabar(devolucion);

            // Ejecuta monetario
            tcarevento evento = TcarEventoDal.Find(EnumEventos.COBRO_DEVOLUCION.Cevento);
            rq.Coperacion = descuento.coperacion;
            this.EjecutaMonetario(rq, evento, Constantes.UNO, descuento.coperacion, montodevolucion);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="evento">Evento que contiene el codigo de transaccion con el cual se ejecuta el monetario</param>
        /// <param name="rubro">Codigo de rubro.</param>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <param name="monto">Valor de la transaccion.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, tcarevento evento, int rubro, string coperacion, decimal monto)
        {
            // Ejecuta monetario
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, evento.cevento);
            rqconta.EncerarRubros();

            RqRubro rqrubro = new RqRubro(rubro, monto, rqmantenimiento.Cmoneda);
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

