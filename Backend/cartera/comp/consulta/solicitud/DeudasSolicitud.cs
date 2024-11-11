using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using System.Linq;
using util.dto;
using util.dto.consulta;

namespace cartera.comp.consulta.solicitud {

    /// <summary>
    /// Clase que se encarga de consultar datos basicos de operaciones por persona
    /// </summary>
    public class DeudasSolicitud : ComponenteConsulta {
        /// <summary>
        /// Consulta de operaciones
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            List<tcarsolicitudconsolidado> ldetalle = TcarSolicitudConsolidadoDal.FindBySolicitud(cpersona).ToList();
            resp["DEUDASPORSOLICITUD"] = ldetalle;
        }

    }
}
