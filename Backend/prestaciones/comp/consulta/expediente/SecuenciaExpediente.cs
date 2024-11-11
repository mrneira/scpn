
using core.componente;
using dal.prestaciones;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;


namespace prestaciones.comp.consulta.expediente {
    /// <summary>
    /// Clase que se encarga de consultar en la base y entregar la tabla de aportaciones que tiene un socio. 
    /// Aportes entrega en una List<Dictionary<String, Object>>
    /// </summary>
    class SecuenciaExpediente :ComponenteConsulta {
        public override void Ejecutar(RqConsulta rqconsulta) {
            int? secuencia = 0;
            string cdetalletipoexp = rqconsulta.Mdatos["cdetalletipoexp"].ToString();
            int year = int.Parse(rqconsulta.Mdatos["year"].ToString());
            secuencia = TpreExpedienteDal.GetSecuenciaporTipoLiquidacion(cdetalletipoexp, year) + 1;
            Response resp = rqconsulta.Response;
            resp["SECUENCIA"] = secuencia;
        }
    }
}