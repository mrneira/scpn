
using core.componente;
using dal.prestaciones;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using System.Data;
using util.dto;
using util.dto.consulta;


namespace prestaciones.comp.consulta.aportes {
    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar la tabla de aportaciones que tiene un socio. 
    /// Aportes entrega en una List<Dictionary<String, Object>>
    /// </summary>
    class Aportes : ComponenteConsulta {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            IList<Dictionary<string, object>> laportes = new List<Dictionary<string, object>>();
            IList<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            IList<Dictionary<string, object>> taportes = new List<Dictionary<string, object>>();
            Dictionary<string, object> total2 = new Dictionary<string, object>();
            Dictionary<string, object> Mparam = new Dictionary<string, object>();

            tpreparametros param = TpreParametrosDal.Find("CAN-MINIMA-APORTES");
            decimal? naportesm = param.numero;
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            taportes = TpreAportesDal.GetTotalAportes(cpersona);
            
            // Consultar el historico de carrera por estado del socio ---- 1 cod ALTA
            tsoccesantiahistorico hisalta = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, (int)rqconsulta.Ccompania, 1);
            // Consultar el historico de carrera por estado del socio ---- 3 cod BAJA
            tsoccesantiahistorico hisbaja = TsocCesantiaHistoricoDal.FindFordenToEstadoSocio(cpersona, (int)rqconsulta.Ccompania, 3);

            // Consultar el historico actual del socio
            tsoccesantiahistorico hisact = TsocCesantiaHistoricoDal.Find(cpersona, (int)rqconsulta.Ccompania);
            if (hisbaja == null) {
                hisbaja = hisact;
            }

            string tiemposervicio = util.Fecha.diff((DateTime)hisbaja.festado, (DateTime)hisalta.festado);
            decimal? total2002 = TpreAportesDal.GetTotalAportes2002(taportes);
            total2002 = (total2002 * 20) / 100;
            total2.Add("TOTAL2002", total2002);
            Mparam.Add("naportesm", naportesm);
            Mparam.Add("tservicio", tiemposervicio);
            taportes.Add(total2);
            taportes.Add(Mparam);
            laportes = TpreAportesDal.GetAportes(rqconsulta);
            ((List<Dictionary<string, object>>)lresp).AddRange(laportes);
            Response resp = rqconsulta.Response;
            resp["APORTES"] = lresp;
            resp["APORTE"] = taportes;
        }
    }
}
