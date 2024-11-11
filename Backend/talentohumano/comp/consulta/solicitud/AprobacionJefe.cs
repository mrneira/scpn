using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using dal.talentohumano;
using modelo;
using dal.generales;
using talentohumano.datos;

namespace talentohumano.comp.consulta.solicitud
{
    public class AprobacionJefe : ComponenteConsulta
    {
        /// <summary>
        /// Busqueda del listado actual de solicitudes por tipo de solicitud
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta){

            if (rqconsulta.Mdatos.ContainsKey("cjefe")) {
                long cfuncionario = long.Parse(rqconsulta.Mdatos["cjefe"].ToString());
                //consulta todas las solicitudes para la opción aprobar Jefe
                IList<tnomsolicitud> solbusqueda = TnomSolicitudDal.FindJefe(false, cfuncionario);

            IList<tnomsolicitud> solicitudes = Solicitud.completarDatos(solbusqueda);
                rqconsulta.Response["SOLICITUDES"] = solicitudes;
            }
        }

    }
}
