using core.util;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using WebApiExt.Politicas;

namespace WebApiExt.Controllers {
    /*
    [PoliticaCorsMov]
    [RoutePrefix("atlas-ext-mov/servicioRest")]
    public class MovController : ApiController {

        string SRV_CORE = "http://localhost:8082";
        //string SRV_CORE = "http://172.16.20.146:8083";

        public HttpResponseMessage Options() {
            return new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        }

        private HttpResponseMessage GetResponse(string resp) {
            var response = new HttpResponseMessage() {
                Content = new StringContent(resp)
            };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            return response;
        }

        private HttpResponseMessage EjecutarConsulta(string datos) {
            string URL = SRV_CORE + "/atlas-core-ext/servicioRest/consultar";

            var context = HttpContext.Current;
            var sessionid = HttpContext.Current.Session.SessionID;
            var clientIP = HttpContext.Current.Request.UserHostAddress;
            var userAgent = HttpContext.Current.Request.UserAgent;

            string datastr = datos;
            string response = null;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
            NameValueCollection collHeader = context.Request.Params;
            request.Headers.Add("ext_sessionid", sessionid);
            request.Headers.Add("ext_clientIP", clientIP);
            request.Headers.Add("ext_userAgent", userAgent);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.ContentLength = datastr.Length;
            //request.CookieContainer.Add(context.Request.Cookies.Get(0));
            StreamWriter requestWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.ASCII);
            requestWriter.Write(datastr);
            requestWriter.Close();

            try {
                WebResponse webResponse = request.GetResponse();
                Stream webStream = webResponse.GetResponseStream();
                StreamReader responseReader = new StreamReader(webStream);
                response = responseReader.ReadToEnd();
                responseReader.Close();
            } catch (Exception e) {
                string resp = JsonConvert.SerializeObject(ManejadorExcepciones.GetMensajeResponse(e));
                return GetResponse(resp);
            }
            return GetResponse(response);
        }

        private HttpResponseMessage EjecutarMantenimiento(string datos) {
            string URL = SRV_CORE + "/atlas-core-ext/servicioRest/mantener";

            var context = HttpContext.Current;
            var sessionid = HttpContext.Current.Session.SessionID;
            var clientIP = HttpContext.Current.Request.UserHostAddress;
            var userAgent = HttpContext.Current.Request.UserAgent;

            string datastr = datos;
            string response = null;

            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(URL);
            request.Headers.Add("ext_sessionid", sessionid);
            request.Headers.Add("ext_clientIP", clientIP);
            request.Headers.Add("ext_userAgent", userAgent);
            request.Method = "POST";
            request.ContentType = "application/json";
            request.ContentLength = datastr.Length;
            StreamWriter requestWriter = new StreamWriter(request.GetRequestStream(), System.Text.Encoding.ASCII);
            requestWriter.Write(datastr);
            requestWriter.Close();

            try {
                WebResponse webResponse = request.GetResponse();
                Stream webStream = webResponse.GetResponseStream();
                StreamReader responseReader = new StreamReader(webStream);
                response = responseReader.ReadToEnd();
                responseReader.Close();
            } catch (Exception e) {
                string resp = JsonConvert.SerializeObject(ManejadorExcepciones.GetMensajeResponse(e));
                return GetResponse(resp);
            }
            return GetResponse(response);
        }

        [Route("consultar")]
        [HttpPost]
        public HttpResponseMessage Consultar([FromBody]JObject data) {
            return EjecutarConsulta(data.ToString());
        }

        [Route("mantener")]
        [HttpPost]
        public HttpResponseMessage Mantener([FromBody]JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

        [Route("logout")]
        [HttpPost]
        public HttpResponseMessage Logout([FromBody]JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

        [Route("cambiocontrasenia")]
        [HttpPost]
        public HttpResponseMessage CambioContrasenia([FromBody]JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

        [Route("validacionotp")]
        [HttpPost]
        public HttpResponseMessage Validacionotp([FromBody]JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

        [Route("menu")]
        [HttpPost]
        public HttpResponseMessage Menu([FromBody]JObject data) {
            return this.EjecutarConsulta(data.ToString());
        }

        [Route("login")]
        [HttpPost]
        public HttpResponseMessage Login([FromBody]JObject data) {
            return this.EjecutarMantenimiento(data.ToString());
        }

    }*/
}