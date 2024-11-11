using core.componente;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;
using dal.tesoreria;

namespace tesoreria.comp.consulta.bce.empresa
{

    /// <summary>
    /// Clase que se encarga de consultar datos personales.
    /// </summary>
    public class InformacionEmpresa : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos de la empresa.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            int cempresa = int.Parse(rqconsulta.Mdatos["cempresa"].ToString());

            ttesempresa infoempresa = TtesEmpresaDal.Find(cempresa);
            List<ttesempresa> lempresa = new List<ttesempresa>();
            lempresa.Add(infoempresa);
            
            resp["INFORMACIONEMPRESA"] = lempresa;
        }
    }
}

