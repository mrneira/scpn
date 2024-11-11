using amortizacion.tabla.util;
using cartera.comp.mantenimiento.util;
using cartera.contabilidad;
using cartera.datos;
using cartera.enums;
using cartera.monetario;
using dal.cartera;
using dal.generales;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.traslados.helper {

    public class TrasladoHelper {

        /// <summary>
        /// Request con el que se ejecuta la transaccion de cambio de estado.
        /// </summary>
        protected RqMantenimiento rqMantenimiento;

        /// <summary>
        /// Objeto que contiene los datos de una operacion de cartera.
        /// </summary>
        protected Operacion operacion;

        /// <summary>
        /// Fecha en la que se ejecuta los traslados o castigos de la cartera.
        /// </summary>
        protected int fproceso;

        /// <summary>
        /// C castigo, T Traslado o paso a vencido.
        /// </summary>
        protected String tipo;

        /// <summary>
        /// true, cambia de estado cuotas futuras, false solo cambia estado cuotas que ya llego a la fecha de vencimiento.
        /// </summary>
        protected Boolean cambiaestadocuotasfuturas = true;

        /// <summary>
        /// Numero de decimales de la moneda de la operacion.
        /// </summary>
        private int decimales;

        /// <summary>
        /// Map que almacena acumulados de creditos con los que se da de baja el capital.
        /// </summary>
        protected Dictionary<string, Monetario> mcreditoacumulados = new Dictionary<string, Monetario>();

        /// <summary>
        /// Map que almacena acumulados de debitos con los que se da de alta contable en el nuevo estatus.
        /// </summary>
        protected Dictionary<string, Monetario> mdebitoacumulados = new Dictionary<string, Monetario>();

        /// <summary>
        /// Objeto que contiene los perfiles contables de cartera.
        /// </summary>
        private Perfiles perfiles;
        /// <summary>
        /// Codigo contable de la prime cuota que se castiga.
        /// </summary>
        public String codigoContableDolar;

        /// <summary>
        /// Metodo que inicializa datos de una operacion de cartera.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        protected void Inicializar(RqMantenimiento rqMantenimiento)
        {
            this.rqMantenimiento = rqMantenimiento;
            // encera rubros para evitar que se ejecuten con la nueva transaccion.
            this.rqMantenimiento.EncerarRubros();
            operacion = OperacionFachada.GetOperacion(rqMantenimiento);
            decimales = TgenMonedaDal.GetDecimales(operacion.tcaroperacion.cmoneda);
            perfiles = new Perfiles(operacion.tcaroperacion);
            try {
                String aux = TcarParametrosDal.GetValorTexto("CAMBIAESTADO-CUOTASFUTURAS", operacion.tcaroperacion.ccompania ?? 0);
                if (tipo.Equals("T") && aux != null && aux.Equals("0")) {
                    cambiaestadocuotasfuturas = false;
                }
            }
            catch (AtlasException e) {
                if (!(e.Codigo.Equals("BCAR-0022") || e.Codigo.Equals("BCAR-0021"))) {
                    throw e;
                }
            }

        }

        /// <summary>
        /// Metodo que se encarga de realizar el cambio de estado de una cuota.
        /// </summary>
	    protected void ProcesaCuota(tcaroperacioncuota cuota, String cestatusdestino, Boolean cuotasporvencer)
        {
            Boolean cambiarestado = true;
            if (cuotasporvencer && !cambiaestadocuotasfuturas) {
                cambiarestado = false;
            }
            List<tcaroperacionrubro> lrubros = new List<tcaroperacionrubro>();
            lrubros.AddRange(cuota.GetRubros());
            foreach (tcaroperacionrubro rubro in lrubros) {
                if (rubro.esaccrual ?? false) {

                    ProcesaAccrual(cuota, rubro, cestatusdestino);
                } else {
                    // Solo hace traslados de capital no de seguros o otros rubros de la taba de amortizacion.
                    if (EjecutarSaldo(rubro)) {

                        ProcesaSaldos(cuota, rubro, cestatusdestino);
                    }
                }
            }
            if (cambiarestado) {
                // Genera historia y cambia de estatus a la cuota
                TcarOperacionCuotaHistoriaDal.RegistraHistoria(cuota, fproceso, rqMantenimiento.Mensaje, cestatusdestino.Equals(EnumEstatus.CASTIGADA.Cestatus));
                cuota.cestatus = cestatusdestino;
            }
        }

        private void ProcesaAccrual(tcaroperacioncuota cuota, tcaroperacionrubro rubro, String cestatusdestino)
        {
            if (cuota.cestatus.Equals(EnumEstatus.NO_DEVENGA.Cestatus) && cestatusdestino.Equals(EnumEstatus.VENCIDA.Cestatus)) {
                // si esta en no devenga y pasa a vencido no hacer nada ya que NDV ya contabiliza en cuentas de orden.
                // retornar para que no pase a vigente el interes.
                return;
            }

            tcarcambioestado tcarCambioEstado = TcarCambioEstadoDal.Find(tipo, rubro.csaldo);
            if (tcarCambioEstado == null) {
                return;
            }

            // cuotas que tenagn un valor de intereses y contabiliza en el nuevo codigo contable.
            Decimal saldo = TcarOperacionRubroDal.GetSaldoAccrual(cuota, rubro, fproceso, decimales);
            if (saldo.CompareTo(Decimal.Zero) > 0) {
                AdicionarRubroAccrual(tcarCambioEstado, cuota, rubro, saldo, cestatusdestino);
            }

            // Historia del registro
            TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fproceso, rqMantenimiento.Mensaje, cestatusdestino.Equals(EnumEstatus.CASTIGADA.Cestatus), decimales);
            // cambia de codigo de saldo si esta definido un rubro destino en tcarCambioEstado.
            // realiza un persist al em
            tcaroperacionrubro rubronuevo = TcarOperacionRubroDal.CambiarCodigoSaldo(rubro, tcarCambioEstado);
            if (rubronuevo != null) {
                // si cambia de csaldo actualiza lista de rubros de la cuota.
                List<tcaroperacionrubro> lrubros = cuota.GetRubros();
                lrubros.Remove(rubro);
                lrubros.Add(rubronuevo);
            }

        }

        /// <summary>
        /// Metodo que ejecuta el cambio de estatus de rubros tipo saldo.
        /// </summary>
        private void ProcesaSaldos(tcaroperacioncuota cuota, tcaroperacionrubro rubro, String cestatusdestino)
        {
            // Castigo de capital.
            if (cestatusdestino.Equals(EnumEstatus.CASTIGADA.Cestatus) && rubro.csaldo.StartsWith("CAP")) {
                this.ProcesaCastigoCapital(cuota, rubro, cestatusdestino);
                return;
            }
            tcarcambioestado tcarCambioEstado = TcarCambioEstadoDal.Find(tipo, rubro.csaldo);
            // Permite hacer cambio de estato de todoss los tipo SALDO. ejemplo capital, cxc
            // si no esta definido indica que no se hace afectacion contable en los tipo SALDO.
            if (tcarCambioEstado == null) {
                return;
            }
            // Historia del registro
            TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fproceso, rqMantenimiento.Mensaje, false, decimales);

            MonetarioAcumuladoCartera.AcumulaenMapEstatus(rubro, mcreditoacumulados, cuota.cestatus, tcarCambioEstado.crubrocredito);

            // cambia de codigo de saldo si esta definido un rubro destino en tcarCambioEstado.
            tcaroperacionrubro rubronuevo = TcarOperacionRubroDal.CambiarCodigoSaldo(rubro, tcarCambioEstado);
            if (rubronuevo != null) {
                // si cambia de csaldo actualiza lista de rubros de la cuota.
                List<tcaroperacionrubro> lrubros = cuota.GetRubros();
                lrubros.Remove(rubro);
                lrubros.Add(rubronuevo);
            } else {
                rubronuevo = rubro;
            }

            String cestatusoriginalcuota = cuota.cestatus;
            cuota.cestatus = cestatusdestino;
            // La cartera castigada do maneja codigos contables por bandas.
            if (cestatusdestino.CompareTo(EnumEstatus.CASTIGADA.Cestatus) != 0) {
                int cbanda = TcarOperacionCuotaDal.Cambiobanda(operacion.tcaroperacion, cuota, fproceso);
                cuota.cbanda = cbanda;
            }
            rubronuevo.codigocontable = TmonSaldoDal.Find(rubronuevo.csaldo).codigocontable;

            // cambia de codigo banda y codigo contable.
            perfiles.RemplazaTipoProductoSaldo(cuota, rubronuevo, fproceso);
            MonetarioAcumuladoCartera.AcumulaenMapEstatus(rubronuevo, mdebitoacumulados, cuota.cestatus,
                        tcarCambioEstado.crubrodebito);

            // Regresa la cuota al estatado original.
            cuota.cestatus = cestatusoriginalcuota;
        }

        /// <summary>
        /// Metodo que ejecuta el cambio de estatus de rubros tipo saldo.
        /// </summary>
        private void ProcesaCastigoCapital(tcaroperacioncuota cuota, tcaroperacionrubro rubro, String cestatusdestino)
        {
            tcarcambioestado tcarCambioEstado = TcarCambioEstadoDal.Find(tipo, rubro.csaldo);
            if (this.codigoContableDolar == null) {
                this.codigoContableDolar = rubro.codigocontable;
            }
            // Historia del registro
            TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fproceso, rqMantenimiento.Mensaje, true, decimales);

            MonetarioAcumuladoCartera.AcumulaenMapEstatus(rubro, mcreditoacumulados, cuota.cestatus, tcarCambioEstado.crubroreversocredito);

            // cambia de codigo de saldo si esta definido un rubro destino en tcarCambioEstado.
            tcaroperacionrubro rubronuevo = TcarOperacionRubroDal.CambiarCodigoSaldo(rubro, tcarCambioEstado);
            if (rubronuevo != null) {
                // si cambia de csaldo actualiza lista de rubros de la cuota.
                List<tcaroperacionrubro> lrubros = cuota.GetRubros();
                lrubros.Remove(rubro);
                lrubros.Add(rubronuevo);
            } else {
                rubronuevo = rubro;
            }

            // La cartera castigada do maneja codigos contables por bandas.
            if (cestatusdestino.CompareTo(EnumEstatus.CASTIGADA.Cestatus) != 0) {
                int cbanda = TcarOperacionCuotaDal.Cambiobanda(operacion.tcaroperacion, cuota, fproceso);
                cuota.cbanda = cbanda;
            }
            rubronuevo.codigocontable = TmonSaldoDal.Find(rubronuevo.csaldo).codigocontable;
        }

        /// <summary>
        /// Objeto que confiene la informacion de un rubro de una cuota.
        /// </summary>
        private Boolean EjecutarSaldo(tcaroperacionrubro rubro)
        {
            Decimal? saldo = rubro.saldo;
            if ((saldo == null) || (saldo <= Decimal.Zero) || !rubro.csaldo.Contains("CAP-")) {
                return false;
            }
            return true;
        }

        /// <summary>
        /// Metodo que se encarga de adicioanr al request monetario los rubros de reverso de interes en el estatus actual y la cnatbailizacion en
        /// el nuevo estatus.
        /// </summary>
        private tcarcambioestado AdicionarRubroAccrual(tcarcambioestado tcarCambioEstado, tcaroperacioncuota cuota, tcaroperacionrubro rubro, Decimal monto, String esatusdestino)
        {
            // baja del interes de las cuenta actuales
            AdicionaPorRubro(tcarCambioEstado.crubroreversocredito ?? 0, monto, cuota.cestatus);
            AdicionaPorRubro(tcarCambioEstado.crubroreversodebito ?? 0, monto, cuota.cestatus);
            // contabiliza accrual en nuevas cuentas.
            AdicionaPorRubro(tcarCambioEstado.crubrodebito ?? 0, monto, esatusdestino);
            AdicionaPorRubro(tcarCambioEstado.crubrocredito ?? 0, monto, esatusdestino);
            return tcarCambioEstado;
        }

        /// <summary>
        /// Adiciona un rubro de accrual al request monetario.
        /// </summary>
        private void AdicionaPorRubro(int crubro, Decimal monto, String cestatus)
        {
            // reverso del accrual de las cuenta actuales y contabiliza en cuentas de orden
            RubroHelper.AdicionarRubro(rqMantenimiento, crubro, monto, operacion.tcaroperacion.coperacion, operacion.tcaroperacion.cmoneda, cestatus);
        }

        /// <summary>
        /// Entrega objeto con informacion de una operacion de cartera.
        /// </summary>
        /// <returns></returns>
        public tcaroperacion GetTcarOperacion()
        {
            return this.operacion.tcaroperacion;
        }

    }
}
