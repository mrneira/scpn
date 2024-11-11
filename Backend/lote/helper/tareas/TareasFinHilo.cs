using core.servicios;
using core.util;
using dal.lote;
using modelo;
using System;
using util;
using util.dto;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;

namespace lote.helper {

    /// <summary>
    /// Clase que se encarga de ejecutar una tarea previa, que llenar tareas a ejecutar por operacion.
    /// </summary>
    public class TareasFinHilo {

        /// <summary>
        /// Instancia de la tarea previa a ejecutar.
        /// </summary>
        private ITareaFin tareafin;
        /// <summary>
        /// Request que contiene datos para ejecutar tarea previa.
        /// </summary>
        private RequestModulo rqmodulo;
        /// <summary>
        /// Codigo de tarea previa a ejecutar.
        /// </summary>
        private string ctarea;
        /// <summary>
        /// Orden de ejecucion de la tarea, ainsertar en tlotetareasoperacion.
        /// </summary>
        private int? orden = 0;

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Crea una hilo de TareasPreviasHilo.
        /// </summary>
        public TareasFinHilo(ITareaFin tareafin, RequestModulo rqmodulo, String ctarea, int? orden)
        {
            this.tareafin = tareafin;
            this.rqmodulo = rqmodulo;
            this.ctarea = ctarea;
            this.orden = orden;
        }

        /// <summary>
        /// Método que inicia la ejecución del Hilo de la tarea de finalizacion.
        /// </summary>
        public void Ejecutar()
        {
            AtlasContexto contexto = new AtlasContexto();
            Sessionef.FijarAtlasContexto(contexto);
            using (var contextoTransaccion = contexto.Database.BeginTransaction()) {
                try {
                    tloteresultadofin obj = Crear("0", ""); // cuando se procesa con exito
                    tareafin.Ejecutar(rqmodulo, ctarea, orden);
                    obj.freal = Fecha.GetDataBaseTimestamp();

                    contexto.SaveChanges();
                    contextoTransaccion.Commit();
                }
                catch (Exception e) {
                    contextoTransaccion.Rollback();
                    logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
                    Response resp = ManejadorExcepciones.GetMensajeResponse(e);
                    try {
                        tloteresultadofin obj = Crear(resp.GetCod(), resp.GetMsgusu());
                        obj.freal = Fecha.GetDataBaseTimestamp();
                        InsertAnidadoThread.Grabar(rqmodulo.Ccompania, obj);
                    }
                    catch (Exception e1) {
                        logger.Error($"{string.Join(".", e1.TargetSite.DeclaringType.FullName, e1.TargetSite.Name)} - {e1.Message} - {e1.InnerException}");
                    }
                }
                finally {
                    Sessionef.CerrarAtlasContexto(contexto);
                }
            }
        }

        /// <summary>
        /// Inserta log con el resultado de ejecucion de la tarea previa.
        /// </summary>
        private tloteresultadofin Crear(string cresultado, string textoresultado)
        {
            return TloteResultadoFinDal.Crear(rqmodulo.Fconatble, rqmodulo.Numeroejecucion, rqmodulo.Clote,
                    rqmodulo.Cmodulo, ctarea, cresultado, textoresultado);
        }

    }
}
