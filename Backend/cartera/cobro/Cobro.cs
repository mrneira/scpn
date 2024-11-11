using cartera.accrual;
using cartera.cobro.helper;
using cartera.enums;
using cartera.monetario;
using core.servicios.mantenimiento;
using dal.cartera;
using dal.monetario;
using modelo;
using monetario.util.rubro;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.cobro {

    /// <summary>
    /// Clase que se encarga del manejo del cobro de cuotas en operaciones de cartera.
    /// </summary>
    public class Cobro : CobroHelper {
        /// <summary>
        /// Saldo no pagado, diferencia entre el valor pagado y el valor pendiente de pago en los rubros.
        /// </summary>
        private decimal valornoaplicado = Constantes.CERO;
        /// <summary>
        /// Saldo no pagado, diferencia entre el valor pagado y el valor pendiente de pago en los rubros.
        /// </summary>
        private decimal totalPrecancelacionArregloPagos = Constantes.CERO;
        /// <summary>
        /// Bandera que indica si esta ejecutando cobro anticipado de cuotas.
        /// </summary>
        private bool espagoanticipado = false;
        /// <summary>
        /// Objeto que contiene rubros de la transaccion de pago anticipado.
        /// </summary>
        private TransaccionRubro transaccionRubroPagoAnticipado;
        /// <summary>
        /// true indica que es un cobro de arreglo de pagos, cobra primero los valores con pago obligatorio.
        /// </summary>
        public bool esarreglopago = false;
        /// <summary>
        /// true procesa pagos obligatorios de arreglo de pagos.
        /// </summary>
        public bool procesaPagosOblogatorios = false;
        /// <summary>
        /// true indica que se esta cancelando la operacion en arreglo de pagos, con los valores no pagados se genera otra operacion.
        /// </summary>
        public bool precancelacionArregloPagos = false;

        /// <summary>
        /// Lista de rubros a pagar en arreglo de pagos.
        /// </summary>
        private List<tcaroperacionarrepagorubro> lArregloPagosRubros;

        /// <summary>
        /// Crea una instancia de cobro.
        /// </summary>
        /// <param name="saldo">Objeto que contiene los valores adeudados por rubro.</param>
        /// <param name="valorpagado">Monto pagado a distribuir en los rubros de las cuotas.</param>
        /// <param name="fcobro">Fecha en la que se aplica el cobro.</param>
        public Cobro(saldo.Saldo saldo, decimal valorpagado, int fcobro) : this(saldo, valorpagado, fcobro, false, null) { }

        /// <summary>
        /// Crea una instancia de cobro.
        /// </summary>
        /// <param name="saldo">Objeto que contiene los valores adeudados por rubro.</param>
        /// <param name="valorpagado">Monto pagado a distribuir en los rubros de las cuotas.</param>
        /// <param name="fcobro">Fecha en la que se aplica el cobro.</param>
        /// <param name="esarreglopago">true indica que esta pagando un arreglo de pago.</param>
        public Cobro(saldo.Saldo saldo, decimal valorpagado, int fcobro, bool esarreglopago, long? csolicitud)
        {
            base.saldo = saldo;
            valornoaplicado = valorpagado;
            base.fcobro = fcobro;
            base.SetTcaroperacion(this.saldo.Operacion.tcaroperacion);
            this.esarreglopago = esarreglopago;
            if (this.esarreglopago) {
                // Lista de rubros a pagar en el arreglo de pagos.
                lArregloPagosRubros = TcarOperacionArrePagoRubroDal.Find(base.tcaroperacion.coperacion, (long)csolicitud);
            }
        }
        /// <summary>
        /// Metodo que ejecuta el cobro de cuotas de la operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <param name="aplicavalornopagadoacapital">true indica que el saldo no aplicado a las cuotas vencidas y cuota actual 
        /// se acumula en en el saldo de capital a almacenar en la tabla tcaroperaciontransaccionrubro.</param>
        /// <param name="insertatransaccionrubro"></param>
        /// <returns>decimal</returns>
        public decimal Ejecutar(RqMantenimiento rqmantenimiento, bool aplicavalornopagadoacapital, bool insertatransaccionrubro)
        {
            espagoanticipado = false;
            this.rqmantenimiento = rqmantenimiento;
            MonetarioHelper.FijaTransaccion(rqmantenimiento, EnumEventos.COBRO.Cevento); // 7-21
            // En arreglo de pagos primero conbra valores obligatorios de pagos, si existe un saldo para los valores de acuerdo a la prelacion de cobro.
            if (this.esarreglopago) {
                this.procesaPagosOblogatorios = true;
                // Ejecuta el cobro unicamente de los pagos obligatorios del arreglo de pagos.
                CobroCuotas(aplicavalornopagadoacapital);
                this.procesaPagosOblogatorios = false;
            }
            CobroCuotas(aplicavalornopagadoacapital);
            // ejecuta transaccion monetaria.
            MonetarioHelper.EjecutaMonetario(rqmantenimiento);


            // Inserta registros de valores cobrados en tcaroperaciontransaccionrubro.
            if (insertatransaccionrubro) {
                TcarOperacionTransaccionRubroDal.Crear(rqmantenimiento, tcaroperacion.coperacion, mcobro, rqmantenimiento.Fconatable,
                        fcobro);

            }
            return valornoaplicado;
        }

        /// <summary>
        /// Metodo que ejecuta el cobro de cuotas de la operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        /// <returns>decimal</returns>
        public decimal EjecutarCobroAnticipado(RqMantenimiento rqmantenimiento)
        {
            this.rqmantenimiento = rqmantenimiento;
            espagoanticipado = true;
            MonetarioHelper.FijaTransaccion(rqmantenimiento, EnumEventos.COBROANTICIPADO.Cevento);
            transaccionRubroPagoAnticipado = new TransaccionRubro(rqmantenimiento.Cmodulo, rqmantenimiento.Ctransaccion);
            // cobro anticipado de cuotas por vencer.
            CobroAnticipado();
            // ejecuta transaccion monetaria.
            MonetarioHelper.EjecutaMonetario(rqmantenimiento);

            // Inserta registros de valores cobrados en tcaroperaciontransaccionrubro.
            TcarOperacionTransaccionRubroDal.Crear(rqmantenimiento, tcaroperacion.coperacion, mcobro, rqmantenimiento.Fconatable, fcobro);

            return valornoaplicado;
        }

        /// <summary>
        /// El cobro se realiza hasta la cuota en curso, si los rubros tienen un valor pendiente de pago.
        /// </summary>
        /// <param name="aplicavalornopagadoacapital">true indica que el saldo no aplicado a las cuotas vencidas y cuota actual 
        /// se acumula en en el saldo de capital a almacenar en la tabla tcaroperaciontransaccionrubro.</param>
        private void CobroCuotas(bool aplicavalornopagadoacapital)
        {
            List<tcarprelacioncobro> lprelacion = TcarPrelacionCobroDal.FindAll();
            if (TcarProductoDal.Find((int)tcaroperacion.cmodulo, (int)tcaroperacion.cproducto,
                (int)tcaroperacion.ctipoproducto).cobrovertical.Equals("1")) {
                CobroCuotasVertical(lprelacion);
            } else {
                CobroCuotasHorizontal(lprelacion);
            }
            if (aplicavalornopagadoacapital) {
                CobroCuotasFuturas();
                Actualizamap(EnumSaldos.CAPITAL.GetCsaldo(), valornoaplicado);
            }
        }

        /// <summary>
        /// Metodo que se encarga de cobro de cuotas vertical, recorre la prelacion de cobro y cobra de todas cuotas.
        /// Ejemplo primero cobra mora de todas las cuotas, luego interes, seguros y capital.
        /// </summary>
        /// <param name="lprelacion">Lista que contiene el orden de cobro de las cuotas.</param>
        private void CobroCuotasVertical(List<tcarprelacioncobro> lprelacion)
        {
            foreach (tcarprelacioncobro prelacion in lprelacion) {
                if (!Existesaldonoaplicado()) {
                    break;
                }
                List<tcaroperacioncuota> lcuotas = saldo.Operacion.Lcuotas;
                foreach (tcaroperacioncuota cuota in lcuotas) {
                    if (!Continuarcobro(cuota)) {
                        break;
                    }
                    Cobrarubro(cuota, prelacion);
                    this.MarcaCuotaPagada(cuota);
                }

            }
        }

        /// <summary>
        /// Metodo que se encar del cobro horizontal de cuotas. El pago se aplica por cuota y dentro de la cuota la prelacion de cobro.
        /// </summary>
        /// <param name="lprelacion">Lista que contiene el orden de cobro de las cuotas.</param>
        private void CobroCuotasHorizontal(List<tcarprelacioncobro> lprelacion)
        {
            foreach (tcaroperacioncuota cuota in saldo.Operacion.Lcuotas) {
                if (!Continuarcobro(cuota)) {
                    break;
                }
                foreach (tcarprelacioncobro prelacion in lprelacion) {
                    if (!Existesaldonoaplicado()) {
                        break;
                    }
                    Cobrarubro(cuota, prelacion);
                }
                this.MarcaCuotaPagada(cuota);
            }
        }
        /// <summary>
        /// Metodo que se encarga del cobro de cuotas anticipadas en la aplicacion.
        /// El pago se realiza por cuota y dentro de la cuota se aplica la prelacion de cobro por codigo de saldo. 
        /// La cuota actual se cobro los saldos tipo ACC hasta ayer.
        /// </summary>
        private void CobroAnticipado()
        {
            List<tcarprelacioncobro> lprelacion = TcarPrelacionCobroDal.FindAll();
            int ncuotaencurso = saldo.Cuotaencurso == null ? 0 : (int)saldo.Cuotaencurso.numcuota;
            foreach (tcaroperacioncuota cuota in saldo.Operacion.Lcuotas) {
                if (cuota.numcuota < ncuotaencurso) {
                    continue;
                }
                // valida que cobre valor total de la cuota.
                decimal pendiente = saldo.CalculaDeudaPorCuota(cuota);
                if (pendiente.CompareTo(valornoaplicado) > 0) {
                    // cobra cuota completa.
                    break;
                }
                foreach (tcarprelacioncobro prelacion in lprelacion) {
                    if (!Existesaldonoaplicado()) {
                        break;
                    }
                    Cobrarubro(cuota, prelacion);
                }
                this.MarcaCuotaPagada(cuota);
            }
        }

        /// <summary>
        /// Metodo que se encarga del cobro de cuentas por cobrar con vencimiento futuro, esto se realiza en pagos 
        /// extraordinarios en los que se cobra las cxc o en precancelaciones de operaciones.
        /// </summary>
        private void CobroCuotasFuturas()
        {
            List<tcarprelacioncobro> lprelacion = TcarPrelacionCobroDal.FindAll();
            foreach (tcaroperacioncuota cuota in saldo.Operacion.Lcuotas) {
                if (cuota.fvencimiento > base.fcobro) {
                    foreach (tcaroperacionrubro rubro in cuota.GetRubros()) {
                        if (!AplicarCuotasFuturas(rubro)) {
                            continue;
                        }
                        if (!precancelacionArregloPagos) {
                            Actualizavalorpagado(cuota, rubro,
                                    TcarPrelacionCobroDal.GetTcarPrelacionCobro(lprelacion, rubro.csaldo));
                        } else {
                            ActualizaValorPagadoArregloPagos(cuota, rubro,
                                    TcarPrelacionCobroDal.GetTcarPrelacionCobro(lprelacion, rubro.csaldo));
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Valida si el rubro de la cuota es una cuenta por cobrar.
        /// </summary>
        /// <param name="rubro">Rubro asociado a una cuota a verificar si es una cxc.</param>
        /// <returns>bool</returns>
        private bool AplicarCuotasFuturas(tcaroperacionrubro rubro)
        {
            tmonsaldo tmonsaldo = TmonSaldoDal.Find(rubro.csaldo);
            if (tmonsaldo.ctiposaldo.Equals("CAP") || (rubro.esaccrual != null && (bool)rubro.esaccrual)) {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Ejecuta el cobro para un codigo de saldo.
        /// </summary>
        /// <param name="cuota">Datos de la cuota.</param>
        /// <param name="prelacion">Objeto que contiene el codigo de saldo a cobrar.</param>
        private void Cobrarubro(tcaroperacioncuota cuota, tcarprelacioncobro prelacion)
        {
            tcaroperacionrubro rubro = TcarOperacionRubroDal.FindPorCodigoSaldo(cuota.GetRubros(), prelacion.csaldo);
            if (rubro != null) {
                if (!precancelacionArregloPagos) {
                    Actualizavalorpagado(cuota, rubro, prelacion);
                } else {
                    ActualizaValorPagadoArregloPagos(cuota, rubro, prelacion);
                }
            }
        }

        /// <summary>
        /// Valida si sicontunua ejecutando el cobro.
        /// </summary>
        /// <param name="cuota">Objeto que contiene datos de cuota a cobrar.</param>
        /// <returns>bool</returns>
        private bool Continuarcobro(tcaroperacioncuota cuota)
        {
            if ((cuota.finicio >= fcobro) || !Existesaldonoaplicado()) {
                return false;
            }
            return true;

        }

        /// <summary>
        /// Verifica si existe un valor pagado no aplicado a los rubros de las cuotas.
        /// </summary>
        /// <returns>bool</returns>
        private bool Existesaldonoaplicado()
        {
            if (!precancelacionArregloPagos && valornoaplicado.CompareTo(Constantes.CERO) <= 0) {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Actualiza el valor a pagar en el rubro. Si el saldo pendiente de distribuir es mayor al adeudado en el rubro
        /// </summary>
        /// <param name="cuota">Objeto que contine datos de una cuota.</param>
        /// <param name="rubro">Objeto que contiene datos del rubro a cobrar.</param>
        /// <param name="prelacion">Definicion de la prelacion de cobro de un tipo de saldo.</param>
        private void Actualizavalorpagado(tcaroperacioncuota cuota, tcaroperacionrubro rubro, tcarprelacioncobro prelacion)
        {
            if ((rubro.GetPendiente() == 0) || (rubro.fpago != null) || !this.PagarRubro(rubro)) {
                // Si no tiene un valor a pagar.
                return;
            }
            decimal valorpendiente = rubro.GetPendiente();
            if (rubro.GetPagadoentransaccion() > 0) {
                valorpendiente = valorpendiente - rubro.GetPagadoentransaccion();
            }
            if (valorpendiente <= 0) {
                return;
            }
            decimal valorpagado = Constantes.CERO;
            bool pagocompleto = false;

            if ((valorpendiente.CompareTo(Constantes.CERO) <= 0) && (rubro.fpago == null)) {
                this.MarcarPagoSinDeuda(cuota, rubro);
                return;
            }
            // Cobro completo el valor pendiente de pago el rubro
            if (valornoaplicado.CompareTo(valorpendiente) >= 0) {
                valorpagado = valorpendiente;
                valornoaplicado = valornoaplicado - valorpendiente;
                pagocompleto = true;
            } else {
                // Cobro parcial del valor pendiente de pago.
                valorpagado = valornoaplicado;
                valornoaplicado = Constantes.CERO;
            }
            // actualiza el valor cobrado en el rubro
            if (valorpagado.CompareTo(Constantes.CERO) > 0) {
                Actualizavalorcobrado(cuota, rubro, valorpagado, pagocompleto, prelacion);
            }
        }

        /// <summary>
        /// Ejecuta cobro en precancelacion de arreglo de pagos.
        /// </summary>
        /// <param name="cuota">Objeto que contine datos de una cuota.</param>
        /// <param name="rubro">Objeto que contiene datos de un rubro de una cuota.</param>
        /// <param name="prelacion">Objeto que contiene la prelacion de pagos de rubros</param>
        private void ActualizaValorPagadoArregloPagos(tcaroperacioncuota cuota, tcaroperacionrubro rubro, tcarprelacioncobro prelacion)
        {
            if ((rubro.GetPendiente() == 0) || (rubro.fpago != null)) {
                // Si no tiene un valor a pagar.
                return;
            }
            decimal valorpagado = rubro.GetPendiente();
            if (valorpagado <= 0 && rubro.fpago == null) {
                this.MarcarPagoSinDeuda(cuota, rubro);
                return;
            }
            // actualiza el valor cobrado en el rubro
            if (valorpagado > 0) {
                totalPrecancelacionArregloPagos = totalPrecancelacionArregloPagos + valorpagado;
                Actualizavalorcobrado(cuota, rubro, valorpagado, true, prelacion);
                rubro.AddDatos("actulizomontoarrglopagos", "1");
            }
        }

        /// <summary>
        /// Marca cuotas como pagadas si no tiene valores adeudados y no tiene fecha de pago.
        /// </summary>
        /// <param name="cuota">Objeto que contine datos de una cuota.</param>
        /// <param name="rubro">Objeto que contiene datos de un rubro de una cuota.</param>
        private void MarcarPagoSinDeuda(tcaroperacioncuota cuota, tcaroperacionrubro rubro)
        {
            // Generar registro de historia.
            TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fcobro, rqmantenimiento.Mensaje,
                    rqmantenimiento.Enlinea, decimales);
            rubro.fpago = fcobro;
            rubro.accrual = Constantes.CERO;
        }

        /// <summary>
        /// Valida si aplica el pago en arreglo de pagos.
        /// </summary>
        /// <param name="rubro">Objeto que contiene informacion de un rubro de la tabla de amortizacion.</param>
        /// <returns></returns>
        private bool PagarRubro(tcaroperacionrubro rubro)
        {
            if (!this.procesaPagosOblogatorios) {
                return true;
            }
            bool pagar = false;
            foreach (tcaroperacionarrepagorubro rubarreglo in lArregloPagosRubros) {
                if ((bool)rubarreglo.pagoobligatorio && rubarreglo.csaldo.Equals(rubro.csaldo)) {
                    pagar = true;
                    break;
                }
            }
            return pagar;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cuota"></param>
        /// <param name="rubro">Objeto que contiene datos del rubro a cobrar.</param>
        /// <param name="valorpagado">Monto a pagar en el rubro.</param>
        /// <param name="pagocompleto">true, indica que se paga completo el valor del rubro.</param>
        /// <param name="prelacion">Definicion de la prelacion de cobro de un tipo de saldo.</param>
        private void Actualizavalorcobrado(tcaroperacioncuota cuota, tcaroperacionrubro rubro, decimal valorpagado, bool pagocompleto,
                tcarprelacioncobro prelacion)
        {
            // Generar registro de historia
            // Se puede cobrar en varias transacciones y en varios dias.
            TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fcobro, rqmantenimiento.Mensaje, rqmantenimiento.Enlinea, decimales);
            rubro.SetPagadoentransaccion(valorpagado);
            rubro.cobrado = rubro.cobrado + valorpagado;

            // Cuentas por cobrar
            tcaroperacioncxc cxc = TcarOperacionCxCDal.FindPorCodigoSaldo(rubro);
            if (cxc != null) {
                TcarOperacionCxCHistoriaDal.RegistraHistoria(cxc, fcobro, rqmantenimiento.Mensaje, rqmantenimiento.Enlinea);
            }

            // en pagos anticiapdos se cobra el interes parcial hasta la fecha de pago, luego se aplica el cobro del saldo del interes.
            // en ese caso no se cobra el interes de la cuota completo.
            if (rubro.valorcuota != null && rubro.valorcuota - rubro.cobrado > Constantes.CERO) {
                pagocompleto = false;
            }
            if (pagocompleto) {
                rubro.fpago = fcobro;
                rubro.accrual = Constantes.CERO;
            }

            // actualiza valores de cuentas por cobrar
            if (cxc != null) {
                cxc.mensaje = rubro.mensaje;
                if (pagocompleto) {
                    cxc.fpago = fcobro;
                } else {
                    cxc.monto = cxc.monto - valorpagado;
                }
                Sessionef.Actualizar(cxc);
            }

            // adiciona rubros para ejecutar transaccion monetaria.
            if (espagoanticipado) {
                tmonrubro tmonrubro = transaccionRubroPagoAnticipado.GetRubro(rubro.csaldo);
                Adicionarrubro(rubro, (int)tmonrubro.crubro);
            } else if (!precancelacionArregloPagos || rubro.csaldo.StartsWith("CAP-")) {
                // en arreglo de pagos solo se da de baja contable el capital.
                // otros rubros no se contabiliza.
                Adicionarrubro(rubro, prelacion);
            }

            // acumula valores por tipo de saldo, a grabar en la tabla tcaroperaciontransaccionrubro.
            base.Actualizamap(rubro.csaldo, valorpagado);
        }

        /// <summary>
        /// Actualiza la cuota como pagada si se cobra todos los rubros.
        /// </summary>
        private void MarcaCuotaPagada(tcaroperacioncuota cuota)
        {
            bool pagocompleto = true;
            List<tcaroperacionrubro> lrubros = cuota.GetRubros();

            pagocompleto = this.VerificaRubrosPagados(cuota, lrubros);

            if (pagocompleto) {
                // Maneja historia de la cuota.
                TcarOperacionCuotaHistoriaDal.RegistraHistoria(cuota, fcobro, rqmantenimiento.Mensaje, rqmantenimiento.Enlinea);
                cuota.fpago = fcobro;
            }
        }

        /// <summary>
        /// Verifica que todos los rubros de la cuota esten pagado.
        /// </summary>
        /// <param name="cuota"></param>
        /// <param name="lrubros"></param>
        /// <returns>Boolean</returns>
        private Boolean VerificaRubrosPagados(tcaroperacioncuota cuota, List<tcaroperacionrubro> lrubros)
        {
            Boolean pagocompleto = true;
            Boolean estacapitalpagado = TcarOperacionRubroDal.FindPorCsaldoStart(lrubros, "CAP-CAR").fpago != null;
            foreach (tcaroperacionrubro rubro in lrubros) {
                if (estacapitalpagado && rubro.csaldo.Equals("MORA-CAR")) {
                    // Si el capital esta cobrada marca como cobrada la mora
                    rubro.fpago = this.fcobro;
                } else {
                    if (rubro.fpago == null) {
                        if (rubro.cobrado + rubro.descuento >= rubro.valorcuota) {
                            rubro.fpago = this.fcobro;
                        }
                    }
                }
                if (rubro.fpago == null) {
                    pagocompleto = false;
                    break;
                }
            }
            if (!pagocompleto) {
                this.CalcularMora(cuota, lrubros);
                return pagocompleto;
            }
            foreach (tcaroperacionrubro rubro in lrubros) {
                if (rubro.fpago == null) {
                    // Generar registro de historia
                    TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, this.fcobro, this.rqmantenimiento.Mensaje,
                            this.rqmantenimiento.Enlinea, this.decimales);
                    rubro.fpago = this.fcobro;
                }
            }
            return pagocompleto;
        }

        /// <summary>
        /// Calcula mora de cuotas pagadas parcial el capital.
        /// </summary>
        /// <param name="cuota"></param>
        /// <param name="lrubros"></param>
        private void CalcularMora(tcaroperacioncuota cuota, List<tcaroperacionrubro> lrubros)
        {
            tcaroperacionrubro rubroMora = TcarOperacionRubroDal.FindPorCsaldoStart(lrubros, "MORA");
            if (rubroMora == null) {
                return;
            }
            Accrual accual = new Accrual(this.tcaroperacion, cuota);
            accual.Calcular(this.rqmantenimiento, this.fcobro, this.rqmantenimiento.Mensaje, true);
        }

        /// <summary>
        /// Marca operacion como cancelada o pagada en su totalidad.
        /// </summary>
        public void MarcaOperacionPagada()
        {
            pagototaloperacion = false;
            int i = this.saldo.Operacion.Lcuotas.Count;
            tcaroperacioncuota cta = this.saldo.Operacion.Lcuotas.ElementAt(i - 1);
            if (cta.fpago != null) {
                this.pagototaloperacion = true;
            }

            decimal? saldopendientefuturas = saldo.GetSaldoCuotasfuturas();
            if (saldopendientefuturas == null) {
                saldopendientefuturas = Constantes.CERO;
            }
            if (pagototaloperacion && saldopendientefuturas <= Constantes.CERO) {
                TcarOperacionDal.MarcaOperacionCancelada(tcaroperacion, rqmantenimiento, fcobro);
                BajaGarantias(tcaroperacion);
            }
        }

        public void MarcaOperacionPagadaPrecancelacion()
        {
            TcarOperacionDal.MarcaOperacionCancelada(tcaroperacion, rqmantenimiento, fcobro);
            BajaGarantias(tcaroperacion);
        }

        private void BajaGarantias(tcaroperacion tcaroperacion)
        {
            List<tcaroperaciongarantias> lgarantiascar = TcarOperacionGarantiasDal.Find(tcaroperacion.coperacion);
            if (lgarantiascar == null || lgarantiascar.Count <= 0) {
                return;
            }
            RqMantenimiento rqmantenimientogar = (RqMantenimiento)rqmantenimiento.Clone();
            foreach (tcaroperaciongarantias gacar in lgarantiascar) {
                // Baja garantias contabilizadas por garantia
                rqmantenimientogar.Coperacion = gacar.coperaciongarantia;
                Mantenimiento.ProcesarAnidado(rqmantenimientogar, 9, 6);
            }
        }

        private void ReavualoGarantias(tcaroperacion tcaroperacion)
        {
            List<tcaroperaciongarantias> lreavaluo = TcarOperacionGarantiasDal.Find(tcaroperacion.coperacion);
            if (lreavaluo == null || lreavaluo.Count <= 0) {
                return;
            }
            RqMantenimiento rqmantenimientogar = (RqMantenimiento)rqmantenimiento.Clone();
            foreach (tcaroperaciongarantias reAva in lreavaluo) {
                // Reavaluo contabiliza por garantia
                rqmantenimientogar.Coperacion = reAva.coperaciongarantia;
                Mantenimiento.ProcesarAnidado(rqmantenimientogar, 9, 4);
            }
        }
    }
}
