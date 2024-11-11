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
    class ConsultaEmpleado : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (!rqconsulta.Mdatos.ContainsKey("cfuncionario")){
                return;
            }
            long cfuncionario = long.Parse(rqconsulta.Mdatos["cfuncionario"].ToString());
            IList<tnomsolicitud> solbusqueda = TnomSolicitudDal.FindEmpleado(true, cfuncionario);
            IList<tnomsolicitud> solicitudes = Solicitud.completarDatos(solbusqueda);
            rqconsulta.Response["SOLICITUDES"] = solicitudes;
        }
    }
}
