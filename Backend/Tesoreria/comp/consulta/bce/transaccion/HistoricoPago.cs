using core.componente;
using dal.tesoreria;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace tesoreria.comp.consulta.bce.transaccion
{

    /// <summary>
    /// Clase que se encarga de consultar datos personales.
    /// </summary>
    public class HistoricoPago : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos de la empresa.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long idtransaccion  = long.Parse(rqconsulta.Mdatos["ctestransaccion"].ToString());
            List<ttestransaccion> lhistorico = TtesTransaccionDal.FindSpiPorCodigoAll(idtransaccion);
            resp["HISTORICOPAGO"] = lhistorico;
        }
    }
}

