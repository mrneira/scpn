using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.componente;
using core.servicios;
using core.servicios.mantenimiento;
using dal.cartera;
using dal.contabilidad;
using dal.monetario;
using modelo;
using modelo.interfaces;
using monetario.util;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace cartera.comp.mantenimiento.masivos {

    /// <summary>
    /// Clase que se encarga de ejecutar pagos de transferencia masivo
    /// </summary>
    class AplicarTransferencia : ComponenteMantenimiento {

        // Variables
        long secuencia = Constantes.CERO;
        int cantidad = Constantes.CERO;
        string ccomprobante = "";
        decimal total = Constantes.CERO, totalpago = Constantes.CERO, totaldevolucion = Constantes.CERO;
        decimal saldooperacion = Constantes.CERO;

        /// <summary>
        /// Metodo que ejecuta el pago de las operaciones de cash
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("CARGATRANSFERENCIA") == null || rqmantenimiento.GetTabla("CARGATRANSFERENCIA").Lregistros.Count() < 0) {
                throw new AtlasException("CAR-0076", "NO EXISTEN ARCHIVOS PARA PROCESAR");
            }

            int ctransferencia = int.Parse(Secuencia.GetProximovalor("MASIVOS").ToString());
            secuencia = TcarDevolucionDal.GetSecuencia();
            this.total = 0;
            this.cantidad = 0;
            this.totaldevolucion = 0;
            this.totalpago = 0;
            this.EjecutaTransferencia(rqmantenimiento, ctransferencia);
        }

        /// <summary>
        /// Actualiza registros de archivos y descuentos
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="ctransaccion">Codigo de transaccion.</param>
        private void EjecutaTransferencia(RqMantenimiento rqmantenimiento, int ctransaccion)
        {
            tcarevento evento = TcarEventoDal.Find(EnumEventos.PRECANCELACION_MASIVO.Cevento);

            // Registros
            List<IBean> lpersonas = rqmantenimiento.GetTabla("CARGATRANSFERENCIA").Lregistros;
            foreach (tcartransferenciapersona persona in lpersonas) {
                cantidad += 1;
                total += (decimal)persona.monto;
                persona.ctransferencia = ctransaccion;
                persona.cusuarioing = rqmantenimiento.Cusuario;
                persona.fingreso = rqmantenimiento.Freal;
                persona.montopago = Constantes.CERO;
                persona.montodevolucion = Constantes.CERO;

                if (persona.monto == null || persona.monto <= 0) {
                    continue;
                }

                // Operaciones por persona
                IList<tcaroperacion> loperaciones = TcarOperacionDal.FindPorPersona(persona.cpersona, true);
                foreach (tcaroperacion tcaroperacion in loperaciones) {
                    if (tcaroperacion.cestatus.Equals(EnumEstatus.APROVADA.Cestatus)) {
                        continue;
                    }

                    // Saldos de operacion
                    saldooperacion = Constantes.CERO;
                    Operacion op = OperacionFachada.GetOperacion(tcaroperacion.coperacion, true);
                    this.Saldo(rqmantenimiento.Fconatable, op);

                    // Ejecuta pago
                    if (saldooperacion <= decimal.Subtract((decimal)persona.monto, (decimal)persona.montopago)) {
                        RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                        rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
                        rq.Coperacion = tcaroperacion.coperacion;
                        ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
                        rq.EncerarRubros();
                        this.EjecutaPago(rq, evento, tcaroperacion.coperacion, saldooperacion);
                        this.GrabarDetalle(rq, ctransaccion, tcaroperacion.coperacion, persona, saldooperacion);
                        persona.montopago = decimal.Add((decimal)persona.montopago, saldooperacion);
                    }
                }
                totalpago += (decimal)persona.montopago;

                // Ejecuta devolucion 
                persona.montodevolucion = decimal.Subtract((decimal)persona.monto, (decimal)persona.montopago);
                if (persona.montodevolucion > Constantes.CERO) {
                    RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                    rq.Mensaje = Servicio.GetMensaje(rqmantenimiento.Cusuario);
                    ThreadNegocio.GetDatos().Secuenciamonetario = Constantes.UNO;
                    this.GrabaDevolucion(rq, persona, (decimal)persona.montodevolucion);
                    totaldevolucion += (decimal)persona.montodevolucion;
                }
            }

            // Contabiliza devolucion
            if (totaldevolucion > Constantes.CERO) {
                this.EjecutaContabilizacion(rqmantenimiento, totaldevolucion);
            }

            // Crea cabecera de transferencia
            tcartransferencia transferencia = new tcartransferencia {
                ctransferencia = ctransaccion,
                ftransferencia = rqmantenimiento.Fconatable,
                archivo = rqmantenimiento.GetString("narchivo"),
                cantidad = cantidad,
                monto = total,
                montopago = totalpago,
                montodevolucion = totaldevolucion,
                ccomprobantedevolucion = ccomprobante,
                cusuarioing = rqmantenimiento.Cusuario,
                fingreso = rqmantenimiento.Freal
            };
            Sessionef.Grabar(transferencia);
        }

        /// <summary>
        /// Consulta el valor a pagar en una precancelacion de operaciones de cartera.
        /// </summary>
        /// <param name="fcobro">Fecha de cobro</param>
        /// <param name="coperacion">Numero de operacion de cartera</param>
        private void Saldo(int fcobro, Operacion operacion)
        {
            saldo.Saldo saldo = new saldo.Saldo(operacion, fcobro);
            saldo.Calculacuotaencurso();
            decimal saldofuturo = saldo.GetSaldoCuotasfuturas();

            saldooperacion = saldo.Totalpendientepago;
            if (saldo.Cxp > 0) {
                saldooperacion = decimal.Subtract(saldooperacion, saldo.Cxp);
            }
            saldooperacion = decimal.Add(saldooperacion, saldofuturo);
            if (saldooperacion < 0) {
                saldooperacion = Constantes.CERO;
            }
            // Encera valores pendientes de pago de rubros
            saldo.EncerarValoresPorCobrar();
        }

        /// <summary>
        /// Ejecuta transaccion de pago de normal de cartera
        /// </summary>
        /// <param name="rq">Request de mantenimiento.</param>
        /// <param name="evento">Registro de evento.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="montopago">Valor de pago.</param>
        private void EjecutaPago(RqMantenimiento rqmantenimiento, tcarevento evento, string coperacion, decimal montopago)
        {
            rqmantenimiento.Cambiartransaccion((int)evento.cmodulo, (int)evento.ctransaccion);
            rqmantenimiento.Coperacion = coperacion;
            rqmantenimiento.Monto = montopago;
            Mantenimiento.ProcesarAnidado(rqmantenimiento, (int)evento.cmodulo, (int)evento.ctransaccion);

            // Ejecuta monetario
            this.EjecutaMonetario(rqmantenimiento, evento, coperacion, saldooperacion);
        }

        /// <summary>
        /// Adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="evento">Evento que contiene el codigo de transaccion con el cual se ejecuta el monetario</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="monto">Valor de la transaccion.</param>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, tcarevento evento, string coperacion, decimal monto)
        {
            // Ejecuta monetario
            RqMantenimiento rqconta = (RqMantenimiento)rqmantenimiento.Clone();
            MonetarioHelper.FijaTransaccion(rqconta, evento.cevento);
            rqconta.EncerarRubros();

            RqRubro rqrubro = new RqRubro(1, monto, rqmantenimiento.Cmoneda);
            rqrubro.Coperacion = coperacion;
            rqrubro.Actualizasaldo = false;
            rqconta.AdicionarRubro(rqrubro);

            // Ejecuta la transaccion monetaria anidada.
            if (rqconta.Rubros != null && !(rqconta.Rubros.Count < 1)) {
                new ComprobanteMonetario(rqconta);
            }
        }

        /// <summary>
        /// Graba instancia de detalle de transaccion
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="ctransferencia">Codigo de transaccion.</param>
        /// <param name="coperacion">Numero de operacion de cartera.</param>
        /// <param name="persona">Registro de transaccion.</param>
        /// <param name="monto">Monto de pago.</param>
        private void GrabarDetalle(RqMantenimiento rqmantenimiento, int ctransferencia, string coperacion, tcartransferenciapersona persona, decimal monto)
        {
            // Crea cabecera de transferencia
            tcartransferenciadetalle detalle = new tcartransferenciadetalle {
                ctransferencia = ctransferencia,
                cpersona = persona.cpersona,
                ccompania = persona.ccompania,
                coperacion = coperacion,
                monto = monto,
                mensaje = rqmantenimiento.Mensaje
            };

            Sessionef.Grabar(detalle);
        }

        /// <summary>
        /// Ejecuta transaccion de devolucion de cartera
        /// </summary>
        /// <param name="rq">Request de mantenimiento.</param>
        /// <param name="persona">Registro de transaccion.</param>
        /// <param name="montodevolucion">Valor de devolucion.</param>
        private void GrabaDevolucion(RqMantenimiento rqmantenimiento, tcartransferenciapersona persona, decimal montodevolucion)
        {
            // Control de secuencia
            secuencia += 1;

            // Registro de devolucion
            tcardevolucion devolucion = new tcardevolucion();
            //devolucion.cdevolucion = secuencia;
            devolucion.fcontable = rqmantenimiento.Fconatable;
            devolucion.cpersona = persona.cpersona;
            devolucion.ccompania = persona.ccompania;
            devolucion.cmodulo = rqmantenimiento.Cmodulotranoriginal;
            devolucion.ctransaccion = rqmantenimiento.Ctranoriginal;
            devolucion.cusuarioing = rqmantenimiento.Cusuario;
            devolucion.fingreso = rqmantenimiento.Freal;
            devolucion.monto = montodevolucion;
            Sessionef.Grabar(devolucion);
        }

        /// <summary>
        /// Ejecuta contabilizacion de devolucion
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="monto">Valor de devolucion a contabilizar.</param>
        private void EjecutaContabilizacion(RqMantenimiento rqmantenimiento, decimal monto)
        {
            // Codigo de plantilla contable
            int cplantilla = (int)TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_TRANSFERENCIA_ISSPOL", rqmantenimiento.Ccompania).numero;
            if (cplantilla == 0) {
                throw new AtlasException("BCAR-0023", "VALOR NUMERICO PARA EL PARAMETRO NO DEFINIDO EN TCARPARAMETROS CODIGO: {0} COMPANIA: {1}", "PLANTILLA_CONTABLE_TRANSFERENCIA_ISSPOL", rqmantenimiento.Ccompania);
            }

            // Genera comprobante contable¿
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, cplantilla);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, monto);
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.AddDatos("actualizarsaldosenlinea", true);
        }

        /// <summary>
        /// Completa cabecera de comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="cplantilla">Codigo de plantilla contable.</param>
        private tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, int cplantilla)
        {
            ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "INGRES");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                1, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, "DEVOLUCIÓN DE TRANSFERENCIAS ISSPOL", true, true, true, false, false, false, false,
                cplantilla, 3, 1, 1, rqmantenimiento.Ctransaccion, rqmantenimiento.Cmodulo, 1003, "INGRES", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }

        /// <summary>
        /// Completa detalle de comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <param name="comprobante">Codigo de comprobante contable.</param>
        /// <param name="monto">Valor de devolucion a contabilizar.</param>
        private List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcomprobante comprobante, decimal monto)
        {
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find((int)comprobante.cplantilla, rqmantenimiento.Ccompania);
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (tconplantilladetalle pd2 in plantillaDetalle) {
                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                cd.monto = monto;
                cd.montooficial = monto;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = 1;
                cd.csucursal = 1;
                cd.ccuenta = pd2.ccuenta;
                cd.debito = pd2.debito;
                cd.cpartida = pd2.cpartida;
                cd.numerodocumentobancario = "";
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda ?? "USD";
                cd.cmonedaoficial = rqmantenimiento.Cmoneda ?? "USD";
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = pd2.centrocostosccatalogo;
                cd.centrocostoscdetalle = pd2.centrocostoscdetalle;

                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }

            if (sumatorioCreditos != sumatorioDebitos) {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }

            comprobante.montocomprobante = monto;
            return comprobanteDetalle;
        }
    }
}
