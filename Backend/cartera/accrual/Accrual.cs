using cartera.contabilidad;
using cartera.enums;
using cartera.monetario;
using dal.cartera;
using dal.generales;
using general.util;
using modelo;
using monetario.util;
using monetario.util.rubro;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace cartera.accrual {

    /// <summary>
    /// Clase utilitaria que se encarga de calcular accuales de una cuota.
    /// </summary>
    public class Accrual {
        /// <summary>
        /// Objeto que contiene los datos de la operacion de cartera.
        /// </summary>
        private tcaroperacion tcaroperacion;
        /// <summary>
        /// Objeto que contiene los datos de la cuota a calcular accrual.
        /// </summary>
        private tcaroperacioncuota cuota;
        /// <summary>
        /// Lista de tasas asociadas a la operacion.
        /// </summary>
        private IList<tcaroperaciontasa> ltasas;
        /// <summary>
        /// Lista de accrual a calcualr para la operacion.
        /// </summary>
        private IList<tcaraccrual> lacrual;
        /// <summary>
        /// Lista de runbros perteneciente a una cuota.
        /// </summary>
        private IList<tcaroperacionrubro> lrubroscuota;
        /// <summary>
        /// Variable que indica que se creo un rubro asociado al codigo de saldo de la mora.
        /// </summary>
        bool crearubro = false;

        /// <summary>
        /// Crea una instancia de accrual, obtiene la lista de tasas de la operacion y una lista de registros de accrual a calcular.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que </param>
        /// <param name="cuota"></param>
        public Accrual(tcaroperacion tcaroperacion, tcaroperacioncuota cuota) {
            this.tcaroperacion = tcaroperacion;
            this.cuota = cuota;
            ltasas = TcarOperacionTasaDal.Find(tcaroperacion.coperacion);
            lacrual = TcarAccrualDal.FindAll();
            lrubroscuota = cuota.GetRubros();
        }

        /// <summary>
        /// Metodo que calcula accrual, recorre la lista de cuotas de la operacion y verifica si tiene que calcular accrual.<br>
        /// Condiciones:
        /// Si el accrual se calcula desde la fecha de inico de la cuota hasta su vencimiento, el accual se calcula dividiendo el valor de la cuota para el numero de dias.
        /// Si el accrual se calcual desde el vencimiento de la cuota "MORA" se calcula dada una tasa.
        /// 
        /// </summary>
        /// <param name="fproceso">Fecha de proceso a la cual se calcula el accrual</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el rubro de accrual.</param>
        public void Calcular(RqMantenimiento rqmantenimiento, int fproceso, string mensaje, bool registrarSaldo) {
            lrubroscuota = cuota.GetRubros();
            List<tcaroperacionrubro> lcapital = TcarOperacionRubroDal.FindCapital(lrubroscuota);
            BaseDeCalculo bcalculo = BaseDeCalculo.GetBaseDeCalculo(tcaroperacion.cbasecalculo);
            foreach (tcaroperacionrubro rubrocapital in lcapital) {
                foreach (tcaraccrual accrual in lacrual) {
                    // El interes desde la fecha de inico se calcula cuando se genera la tabla de pagos.
                    // En el reajuste de tasa se recalucla el valor de la cuota de los tipo ACC y el valor del acrual.
                    if (accrual.accrualdesde.CompareTo("I") != 0 && cuota.cestatus.Equals(accrual.cestatus)) {
                        // calcula accrual desde el vencimiento de la cuota.
                        crearubro = false;
                        CalcularMora(rqmantenimiento, accrual, rubrocapital, fproceso, bcalculo, mensaje, registrarSaldo);
                    }
                }
            }
        }

        /// <summary>
        /// Metodo que se encarga del calculo de la mora.
        /// </summary>
        /// <param name="accrual">Objeto que contiene definicion del accrual a calcular.</param>
        /// <param name="rubrocapital">Objeto que contiene definicion de rubro de capital.</param>
        /// <param name="fproceso">Fecha de proceso.</param>
        /// <param name="cbasecalculo">Base de calculo de la operacion.</param>
        /// <param name="mensaje">Numero de mensaje.</param>
        private void CalcularMora(RqMantenimiento rqMantenimiento, tcaraccrual accrual, tcaroperacionrubro rubrocapital, int fproceso, BaseDeCalculo cbasecalculo, string mensaje, bool registrarSaldo) {
            int dias = 0;
            decimal tasa = (decimal)GetTasaMora(accrual, fproceso);
            AccrualHelper ah = new AccrualHelper(cbasecalculo);
            decimal tasadia = ah.GetTasadiaria(tasa);  // La mora se calcula con la tasa de vencimiento de la cuota.

            // Calcula el interes diario.
            decimal montoParaAccrual = Decimal.Subtract((decimal)rubrocapital.saldo, Decimal.Add((decimal)rubrocapital.cobrado, (decimal)rubrocapital.descuento));
            if ((rubrocapital.fpago != null) || (montoParaAccrual <= 0)) {
                // Si la cuota esta pagada o no tiene valor de capital no calcular.
                return;
            }
            decimal valor = ah.CalcularAccrualDiario(montoParaAccrual, tasa, fproceso, fproceso, tcaroperacion.cmoneda);

            // Obtiene el rubro asociado al codigo de saldo de mora es fproceso por la contabilizacion de la mora en el fin de dia.
            tcaroperacionrubro rubro = GetRubro(accrual, fproceso, mensaje);
            if (!crearubro && (rubro.accrual != null) && (rubro.accrual == valor)) {
                return; // No grabar calculo con el mismo accrual.
            }

            if (!this.crearubro) {
                TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fproceso, mensaje, false, TgenMonedaDal.GetDecimales(this.tcaroperacion.cmoneda));
            }

            rubro.tasa = tasa;
            rubro.tasadia = tasadia;
            rubro.accrual = valor;
            rubro.montoparaaccrual = montoParaAccrual;
            rubro.fpago = null;

            if (crearubro) {
                // si crea el rubro por primera vez el valor del accrual se calcula desde la fecha de vencimeinto de la cuota.
                dias = Fecha.Resta365(fproceso, (int)cuota.fvencimiento);
            }
            if (registrarSaldo && crearubro && dias > 0) {
                decimal saldo = (decimal)rubro.accrual * dias;
                saldo = Math.Round(saldo, TgenMonedaDal.GetDecimales(tcaroperacion.cmoneda), MidpointRounding.AwayFromZero);
                rubro.saldo = saldo + rubro.cobrado + rubro.descuento;
                this.ContabilizarSaldoCalculado(rqMantenimiento, saldo); // Es el saldo calculado.
            }
            this.lrubroscuota.Add(rubro);
        }

        /// <summary>
        /// Obtiene un rubro de la cuota asociado al codigo de saldo de la mora.
        /// </summary>
        /// <param name="accrual">Objeto que contiene parametros de calculo de accrual.</param>
        /// <param name="fproceso">Fecha de proceso a la cual se obtiene un rurbo de la cuota.</param>
        /// <param name="mensaje">Numero de mensaje con el que se crea el rubro de accrual.</param>
        /// <returns></returns>
        private tcaroperacionrubro GetRubro(tcaraccrual accrual, int fproceso, string mensaje) {
            tcaroperacionrubro rubro = TcarOperacionRubroDal.FindPorCodigoSaldo(lrubroscuota, accrual.csaldoaccrual);
            if (rubro == null) {
                // Crea el rubro de mora tipo accrual
                rubro = TcarOperacionRubroDal.CreaRubro(cuota, accrual.csaldoaccrual, 0, fproceso, true);
                rubro.mensaje = mensaje;
                crearubro = true;
                Sessionef.Save(rubro);
            }
            return rubro;
        }

        /// <summary>
        /// Metodo que entrega la tasa default a aplicar en cuotas que paso su fecha de vencimiento.
        /// </summary>
        /// <param name="accrual">Objeto que contiene el codigo de saldo asociado al accrual.</param>
        /// <param name="rubro">Objeto que contiene la tasa de la cuota.</param>
        /// <returns></returns>
        private decimal? GetTasaMora(tcaraccrual accrual, int fproceso) {
            decimal? tasa = null;
            int diasvencido = Fecha.Resta365(fproceso, (int)cuota.fvencimiento);
            // Si existe un rubro de mora previamente calculado.
            tcaroperacionrubro rubroMora = TcarOperacionRubroDal.FindPorCsaldoStart(this.lrubroscuota, "MORA");
            if ((rubroMora != null) && (rubroMora.tasa != null)) {
                tasa = (decimal)rubroMora.tasa;
                return tasa;
            }

            tcartasamora mora = TcarTasaMoraDal.Find(accrual.csaldoaccrual, accrual.cestatus);

            // tasa del rubro de interes normal de cartera.
            tasa = this.GetTasa(mora);

            // La tasa de mora se calcula con la tasa de interes de la cuota.
            tcartasamorarangos tcarTasaMoraRangos = TcarTasaMoraRangosDal.Find(diasvencido);

            tasa = Tasa.GetTasa((decimal)tasa, tcarTasaMoraRangos.margen, tcarTasaMoraRangos.operador);
            return (decimal)tasa;
        }

        /// <summary>
        /// Entrega la tasa de mora del rubro interes. Si no esta migrado toma la tasa de la operacion.
        /// </summary>
        /// <param name="mora"></param>
        /// <returns></returns>
        private decimal? GetTasa(tcartasamora mora) {
            decimal? tasa = null;

            // SI existe un registro de interes que no este pagado.
            tcaroperacionrubro rubroInteres = TcarOperacionRubroDal.FindPorCodigoSaldo(this.lrubroscuota, mora.csaldointeres);
            if ((rubroInteres != null) && (rubroInteres.tasa != null)) {
                tasa = rubroInteres.tasa;
                return tasa;
            }

            // Busca en la base de datos un registro de interes pagado
            tcaroperacionrubro r = TcarOperacionRubroDal.FindPorNumcuotaSaldo(this.cuota.coperacion, this.cuota.numcuota, mora.csaldointeres);
            if ((r != null) && (r.tasa != null)) {
                tasa = r.tasa;
                return tasa;
            }

            // Busca en la base de datos un registro de interes pagado
            tcaroperacionrubro rint = TcarOperacionRubroDal.FindPorNumcuotaSaldo(this.cuota.coperacion,this.cuota.numcuota, EnumSaldos.INTERES.GetCsaldo());
            if ((rint != null) && (rint.tasa != null)) {
                tasa = rint.tasa;
                return tasa;
            }
            // si el rubro interes esta pagado y es el primer calulo de la mora toma la tasa de la operacion.
            tasa = this.tcaroperacion.tasa;
            return tasa;

        }

        /// <summary>
        /// Metodo que entrega la definicion TcarOperacionTasa para un tipo de saldo grupo de balance.
        /// </summary>
        /// <param name="csaldo">Objeto con el tipo de saldo y grupo de balance a calcular intereses.</param>
        /// <returns>TcarOperacionTasa</returns>
        public tcaroperaciontasa GetTasaOperacion(String csaldo) {
            tcaroperaciontasa tasa = null;
            foreach (tcaroperaciontasa obj in ltasas) {
                if (obj.csaldo.CompareTo(csaldo) != 0) {
                    continue;
                }
                tasa = obj;
                break;
            }
            return tasa;
        }

        /// <summary>
        /// Verifica si la cuota tiene calculada mora.
        /// </summary>
        /// <returns></returns>
        public bool ExisteCalculoMora() {
            bool existe = false;
            tcaroperacionrubro rubro = TcarOperacionRubroDal.FindPorCodigoSaldo(lrubroscuota, "MORA-CAR");
            if (rubro != null) {
                existe = true;
            }
            return existe;
        }

        /// <summary>
        /// Contabliza mora de dias anteriores en el calculo.
        /// </summary>
        /// <param name="rqMantenimiento">Request de mantenimiento</param>
        /// <param name="monto">Monto a registrar en movimientos del accrual</param>
        /// <returns></returns>
        private void ContabilizarSaldoCalculado(RqMantenimiento rqMantenimiento, decimal monto) {
            if (rqMantenimiento == null) {
                return;
            }
            String accrualMora = TcarParametrosDal.Find("CONTABILIZA-ACCRUAL-MORA", rqMantenimiento.Ccompania).texto;
            if (!Constantes.EsUno(accrualMora)) {
                return;
            }
            RqMantenimiento rq = (RqMantenimiento)rqMantenimiento.Clone();
            tcarevento evento = TcarEventoDal.Find("CONTABILIZACION-ACCRUAL"); // 7-504
            rq.Cambiartransaccion((int)evento.cmodulo, (int)evento.ctransaccion);
            rq.Cmodulotranoriginal = rq.Cmodulo;
            rq.Ctranoriginal = rq.Ctransaccion;
            TransaccionRubro transaccionRubro = new TransaccionRubro((int)evento.cmodulo, (int)evento.ctransaccion);

            tmonrubro rubro = transaccionRubro.GetRubro("MORA-CAR");

            String codigocontable = null;   // Perfiles.getCodigoContableTipoCreditoSaldo(rubro.getCsaldo(), null, this.tcaroperacion.getCtipocredito(), this.tcaroperacion.getCestadooperacion());
            RubroHelper.AdicionarRubro(rq, rubro.crubro, codigocontable, monto, this.tcaroperacion.coperacion, this.tcaroperacion.cmoneda, null);

            // rubro par ejemplo ingresos o orden por contra
            tmonrubro rubropar = transaccionRubro.GetRubro(rubro.crubropar ?? 0);
            String codigocontablepar = null; // Perfiles.getCodigoContableTipoCreditoSaldo(rubropar.getCsaldo(), null, this.tcaroperacion.getCtipocredito(), this.tcaroperacion.getCestadooperacion());
            RubroHelper.AdicionarRubro(rq, rubro.crubropar ?? 0, codigocontablepar, monto, this.tcaroperacion.coperacion, this.tcaroperacion.cmoneda, null);

            // Ejecuta la transaccion monetaria anidada.
            ComprobanteMonetario monetario = new ComprobanteMonetario();
            monetario.Ejecutar(rq);
        }

    }
}
