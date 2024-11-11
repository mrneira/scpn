using cartera.datos;
using cartera.enums;
using cartera.saldo;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.cartera {

    /// <summary>
    /// Clase que se encarga de consultar los saldos vencidos de cuotas que ya llegaron a una fecha de vencimiento.
    /// </summary>
    public class SaldosVencidos : ComponenteConsulta {

        decimal totalprecancelar = 0;

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.GetDatos("cpersona");
            int year = Fecha.GetFecha(rqconsulta.Fconatable).Year;
            int month = Fecha.GetFecha(rqconsulta.Fconatable).Month + 1;
            if (month > 12) {
                month = Constantes.UNO;
                year += Constantes.UNO;
            }

            DateTime ffinmes = new DateTime(year, month, 1).AddDays(-1);
            rqconsulta.Mdatos["ffvencimiento"] = Fecha.DateToInteger(ffinmes);

            IList<tcaroperacion> loperaciones = TcarOperacionDal.FindPorPersona(cpersona, true);
            List<Dictionary<string, object>> lsaldos = new List<Dictionary<string, object>>();
            foreach (tcaroperacion op in loperaciones) {
                if (!op.cestatus.Equals(EnumEstatus.APROVADA)) {
                    totalprecancelar = Constantes.CERO;
                    Operacion operacion = OperacionFachada.GetOperacion(op.coperacion, true);
                    int fcobro = Fecha.DateToInteger(ffinmes);
                    Saldo saldo = new Saldo(operacion, fcobro);
                    saldo.Calculacuotaencurso();

                    decimal montorubro = Constantes.CERO;
                    decimal totaldescuento = Constantes.CERO;
                    if (op.numerocuotas == operacion.Lcuotas[0].numcuota) {
                        totaldescuento = saldo.GetValorCuota(operacion.Lcuotas[0]);
                    } else {
                        totaldescuento = saldo.GetValorCuota(saldo.GetPrimracuotaFutura());
                    }
                    List<tcaroperacioncuota> lcuotas = operacion.Lcuotas;
                    foreach (tcaroperacioncuota cuota in lcuotas) {
                        foreach (tcaroperacionrubro rubro in (List<tcaroperacionrubro>)cuota.GetRubros()) {
                            montorubro = (decimal)rubro.saldo - (decimal)rubro.cobrado - (decimal)rubro.descuento;
                            if ((rubro.esaccrual != null && (bool)rubro.esaccrual) || rubro.fpago != null) {
                                if (rubro.GetPendiente().CompareTo(Decimal.Zero) <= 0) {
                                    continue;
                                }
                                montorubro = rubro.GetPendiente();
                            }
                            totalprecancelar = totalprecancelar + montorubro;
                        }
                    }

                    if (saldo.Cxp > 0) {
                        totalprecancelar = totalprecancelar - saldo.Cxp;
                    }

                    Dictionary<string, object> m = new Dictionary<string, object>();
                    m.Add("op", op.coperacion);
                    m.Add("des", totaldescuento);
                    m.Add("sal", totalprecancelar);

                    Saldo saldovencido = new Saldo(operacion, rqconsulta.Fconatable);
                    m.Add("ven", saldovencido.Totalpendientepago);
                    lresp.Add(m);
                }
            }

            rqconsulta.Response.Add("SALDOSOPERACION", lresp);
        }
    }
}
