using core.servicios.mantenimiento;
using core.util;
using dal.lote;
using modelo;
using System;
using util.dto.lote;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace resultado {

    /// <summary>
    /// Clase que se encarga de registrar resultado de ejecucion de lotes en tloteresultados.
    /// </summary>
    /// <author>amerchan</author>
    public class ResultadoLote {

        /// <summary>
        /// Codigo de compania de trabajo.
        /// </summary>
        private RequestResultadoLote rqresultado;

        /// <summary>
        ///  Request con el que se ejecutan transacciones.
        /// </summary>
        protected RqMantenimiento rqmantenimiento;

        /// <summary>
        /// Acciones a tomar al momento de grabar los resultados, C Crear un registro, F Finalizar lote, A Actualizar contadores.
        /// </summary>
        private string accion;

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Crea una instancia de ErrorLoteThread.
        /// </summary>
        public ResultadoLote(RequestResultadoLote rqresultado, RqMantenimiento rqmantenimiento, String accion) {
		    this.accion = accion;
		    this.rqresultado = rqresultado;
            this.rqmantenimiento = rqmantenimiento;
        }

        public void Ejecutar() {
            ThreadNegocio.RemoveDatos();
            Datos d = new Datos();
            ThreadNegocio.FijarDatos(d);
            d.Compania = rqmantenimiento.Ccompania;

            AtlasContexto contexto = new AtlasContexto();
            Sessionef.FijarAtlasContexto(contexto);
            using (var contextoTransaccion = contexto.Database.BeginTransaction()) {
                try {
                    if (this.accion.Equals("C")) {
                        this.Crear();
                    }
                    if (this.accion.Equals("F")) {
                        this.Finalizar();
                        this.Actualizarcontadores();
                        this.EnviaMail();
                    }
                    if (this.accion.Equals("A")) {
                        this.Actualizarcontadores();
                    }

                    contexto.SaveChanges();
                    contextoTransaccion.Commit();
                } catch (Exception e) {
                    contextoTransaccion.Rollback();
                    logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
                    ManejadorExcepciones eh = new ManejadorExcepciones();
                } finally {
                    Sessionef.CerrarAtlasContexto(contexto);
                }
            }
        }

        private void EnviaMail() {
		    this.rqmantenimiento.AddDatos("clote", this.rqresultado.Clote);
		    this.rqmantenimiento.AddDatos("cmodulolote", this.rqresultado.Cmodulo);
		    this.rqmantenimiento.AddDatos("fcontablelote", this.rqresultado.Fconatble);
		    this.rqmantenimiento.AddDatos("numeroejecucionlote", this.rqresultado.Numeroejecucion);

		    Mantenimiento.ProcesarAnidado(this.rqmantenimiento, 21, 200);
        }

        private void Crear() {
            // registra inicio de ejecucion del lote.
            TloteResultadoDal.Crear(this.rqresultado.Fconatble, this.rqresultado.Numeroejecucion, this.rqresultado.Clote,
    				this.rqresultado.Cmodulo, this.rqresultado.Cusuario, this.rqresultado.Cmodulotransaccionejecucion,
    				this.rqresultado.Ctransaccionejecucion, this.rqresultado.Secuenciaresultado, this.rqresultado.Ctareahorizontal, this.rqresultado.Filtros);
        }

        private void Finalizar() {
            // registra finalizacion de ejecucion del lote.
            TloteResultadoDal.ActualizaFinalizacion(this.rqresultado.Fconatble, this.rqresultado.Numeroejecucion, this.rqresultado.Clote,
    				this.rqresultado.Cmodulo, this.rqresultado.Secuenciaresultado, this.rqresultado.Ctareahorizontal, this.rqresultado.Total);
        }

        private void Actualizarcontadores() {
            // registra finalizacion de ejecucion del lote.
            TloteResultadoDal.ActualizaContadores(this.rqresultado.Fconatble, this.rqresultado.Numeroejecucion, this.rqresultado.Clote,
    				this.rqresultado.Cmodulo, this.rqresultado.Secuenciaresultado, this.rqresultado.Ctareahorizontal, this.rqresultado.Total);
        }


    }
}
