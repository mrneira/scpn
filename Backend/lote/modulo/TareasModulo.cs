using modelo.servicios;
using resultado;
using System;
using System.Collections.Generic;
using System.Threading;
using util.dto.lote;
using util.dto.mantenimiento;
using util.thread;

namespace modulo {

    /// <summary>
    /// Clase que se encarga de generar y crear archivos
    /// </summary>
    /// <author>amerchan</author>
    public abstract class TareasModulo {

        /// <summary>
        /// Result que contiene la operacion a la cual se ejecutan tareas.
        /// </summary>
        protected ScrollableResults rSet;
        /// <summary>
        /// Request con el que se ejecutan transacciones.
        /// </summary>
        protected RqMantenimiento rqmantenimiento;
        /// <summary>
        /// Objeto que contiene fechas contables y el modulo en ejecucion.
        /// </summary>
        protected RequestModulo rqmodulo;

        protected RequestResultadoLote rqresultado;

        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public abstract void Procesar(RqMantenimiento rqmantenimiento, RequestModulo rqmodulo, int? numerohilos);

        protected abstract void EjecutaOperacion(ExecutorService pool, Dictionary<string, object> idunico, int secuencia);

        protected void Inicializaejecucion() {
            this.LlenarRqResultado(this.rqmantenimiento, this.rqmodulo);
            this.CrearResultado();
        }

        /// <summary>
        /// Recorre el resultset que contiene los numeros de operacion a ejecutar el tareas del lote, ejecuta por operacion.
        /// </summary>
        protected void Ejecutar(int? numerohilos) {
            ExecutorService pool = new ExecutorService(numerohilos);
            int secuencia = 0;
            try {
                if (this.rSet != null) {
                    try {
                        while (!pool.EstaTerminado()) {
                            if (!pool.ExisteDisponibilidad()) {
                                Thread.Sleep(600);
                            } else {
                                if (this.rSet.Next()) {
                                    Dictionary<string, object> obj = this.rSet.Get();
                                    // Ejecuta tareas por operacion o por criterio unico de ejecucion.
                                    secuencia++;
                                    this.EjecutaOperacion(pool, obj, secuencia);
                                } else {
                                    pool.CerrarPool();
                                }
                            }
                            pool.Consumir();
                        }
                    } catch (Exception e) {
                        logger.Error($"{string.Join(".", e.TargetSite.DeclaringType.FullName, e.TargetSite.Name)} - {e.Message} - {e.InnerException}");
                    }
                }
            } finally {

            }
            this.FinalizaResultado(secuencia);
        }

        private void CrearResultado() {
            ResultadoLote result = new ResultadoLote(this.rqresultado, rqmantenimiento, "C");
            Thread thread = new Thread(result.Ejecutar);
            thread.Start();
        }

        private void FinalizaResultado(int secuencia) {
            Thread.Sleep(1000);

            this.rqresultado.Total = secuencia;
            ResultadoLote result = new ResultadoLote(this.rqresultado, rqmantenimiento, "F");
            Thread thread = new Thread(result.Ejecutar);
            thread.Start();
        }

        /// <summary>
        /// Llena objeto con el cual se graba, el resultado de la ejecucion del lote.
        /// </summary>
        protected void LlenarRqResultado(RqMantenimiento rqmantenimiento, RequestModulo rqmodulo) {
            this.rqresultado = new RequestResultadoLote();

            this.rqresultado.Ccompania = rqmantenimiento.Ccompania;
            this.rqresultado.Clote = rqmodulo.Clote;
            this.rqresultado.Cmodulo = rqmodulo.Cmodulo;
            this.rqresultado.Cmodulotransaccionejecucion = rqmantenimiento.Cmodulotranoriginal;
            this.rqresultado.Ctransaccionejecucion = rqmantenimiento.Ctranoriginal;
            this.rqresultado.Cusuario = rqmantenimiento.Cusuario;
            this.rqresultado.Fconatble = rqmodulo.Fconatble;
            this.rqresultado.Mensaje = rqmantenimiento.Mensaje;
            this.rqresultado.Numeroejecucion = rqmodulo.Numeroejecucion;
            this.rqresultado.Filtros = (String)rqmantenimiento.GetDatos("filtroslote");
            this.rqresultado.Secuenciaresultado = rqmodulo.Secuenciaresultado;
            this.rqresultado.Ctareahorizontal = rqmodulo.Ctareahorizontal;
        }


    }
}