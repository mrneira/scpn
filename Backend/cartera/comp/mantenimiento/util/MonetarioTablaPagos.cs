using amortizacion.tabla.util;
using cartera.contabilidad;
using cartera.datos;
using cartera.enums;
using dal.cartera;
using dal.generales;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.mantenimiento;
namespace cartera.comp.mantenimiento.util {

    /// <summary>
    /// Clase que se encarga de ejecutar transaccion monetaria cuando se geenra una tabla de pagos, ejemplo 
    /// desembolso, pago extraordinario, reajsute de tasa de operaciones de credito.
    /// </summary>
    public class MonetarioTablaPagos {

        /// <summary>
        /// Request de entrada con el que se ejecuta la transaccion monetaria de desembolso.
        /// </summary>
        private RqMantenimiento rqmantenimiento = null;

        /// <summary>
        /// Clase que se encarga de acumular montos por codigo contable y ejecutar monetarios acumulados.
        /// </summary>
        private MonetarioAcumuladoCartera monetarioacumuladocartera;

        /// <summary>
        /// Metodo que se encarga de ejecutar la transaccion monetaria.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion monetaria.</param>
        /// <param name="cevento">Codigo de evento con el que se obtiene la transaccion monetaria a ejecutar.</param>
        public MonetarioTablaPagos(RqMantenimiento rqmantenimiento, string cevento)
        {
            this.rqmantenimiento = rqmantenimiento;
            monetarioacumuladocartera = new MonetarioAcumuladoCartera();
            // La tabla de amortizacion esta dentro de la clase Operacion, cada cuota tiene una lista de rubros asociados.
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcaroperacion tcarOperacion = operacion.Tcaroperacion;

            // Verifica si genera historia de cuota y rubro
            Boolean generahistoria = cevento.Equals(EnumEventos.DESEMBOLSO.Cevento) ? true : false;
            List<tcaroperacioncuota> lcuotas = operacion.Lcuotas;
            if (lcuotas == null) {
                return;
            }
            foreach (tcaroperacioncuota cuota in lcuotas) {
                if (cuota.fpago == null) {
                    this.Acumulaporcodigocontable(tcarOperacion, cuota, generahistoria);
                }
            }
            // Ejecuta transaccion monetaria.
            monetarioacumuladocartera.EjecutaMonetario(rqmantenimiento, operacion.tcaroperacion, cevento);
        }

        /// <summary>
        /// Metodo que acumula valores a contabilizar en el desembolso por codigo contable.
        /// </summary>
        /// <param name="cuota">Objeto que contiene datos de cuota con sus rubros.</param>
        private void Acumulaporcodigocontable(tcaroperacion tcarOperacion, tcaroperacioncuota cuota, Boolean generahistoria)
        {
            // manejo de historia de la operacion, el estatus se maneja en el registro vigente.
            if (generahistoria) {
                TcarOperacionCuotaHistoriaDal.RegistraHistoria(cuota, rqmantenimiento.Fconatable, rqmantenimiento.Mensaje, true);
            }

            cuota.mensaje = rqmantenimiento.Mensaje;
            foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros()) {
                //SE CREA EL SALDO PARA TODOS LOS RUBROS CUANDO ES UNA NEGOCIACIÓN DE PAGOS
                if (!tcarOperacion.cestadooperacion.Equals(EnumEstadoOperacion.ORIGINAL.CestadoOperacion))
                {
                    tmonsaldo tmonsaldo = TmonSaldoDal.Find(rubro.csaldo);
                    // Crea registros de historia de todos los rubros de la cuota para reversos.
                    if (generahistoria)
                    {
                        TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, rqmantenimiento.Fconatable, rqmantenimiento.Mensaje, true, TgenMonedaDal.GetDecimales(tcarOperacion.cmoneda));
                    }
                    // todos los rubros necesitan un mensaje para reversos.
                    rubro.mensaje = rqmantenimiento.Mensaje;
                    // Unicamente contabiliza saldos pendientes.
                    decimal saldo = (decimal)rubro.saldo - (decimal)rubro.cobrado - (decimal)rubro.descuento;
                    if (saldo != 0)
                    {
                        // Codigo contable unicamente del capital
                        rubro.codigocontable = tmonsaldo.codigocontable;
                        // Resolucion de perfiles contables.
                        Perfiles perfiles = new Perfiles(tcarOperacion);
                        perfiles.Procesar(cuota, rubro, rqmantenimiento.Fconatable);
                        // acumula valores por codigo contable para ejecutar monetarios con valores acumulados.
                        monetarioacumuladocartera.AcumulaenMap(cuota, rubro);
                        rubro.mensaje = rqmantenimiento.Mensaje;
                    }
                }
                else
                {
                    tmonsaldo tmonsaldo = TmonSaldoDal.Find(rubro.csaldo);
                    // Crea registros de historia de todos los rubros de la cuota para reversos.
                    if (generahistoria)
                    {
                        TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, rqmantenimiento.Fconatable, rqmantenimiento.Mensaje, true, TgenMonedaDal.GetDecimales(tcarOperacion.cmoneda));
                    }
                    // todos los rubros necesitan un mensaje para reversos.
                    rubro.mensaje = rqmantenimiento.Mensaje;
                    if (tmonsaldo.ctiposaldo.Equals("CAP"))
                    {
                        // Codigo contable unicamente del capital
                        rubro.codigocontable = tmonsaldo.codigocontable;
                        // Resolucion de perfiles contables.
                        Perfiles perfiles = new Perfiles(tcarOperacion);
                        perfiles.Procesar(cuota, rubro, rqmantenimiento.Fconatable);
                        // acumula valores por codigo contable para ejecutar monetarios con valores acumulados.
                        monetarioacumuladocartera.AcumulaenMap(cuota, rubro);
                        rubro.mensaje = rqmantenimiento.Mensaje;
                    }
                    else
                    {
                        // UNicamente contabiliza capital.
                        continue;
                    }
                }

            }
        }
    }

}