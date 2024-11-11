using dal.lote;
using modelo;
using System;
using util.servicios.ef;

namespace lote.resultado {

    /// <summary>
    /// Clase que se encarga de registrar control de lotes.
    /// </summary>
    public class ControlLote {

        /// <summary>
        /// Codigo de compania.
        /// </summary>
        private int? compania;

        /// <summary>
        /// Fecha en la que se ejecuta el lote.
        /// </summary>
        private int fproceso;

        /// <summary>
        /// Codigo de lote.
        /// </summary>
        private string clote;

        /// <summary>
        /// Acciones a tomar al momento de grabar los resultados, C Crear un registro de control, F Finalizar lote ejecucion lote.
        /// </summary>
        private string accion;

        /// <summary>
        /// Numero de ejecucion del lote.
        /// </summary>
        private int numeroejecucion;

        /// <summary>
        /// Codigo de modulo desde el cual se ejecuta el lote.
        /// </summary>
        private int cmodulo;

        /// <summary>
        /// Codigo de transaccion desde la cual se ejecuta el lote.
        /// </summary>
        private int ctransaccion;

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Crea una instancia de ControlLote.
        /// </summary>
        public ControlLote(int compania, int fproceso, string clote, string accion, int numeroejecucion, int cmodulo, int ctransaccion) {
		    this.compania = compania;
		    this.fproceso = fproceso;
		    this.clote = clote;
		    this.accion = accion;
		    this.numeroejecucion = numeroejecucion;
		    this.cmodulo = cmodulo;
		    this.ctransaccion = ctransaccion;
        }

        public void Ejecutar() {
            AtlasContexto contexto = new AtlasContexto();
            Sessionef.FijarAtlasContexto(contexto);
            using (var contextoTransaccion = contexto.Database.BeginTransaction()) {
                try {
                    if (accion.Equals("C")) {
                        Crear();
                    }
                    if (accion.Equals("F")) {
                        Finalizar();
                    }
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

        private void Crear() {
            // registra inicio de ejecucion del lote.
            TloteControlEjecucionDal.Crear(fproceso, clote, numeroejecucion, cmodulo, ctransaccion);
	    }

        private void Finalizar() {
            // registra finalizacion de ejecucion del lote.
        }

    }
}
