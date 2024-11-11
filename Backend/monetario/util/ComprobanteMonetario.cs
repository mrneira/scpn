using dal.contabilidad;
using dal.monetario;
using modelo;
using modelo.helper.cartera;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.contable;
using util.servicios.ef;
using util.thread;

namespace monetario.util {
    public class ComprobanteMonetario {

        /// <summary>
        /// Datos del request con el cual se ejecuta una transaccion monetaria.
        /// </summary>
        private RqMantenimiento rqmantenimiento;

        /// <summary>
        /// Lista de rubros que forman parte de la transaccion monetaria.
        /// </summary>
        private List<Rubro> lrubros = new List<Rubro>();

        /// <summary>
        /// Lista de rubros que forman parte de la transaccion monetaria.
        /// </summary>
        private IList<tmoncomponentetransaccion> lcomponentetransaccion = new List<tmoncomponentetransaccion>();

        /// <summary>
        /// True indica que la transaccion se ejecuta en modo reverso, false la transaccion se ejecuta en modonormal.
        /// </summary>
        private bool reverso = false;
        /// <summary>
        /// Lista de movimientos a reverar.
        /// </summary>
        private List<Movimiento> lmovimientoreverso;

        /// <summary>
        /// Crea una instancia de ComprobanteMonetario, constructor utilizado en la ejecucion de transacciones internas o automaticas.
        /// </summary>
        public ComprobanteMonetario()
        {
        }

        /// <summary>
        /// Crea una instancia de ComprobanteMonetario.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de una transaccion monetaria.</param>
        public ComprobanteMonetario(RqMantenimiento rqmantenimiento)
        {
            Ejecutar(rqmantenimiento);
            // Ejecuta actividades de finalizacion de la transaccion, ejeplo calculo de accrual a la vista, promedios
            Finalizar();
        }

        /// <summary>
        /// Crea una instancia de ComprobanteMonetario.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de una transaccion monetaria.</param>
        /// <param name="lmovimientoreverso">Lista de movimientos a reversar.</param>
        public ComprobanteMonetario(RqMantenimiento rqmantenimiento, List<Movimiento> lmovimientoreverso)
        {
            this.lmovimientoreverso = lmovimientoreverso;
            Ejecutar(rqmantenimiento);
            // Ejecuta actividades de finalizacion de la transaccion, ejeplo calculo de accrual a la vista, promedios
            Finalizar();
        }

        public RqMantenimiento Rqmantenimiento { get => rqmantenimiento; set => rqmantenimiento = value; }
        public List<Rubro> Lrubros { get => lrubros; set => lrubros = value; }
        public IList<tmoncomponentetransaccion> Lcomponentetransaccion { get => lcomponentetransaccion; set => lcomponentetransaccion = value; }
        public bool Reverso { get => reverso; set => reverso = value; }
        public List<Movimiento> Lmovimientoreverso { get => lmovimientoreverso; set => lmovimientoreverso = value; }

        /// <summary>
        /// Metodo que se encarga de ejecutar una transaccion monetaria.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del request utilizado en la ejecucion de una transaccion monetaria.</param>
        public void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            this.rqmantenimiento = rqmantenimiento;
            reverso = this.rqmantenimiento.Reverso != "N" ? true : false;
            MonetarioUtil.LlenarFechas(rqmantenimiento);
            MonetarioUtil.LlenarTransaccionMonetaria(rqmantenimiento);
            if (reverso) {
                MonetarioUtil.Adicionarrubrosreverso(rqmantenimiento, lrubros, lmovimientoreverso);
            } else {
                MonetarioUtil.Adicionarrubrosnormal(rqmantenimiento, lrubros);
                // Calculo de impuestos cargos comisiones es un componente de que se define a nivel de transaccion.
            }

            // Ejecutar componentes moneratios de inicio, en vista uno de los componentes es calcular valor debito de la transaccion.
            MonetarioUtil.EjecutaComponentesInicio(this);
            Grabar();
        }

        private void Grabar()
        {
            foreach (Rubro rubro in lrubros) {
                Movimiento movimiento = rubro.Movimiento;
                if (!(bool)rubro.Tmonsaldo.registramovimiento || (rubro.Tmonrubro != null && !(bool)rubro.Tmonrubro.grabar)) {
                    continue;
                }
                if (!(movimiento is IBean)) {
                    continue;
                }
                // graba movimientos.
                GrabarMovimiento(movimiento, rubro);
                // verifica si el codigo de saldo indica que actualiza saldo.
                if (rubro.Tmonsaldo.actualizasaldo != null && (bool)rubro.Tmonsaldo.actualizasaldo) {
                    // Actualiza saldos de operaciones.
                    string coperacion = DtoUtil.GetValorCampoNoDto(movimiento, "coperacion").ToString();
                    if (coperacion == null) {
                        coperacion = "0"; // valor de default.
                    }
                    Saldo saldo = ThreadNegocio.GetDatos().GetInstanciaSaldo(rubro.Tmonsaldo.cmodulo, coperacion);
                    saldo.Actualizar(rqmantenimiento, rubro);
                }
            }
            // Ejecutar componentes monetarios de finalizacion de la transacciion.
            MonetarioUtil.EjecutaComponentesFinalizacion(this);
        }

        /// <summary>
        /// Almacena movimientos en las distintas tablas asociadas al modulo del movimiento.
        /// </summary>
        /// <param name="movimiento">OBjeto a grabar en la base de datos.</param>
        private void GrabarMovimiento(Movimiento movimiento, Rubro rubro)
        {
            if (movimiento.freal == null) {
                movimiento.freal = this.rqmantenimiento.Freal;
            }
            int sec = ThreadNegocio.GetDatos().Secuenciamonetario;
            movimiento.secmensaje = sec;
            Sessionef.Save((IBean)movimiento);
            sec = sec + 1;
            ThreadNegocio.GetDatos().Secuenciamonetario = sec;

            tconcatalogo ccatalogo = TconCatalogoDal.Find((int)movimiento.ccompania, movimiento.ccuenta);
            if (ccatalogo == null) {
                throw new AtlasException("BMON-019", "CUENTA CONTABLE NO DEFINIDA: {0} PARA EL RUBRO: {1}", movimiento.ccuenta, movimiento.csaldo);
            }
            movimiento.cclase = ccatalogo.cclase;
            EcuacionContable ec = ThreadNegocio.GetDatos().getEcuacionContable();
            bool esSaldoDeudor = TmonClaseDal.Find(movimiento.cclase).suma.Equals("D") ? true : false;
            bool suma = TmonClaseDal.Suma(movimiento.cclase, movimiento.debito);
            ec.ActualizarSaldo(movimiento.cclase, (decimal)movimiento.montomonedalocal, suma, ccatalogo.tipoplancdetalle, esSaldoDeudor);
            GrabaTmonMovimiento(movimiento);
        }

        /// <summary>
        /// Crea un regitro por modulo y numero de mensaje en la tabla TmonMovimiento.
        /// </summary>
        /// <param name="movimiento">OBjeto a grabar en la base de datos.</param>
        private void GrabaTmonMovimiento(Movimiento movimiento)
        {
            if (DtoUtil.GetValorCampoNoDto(movimiento, "cmodulo") == null || DtoUtil.GetValorCampoNoDto(movimiento, "coperacion") == null) {
                return;
            }
            int? cmodulo = (int)DtoUtil.GetValorCampoNoDto(movimiento, "cmodulo");
            string coperacion = DtoUtil.GetValorCampoNoDto(movimiento, "coperacion").ToString();
            if (coperacion != null || (cmodulo != null && (int)cmodulo == 4)) {
                TmonMovimientoDal.Crear(rqmantenimiento, (int)cmodulo, coperacion);
            }
        }

        /// <summary>
        /// Invoca al metodo finalizar en la clase que actualiza saldos, ejemplo de implemetacion en cuentas a la vista calculo de accrual.
        /// </summary>
        private void Finalizar()
        {
            // msaldos Map key modulo, value Map de saldos por operacion
            Dictionary<int, Dictionary<string, Saldo>> msaldos = ThreadNegocio.GetDatos().Msaldos;
            List<int> lmoduloprocesado = new List<int>();
            var smodulos = msaldos.Keys;
            foreach (int modulo in smodulos) {
                if (lmoduloprocesado.Contains(modulo)) {
                    continue;
                }
                lmoduloprocesado.Add(modulo);
                Dictionary<string, Saldo> moperacion = msaldos[modulo];
                // Ejecuta un solo finalizar por modulo.
                Saldo saldo = moperacion.Values.Last();
                saldo.Finalizar(rqmantenimiento);
            }
        }

    }
}
