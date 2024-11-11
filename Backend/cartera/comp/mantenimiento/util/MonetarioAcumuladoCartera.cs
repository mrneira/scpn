using amortizacion.tabla.util;
using cartera.datos;
using cartera.enums;
using cartera.monetario;
using core.componente;
using dal.cartera;
using modelo;
using monetario.util.rubro;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.util {

    public class MonetarioAcumuladoCartera {

        /// <summary>
        /// Dictionary que almacena valores acumulados a registrar en movimientos de cartera, agrupado por codigo contable y codigo de saldo.
        /// </summary>
        private Dictionary<string, Monetario> macumulados = new Dictionary<String, Monetario>();

        /// <summary>
        /// Metodo que acumula al map el valor a conatbilizar por codigo contable, codigo de saldo.
        /// </summary>
        /// <param name="cuota"></param>
        /// <param name="rubro">Bean que contiene los datos de un rubro asociado a una cuota.</param>
        public void AcumulaenMap(tcaroperacioncuota cuota, tcaroperacionrubro rubro) {
            String key = rubro.codigocontable + "^" + rubro.csaldo + "^" + cuota.cestatus;
            Monetario monetario = null;
            if(macumulados.ContainsKey(key)) {
                monetario = macumulados[key];
            }
            if (monetario == null) {
                monetario = new Monetario(rubro.codigocontable, rubro.csaldo);
                monetario.SetCoperacion(rubro.coperacion);
                monetario.SetCestatus(cuota.cestatus);
            }
            decimal saldo = (decimal)rubro.saldo - (decimal)rubro.cobrado - (decimal)rubro.descuento;
            monetario.SetValor(saldo + monetario.GetValor());
            macumulados[key] = monetario;
        }

        /// <summary>
        /// Metodo que acumula al map el valor a conatbilizar por codigo contable, codigo de saldo.
        /// </summary>
        /// <param name="rubro">Bean que contiene los datos de un rubro asociado a una cuota.</param>
        /// <param name="macumulados">Dictionary que contiene valores acumualados, se tutiliza en maduracion, traslados</param>
        public static void AcumulaenMap(tcaroperacionrubro rubro, Dictionary<String, Monetario> macumulados) {
            MonetarioAcumuladoCartera.AcumulaenMapEstatus(rubro, macumulados, null, 0);
        }

        /// <summary>
        /// Metodo que acumula al map el valor a conatbilizar por codigo contable, codigo de saldo.
        /// </summary>
        /// <param name="tcarOperacionRubro">Bean que contiene los datos de un rubro asociado a una cuota.</param>
        /// <param name="macumulados">Dictionary que contiene valores acumualados, se tutiliza en maduracion, traslados</param>
        /// <param name="cestatus">Codigo de estatus.</param>
        /// <param name="crubro">Codigo de rubro asociado a una transaccióncon el que ejecuta ejecuta el monetario.</param>
        public static void AcumulaenMapEstatus(tcaroperacionrubro tcarOperacionRubro, Dictionary<String, Monetario> macumulados, String cestatus,
                int? crubro) {
            String key = tcarOperacionRubro.codigocontable + "^" + tcarOperacionRubro.csaldo;
            if (cestatus != null) {
                key = key + "^" + cestatus;
            }
            Monetario monetario = null;
            if(macumulados.ContainsKey(key)) {
                monetario = macumulados[key];
            }            
            if (monetario == null) {
                monetario = new Monetario(tcarOperacionRubro.codigocontable, tcarOperacionRubro.csaldo);
                monetario.SetCoperacion(tcarOperacionRubro.coperacion);
                if (crubro != null) {
                    monetario.SetRubro((int)crubro);
                }

                if (cestatus != null) {
                    monetario.SetCestatus(cestatus);
                }
            }
            decimal saldo = (decimal)tcarOperacionRubro.saldo - (decimal)tcarOperacionRubro.cobrado - (decimal)tcarOperacionRubro.descuento;
            monetario.SetValor(saldo + monetario.GetValor());
            macumulados[key] = monetario;
        }

        /// <summary>
        /// Metodo que ejecuta el financiero para contabilizar la tabla de pagos, sin actulizar saldos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="tcaroperacion"></param>
        /// <param name="cevento"></param>
        public void EjecutaMonetario(RqMantenimiento rqmantenimiento, tcaroperacion tcaroperacion, String cevento) {
            tcarevento evento = MonetarioHelper.FijaTransaccion(rqmantenimiento, cevento);
            TransaccionRubro trubro = new TransaccionRubro((int)evento.cmodulo, (int)evento.ctransaccion);

            foreach (KeyValuePair<String, Monetario> itr in macumulados) {
                Monetario monetario = itr.Value;
                tmonrubro tmonrubro = null;
                tmonrubro = trubro.GetRubro(monetario.GetCsaldo());
                if (tmonrubro != null) {
                    RubroHelper.AdicionarRubro(rqmantenimiento, (int)tmonrubro.crubro, monetario.GetCodigocontable(),
                            monetario.GetValor(), tcaroperacion.coperacion, tcaroperacion.cmoneda, monetario.GetCestatus());
                    if (tmonrubro.crubropar != null) {
                        RubroHelper.AdicionarRubro(rqmantenimiento, (int)tmonrubro.crubropar, monetario.GetValor(), tcaroperacion.coperacion,
                                tcaroperacion.cmoneda, monetario.GetCestatus());
                    }
                }
            }
            MonetarioHelper.EjecutaMonetario(rqmantenimiento);
        }

        /// <summary>
        /// Metodo que adiciona rubros asociados a una transaccion de cambio de estatus, puede ser traslado o castigo.
        /// </summary>
        /// <param name="rqMantenimiento">Request de manteniemiento al que se adiciona rubros.</param>
        /// <param name="macumulados">Dictionary que contiene los valores con los que se crea un TmonRubro.</param>
        /// <param name="tcarOperacion">Objeto que contiene los datos de una operacion de cartera.</param>
        public static void AdicionarRubrosCambioEstado(RqMantenimiento rqMantenimiento, Dictionary<String, Monetario> macumulados,
                tcaroperacion tcarOperacion) {
            foreach (KeyValuePair<String, Monetario> itr in macumulados) {
                Monetario monetario = itr.Value;
                RubroHelper.AdicionarRubro(rqMantenimiento, monetario.GetRubro(), monetario.GetCodigocontable(), monetario.GetValor(),
                        tcarOperacion.coperacion, tcarOperacion.cmoneda, monetario.GetCestatus());
            }
        }

        /// <summary>
        /// Metodo que adiciona rubros asociados a una transaccion de cambio de estatus, puede ser traslado o castigo.
        /// </summary>
        /// <param name="macumulados">Dictionary que contiene los valores con los que se crea un TmonRubro.</param>
        public static decimal GetValorTotal( Dictionary<String, Monetario> macumulados) {
            Decimal total = 0;
            foreach (KeyValuePair<String, Monetario> itr in macumulados) {
                Monetario monetario = itr.Value;
                total = total + monetario.GetValor();
            }
            return total;
        }
    }

}
