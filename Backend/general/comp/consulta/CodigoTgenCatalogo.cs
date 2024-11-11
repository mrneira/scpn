using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using dal.generales;
using util.dto;
using core.log;
namespace general.comp.consulta
{
  public  class CodigoTgenCatalogo : ComponenteConsulta
    {
        /// <summary>
        /// Metodo que consulta una imagen y la devuelve en Base64
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            int cmodulo = rqconsulta.Cmodulo;
            List<Dictionary<string, object>> lresp = new List<Dictionary<string, object>>();
            if (rqconsulta.Response.ContainsKey("CODIGONUEVO") && rqconsulta.Response["CODIGONUEVO"] != null)
            {
                lresp = (List<Dictionary<string, object>>)rqconsulta.Response["CODIGONUEVO"];
            }

            Response resp = rqconsulta.Response;
            
            Dictionary<string, object> ldatosresp = new Dictionary<string, object>();
            ldatosresp["CCATALOGO"] = TgenCatalogoDal.NuevoCodigo(cmodulo);
            lresp.Add(ldatosresp);
            //// Fija la respuesta en el response. La respuesta contiene los la respuesta.
            rqconsulta.Response["CODIGONUEVO"] = lresp;
        }
        

    }
}
