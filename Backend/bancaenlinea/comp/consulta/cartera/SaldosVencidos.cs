using cartera.comp.consulta.saldos;
using cartera.datos;
using cartera.enums;
using core;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Runtime.Remoting;
using util;
using util.dto;
using util.dto.consulta;

namespace bancaenlinea.comp.consulta.cartera {

    /// <summary>
    /// Clase que se encarga de consultar los saldos vencidos de cuotas que ya llegaron a una fecha de vencimiento.
    /// </summary>
    public class SaldosVencidos : ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta)
        {
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();

            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.GetDatos("cpersona");

            DateTime ffinmes = new DateTime(Fecha.GetFecha(rqconsulta.Fconatable).Year, Fecha.GetFecha(rqconsulta.Fconatable).Month + 1, 1).AddDays(-1);
            rqconsulta.Mdatos["ffvencimiento"] = Fecha.DateToInteger(ffinmes);

            String componente = "cartera.comp.consulta.saldos.RubrosVencidos";
            ComponenteConsulta c = null;
            decimal saldo = 0;

            IList<tcaroperacion> loperaciones = TcarOperacionDal.FindPorPersona(cpersona, true);
            List<Dictionary<string, object>> lsaldos = new List<Dictionary<string, object>>();
            foreach (tcaroperacion op in loperaciones) {
                rqconsulta.Coperacion = op.coperacion;
                string assembly = componente.Substring(0, componente.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, componente);
                object comp = handle.Unwrap();
                c = (ComponenteConsulta)comp;
                c.Ejecutar(rqconsulta);

                saldo = decimal.Parse(rqconsulta.Response["TOTALVENCIDO"].ToString());
                rqconsulta.Response.Remove("TOTALVENCIDO");

                Dictionary<string, object> m = new Dictionary<string, object>();
                m.Add("op", op.coperacion);
                m.Add("sal", saldo);
                lresp.Add(m);
            }

            rqconsulta.Response.Add("SALDOSOPERACION", lresp);
        }
    }
}
