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

namespace presupuesto.lote
{
    /// <summary>
    /// Clase que se encarga de ejecutar una tareas por registro. Lee las tareas definidas en la tabla TconRegistroLote, para un numero de
    /// registro y las ejecuta.
    /// </summary>
    public class LoteRegistroHilo : IPoolHiloItem {

        // Request utilizado en la ejecucion de transacciones de mantenimeinto y/o monetarias.
        private RqMantenimiento rqmantenimiento;

	    // Objeto que contiene los datos de la operacion para ejetura las tareas.
	    private RequestOperacion rqoperacion;

        /// <summary>
        /// Crea un nuevo hilo para procesar tareas de una operacion.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="rqoperacion"></param>
        public LoteRegistroHilo(RqMantenimiento rqmantenimiento, RequestOperacion rqoperacion) {
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

                    FijaDatosminimos(rqm, rqoperacion);
                    // procesa tareas operacion
                    TareasRegistroPresupuesto.Ejecutar(rqm, rqoperacion);

                    contexto.SaveChanges();
                    contextoTransaccion.Commit();
                } catch (Exception e) {
                    contextoTransaccion.Rollback();
                } finally {
                    Sessionef.CerrarAtlasContexto(contexto);
                }
            }

        }

        /// <summary>
        /// Fija datos minimos, para ejecutar las tareas de la operacion.
        /// </summary>
        private void FijaDatosminimos(RqMantenimiento rqmantenimiento, RequestOperacion rqoperacion) {
            String msg = Servicio.GetMensaje("L" + rqoperacion.Cregistro);
            rqmantenimiento.Mensaje = msg;
            Thread.CurrentThread.Name = rqmantenimiento.Mensaje;
            rqmantenimiento.Enlinea = false;
	    }

    }
}
