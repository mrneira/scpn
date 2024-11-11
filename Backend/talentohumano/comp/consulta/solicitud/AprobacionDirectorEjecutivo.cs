using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using modelo;
using dal.talentohumano;
using talentohumano.datos;

namespace talentohumano.comp.consulta.solicitud
{
    public class AprobacionDirectorEjecutivo : ComponenteConsulta
    {
        /// <summary>
        /// Busqueda del listado actual de solicitudes por tipo de solicitud
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            //consulta todas las solicitudes para la opción aprobar director ejecutivo
            IList<tnomsolicitud> solbusqueda = TnomSolicitudDal.FindDE(false);

            IList<tnomsolicitud> solicitudes = Solicitud.completarDatos(solbusqueda);
            rqconsulta.Response["SOLICITUDES"] = solicitudes;

        }

    }
}
