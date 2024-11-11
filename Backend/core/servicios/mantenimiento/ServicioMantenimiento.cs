using core.servicios.mantenimiento;
using core.util;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.servicios.ef;

namespace core {
    public class ServicioMantenimiento {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        private string sessionId = "";

        private string userAgent = "";

        private string cterminalremoto = "";

        public string SessionId { get => sessionId; set => sessionId = value; }

        public string UserAgent { get => userAgent; set => userAgent = value; }

        public string Cterminalremoto { get => cterminalremoto; set => cterminalremoto = value; }

        public string Mantener(string data) {


            AtlasContexto contexto = new AtlasContexto();
            String resp = "";

            Sessionef.FijarAtlasContexto(contexto);
            using (var contextoTransaccion = contexto.Database.BeginTransaction()) {
                Mantenimiento man = null;
                Response response = null;
                try {
                    man = new Mantenimiento();
                    man.SessionId = sessionId;
                    man.UserAgent = userAgent;
                    man.Cterminalremoto = cterminalremoto;

                    response = man.Ejecutar(data.ToString());
                    if (Sessionef.thread_rollback)
                    {
                        contextoTransaccion.Rollback();
                    }
                    else
                    {
                        contexto.Database.Log = sql => Debug.Write(sql);
                        contexto.SaveChanges();
                        contextoTransaccion.Commit(); 
                    }
                } catch (Exception e) {
                    contextoTransaccion.Rollback();
                    response = ManejadorExcepciones.GetMensajeResponse(e);
                    logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
                } finally {
                    man.Sw.Stop();
                    resp = JsonConvert.SerializeObject(response);
                    man.logtransaccion.grabarLogConCommit(man.Request, response, man.GetTiempo(), "M");
                    Sessionef.CerrarAtlasContexto(contexto);
                }
            }
            return resp;
        }


    }
}
