using core.servicios;
using core.util;
using dal.generales;
using dal.lote;
using modelo;
using modulo;
using System;
using System.Collections.Generic;
using System.Runtime.Remoting;
using util;
using util.dto.lote;
using util.dto.mantenimiento;
using util.enums;
using util.servicios.ef;
using util.thread;
using System.Linq;

namespace lote.helper {

    /// <summary>
    /// Clase que se encarga de ejecutar un lote, ejecuta componentes de negocio que llenan tareas a ejecutar por operacion y luego ejecuta las 
    /// tareas por operacion.El orden de ejecucion es por modulo.
    /// </summary>
    public class LoteHilo {

        /// <summary>
        /// Objeto que almacena la transaccion con la que se ejecuta el proceso batch, con el cual se obtiene los procesos a ejecutar fin de dia.
        /// </summary>
        private RqMantenimiento rq;

        /// <summary>
        /// Codigo de lote.
        /// </summary>
        private string clote;

        /// <summary>
        /// Numero de ejecucion del lote.
        /// </summary>
        private int numeroejecucion;

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        /// <summary>
        /// Crea una instancia de LoteHilo.
        /// </summary>
        public LoteHilo(RqMantenimiento rqmantenimiento, string clote, int numeroejecucion)
        {
            this.rq = rqmantenimiento;
            this.clote = clote;
            this.numeroejecucion = numeroejecucion;
        }

        /// <summary>
        /// Ejecuta por modulo, componentes de negocio previo que obtienen tareas a ejecutar por operacion y luego ejecuta tareas por operacion.
        /// </summary>
        public void Procesar()
        {
            ThreadNegocio.RemoveDatos();
            Datos d = new Datos();
            ThreadNegocio.FijarDatos(d);
            d.Compania = rq.Ccompania;

            AtlasContexto contexto = new AtlasContexto();
            Sessionef.FijarAtlasContexto(contexto);
            using (var contextoTransaccion = contexto.Database.BeginTransaction()) {
                try {
                    List<tlotemodulo> lmodulos = TloteModuloDal.Find(clote);
                    RequestModulo rqmodulo = LlenarRequestModulo();
                    foreach (tlotemodulo modulo in lmodulos) {
                        if (!this.ValidaEjecucionModulo(modulo)) {
                            continue;
                        }
                        rqmodulo.Cmodulo = modulo.cmodulo;
                        if (modulo.modoejecucion.CompareTo("V") == 0) {
                            // Todas las tareas de un registro en una transaccion
                            this.ProcesoVertical(modulo, rqmodulo);
                        } else {
                            // Todas las tareas de un registro en transaccion independiente por tares
                            this.ProcesoHorizontal(modulo, rqmodulo);
                        }
                    }
                    contexto.SaveChanges();
                    contextoTransaccion.Commit();
                }
                catch (Exception e) {
                    contextoTransaccion.Rollback();
                    logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
                }
                finally {
                    Finalizar();
                    Sessionef.CerrarAtlasContexto(contexto);
                }
            }

        }

        private void ProcesoVertical(tlotemodulo obj, RequestModulo rqmodulo)
        {
            // ejecuta componentes de negocio previos.
            this.TareasPreviasEjecutar(obj, rqmodulo);
            // ejecuta tareas por operacion
            this.TareasModuloEjecutar(obj, rqmodulo, 1, null);
            // ejecuta componentes de negocio de finlización.
            this.TareasFinEjecutar(obj, rqmodulo);
        }

        private void ProcesoHorizontal(tlotemodulo obj, RequestModulo rqmodulo)
        {
            List<tlotemodulotareas> ltareas = TloteModuloTareasDal.FindActivos(rqmodulo.Clote, rqmodulo.Cmodulo);
            int secuencia = 1;

            tlotemodulotareas tareadep = null;
            foreach (tlotemodulotareas tarea in ltareas) {
                if (!this.ValidaEjecucionTarea(tarea, tareadep)) {
                    continue;
                }
                // ejecuta componente de negocio previo.
                TareasPrevias.Ejecutatarea(tarea, rqmodulo);
                // ejecuta tareas por registro
                this.TareasModuloEjecutar(obj, rqmodulo, secuencia, tarea);
                secuencia = secuencia + 1;
                // ejecuta componente de negocio de finlización.
                TareasFin.Ejecutataraea(tarea, rqmodulo);
                tareadep = tarea;
            }
        }

        /// <summary>
        /// Metodo que se encarga de ejecutar procesos que llenan tareas a ejecutar por operacion las clases se implmentan en cada modulo.
        /// </summary>
        /// <param name="tlotemodulo">Objeto que contiene definicion de tlotemodulo.</param>
        /// <param name="rqmodulo">Objeto que contiene fechas contables y el modulo en ejecucion.</param>
        private void TareasModuloEjecutar(tlotemodulo tlotemodulo, RequestModulo rqmodulo, int secuenciaresultado, tlotemodulotareas tarea)
        {
            string claselotes = EnumModulos.GetEnumModulos(rqmodulo.Cmodulo).Claselotes;
            if (claselotes == null) {
                return;
            }
            String ctarea = tarea != null ? tarea.ctarea : null;
            Boolean existerrorprev = TloteResultadoPrevioDal.ExisteErrores(rqmodulo.Fconatable, rqmodulo.Numeroejecucion, rqmodulo.Clote, tlotemodulo.cmodulo, ctarea);
            if (!existerrorprev) {
                string assembly = claselotes.Substring(0, claselotes.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, claselotes);
                object obj = handle.Unwrap();
                TareasModulo tmodulo = (TareasModulo)obj;
                rqmodulo.Secuenciaresultado = secuenciaresultado;
                rqmodulo.Ctareahorizontal = ctarea;
                tmodulo.Procesar(rq, rqmodulo, tlotemodulo.numerohilos);
            }
        }

        /// <summary>
        /// Metodo que se encarga de ejecutar procesos que llenan tareas a ejecutar por operacion.
        /// </summary>
        private void TareasPreviasEjecutar(tlotemodulo tlotemodulo, RequestModulo rqmodulo)
        {
            TareasPrevias tprevias = new TareasPrevias();
            TareasPrevias.Procesar(tlotemodulo, rqmodulo);
        }

        /// <summary>
        /// Metodo que se encarga de ejecutar tareas de finanlización.
        /// </summary>
        private void TareasFinEjecutar(tlotemodulo tlotemodulo, RequestModulo rqmodulo)
        {
            TareasFin.Procesar(tlotemodulo, rqmodulo);
        }

        private Boolean ValidaEjecucionModulo(tlotemodulo lotemod)
        {
            TloteModuloDal.Validahilos(lotemod);
            if (String.IsNullOrEmpty(lotemod.modoejecucion)) {
                return false;
            }

            tlotecodigo lote = TloteCodigoDal.Find(this.clote);
            // Valida dependencia de lote
            if (lotemod.cmodulodependencia != null) {
                tlotemodulo moddep = TloteModuloDal.Find(lotemod.cmodulodependencia ?? 0, lotemod.clote);
                if (moddep.activo == null || moddep.activo == false) {
                    return true;
                }

                IList<Dictionary<string, object>> lresultados = TloteResultadoDal.FindResultadosUltimosProcesados(this.rq.Fconatable, moddep.clote, moddep.cmodulo, null);

                if (lotemod.valprocesoantprev != null && lotemod.valprocesoantprev == true) {
                    if (lresultados == null || lresultados.Count <= 0) {
                        return false;
                    }
                    Boolean existerrorprev = TloteResultadoPrevioDal.ExisteErrores(this.rq.Fconatable, this.numeroejecucion, this.clote, moddep.cmodulo, null);
                    if (existerrorprev) {
                        return false;
                    }
                }
                if (lotemod.valprocesoantregistros != null && lotemod.valprocesoantregistros == true) {
                    if (lresultados == null || lresultados.Count <= 0) {
                        return false;
                    }
                    Dictionary<string, object> resultado = lresultados.ElementAt(0);
                    if (resultado["error"] != null && (int)resultado["error"] > 0) {
                        return false;
                    }
                }
                if (lotemod.valprocesoantfin != null && lotemod.valprocesoantfin == true) {
                    if (lresultados == null || lresultados.Count <= 0) {
                        return false;
                    }
                    Boolean existerrorprev = TloteResultadoFinDal.ExisteErrores(this.rq.Fconatable, this.numeroejecucion, this.clote, moddep.cmodulo, null);
                    if (existerrorprev) {
                        //throw new LoteException("LOT-0005", "EXISTEN ERRORES DE FINLIZACIÓN EN EL LOTE: [{0}] PARA EL MÓDULO: [{0}]", lote.getNombre(), mod.getNombre());
                        return false;
                    }
                }
            }
            return true;
        }

        private Boolean ValidaEjecucionTarea(tlotemodulotareas tarea, tlotemodulotareas tareadep)
        {
            if (tareadep == null || tareadep.activo == null || tareadep.activo == false) {
                return true;
            }
            tlotecodigo lote = TloteCodigoDal.Find(this.clote);

            if (tareadep.valtareadepprev != null && tareadep.valtareadepprev == true) {
                Boolean existerrorprev = TloteResultadoPrevioDal.ExisteErrores(this.rq.Fconatable, this.numeroejecucion, this.clote, tareadep.cmodulo, tareadep.ctarea);
                if (existerrorprev) {
                    return false;
                }
            }
            if (tareadep.valtareadepregistros != null && tareadep.valtareadepregistros == true) {
                IList<Dictionary<string, object>> lresultados = TloteResultadoDal.FindResultadosUltimosProcesados(this.rq.Fconatable, tareadep.clote, tareadep.cmodulo, tareadep.ctarea);
                if (lresultados == null || lresultados.Count <= 0) {
                    return false;
                }
                Dictionary<string, object> resultado = lresultados.ElementAt(0);
                if (resultado["error"] != null && (int)resultado["error"] > 0) {
                    return false;
                }
            }
            if (tareadep.valtareadepfin != null && tareadep.valtareadepfin == true) {
                Boolean existerrorprev = TloteResultadoFinDal.ExisteErrores(this.rq.Fconatable, this.numeroejecucion, this.clote, tareadep.cmodulo, tareadep.ctarea);
                if (existerrorprev) {
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// Metodo que entrega los datos comunes para el procesamiento de tareas.
        /// </summary>
        private RequestModulo LlenarRequestModulo()
        {
            RequestModulo rqmodulo = new RequestModulo();

            rqmodulo.Ccompania = rq.Ccompania;

            // Mantener la fecha de rqmantenimiento para proceso que no necesitan la fcontable y se cambia en una clase previa.
            // Esta se llena al ejecutar la transaccion.
            rqmodulo.Fconatble = rq.Fconatable;
            rqmodulo.Ftrabajo = rq.Ftrabajo;
            rqmodulo.Cusuario = rq.Cusuario;

            tgenfechacontable fecha = TgenfechacontableDal.Find(rq.Ccompania);
            rqmodulo.Fconatbleproxima = fecha.fproxima;
            rqmodulo.Fconatbleanterior = fecha.fanterior;
            rqmodulo.Fejecucion = Fecha.GetFechaSistemaIntger();
            rqmodulo.Clote = clote;
            rqmodulo.Mensaje = rq.Mensaje;
            rqmodulo.Numeroejecucion = numeroejecucion;
            rq.AddDatos("TGENFECHACONTABLE", fecha);
            rqmodulo.AddDatos("RQMANTENIMIENTO", rq);
            return rqmodulo;
        }

        private void Finalizar()
        {
            try {
                // actualiza registro de contro de ejecucion lote, cambia el estaus a finalizado.
                tlotecontrolejecucion control = TloteControlEjecucionDal.Find(rq.Fconatable, clote, numeroejecucion);
                control.estatus = "F";
                UpdateAnidadoThread.Actualizar(1, control);
            }
            catch (Exception e) {
                ManejadorExcepciones eh = new ManejadorExcepciones();
                logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
            }
        }


    }
}
