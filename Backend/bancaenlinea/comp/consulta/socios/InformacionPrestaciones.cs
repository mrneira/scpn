using core.componente;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;
using socio.datos;

namespace bancaenlinea.comp.consulta.socios {

    /// <summary>
    /// Clase que se encarga de consultar datos de prestaciones.
    /// </summary>
    public class InformacionPrestaciones : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos de prestaciones.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];
            Socios socio = new Socios(cpersona, rqconsulta);
            List<Dictionary<string, object>> ldatos = new List<Dictionary<string, object>>();
            Dictionary<string, object> m = new Dictionary<string, object>();

            tsoccesantiahistorico hisbaja = socio.GetHistoricoSocioBaja();
            tsoccesantiahistorico hisalta = socio.GetHistoricoSocioAlta();
            tsoccesantiahistorico hisactual = socio.GetHistoricoSocioActual();
            tsoctipobaja tsoctipobaja = socio.GetTipoBaja();

            m["falta"] = hisalta.festado;
            m["fbaja"] = hisbaja != null ? hisbaja.festado : rqconsulta.Freal;
            m["festadoactual"] = hisactual.festado;
            m["tiemposervico"] = socio.GetTservicio();
            m["tipobaja"] = tsoctipobaja != null ? tsoctipobaja.nombre : string.Empty;
            m["totalaportes"] = socio.GetTotalAportes();
            m["acumuladoaportes"] = socio.GetAcumAportes();
            ldatos.Add(m);
            resp["DATOSPRESTACIONES"] = ldatos;
        }
    }
}

