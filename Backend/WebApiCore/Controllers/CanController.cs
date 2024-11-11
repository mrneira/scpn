using core;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using WebApiCore.Politicas;

namespace WebApiCore.Controllers {

    [PoliticaCorsCan]
    [RoutePrefix("atlas-core-can/servicioRest")]
    public class CanController : ApiController {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public HttpResponseMessage Options() {
            return new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        }

        private HttpResponseMessage EjecutarConsulta(string datos) {
            NameValueCollection headers = HttpContext.Current.Request.Headers;
            var sessionid = headers.Get("ext_sessionid");
            var clientIP = headers.Get("ext_clientIP");
            var userAgent = headers.Get("ext_userAgent");

            ServicioConsulta sc = new ServicioConsulta();
            sc.SessionId = sessionid;
            sc.UserAgent = userAgent;
            sc.Cterminalremoto = clientIP;
            String resp = sc.Consultar(datos);
            return this.GetResponse(resp);
        }

        private HttpResponseMessage EjecutarMantenimiento(string datos) {
            NameValueCollection headers = HttpContext.Current.Request.Headers;
            var sessionid = headers.Get("ext_sessionid");
            var clientIP = headers.Get("ext_clientIP");
            var userAgent = headers.Get("ext_userAgent");

            ServicioMantenimiento sm = new ServicioMantenimiento();
            sm.SessionId = sessionid;
            sm.UserAgent = userAgent;
            sm.Cterminalremoto = clientIP;
            String resp = sm.Mantener(datos);
            return this.GetResponse(resp);
        }

        [Route("consultar")]
        [HttpPost]
        public HttpResponseMessage Consultar([FromBody] JObject data) {
            return this.EjecutarConsulta(data.ToString());
        }

        [Route("mantener")]
        [HttpPost]
        public HttpResponseMessage Mantener([FromBody] JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

        private HttpResponseMessage GetResponse(string resp) {
            var response = new HttpResponseMessage() {
                Content = new StringContent(resp)
            };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            return response;
        }
    }
}
