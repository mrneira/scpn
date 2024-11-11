using cartera.contabilidad;
using cartera.datos;
using dal.cartera;
using dal.monetario;
using general.util;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace cartera.lote.migracion {
    /// <summary>
    /// Clase que se encarga de completar datos en operaciones de cartera migradas.
    /// </summary>
    public class CompletarDatosOperacion : ITareaOperacion {

        private tcaroperacion tcarOperacion;
        private int fcontable;
        private int? fvencimiento;
        private datos.Operacion operacion;

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            this.fcontable = rqmantenimiento.Fconatable;
            this.operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            this.tcarOperacion = this.operacion.Tcaroperacion;

            this.CompletarCuotas(operacion.GetLcuotas());
            this.CompletarOperacion();
            // calcula mora en las cuotas pasadas no calcula saldo de los dias anteriores.

        }

        private void CompletarOperacion()
        {
            this.tcarOperacion.fvigencia = this.tcarOperacion.fapertura;
            if ((this.fvencimiento != null) && (this.tcarOperacion.cestatus != "CAN")) {
                this.tcarOperacion.fvencimiento = this.fvencimiento;
            }

            int plazo = Fecha.Resta365((int)this.tcarOperacion.fvencimiento, (int)this.tcarOperacion.fapertura);
            if (this.tcarOperacion.valorcuota == null) {
                this.tcarOperacion.valorcuota = 0;
            }

            // Calcula tasa efectiva
            IList<tcaroperaciontasa> ltasas = TcarOperacionTasaDal.Find(this.tcarOperacion.coperacion);
            foreach (tcaroperaciontasa t in ltasas) {
                decimal tasaefectiva = Tasa.GetTasaEfectiva(t.tasa, (int)this.tcarOperacion.cfrecuecia);
                t.tasaefectiva = tasaefectiva;
            }

            // Cuentas por Cobrar
            operacion.GetLCuentasPorCobrar();
        }

        private void CompletarCuotas(IList<tcaroperacioncuota> lcuotas)
        {
            int? finicio = this.tcarOperacion.fapertura;
            foreach (tcaroperacioncuota tcarOperacionCuota in lcuotas) {
                this.fvencimiento = tcarOperacionCuota.fvencimiento;
                this.CompletarCuota(tcarOperacionCuota, (int)finicio);
                finicio = tcarOperacionCuota.fvencimiento;
            }
        }


        private void CompletarCuota(tcaroperacioncuota cuota, int finicio)
        {
            // cuota.setFinicio(finicio);
            //cuota.setDias(this.getDias(cuota));
            //cuota.setDiasreales(Fecha.Resta365(cuota.getFvencimiento(), cuota.getFinicio()));
            if (this.tcarOperacion.cestatus.Equals("CAN")) {
                cuota.fpago = cuota.fvencimiento; // las cuotas canceladas se marcan compo pagadas.
                this.MarcarPagoRubros(cuota);
                return;
            } else {
                // competa informacion de los rubros de la cuota.
                this.CompletarRubros(cuota);
            }
        }


        private int GetDias(tcaroperacioncuota cuota)
        {
            int dias = 0;
            bool diascomerciales = true;
            if (this.tcarOperacion.cbasecalculo.Contains("365/")) {
                diascomerciales = false;
            }
            if (diascomerciales) {
                dias = Fecha.Resta360((int)cuota.fvencimiento, (int)cuota.finicio);
            } else {
                dias = Fecha.Resta365((int)cuota.fvencimiento, (int)cuota.finicio);
            }
            return dias;
        }


        private void MarcarPagoRubros(tcaroperacioncuota cuota)
        {
            if (cuota == null) {
                return;
            }
            List<tcaroperacionrubro> lrRubros = cuota.GetRubros();
            foreach (tcaroperacionrubro rubro in lrRubros) {
                if (rubro.fpago == null) {
                    rubro.fpago = cuota.fpago;
                }
            }
        }

        private void CompletarRubros(tcaroperacioncuota cuota)
        {
            List<tcaroperacionrubro> lrRubros = cuota.GetRubros();
            if ((cuota.fpago == null) && this.VerificarPagada(lrRubros)) {
                cuota.fpago = cuota.fvencimiento;
            }
            if (cuota.fpago != null) {
                return;
            }
            tcaroperacionrubro rubroCapital = TcarOperacionRubroDal.FindPorCodigoSaldo(lrRubros, "CAP-CAR");

            tmonsaldo tmonsaldo = TmonSaldoDal.Find("CAP-CAR");
            // Codigo contable unicamente del capital
            rubroCapital.codigocontable = tmonsaldo.codigocontable;
            // Resolucion de perfiles contables.
            Perfiles perfiles = new Perfiles(this.tcarOperacion);
            perfiles.Procesar(cuota, rubroCapital, this.fcontable);

            tcaroperacionrubro rubroMora = TcarOperacionRubroDal.FindPorCodigoSaldo(lrRubros, "MORA-CAR");
            if ((rubroMora != null) && (rubroMora.accrual == null)) {
                rubroMora.accrual = 0;
            }

            // manejo del rubro interes de la cuota.
            this.CompletaInteres(cuota, lrRubros, rubroCapital);
        }

        private bool VerificarPagada(List<tcaroperacionrubro> lrRubros)
        {
            bool pagada = true;
            foreach (tcaroperacionrubro rubro in lrRubros) {
                if (rubro.fpago == null) {
                    pagada = false;
                }
            }
            return pagada;
        }

        private void CompletaInteres(tcaroperacioncuota cuota, List<tcaroperacionrubro> lrRubros, tcaroperacionrubro rubroCapital)
        {
            foreach (tcaroperacionrubro rub in lrRubros) {

                if (!rub.csaldo.Equals("INT-CAR") && !rub.csaldo.Equals("FONDOCON")) {
                    continue;
                }

                tcaroperacionrubro rubroInteres = TcarOperacionRubroDal.FindPorCodigoSaldo(lrRubros, rub.csaldo);
                if (rubroInteres == null) {
                    continue;
                }
                rubroInteres.montoparaaccrual = cuota.capitalreducido;
                rubroInteres.accrual = 0;

                if (cuota.fvencimiento <= this.fcontable) {
                    if ((rubroInteres.fpago == null) && (rubroInteres.valorcuota <= (rubroInteres.cobrado + rubroInteres.descuento))) {
                        // si el valor cobrado es mayor al valor de la cuota de interes.
                        rubroInteres.fpago = this.fcontable;
                        continue;
                    }

                    if ((rubroInteres.fpago == null)) {
                        // En la migracion si el cobrado es mayor o igual al pagado tiene fpago
                        rubroInteres.saldo = rubroInteres.valorcuota;
                    }
                    continue; // Si la cuota esta vencida el accrual es cero.
                }

                decimal accrual = (decimal)rubroInteres.valorcuota / (int)cuota.diasreales;
                accrual = Math.Round(accrual / Constantes.UNO, 7, System.MidpointRounding.AwayFromZero);

                // getValorcuota().divide(new BigDecimal(cuota.getDiasreales()), 7, BigDecimal.ROUND_HALF_UP);
                rubroInteres.accrual = accrual;
                rubroInteres.saldo = 0; // Saldo en cero para que la aplicacion calcule el saldo hasta ayer.

                // la cuota actual actualiza el saldo del accrual y la fecha de vigencia del registro.
                if ((cuota.finicio < fcontable) && (cuota.fvencimiento >= this.fcontable)) {
                    rubroInteres.fvigencia = cuota.finicio;
                    //int fcalculo = fcontable; //Fecha.AdicionaDias365(fcontable, 1);
                    //decimal saldo = TcarOperacionRubroDal.GetSaldoAccrual(cuota, rubroInteres, fcalculo, 2);
                    //rubroInteres.saldo = saldo + rubroInteres.cobrado + rubroInteres.descuento;
                    //rubroInteres.fvigencia = this.fcontable;
                }

                // si la cuota esta vencida el accrual diario pasa a ser cero.
                if (cuota.fvencimiento <= this.fcontable) {
                    rubroInteres.accrual = 0;
                }
            }
        }

    }

}
