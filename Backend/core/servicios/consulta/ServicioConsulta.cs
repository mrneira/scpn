using core.servicios.consulta;
using core.util;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.servicios.ef;

namespace core {
    public class ServicioConsulta {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private string sessionId = "";

        private string userAgent = "";

        private string cterminalremoto = "";

        public string SessionId { get => sessionId; set => sessionId = value; }

        public string UserAgent { get => userAgent; set => userAgent = value; }

        public string Cterminalremoto { get => cterminalremoto; set => cterminalremoto = value; }

        /// <summary>
        /// Ejecuta la cosnula de una transaccion. 
        /// </summary>
        /// <param name="data"></param>
        /// <returns></returns>
        public string Consultar(string data) {
            Consulta consulta = null;
            Response response = null;
            String resp = "";
            AtlasContexto contexto = new AtlasContexto();
            try {
                Sessionef.FijarAtlasContexto(contexto);
                consulta = new Consulta();
                consulta.SessionId = sessionId;
                consulta.UserAgent = userAgent;
                consulta.Cterminalremoto = cterminalremoto;

                response = consulta.Ejecutar(data);
            } catch (Exception e) {
                response = ManejadorExcepciones.GetMensajeResponse(e);
                logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
            } finally {
                consulta.Sw.Stop();
                resp = JsonConvert.SerializeObject(response);
                consulta.logtransaccion.grabarLogConCommit(consulta.Request, response, consulta.GetTiempo(), "C");
                Sessionef.CerrarAtlasContexto(contexto);
            }
            return resp;
        }
    }
}
