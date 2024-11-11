using core;
using core.servicios.mantenimiento;
using core.util;
using modelo;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Specialized;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using util.dto;
using util.servicios.ef;
using WebApiCore.Politicas;

namespace WebApiCore.Controllers {

    [PoliticaCorsExt]
    [RoutePrefix("atlas-core-ext/servicioRest")]
    public class ExtController : ApiController {
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

        [Route("logout")]
        [HttpPost]
        public HttpResponseMessage Logout([FromBody] JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

        [Route("cambiocontrasenia")]
        [HttpPost]
        public HttpResponseMessage CambioContrasenia([FromBody] JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

        [Route("validacionotp")]
        [HttpPost]
        public HttpResponseMessage Validacionotp([FromBody] JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

        [Route("menu")]
        [HttpPost]
        public HttpResponseMessage Menu([FromBody] JObject data) {
            return this.EjecutarConsulta(data.ToString());
        }

        [Route("login")]
        [HttpPost]
        public HttpResponseMessage Login([FromBody] JObject data) {
            var context = HttpContext.Current;
            var sessionid = HttpContext.Current.Session.SessionID;
            var clientIP = HttpContext.Current.Request.UserHostAddress;
            Mantenimiento man = null;
            Response response = null;
            AtlasContexto contexto = new AtlasContexto();
            String resp = "";

            Sessionef.FijarAtlasContexto(contexto);
            using (var contextoTransaccion = contexto.Database.BeginTransaction()) {
                try {
                    man = new Mantenimiento();
                    man.SessionId = sessionid;
                    man.UserAgent = Request.Headers.UserAgent.ToString();
                    man.Cterminalremoto = clientIP;

                    response = man.Ejecutar(data.ToString());
                    contexto.SaveChanges();
                    contextoTransaccion.Commit();
                } catch (Exception ex) {
                    contextoTransaccion.Rollback();
                    response = ManejadorExcepciones.GetMensajeResponse(ex);
                } finally {
                    resp = JsonConvert.SerializeObject(response);
                    man.logtransaccion.grabarLogConCommit(man.Request, response, man.GetTiempo(), "M");
                    contextoTransaccion.Dispose();
                }
            }
            return this.GetResponse(resp);
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