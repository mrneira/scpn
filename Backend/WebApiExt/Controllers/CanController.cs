using CoreSecurity;
using core.util;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Web;
using System.Web.Http;
using WebApiExt.Politicas;

namespace WebApiExt.Controllers {

    [PoliticaCorsCan]
    [RoutePrefix("atlas-ext-can/servicioRest")]
    public class CanController : ApiController {
        //string SRV_CORE = "http://localhost:8082";
        //string SRV_CORE = "http://192.168.0.198/ApiCore";
        string SRV_CORE = "http://192.168.0.193/WebApiCore";

        public HttpResponseMessage Options() {
            return new HttpResponseMessage { StatusCode = HttpStatusCode.OK };
        }

        private HttpResponseMessage GetResponse(string resp, string key) {
            string respEncrypted = SecurityLib.OpenSSLEncrypt(resp, key);
            var response = new HttpResponseMessage() {
                Content = new StringContent(JsonConvert.SerializeObject(respEncrypted))
            };
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");

            return response;
        }

        public string GetAutenticate() {
            NameValueCollection headers = HttpContext.Current.Request.Headers;
            string autenticate = null;

            if (!string.IsNullOrEmpty(headers.Get("Autenticate"))) {
                autenticate = headers.Get("Autenticate");
            }
                
            return autenticate;
        }

        private HttpResponseMessage EjecutarConsulta(string datos, string key) {
            string URL = SRV_CORE + "/atlas-core-can/servicioRest/consultar";

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
                return GetResponse(resp, key);
            }
            return GetResponse(response, key);
        }

        private HttpResponseMessage EjecutarMantenimiento(string datos, string key) {
            string URL = SRV_CORE + "/atlas-core-can/servicioRest/mantener";

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
                return GetResponse(resp, key);
            }
            return GetResponse(response, key);
        }

        [Route("consultar")]
        [HttpPost]
        public HttpResponseMessage Consultar([FromBody] string data) {
            string key = GetAutenticate();
            string dataDecrypted = SecurityLib.OpenSSLDecrypt(data, key);
            return this.EjecutarConsulta(dataDecrypted, key);
        }

        //public HttpResponseMessage Consultar([FromBody] JObject data) {
        //    return this.EjecutarConsulta(data.ToString());
        //}


        [Route("mantener")]
        [HttpPost]
        public HttpResponseMessage Mantener([FromBody] string data) {
            string key = GetAutenticate();
            string dataDecrypted = SecurityLib.OpenSSLDecrypt(data, key);
            return this.EjecutarMantenimiento(dataDecrypted, key);
        }

        //public HttpResponseMessage Mantener([FromBody] JObject data) {
        //    return this.EjecutarMantenimiento(data.ToString());
        //}


    }
}
