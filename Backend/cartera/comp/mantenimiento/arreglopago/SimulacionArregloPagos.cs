using cartera.comp.mantenimiento.util;
using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.arreglopago {

    /// <summary>
    /// Clase que se encarga de simular la operación de arreglo de pago.
    /// </summary>
    public class SimulacionArregloPagos : ComponenteMantenimiento {
        /// <summary>
        /// Objeto que contiene rubros y saldos con los que se genera la nueva tabla de amortizacion.
        /// </summary>
        private List<object> mcobro;

        /// <summary>
        /// Genera nueva operacion como resultado del arreglo de pagos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            tcaroperacion tcaroperacionanterior = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;

            // Verifica existencia de arreglo de pagos
            List<tcaroperacionarreglopago> loperacionarreglo = TcarOperacionArregloPagoDal.Find(tcaroperacionanterior.coperacion);
            if (loperacionarreglo.Any()) {
                throw new AtlasException("CAR-0053", "YA EXISTE UN ARREGLO DE PAGOS PARA LA OPERACIÓN: {0}", tcaroperacionanterior.coperacion);
            }

            // Lista de rubros
            JArray rubros = (JArray)rqmantenimiento.GetDatos("ARREGLORUBROS");
            mcobro = rubros.ToList<object>();

            // Crea nueva operacion
            this.CrearNuevaOperacion(tcaroperacionanterior, rqmantenimiento);

            // Genera tabla de pagos
            TablaPagos tablapagos = new TablaPagos();
            tablapagos.Ejecutar(rqmantenimiento);
        }

        /// <summary>
        /// Crea nueva operacion de cartera resultado del arreglo de pagos.
        /// </summary>
        /// <param name="tcaroperacionanterior">Objeto que contiene informacion de la operacion anterior que se cancela en el arreglo de pagos.</param>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        private tcaroperacion CrearNuevaOperacion(tcaroperacion tcaroperacionanterior, RqMantenimiento rqmantenimiento)
        {
            string joper = JsonConvert.SerializeObject((tcaroperacion)tcaroperacionanterior.Clone());
            tcaroperacion tcaroperacionnueva = JsonConvert.DeserializeObject<tcaroperacion>(joper);
            // Genera numero de operacion de cartera.
            tcaroperacionnueva.coperacion = "99999999";
            tcaroperacionnueva.mensaje = rqmantenimiento.Mensaje;
            tcaroperacionnueva.mensajeanterior = null;
            tcaroperacionanterior.coperacionarreglopago = tcaroperacionnueva.coperacion;

            // Fija condiciones para generar tabla de amortizacion.
            this.FijaCondicionesOperacion(tcaroperacionnueva, rqmantenimiento);
            OperacionFachada.AddOperacion(tcaroperacionnueva);

            // Clona datos adicionales de tablas de la operacion anterior.
            this.ClonarTablasAdicionales(rqmantenimiento, tcaroperacionanterior.coperacion, tcaroperacionnueva.coperacion);

            // cambia la operacion del rqmantenimiento para la generacion de la nueva tabla de pagos.
            rqmantenimiento.Coperacion = tcaroperacionnueva.coperacion;
            return tcaroperacionnueva;
        }

        /// <summary>
        /// Clona tablas adicionales asociadas a la operacion de cartera a la que se realiza el arreglo de pagos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="coperacionanterior">Numero de operacion anterior.</param>
        /// <param name="coperacionnueva">Numero de la nueva operacion.</param>
        private void ClonarTablasAdicionales(RqMantenimiento rqmantenimiento, String coperacionanterior, String coperacionnueva)
        {
            TcarOperacionTasaDal.ClonarTcarOperacionTasaArregloPago(rqmantenimiento, coperacionanterior, coperacionnueva);
            TcarOperacionCargosTablaDal.ClonarTcarOperacionCargosTabla(rqmantenimiento, coperacionanterior, coperacionnueva);
            GetArregloPagosTabla(rqmantenimiento);
        }

        /// <summary>
        /// Fija condiciones de la operacion para generar la tabla de amortizacion.
        /// </summary>
        /// <param name="tcaroperacion">Objeto que contiene informacion de la operacion de cartera.</param>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        private void FijaCondicionesOperacion(tcaroperacion tcaroperacion, RqMantenimiento rqmantenimiento)
        {
            tcaroperacionarreglopago arregloPago = (tcaroperacionarreglopago)rqmantenimiento.GetTabla("TCAROPEARREGLOPAGO").Lregistros.ElementAt(0);
            tcartipoarreglopago tipoArregloPago = TcarTipoArregloPagoDal.Find(arregloPago.ctipoarreglopago);
            tcaroperacion.cestatus = "VIG";
            tcaroperacion.fapertura = rqmantenimiento.Fconatable;
            tcaroperacion.faprobacion = rqmantenimiento.Fconatable;
            tcaroperacion.cusuarioapertura = rqmantenimiento.Cusuario;
            tcaroperacion.cusuariodesembolso = rqmantenimiento.Cusuario;
            tcaroperacion.fcancelacion = null;
            tcaroperacion.cusuariocancelacion = null;

            tcaroperacion.cestadooperacion = tipoArregloPago.cestadooperacion;
            tcaroperacion.monto = decimal.Parse(arregloPago.Mdatos["monto"].ToString());
            tcaroperacion.cuotainicio = 1;
            tcaroperacion.fgeneraciontabla = rqmantenimiento.Fconatable;
            tcaroperacion.finiciopagos = arregloPago.finiciopagos;
            if (arregloPago.valorcuota != null) {
                tcaroperacion.valorcuota = arregloPago.valorcuota;
                tcaroperacion.numerocuotas = null;
            }
            if (arregloPago.numerocuotas != null) {
                tcaroperacion.numerocuotas = arregloPago.numerocuotas;
                tcaroperacion.valorcuota = null;
            }
        }

        /// <summary>
        /// Entrega el listado de saldos como gastos.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        private void GetArregloPagosTabla(RqMantenimiento rqmantenimiento)
        {
            Dictionary<string, decimal> lsaldos = new Dictionary<string, decimal>();

            foreach (JObject obj in this.mcobro) {
                IDictionary<string, object> m = obj.ToObject<Dictionary<string, object>>();
                if (m.ContainsKey("csaldodestino")) {
                    if (!(bool)m["pagoobligatorio"]) {
                        lsaldos[m["csaldodestino"].ToString()] = decimal.Parse(m["monto"].ToString());
                    }
                }
            }
            rqmantenimiento.AddDatos("MSALDOS-ARREGLO-PAGOS-TABLA", lsaldos);
        }

    }
}
