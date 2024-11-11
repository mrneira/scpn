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

namespace inversiones.lote
{
    /// <summary>
    /// Clase que se encarga de ejecutar una tarea por registro. Lee las tareas definidas en la tabla TconRegistroLote, para un numero de
    /// registro y las ejecuta.
    /// </summary>
    public class LoteInversionHilo : IPoolHiloItem {

        // Request utilizado en la ejecucion de transacciones de mantenimeinto y/o monetarias.
        private RqMantenimiento rqmantenimiento;

	    // Objeto que contiene los datos de la operacion para ejetura las tareas.
	    private RequestOperacion rqoperacion;

        /// <summary>
        /// Crea un nuevo hilo para procesar tareas de una operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el cual se ejecuta la inversión.</param>
        /// <param name="rqoperacion">Request de operación con el cual se ejecuta la inversión.</param>
        /// <returns></returns>
        public LoteInversionHilo(RqMantenimiento rqmantenimiento, RequestOperacion rqoperacion) {
            this.rqmantenimiento = rqmantenimiento;
            this.rqoperacion = rqoperacion;
        }


        /// <summary>
        /// Metodo que se encarga de la llamada para la ejecucion de una cuenta.
        /// </summary>
        /// <returns></returns>
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

                    FijaDatosminimos(rqm, rqoperacion);
                    // procesa tareas operacion
                    TareasOperacionInversion.Ejecutar(rqm, rqoperacion);

                    contexto.SaveChanges();
                    contextoTransaccion.Commit();
                } catch (Exception e) {
                    contextoTransaccion.Rollback();
                    //logger.Error(e);
                } finally {
                    Sessionef.CerrarAtlasContexto(contexto);
                }
            }

        }

        /// <summary>
        /// Fija datos minimos, para ejecutar las tareas de la operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento con el cual se ejecuta la inversión.</param>
        /// <param name="rqoperacion">Request de operación con el cual se ejecuta la inversión.</param>
        /// <returns></returns>
        private void FijaDatosminimos(RqMantenimiento rqmantenimiento, RequestOperacion rqoperacion) {
            String msg = Servicio.GetMensaje("LOTE--" + rqoperacion.Cregistronumero);
            rqmantenimiento.Mensaje = msg;
            Thread.CurrentThread.Name = rqmantenimiento.Mensaje;
            rqmantenimiento.Enlinea = false;
	    }

    }
}
