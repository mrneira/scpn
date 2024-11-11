using core.componente;
using dal.cartera;
using dal.generales;
using System;
using System.Collections.Generic;
using util.dto.consulta;
using modelo;
using cartera.datos;
using util;
using dal.monetario;
using cartera.enums;

namespace cartera.comp.consulta.operacion {

    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar la tabla de amortizacion de una operacion de cartera.
    /// </summary>
    public class TablaPagos : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos de la operacion.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            String coperacion = rqconsulta.Coperacion;
            int fconsulta = rqconsulta.Fconatable;
            int decimales = TgenMonedaDal.GetDecimales(OperacionFachada.GetOperacion(coperacion, true).tcaroperacion.cmoneda);
            // Consulta cuotas con sus rubros.
            List<tcaroperacioncuota> lcuota = TcarOperacionCuotaDal.FindNoPagadas(coperacion);
            Dictionary<String, Decimal> mtotales = new Dictionary<String, Decimal>();
            // Lista de respuesta con la tabla de pagos
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            List<Dictionary<String, Decimal>> ltotales = new List<Dictionary<String, Decimal>>();
            foreach (tcaroperacioncuota cuota in lcuota) {
                Dictionary<string, object> mresponse = TablaPagos.CuotaToMap(cuota, mtotales, fconsulta, decimales, rqconsulta.Fconatable);
                lresp.Add(mresponse);
            }
            // Fija la respuesta en el response. La respuesta contiene la tabla de pagos.
            rqconsulta.Response.Add("TABLA", lresp);
            ltotales.Add(mtotales);
            rqconsulta.Response.Add("TOTALES", ltotales);
        }

        /// <summary>
        /// Crea un map con los datos de una cuota a entregar al cliente.
        /// </summary>
        public static Dictionary<string, object> CuotaToMap(tcaroperacioncuota cuota, Dictionary<string, Decimal> mtotales, int fconsulta,
            int decimales, int fcontable)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            m["num"] = cuota.numcuota;
            m["dias"] = cuota.dias;
            m["diasr"] = cuota.diasreales;
            m["estatus"] = cuota.cestatus;
            m["fven"] = Fecha.GetFechaPresentacion(cuota.fvencimiento ?? 0);
            m["fvencimiento"] = Fecha.GetFechaPresentacionAnioMesDia(cuota.fvencimiento ?? 0);
            m["cred"] = cuota.capitalreducido;
            m["abonoc"] = cuota.pagoextraordinario;
            m["ven"] = (cuota.fvencimiento <= fcontable) ? true : false;
            m["cvalor"] = TcarOperacionRubroDal.FindPorNumcuotaSaldo(cuota.coperacion, cuota.numcuota, EnumSaldos.CAPITAL.GetCsaldo()).valorcuota;

            // Acumula rubros de acuerdo al tipo de saldo. Capital, Interes, Seguros, Comisiones, Cargos.

            Dictionary<String, Decimal> mtiposaldo = TablaPagos.AcumulaPorTipoSaldo(cuota, cuota.GetRubros(), fconsulta, decimales);
            Decimal valorcuota = Decimal.Zero;
            Decimal valorapagar = Constantes.CERO;
            // Fija los valores en el map de respuesta.
            foreach (string key in mtiposaldo.Keys) {
                String keyaux = key.ToLower();
                Decimal value = mtiposaldo[key];
                m[keyaux] = value;
                Decimal tot = !mtotales.ContainsKey(keyaux) ? Decimal.Zero : mtotales[keyaux];
                tot = Decimal.Add(tot, value);
                mtotales[keyaux] = tot;
                if (!key.Equals("MOR") && !key.Equals("CXC")) {
                    valorcuota = Decimal.Add(valorcuota, value);
                }
                valorapagar = Decimal.Add(valorapagar, value);
            }
            m.Add("valcuo", valorcuota);
            m.Add("valpagar", valorapagar);

            Decimal totalcuo = !mtotales.ContainsKey("valcuo") ? Decimal.Zero : mtotales["valcuo"];
            totalcuo = Decimal.Add(totalcuo, valorcuota);
            mtotales["valcuo"] = totalcuo;

            Decimal totalpag = !mtotales.ContainsKey("valpagar") ? Decimal.Zero : mtotales["valpagar"];
            totalpag = Decimal.Add(totalpag, valorapagar);
            mtotales["valpagar"] = totalpag;
            return m;
        }

        /// <summary>
        /// Acumula valores en un map por tipo de saldo, de los rubros de una cuota.
        /// </summary>
        private static Dictionary<string, Decimal> AcumulaPorTipoSaldo(tcaroperacioncuota cuota, List<tcaroperacionrubro> lrubro, int fconsulta, int decimales)
        {
            Dictionary<string, Decimal> mtiposaldo = new Dictionary<string, Decimal>();
            foreach (tcaroperacionrubro obj in lrubro) {
                tmonsaldo saldo = TmonSaldoDal.Find(obj.csaldo);
                Decimal valor = mtiposaldo.ContainsKey(saldo.ctiposaldo) ? mtiposaldo[saldo.ctiposaldo] : 0;

                if (saldo.ctiposaldo.Equals("MOR")) {
                    valor = TcarOperacionRubroDal.GetSaldoAccrual(cuota, obj, fconsulta, decimales);
                } else {
                    if (cuota.fvencimiento > fconsulta) {
                        valor = Decimal.Add(valor, (obj.valorcuota - obj.descuento) ?? 0);
                    } else {
                        valor = Decimal.Add(valor, (obj.saldo - obj.cobrado - obj.descuento) ?? 0);
                    }
                }

                mtiposaldo[saldo.ctiposaldo] = valor;
            }
            return mtiposaldo;
        }



    }
}
