using core.componente;
using dal.cartera;
using dal.generales;
using System;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;
using modelo;
using dal.persona;
using System.Linq;
using util;
using dal.monetario;
using cartera.enums;

namespace cartera.comp.consulta.solicitud {

    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar la tabla de amortizacion de una solicitud. 
    /// La tabla de pagos entrega en una List<Dictionary<String, Object>>
    /// </summary>
    public class TablaPagos : ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            long csolicitud = long.Parse(rqconsulta.Mdatos["csolicitud"].ToString());
            List<tcarsolicitudcuota> lcuota = TcarSolicitudCuotaDal.Find(csolicitud).Cast<tcarsolicitudcuota>().ToList();
            TcarSolicitudCuotaDal.CompletaRubros(lcuota, TcarSolicitudRubroDal.Find(csolicitud).Cast<tcarsolicitudrubro>().ToList());
            // Lista de respuesta con la tabla de pagos
            List<Dictionary<String, Object>> lresp = new List<Dictionary<String, Object>>();
            foreach (tcarsolicitudcuota cuota in lcuota) {
                Dictionary<String, Object> mresponse = TablaPagos.CuotaToMap(cuota);
                lresp.Add(mresponse);
            }
            // Fija la respuesta en el response. La respuesta contiene la tabla de pagos.
            rqconsulta.Response["TABLA"] = lresp;
        }

        /// <summary>
        /// Crea un map con los datos de una cuota a entregar al cliente.
        /// </summary>
        /// <param name="cuota">Objeto que contiene los datos de una cuota asociada a una solicitud de credito.</param>
        /// <returns></returns>
        public static Dictionary<String, Object> CuotaToMap(tcarsolicitudcuota cuota)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            Dictionary<string, Decimal> mtotales = new Dictionary<string, Decimal>();
            m["num"] = cuota.numcuota;
            m["dias"] = cuota.dias;
            m["fven"] = Fecha.GetFechaPresentacion(cuota.fvencimiento ?? 0);
            m["fvencimiento"] = Fecha.GetFechaPresentacionAnioMesDia(cuota.fvencimiento ?? 0);
            m["cred"] = cuota.capitalreducido;
            List<tcarsolicitudrubro> lrubroscuota = (List<tcarsolicitudrubro>)cuota.GetDatos("rubros");
            m["cvalor"] = lrubroscuota.Find(x => x.csaldo.Equals(EnumSaldos.CAPITAL.GetCsaldo())).valorcuota;

            // Acumula rubros de acuerdo al tipo de saldo. Capital, Interes, Seguros, Comisiones, Cargos.
            Dictionary<String, Decimal> mtiposaldo = TablaPagos.AcumulaPorTipoSaldo((List<tcarsolicitudrubro>)cuota.GetDatos("rubros"));
            Decimal valorcuota = Decimal.Zero;
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
            }
            m.Add("valcuo", valorcuota);

            Decimal totalcuo = !mtotales.ContainsKey("valcuo") ? Decimal.Zero : mtotales["valcuo"];
            totalcuo = Decimal.Add(totalcuo, valorcuota);
            mtotales["valcuo"] = totalcuo;
            return m;
        }

        /// <summary>
        /// Acumula valores en un map por tipo de saldo, de los rubros de una cuota.
        /// </summary>
        /// <param name="lrubro">Lista de rubos asociados a la cuota.</param>
        /// <returns></returns>
        private static Dictionary<String, decimal> AcumulaPorTipoSaldo(List<tcarsolicitudrubro> lrubro)
        {
            Dictionary<String, decimal> mtiposaldo = new Dictionary<String, decimal>();
            foreach (tcarsolicitudrubro obj in lrubro) {
                tmonsaldo saldo = TmonSaldoDal.Find(obj.csaldo);
                decimal? valor = mtiposaldo.ContainsKey(saldo.ctiposaldo) ? mtiposaldo[saldo.ctiposaldo] : Constantes.CERO;
                valor = valor + obj.valorcuota;
                mtiposaldo[saldo.ctiposaldo] = (decimal)valor;
            }
            return mtiposaldo;
        }
    }

}
