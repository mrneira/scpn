using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.dto {
    public class Response : Dictionary<string, object> {

        /// <summary>
        /// Constante que define el codigo de respuesta ok.
        /// </summary>
        public static string cod = "OK";

        /// <summary>
        /// Datos de respuesta obligatoria a enviar al frontend cuando se presenta errores.
        /// </summary>
        //private Dictionary<string, Object> mRespObligatoria = new Dictionary<string, Object>();

        /// <summary>
        /// Crea una instancia de Response.
        /// </summary>
        public Response() {
            base["cod"] = "OK";
        }
        
        public void SetCod(string cod) {
            base["cod"] = cod;
        }

        public string GetCod() {
            return (string)base["cod"];
        }

        public void SetMsgusu(string msgusu) {
            base["msgusu"] = msgusu;
        }

        public string GetMsgusu() {
            return (string)(base.ContainsKey("msgusu") ? base["msgusu"]:"");
        }

        public void SetMsgtec(string msgtec) {
            base["msgtec"] = msgtec;
        }

        public string GetMsgtec() {
            return (string)base["msgtec"];
        }

        public void SetEserror(bool eserror) {
            base["eserror"] = eserror;
        }

        public bool GetEserror() {
            return (bool)base["eserror"];
        }

        //public Dictionary<string, object> MRespObligatoria { get => mRespObligatoria; set => mRespObligatoria = value; }
    }
}
