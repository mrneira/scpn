using canalesdigitales.enums;
using canalesdigitales.helper;
using core.componente;
using dal.canalesdigitales;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.consulta;

namespace canalesdigitales.comp.consulta.prestaciones {
    class SimulaPrestaciones : ComponenteConsulta {
       
        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();

        public override void Ejecutar(RqConsulta rqconsulta) {
            SimularPrestaciones(rqconsulta);
        }

        private void SimularPrestaciones(RqConsulta rqconsulta) {
            tcanusuario usuario = TcanUsuarioDal.Find(rqconsulta.Cusuariobancalinea, rqconsulta.Ccanal);
            string codigoConsulta = "SIMULARPRESTACIONES";

            RqConsulta rq = new RqConsulta();
            rq.Cmodulo = 28;
            rq.Ctransaccion = 205;
            rq.Ccanal = "OFI";
            rq.Ccompania = EnumGeneral.COMPANIA_COD;
            rq.Freal = Fecha.GetFechaSistema();
            rq.AddDatos("CODIGOCONSULTA", codigoConsulta);
            rq.Mdatos.Add("cpersona", usuario.cpersona);
            rq.Mdatos.Add("cdetalletipoexp", rqconsulta.GetString("cdetalletipoexp"));
            rq.Mdatos.Add("cdetallejerarquia", rqconsulta.GetString("cdetallejerarquia"));
            rq.Mdatos.Add("fechaalta", rqconsulta.GetDate("falta"));
            rq.Mdatos.Add("fechabaja", rqconsulta.GetDate("fbaja"));
            rq.Mdatos.Add("coeficiente", rqconsulta.GetDecimal("coeficiente"));
            rq.Mdatos.Add("ctipobaja", rqconsulta.GetInt("ctipobaja"));
            if (rqconsulta.Mdatos.ContainsKey("selectedValues")) {
                rq.Mdatos.Add("selectedValues", rqconsulta.Mdatos["selectedValues"]);
            }
            rq.Response = new Response();

            componenteHelper.ProcesaCodigoConsulta(rq, codigoConsulta);

            rqconsulta.Response.Add("SIMULACION", rq.Response["SIMULACION"]);
            rqconsulta.Response.Add("p_total", rq.Response["p_total"]);
            rqconsulta.Response.Add("BONIFICACION", rq.Response["BONIFICACION"]);

            // ConsultarAportes(rqconsulta, (long)usuario.cpersona);
        }

        //public void ConsultarAportes(RqConsulta rqconsulta, long cpersona) {
        //    RqConsulta rq = new RqConsulta();
        //    rq.Cmodulo = 28;
        //    rq.Ctransaccion = 203;
        //    rq.Ccanal = "OFI";
        //    rq.Ccompania = EnumGeneral.COMPANIA_COD;
        //    rq.Freal = Fecha.GetFechaSistema();
        //    rq.Mdatos.Add("cpersona", cpersona);
        //    rq.Response = new Response();

        //    componenteHelper.ProcesarComponenteConsulta(rq, EnumComponentes.APORTES_SOCIO);

        //    rqconsulta.Response.Add("APORTE", rq.Response["APORTE"]);
        //}
    }
}
