using core.componente;
using dal.prestaciones;
using socio.datos;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace prestaciones.comp.consulta.socio {
    class Reincorporados : ComponenteConsulta {
        /// <summary>
        /// Clase que entrega los datos de los socios reincorporados
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Dictionary<string, object> m = new Dictionary<string, object>();
            decimal valor = 0;
            bool reincorporado = false;
            decimal? naportesm;
            int totalaportes = 0;
            int cumpleaportesminimos = 0;

            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];
            Socios socio = new Socios(cpersona, rqconsulta);
            reincorporado = socio.GetReincorporado();
            valor = socio.GetValorReincorporado();

            // Minimo de aportaciones
            totalaportes = socio.GetTotalAportes();
            naportesm = TpreParametrosDal.Find("CAN-MINIMA-APORTES").numero;
            if (totalaportes >= naportesm)
            {
                cumpleaportesminimos = 1;
            }
            m["totalaportes"] = totalaportes;
            m["aportesminimos"] = naportesm;
            m["cumpleaportesminimos"] = cumpleaportesminimos;

            // Reincorporado
            m["reincorporado"] = reincorporado;
            m["valor"] = valor;
            resp["REINCORPORADO"] = m;

            // Restricciones
            m = new Dictionary<string, object>();
            m["novedad"] = socio.GetNovedadRestriccion();
            resp["NOVEDADRESTRICCION"] = m;

            // RRO 20211104 --------------------------------------------------------------------------------------------------
            m["estado"] = socio.GetSocioNovedades("INA", new string[] { "15", "16", "17", "18" }) != null ? false : true;
            // RRO 20211104 --------------------------------------------------------------------------------------------------
        }
    }
}
