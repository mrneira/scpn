using core.componente;
using dal.tesoreria;
using modelo;
using System.Collections.Generic;
using System.Data;
using util.dto;
using util.dto.consulta;

namespace tesoreria.comp.consulta.bce.operativocontable
{

    /// <summary>
    /// Clase que se encarga de consultar datos personales.
    /// </summary>
    public class DetalleMovimientos : ComponenteConsulta {
        /// <summary>
        /// Consulta datos basicos de la empresa.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            int cempresa = int.Parse(rqconsulta.Mdatos["cempresa"].ToString());
            int fecha = int.Parse(rqconsulta.Mdatos["fecha"].ToString());
            string tipotransaccion = rqconsulta.Mdatos["tipotransaccion"].ToString();
            DataTable dt = OperativoContableDal.FindDetalleMovimientos(cempresa, fecha, tipotransaccion);
            resp["MOVIMIENTOS"] = dt;
        }
    }
}

