using amortizacion.dto;
using amortizacion.helper;
using cartera.enums;
using core.componente;
using core.servicios;
using dal.cartera;
using dal.contabilidad;
using dal.generales;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.datos {

    /// <summary>
    /// Clase que se encarga de manejar una solicitud de credito.<br>
    /// Ejemplo validaar datos de solicitudes, completar datos de la solictudes, generar tablas de amortizacion.
    /// </summary>
    public class Solicitud {

        /// <summary>
        /// Objeto que almacena datos de una solicitud de credito.
        /// </summary>
        private tcarsolicitud tcarsolicitud;

        /// <summary>
        /// Lista de tasas con las que se genera la tabla de pagos de una solicitud.
        /// </summary>
        private List<tcarsolicitudtasa> ltasas;

        /// <summary>
        /// Lista de cargos a incluir en la tabla de amortizacion.
        /// </summary>
        private List<tcarsolicitudcargostabla> lcargostabla;

        public tcarsolicitud Tcarsolicitud { get => tcarsolicitud; set => tcarsolicitud = value; }
        public List<tcarsolicitudtasa> Ltasas { get => ltasas; set => ltasas = value; }
        public List<tcarsolicitudcargostabla> Lcargostabla { get => lcargostabla; set => lcargostabla = value; }

        /// <summary>
        /// Crea una instancia de Operacion.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que almacena datos de una operacion de cartera.</param>
        public Solicitud(tcarsolicitud tcarsolicitud)
        {
            this.tcarsolicitud = tcarsolicitud;
        }

        /// <summary>
        /// Metodo que completa los datos de la solicitud con los datos del producto.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que almacena datos de una operacion de cartera.</param>
        /// <returns></returns>
        public void CompletaDatosdelProducto()
        {
            TcarSolicitudDal.CompletaDatosdelProducto(tcarsolicitud);
        }

        /// <summary>
        /// Metodo que se encarga de generar la tabla de pagos asociada a la solicitud.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <returns>List<Cuota></returns>
        public List<Cuota> GenerarTabla(RqMantenimiento rqmantenimiento)
        {
            Parametros p = GetParametrosTabla(rqmantenimiento);
            amortizacion.helper.Tabla t = TablaHelper
            .GetInstancia(TcarTipoTablaAmortizacionDal.Find((int)tcarsolicitud.ctabla).clase);

            List<amortizacion.dto.Cuota> lcuota = t.Generar(p);
            tcarsolicitud.plazo = (t.GetPlazo());
            tcarsolicitud.fvencimiento = (t.GetFvencimiento());
            return lcuota;
        }

        /// <summary>
        /// Entrega un objeto con los parametros requeridos para generar una tabla de pagos.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <returns>Parametros</returns>
        public Parametros GetParametrosTabla(RqMantenimiento rqmantenimiento)
        {
            Parametros p = new Parametros();
            p.Monto = (decimal)tcarsolicitud.monto;
            p.Numerocuotas = tcarsolicitud.numerocuotas;
            // Si tiene valor de cuota fija la tabla se genera con este valor de cuota.
            p.Valorcuota = tcarsolicitud.valorcuota;
            p.Cuotainicio = 1;
            p.Finiciopagos = tcarsolicitud.finiciopagos;
            p.Diapago = tcarsolicitud.diapago;
            p.Cfrecuencia = tcarsolicitud.cfrecuecia;
            p.Diasfrecuencia = TgenFrecuenciaDal.Find((int)p.Cfrecuencia).dias;
            p.Cmoneda = tcarsolicitud.cmoneda;
            int? plazo = rqmantenimiento.GetInt("plazo");
            if (plazo != null && plazo > 0) {
                p.Plazo = plazo;
            }
            p.Basedecalculo = BaseDeCalculo.GetBaseDeCalculo(tcarsolicitud.cbasecalculo);
            // Si la solicitud no tiene una fecha de generacion de la tabla, se genera con la fecha contable.
            p.Fgeneraciontabla = tcarsolicitud.fgeneraciontabla != null ? (int)tcarsolicitud.fgeneraciontabla : rqmantenimiento.Fconatable;
            p.DiascuotaIndependiente = TcarParametrosDal.GetInteger("DIAS-CUOTA-INDEPENDIENTE", rqmantenimiento.Ccompania);
            p.DiaCuotaMesSiguiente = TcarParametrosDal.GetInteger("DIA-CUOTA-MES", rqmantenimiento.Ccompania);

            // Lista de tasas con las que se genera la tabla.
            p.Tasas = GetTasas((decimal)p.Monto);
            // lista de cargos fijos a adicionar en la tabla de amortizacion.
            p.Cargos = GetCargos(rqmantenimiento);
            p.Mesnogeneracuota = tcarsolicitud.mesnogeneracuota;
            p.Cuotasgracia = tcarsolicitud.cuotasgracia;
            // Rubros de arreglo de pago a adicionar a la tabla.
            if (rqmantenimiento.GetDatos("MSALDOS-ARREGLO-PAGOS-TABLA") != null) {
                p.Marreglopago = (Dictionary<string, decimal>)rqmantenimiento.GetDatos("MSALDOS-ARREGLO-PAGOS-TABLA");
            }

            return p;
        }
        /// <summary>
        /// Lista de tasas con las que se genera la tbala de amortizacion.
        /// </summary>
        /// <param name="monto">Monto sobre el cual se genera la tabla de amortizacion, se utiliza para verificar si genera feci en la tabla de amortizacion.</param>
        /// <returns>List<Tasas></returns>
        private List<Tasas> GetTasas(decimal monto)
        {
            if (ltasas == null) {
                ltasas = (List<tcarsolicitudtasa>)TcarSolicitudTasaDal.Find(tcarsolicitud.csolicitud);
            }
            List<Tasas> lt = new List<Tasas>();
            foreach (tcarsolicitudtasa obj in ltasas) {
                if ((obj.csaldo == "FECI") && (monto <= 5000)) {
                    // en panama creditos menores a 5000 no pagan feci.
                    continue;
                }
                Tasas t = new Tasas();
                t.SetCsaldo(obj.csaldo);
                t.SetCsaldocapital(EnumSaldos.CAPITAL.GetCsaldo());
                t.SetTasa(obj.tasa);
                lt.Add(t);
            }
            return lt;
        }

        /// <summary>
        /// Lista de cargos que se adiciona a la tabla de amortizacion.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <returns>List<Cargos></returns>
        private List<Cargos> GetCargos(RqMantenimiento rqmantenimiento)
        {
            List<Cargos> lc = new List<Cargos>();
            if (lcargostabla == null || lcargostabla.Count == 0) {
                lcargostabla = GetListaCargos(rqmantenimiento);
            }

            if (lcargostabla == null || lcargostabla.Count == 0) {
                return lc;
            }
            IDictionary<string, decimal?> maux = new Dictionary<string, decimal?>();

            // acumula valores por tipo de saldo.
            foreach (tcarsolicitudcargostabla obj in lcargostabla) {
                if (obj.monto == null || obj.monto <= Constantes.CERO) {
                    continue;
                }
                decimal? val = !maux.ContainsKey(obj.csaldo) ? Constantes.CERO : maux[obj.csaldo];
                val = val + (decimal)obj.monto;
                maux[obj.csaldo] = val;
            }

            foreach (string key in maux.Keys) {
                Cargos c = new Cargos();
                c.Csaldo = (key);
                c.Valor = (decimal)maux[key];
                lc.Add(c);
            }
            return lc;
        }

        /// <summary>
        /// Ebtrega lista de cargos a incluir en la tabla de pagos.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con los datos de entrada.</param>
        /// <returns>List<TcarSolicitudCargosTablaDto></returns>
        private List<tcarsolicitudcargostabla> GetListaCargos(RqMantenimiento rqmantenimiento)
        {
            if (!tcarsolicitud.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion)) {
                return null;
            }

            List<IBean> leliminados = null;
            List<IBean> lcargos = null;
            if (rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA") != null && rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA").Lregeliminar.Count > 0) {
                leliminados = rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA").Lregeliminar.Cast<IBean>().ToList();
            }
            if (rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA") != null && rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA").Lregistros.Count > 0) {
                lcargos = rqmantenimiento.GetTabla("TCARSOLICITUDCARGOSTABLA").Lregistros.Cast<IBean>().ToList();
            }
            List<tcarsolicitudcargostabla> lbasedatos = TcarSolicitudCargosTablaDal.Find(tcarsolicitud.csolicitud);
            List<tcarsolicitudcargostabla> lfinal = DtoUtil.GetMergedList(lbasedatos.Cast<IBean>().ToList(), lcargos, leliminados).Cast<tcarsolicitudcargostabla>().ToList();
            return lfinal;
        }
    }
}
