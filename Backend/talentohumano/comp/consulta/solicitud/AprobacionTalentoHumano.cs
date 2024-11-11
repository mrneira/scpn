using core.componente;
using dal.talentohumano;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using talentohumano.datos;
using util.dto.consulta;

namespace talentohumano.comp.consulta.solicitud
{
    class AprobacionTalentoHumano : ComponenteConsulta
    {
        /// <summary>
        /// Busqueda del listado actual de solicitudes por tipo de solicitud
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

                //consulta todas las solicitudes para la opción aprobar Jefe
                IList<tnomsolicitud> solbusqueda = TnomSolicitudDal.FindTalentoHumano(true);
                IList<tnomsolicitud> solicitudes = Solicitud.completarDatos(solbusqueda);
                rqconsulta.Response["SOLICITUDES"] = solicitudes;
            }
        }

    
}
