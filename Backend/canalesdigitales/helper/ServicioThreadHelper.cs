using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Text;
using System.Threading;

namespace canalesdigitales.helper {

    /// <summary>
    /// Clase que utilitaria, encargada de ejecutar un servicio externo.
    /// </summary>
    public class ServicioThreadHelper {

        private readonly string data;
        private readonly string url;

        // Crea una instancia de ServicioThreadHelper.
        public ServicioThreadHelper(string url, Dictionary<string, object> parameters) {
            this.data = JsonConvert.SerializeObject(parameters);
            this.url = url;
        }

        public void Ejecutar() {
            Thread thread = new Thread(GetServicio);
            thread.Start();
        }

        private void GetServicio() {
            string response = string.Empty;

            try {
                Thread.Sleep(5000);

                HttpWebRequest httpRequest = WebRequest.Create(url) as HttpWebRequest;
                ServicePointManager.ServerCertificateValidationCallback = delegate { return true; };

                byte[] bufferData = Encoding.UTF8.GetBytes(data);

                httpRequest.Method = "POST";
                httpRequest.KeepAlive = false;
                httpRequest.UseDefaultCredentials = true;
                httpRequest.ContentType = "application/json";
                httpRequest.ContentLength = bufferData.Length;
                httpRequest.Timeout = 60000;

                using (Stream streamRequest = httpRequest.GetRequestStream()) {
                    streamRequest.Write(bufferData, 0, bufferData.Length);
                    streamRequest.Flush();
                    streamRequest.Close();
                }

                using (HttpWebResponse httpResponse = httpRequest.GetResponse() as HttpWebResponse)
                using (Stream streamResponse = httpResponse.GetResponseStream())
                using (StreamReader streamReader = new StreamReader(streamResponse)) {
                    response = streamReader.ReadToEnd();

                    streamReader.Close();
                    streamResponse.Close();
                    httpResponse.Close();
                }
            } catch (WebException ex) {

            } catch (Exception ex) {

            }
        }

    }

}
