using core.util;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using util.dto;

namespace WebApiCore.Controllers {
    [RoutePrefix("api/values")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ValuesController : ApiController {
        [Route()]
        [HttpGet]

        public HttpResponseMessage Get() {
            var json = "{\"mdatos\":{},\"USUARIODETALLE\":{\"pagina\":0,\"cantidad\":10,\"filtro\":[{\"campo\":\"cpersona\",\"valor\":1},{\"campo\":\"pk_ccompania\",\"valor\":1},{\"campo\":\"pk_verreg\",\"valor\":0}],\"filtroEspecial\":[],\"subquery\":[],\"bean\":\"TsegUsuarioDetalleDto\",\"lista\":\"N\",\"orderby\":\"t.pk.cusuario\"},\"c\":\"1^1^1^ADMIN^9^ES^OFI^127.0.0.1^2^8\"}";
            try {
                //string json = "{\"mdatos\":{},\"USUARIODETALLE\":{\"pagina\":0,\"cantidad\":10,\"filtro\":[{\"campo\":\"Cpersona\",\"valor\":1},{\"campo\":\"Pk_Ccompania\",\"valor\":1},{\"campo\":\"Pk_Verreg\",\"valor\":0}],\"filtroEspecial\":[],\"subquery\":[],\"bean\":\"TsegUsuarioDetalleDto\",\"lista\":\"N\",\"orderby\":\"t.Pk.Cusuario\"},\"c\":\"1^1^1^ADMIN^9^ES^OFI^127.0.0.1^2^8\"}";
                //string json = "{\"CODIGOCONSULTA\":\"MENU\",\"crol\":\"0\",\"angular\":\"Y\",\"cmodulo\":\"2\",\"ctransaccion\":\"2\",\"c\":\"1^1^1^ADMIN^0^ES^OFI^127.0.0.1^2^2\"}";
                
                //Clase con codigo de consulta ejemplo ConsultaPrueba
                //Consulta consulta = new Consulta();
                //String resp = consulta.Ejecutar(json);
                var values = new string[] { json };
                return Request.CreateResponse(HttpStatusCode.OK, values.ToList());
            } catch (Exception e) {
                Response response = ManejadorExcepciones.GetMensajeResponse(e);
                string resp = JsonConvert.SerializeObject(response);
                var values = new string[] { resp };
                return Request.CreateResponse(HttpStatusCode.OK, values.ToList());
            }
        }
    }
}
