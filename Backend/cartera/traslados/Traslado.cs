using cartera.comp.mantenimiento.util;
using cartera.enums;
using cartera.monetario;
using cartera.traslados.helper;
using dal.cartera;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.traslados {

    /// <summary>
    /// Clase que se encarga de ejecutar traslados de cartera.
    /// </summary>
    public class Traslado : TrasladoHelper {

        /// <summary>
        /// Crea una instancia de TrasladoHelper.
        /// </summary>
        public Traslado(RqMantenimiento rqMantenimiento, String tipo, int fproceso)
        {
            this.tipo = tipo;
            this.Inicializar(rqMantenimiento);
            this.fproceso = fproceso;
            // REQUESTOPERACION
        }


        /// <summary>
        /// Ejecuta traslado de cuotas en las cuales la fecha de vencimeinto es menor a la fecha de proceso.
        /// </summary>
        public Boolean ProcesarVencidas(String cestatusdestino)
        {
            Boolean ejecuto = false;
            List<tcaroperacioncuota> lcuotas = operacion.GetLcuotas();
            foreach (tcaroperacioncuota cuota in lcuotas) {
                // Ejecuta cambio de estatus si el estatus es diferente y tiene cuotas venciadas
                if (cuota.cestatus.Equals(cestatusdestino) || (cuota.fpago != null)
                        || !TcarOperacionCuotaDal.EstavencidaOpagada(cuota, fproceso)) {
                    break;
                }

                // contabiliza traslado de los rubros de la cuota
                this.ProcesaCuota(cuota, cestatusdestino, false);
                ejecuto = true;
            }
            return ejecuto;
        }

        /// <summary>
        /// Ejecuta traslados de cuotas en las cuales la fecha de vencimiento de la cuota es mayor a la fecha de proceso.
        /// </summary>
        public void ProcesarPorVencer(String cestatusdestino)
        {
            if (!this.cambiaestadocuotasfuturas) {
                return;
            }
            List<tcaroperacioncuota> lcuotas = operacion.GetLcuotas();
            foreach (tcaroperacioncuota cuota in lcuotas) {
                // Ejecuta cambio de estatus si el estatus destino es diferente y tiene cuotas por vencer
                if (cuota.cestatus.Equals(cestatusdestino) || (cuota.fpago != null)
                        || TcarOperacionCuotaDal.EstavencidaOpagada(cuota, fproceso)) {
                    continue;
                }
                // contabiliza traslado de los rubros de la cuota por vences.
                this.ProcesaCuota(cuota, cestatusdestino, true);
            }
        }

        /// <summary>
        /// Registra transacciones monetarias.
        /// </summary>
        public void EjecutarMonetario()
        {
            // Genera rubros de tipos SALDO.
            // Los rubros de accrual ya estan incluidos en los rubros de rqMantenimiento.
            MonetarioAcumuladoCartera.AdicionarRubrosCambioEstado(rqMantenimiento, mcreditoacumulados, operacion.tcaroperacion);
            MonetarioAcumuladoCartera.AdicionarRubrosCambioEstado(rqMantenimiento, mdebitoacumulados, operacion.tcaroperacion);
            MonetarioHelper.EjecutaMonetario(rqMantenimiento);
        }

        /// <summary>
        /// Ejecuta monetario del capital castigado.
        /// </summary>
        public void EjecutarMonetarioCastigo()
        {
            tcarcambioestado tcarCambioEstado = TcarCambioEstadoDal.Find(tipo, EnumSaldos.CAPITAL.GetCsaldo());
            // Los rubros de accrual ya estan incluidos en los rubros de rqMantenimiento.
            MonetarioAcumuladoCartera.AdicionarRubrosCambioEstado(this.rqMantenimiento, this.mcreditoacumulados, this.operacion.tcaroperacion);
            decimal totalCastigado = MonetarioAcumuladoCartera.GetValorTotal(this.mcreditoacumulados);
            // Contabilizacion en el gasto Debito 4402, el credito son las cuentas 14 del capital de cartera.
            RubroHelper.AdicionarRubro(this.rqMantenimiento, (int)tcarCambioEstado.crubroreversodebito, totalCastigado,
                    this.operacion.tcaroperacion.coperacion, this.operacion.tcaroperacion.cmoneda, EnumEstatus.VENCIDA.Cestatus);

            // Contabilizacion del capital en cuentas de orden Debito 710310 Credito 7203
            RubroHelper.AdicionarRubro(this.rqMantenimiento, (int)tcarCambioEstado.crubrodebito, totalCastigado,
                    this.operacion.tcaroperacion.coperacion, this.operacion.tcaroperacion.cmoneda, EnumEstatus.CASTIGADA.Cestatus);

            RubroHelper.AdicionarRubro(this.rqMantenimiento, (int)tcarCambioEstado.crubrocredito, totalCastigado,
                    this.operacion.tcaroperacion.coperacion, this.operacion.tcaroperacion.cmoneda, EnumEstatus.CASTIGADA.Cestatus);

            MonetarioHelper.EjecutaMonetario(this.rqMantenimiento);
        }

        /// <summary>
        /// Valida si tiene que ejecutar el retorno a vigente.
        /// </summary>
        /// <returns>Boolean</returns>
        public Boolean EjecutarRetornoVigente()
        {
            if (operacion.tcaroperacion.cestatus.Equals(EnumEstatus.CANCELADA.Cestatus)) {
                return false;
            }

            // Si tiene cuotas vencidas no retorna a vigente.
            return TcarOperacionCuotaDal.TieneCuotasVencidas(this.operacion.GetLcuotas(), fproceso) ? false : true;
        }

        public Boolean EjecutarPasoVencido()
        {
            if (this.GetTcarOperacion().cestatus.Equals(EnumEstatus.VENCIDA.Cestatus)) {
                return true; // para que pase a vencido las cuotas que estan en no devenga intereses.
            }
            Boolean pasaravencido = false;
            List<tcaroperacioncuota> lcuotas = this.operacion.GetLcuotas();
            int diasvencido = 0; // de la primera cjuota no pagada
            foreach (tcaroperacioncuota cuota in lcuotas) {
                if (cuota.fpago != null) {
                    continue;
                }

                tcaroperacionrubro rubrocapital = TcarOperacionRubroDal.FindPorCsaldoStart(cuota.GetRubros(), "CAP");
                if (rubrocapital == null || decimal.Subtract(decimal.Subtract((decimal)rubrocapital.saldo, (decimal)rubrocapital.cobrado), (decimal)rubrocapital.descuento).CompareTo(Constantes.CERO) <= 0) {
                    continue;
                }

                if (!TcarOperacionCuotaDal.EstavencidaOpagada(cuota, this.fproceso)) {
                    break;
                }
                diasvencido = util.Fecha.Resta365((int)this.fproceso, (int)cuota.fvencimiento); // de la primera cjuota no pagada
                break;

            }
            tgentipocredito tc = TgenTipoCreditoDal.Find(this.GetTcarOperacion().ctipocredito);
            if (diasvencido.CompareTo(tc.diasgraciapasovencido) > 0) {
                pasaravencido = true;
            }
            return pasaravencido;
        }
    }
}
