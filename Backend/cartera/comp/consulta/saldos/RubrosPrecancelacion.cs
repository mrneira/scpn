using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using dal.cartera;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.consulta;

namespace cartera.comp.consulta.saldos {

    /// <summary>
    /// Clase que se encarga de consultar por rubro valores a precancelar.
    /// </summary>
    public class RubrosPrecancelacion : ComponenteConsulta {

        decimal totalprecancelar = 0;

        /// <summary>
        /// Entrega el saldo a precancelar de una operacion.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            bool adicionarubro = true;
            decimal montorubro = 0;

            Operacion operacion = OperacionFachada.GetOperacion(rqconsulta);
            int fcobro = (int)rqconsulta.Fconatable;
            if (rqconsulta.Mdatos.ContainsKey("fcobro")) {
                fcobro = (int)rqconsulta.GetInt("fcobro");
            }
            Saldo saldo = new Saldo(operacion, fcobro);
            saldo.Calculacuotaencurso();

            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            List<tcaroperacioncuota> lcuotas = operacion.Lcuotas;
            foreach (tcaroperacioncuota cuota in lcuotas) {
                foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros()) {
                    adicionarubro = true;
                    montorubro = (decimal)rubro.saldo - (decimal)rubro.cobrado - (decimal)rubro.descuento;
                    if ((rubro.esaccrual != null && (bool)rubro.esaccrual) || rubro.fpago != null) {
                        if (rubro.GetPendiente().CompareTo(Decimal.Zero) <= 0) {
                            continue;
                        }
                        montorubro = rubro.GetPendiente();
                    }

                    // Verifica existencia de rubro en response
                    Dictionary<string, object> m = new Dictionary<string, object>();
                    foreach (Dictionary<string, object> r in lresp) {
                        if (r["csaldo"].ToString() == rubro.csaldo) {
                            r["monto"] = (decimal)r["monto"] + montorubro;
                            adicionarubro = false;
                            break;
                        }
                    }

                    if (adicionarubro) {
                        tmonsaldo tmonsaldo = TmonSaldoDal.Find(rubro.csaldo);
                        m.Add("ctiposaldo", tmonsaldo.ctiposaldo);
                        m.Add("csaldo", rubro.csaldo);
                        m.Add("nombre", tmonsaldo.nombre);
                        m.Add("monto", montorubro);
                        m.Add("mdatos", new Dictionary<string, object>());
                        lresp.Add(m);
                    }

                    totalprecancelar = totalprecancelar + montorubro;
                }
            }

            if (saldo.Cxp > 0) {
                Dictionary<string, object> p = new Dictionary<string, object>();
                p.Add("ctiposaldo", TmonSaldoDal.Find(EnumSaldos.CUENTAXPAGAR.GetCsaldo()).ctiposaldo);
                p.Add("csaldo", EnumSaldos.CUENTAXPAGAR.GetCsaldo());
                p.Add("nombre", TmonSaldoDal.Find(EnumSaldos.CUENTAXPAGAR.GetCsaldo()).nombre);
                p.Add("monto", saldo.Cxp * (-1));
                p.Add("mdatos", new Dictionary<string, object>());
                lresp.Add(p);
                totalprecancelar = totalprecancelar - saldo.Cxp;
            }

            rqconsulta.Response["RUBROS"] = lresp;
            rqconsulta.Response.Add("TOTALPRECANCELACION", totalprecancelar);
        }

    }
}
