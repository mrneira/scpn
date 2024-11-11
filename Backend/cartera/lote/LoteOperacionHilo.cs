using core.servicios;
using modelo;
using System;
using System.Threading;
using util;
using util.dto;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace cartera.lote
{
    /// <summary>
    /// Clase que se encarga de ejecutar una tareas por operacion. Lee las tareas definidas en la tabla TcarOperacionLote, para un numero de operacion y las ejecuta.
    /// </summary>
    public class LoteOperacionHilo: IPoolHiloItem {

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        // Request utilizado en la ejecucion de transacciones de mantenimeinto y/o monetarias.
        private RqMantenimiento rqmantenimiento;

	    // Objeto que contiene los datos de la operacion para ejetura las tareas.
	    private RequestOperacion rqoperacion;

        /// <summary>
        /// Crea un nuevo hilo para procesar tareas de una operacion.
        /// </summary>
        public LoteOperacionHilo(RqMantenimiento rqmantenimiento, RequestOperacion rqoperacion) {
            this.rqmantenimiento = rqmantenimiento;
            this.rqoperacion = rqoperacion;
        }

        /// <summary>
        /// Metodo que se encarga de la llamada al ejb para la ejecucion de una cuenta.
        /// </summary>
        public void Ejecutar() {
            ThreadNegocio.RemoveDatos();
            Datos d = new Datos();
            ThreadNegocio.FijarDatos(d);
            d.Compania = rqmantenimiento.Ccompania;

            AtlasContexto contexto = new AtlasContexto();
            Sessionef.FijarAtlasContexto(contexto);
            using (var contextoTransaccion = contexto.Database.BeginTransaction()) {
                try {
                    RqMantenimiento rqm = new RqMantenimiento();
                    rqm = RqMantenimiento.Copiar(rqmantenimiento);
                    Response res = new Response();
                    rqm.Response = res;
                    rqm.AddDatos("REQUESTOPERACION", rqoperacion);
                    rqm.Coperacion = rqoperacion.Coperacion;

                    FijaDatosminimos(rqm, rqoperacion);
                    // procesa tareas operacion
                    TareasOperacionCartera.Ejecutar(rqm, rqoperacion);

                    contexto.SaveChanges();
                    contextoTransaccion.Commit();
                } catch (Exception e) {
                    contextoTransaccion.Rollback();
                    logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
                } finally {
                    Sessionef.CerrarAtlasContexto(contexto);
                }
            }

        }

        /// <summary>
        /// Fija datos minimos, para ejecutar las tareas de la operacion.
        /// </summary>
        private void FijaDatosminimos(RqMantenimiento rqmantenimiento, RequestOperacion rqoperacion) {
            rqmantenimiento.Mensaje = Servicio.GetMensaje("LOTE-" + rqoperacion.Coperacion);
            Thread.CurrentThread.Name = rqmantenimiento.Mensaje;
            rqmantenimiento.Enlinea = false;
	    }

    }
}
