using dal.lote;
using modelo;
using System;
using util;
using util.servicios.ef;
using util.thread;

namespace lote.helper {

    /// <summary>
    /// Clase que se encarga de ejecutar un lote, ejecuta componentes de negocio que llenan tareas a ejecutar por operacion y luego ejecuta las 
    /// tareas por operacion.El orden de ejecucion es por modulo.
    /// </summary>
    public class ErrorLoteIndividualHilo {

        /// <summary>
        /// Objeto que almacena la transaccion con la que se ejecuta el proceso batch, con el cual se obtiene los procesos a ejecutar fin de dia.
        /// </summary>
        private RequestOperacion rqoperacion;

        /// <summary>
        /// Codigo de tarea.
        /// </summary>
        private string ctarea;

        /// <summary>
        /// mensaje.
        /// </summary>
        private string mensaje;

        /// <summary>
        /// Codigo de cresultado.
        /// </summary>
        private string cresultado;

        /// <summary>
        /// textoresultado
        /// </summary>
        private string textoresultado;

        /// <summary>
        /// campo ccompania
        /// </summary>
        private int ccompania;

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Crea una instancia de LoteHilo.
        /// </summary>
        public ErrorLoteIndividualHilo(int ccompania, RequestOperacion rqoperacion, string ctarea, string mensaje, string cresultado, string textoresultado) {
            this.rqoperacion = rqoperacion;
            this.ctarea = ctarea;
            this.mensaje = mensaje;
            this.cresultado = cresultado;
            this.textoresultado = textoresultado;
            this.ccompania = ccompania;
        }

        /// <summary>
        /// Ejecuta por modulo, componentes de negocio previo que obtienen tareas a ejecutar por operacion y luego ejecuta tareas por operacion.
        /// </summary>
        public void Procesar() {
            ThreadNegocio.RemoveDatos();
            Datos d = new Datos();
            ThreadNegocio.FijarDatos(d);
            d.Compania = ccompania;

            AtlasContexto contexto = new AtlasContexto();
            Sessionef.FijarAtlasContexto(contexto);
            using (var contextoTransaccion = contexto.Database.BeginTransaction()) {
                try {
                    TloteResultadoIndividualDal.registraerror(rqoperacion, ctarea, mensaje, cresultado, textoresultado);
                    contexto.SaveChanges();
                    contextoTransaccion.Commit();
                } catch (Exception e) {
                    contextoTransaccion.Rollback();
                    logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
                    throw e;
                } finally {
                    Sessionef.CerrarAtlasContexto(contexto);
                }
            }
            
        }


    }
}
