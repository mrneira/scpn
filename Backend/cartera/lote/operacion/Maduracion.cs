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
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace cartera.lote.operacion {
    /// <summary>
    /// Clase que se encarga de ejecutar maduracion de cartera.
    /// </summary>
    public class Maduracion : ITareaOperacion {

        /// <summary>
        /// Map que almacena acumulados de debitos con los nuevos codigos de banda.
        /// </summary>
        private Dictionary<string, Monetario> mdebitosacumulados = new Dictionary<string, Monetario>();

        /// <summary>
        /// Map que almacena acumulados de creditos con los codigos de banda a dar de baja.
        /// </summary>
        private Dictionary<string, Monetario> mcreditoacumulados = new Dictionary<string, Monetario>();
        /// <summary>
        /// Numero de decimales que maneja lo moneda de la operacion de cartera.
        /// </summary>
        private int decimales;

        private Perfiles perfiles;

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion)
        {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            tcaroperacion tcaroperacion = operacion.tcaroperacion;
            if (tcaroperacion.cestatus.Equals("CAN") || tcaroperacion.cestatus.Equals("APR")) {
                return;
            }
            decimales = TgenMonedaDal.GetDecimales(tcaroperacion.cmoneda);

            perfiles = new Perfiles(tcaroperacion);

            List<tcaroperacioncuota> lcuotas = operacion.GetLcuotas();

            foreach (tcaroperacioncuota cuota in lcuotas) {
                int cbanda = TcarOperacionCuotaDal.Cambiobanda(tcaroperacion, cuota, requestoperacion.Fconatble ?? 0);
                // Si no cambia de banda no hacer nada.
                if (cuota.cbanda == cbanda) {
                    continue;
                }
                tcaroperacionrubro rubro = TcarOperacionRubroDal.FindPorCodigoSaldo(cuota.GetRubros(), EnumSaldos.CAPITAL.GetCsaldo());
                if (rubro.saldo == null || rubro.saldo <= Decimal.Zero) {
                    continue;
                }
                // para madurar otro codigo de saldo obetner el rubro y llamar nuevamente al metodo manejarubro.
                Manejarubro(rqmantenimiento, requestoperacion, tcaroperacion, cuota, rubro, cbanda);
            }
            // ejecuta monetario.
            EjecutaMonetario(rqmantenimiento, tcaroperacion);
        }

        /// <summary>
        /// Acuma en map de tipo Monetario, valores a dar de baja contable de los rubros de codigos de banda anteriores, y los pasa a un nuevo
        /// codigo de banda.<br>
        /// Crea un map con los codigos contables anteriores.Crea historia del rubro.Cambia de codigo conatble. Crea un map con el nuevo codigo
        /// contable.
        /// </summary>
        private void Manejarubro(RqMantenimiento rq, RequestOperacion rqoperacion, tcaroperacion tcaroperacion, tcaroperacioncuota cuota,
                tcaroperacionrubro rubro, int cbanda)
        {
            // actualiza creditos en el map para dar de baja contablemente por acumulados.
            MonetarioAcumuladoCartera.AcumulaenMap(rubro, mcreditoacumulados);
            // Genera hsitoria del rubro.
            TcarOperacionCuotaHistoriaDal.RegistraHistoria(cuota, rqoperacion.Fconatble ?? 0, rq.Mensaje, false);
            TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, rqoperacion.Fconatble ?? 0, rq.Mensaje, false, decimales);

            cuota.cbanda = cbanda;
            rubro.codigocontable = TmonSaldoDal.Find(rubro.csaldo).codigocontable;
            // cambia de codigo banda y codigo contable.
            perfiles.RemplazaRango(cuota, rubro, rq.Fconatable);

            // actualiza debitos en el map con los nuevos codigos contables.
            MonetarioAcumuladoCartera.AcumulaenMap(rubro, mdebitosacumulados);
        }

        /// <summary>
        /// Metodo que se encarga de ejecutar transacciones monetarias.
        /// </summary>
        private void EjecutaMonetario(RqMantenimiento rqmantenimiento, tcaroperacion tcaroperacion)
        {
            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
            tcarevento tce = MonetarioHelper.FijaTransaccion(rq, EnumEventos.MADURACION.Cevento);
            rq.Cmodulotranoriginal = (int)tce.cmodulo;
            rq.Ctranoriginal = (int)tce.ctransaccion;
            rq.EncerarRubros();

            // credito para dar de baja los valores actuales.
            AdicionaRubros(rq, tcaroperacion, mcreditoacumulados, 1);
            // Debito para registrar los nuevos codigos contables.
            AdicionaRubros(rq, tcaroperacion, mdebitosacumulados, 2);
            // ejecuta monetario.
            MonetarioHelper.EjecutaMonetario(rq);
        }

        /// <summary>
        /// Recorre el map Monetario, que contien informacion para crear y adiciona un rubro al request de mantenimeinto.
        /// </summary>
        private void AdicionaRubros(RqMantenimiento rq, tcaroperacion tcaroperacion, Dictionary<string, Monetario> mmonetario, int crubro)
        {
            foreach (KeyValuePair<string, Monetario> entry in mmonetario) {
                RubroHelper.AdicionarRubro(rq, crubro, entry.Value.GetCodigocontable(), entry.Value.GetValor(), tcaroperacion.coperacion, tcaroperacion.cmoneda, null);
            }
        }


    }
}
