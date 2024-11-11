using core.componente;
using general.comp.mantenimiento.archivo;
using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Runtime.Remoting;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.thread;

namespace general.archivos {
    /// <summary>
    /// Clase que se encarga de procesar un archvio de forma asincronica.
    /// </summary>
    public class ArchivoHilo {

        /// <summary>
        /// Numero de hilos activos.
        /// </summary>
        public int numHilosActivos = 0;
        /// <summary>
        /// Cantidad de registros con error por Ejecución 
        /// </summary>
        public int numeroErrores = 0;
        /// <summary>
        /// numero de filas por archivos 
        /// </summary>
        public int numerolinas = 0;

        public List<Task> tasks = new List<Task>();
        /// <summary>
        /// Ejecuta la carga del archvio de manera asincronica..
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public async static void LeerArchivo(RqMantenimiento rqmantenimiento, int ctipoarchivo, int numejecucion) {
            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["rqmantenimiento"] = rqmantenimiento,
                ["ctipoarchivo"] = ctipoarchivo,
                ["numejecucion"] = numejecucion
            };
            // await EjecutarAsincronico(mdatos);

        }
        public static void LeerArchivoSincrono(RqMantenimiento rqmantenimiento, int ctipoarchivo, int numejecucion) {
            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["rqmantenimiento"] = rqmantenimiento,
                ["ctipoarchivo"] = ctipoarchivo,
                ["numejecucion"] = numejecucion
            };
            //await EjecutarAsincronico(mdatos);
            EjecutarAsincronico(mdatos);
        }

        static string EjecutarAsincronico(Dictionary<string, object> mdatos) {
            try {
                return EjecutarHilo(mdatos);
            } catch (Exception ex) {
                throw new AtlasException("0000", ex.Message);
            }


        }

        private static string EjecutarHilo(Dictionary<string, object> mdatos) {
            try {
                ArchivoHilo ah = new ArchivoHilo();
                ah.Ejecutar(mdatos);

                return "";
            } catch (Exception e) {
                throw e;
            }
        }

        public void Ejecutar(object datos) {
            //  ISession session = null;
            // ITransaction tx = null;
            string method = string.Format("{0}.{1}", MethodBase.GetCurrentMethod().DeclaringType.FullName, MethodBase.GetCurrentMethod().Name);
            Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
            AtlasContexto contexto = new AtlasContexto();
            using (var contextodb = contexto.Database.BeginTransaction()) {
                try {
                    this.LeerArchivo(mdatos);
                } catch (Exception) {
                    contextodb.Rollback();
                } finally {
                    contextodb.Dispose();
                    //   ThreadNegocio.RemoveDatos();
                }

            }
        }

        /// <summary>
        /// Obtiene y actualiza en la base el proximo codigo de secuencia.
        /// </summary>
        /// <param name="datos"></param>
        public void LeerArchivo(object datos) {
            RqMantenimiento rqmantenimiento;
            // RqMantenimiento rqmantenimientoclone;
            StreamReader file = null;
            // string[] lines;
            int numerolinas = 0; //Numero de linea del archivo que esta en ejecucion.
            string datosRegistro;  //Datos de una linea del archivo.
            string method = string.Format("{0}.{1}", MethodBase.GetCurrentMethod().DeclaringType.FullName, MethodBase.GetCurrentMethod().Name);
            Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
            RqMantenimiento rq = (RqMantenimiento)mdatos["rqmantenimiento"];

            int ctipoarchivo = (int)mdatos["ctipoarchivo"];
            string path = (string)rq.Mdatos["path"];
            int numejecucion = (int)mdatos["numejecucion"];

            try {
                file = new StreamReader(path);
                long i = File.ReadAllLines(path).Count();
                while ((datosRegistro = file.ReadLine()) != null) {
                    if (!string.IsNullOrEmpty(datosRegistro)) {
                        numerolinas++;
                        rq.AddDatos("procesoaportefin", false);
                        if (i == numerolinas) {
                            rq.AddDatos("procesoaportefin", true);
                        }
                        ProcesarPorLinea(rq, numerolinas, datosRegistro, numejecucion, rq.Cmodulo,ctipoarchivo);
                    }
                }

            } catch (Exception e) {

                throw e;
            } finally {
                try {
                    //Thread.Sleep(6000);
                    Task.WaitAll(tasks.ToArray());
                    CargarArchivo car = new CargarArchivo();
                    car.MarcarFinCargaArchivo(rq, ctipoarchivo, numejecucion);
                } catch (Exception ex) {
                    // no hacer nada si no se abrio el archivo.
                }
            }
        }
        /// <summary>
        /// Metodo que se encarga de procesar una linea del archivo. 
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se carga el archivo.</param>
        /// <param name="numlinea">Numero de linea a procesar.</param>
        /// <param name="registro">Datos de una linea del archivo.</param>
        private void ProcesarPorLinea(RqMantenimiento rq, int numlinea, string datosRegistro, int numeroEjecucion, int cmodulo, int ctipoarchivo) {
            try {
                RqMantenimiento rqmantenimiento = (RqMantenimiento)rq.Clone(); // se clona para que vaya un copia al asincrono 
                long? cpersona = rqmantenimiento.GetLong("c_pk_cpersona");
                if (cpersona != null) {
                    rqmantenimiento.RemoveDatos("c_pk_cpersona");
                }
                rqmantenimiento.Mtablas = new Dictionary<string, Tabla>();
                rqmantenimiento.Lorden = new List<string>();
                Linea linea = new Linea(rqmantenimiento, numlinea, datosRegistro, numeroEjecucion, cmodulo, ctipoarchivo);
                Consumir(linea);

            } catch (Exception e) {
                throw e;
                // Guardar bitacora por linea del archivo con error.
            }


        }

        /// <summary>
        /// Adiciona instancias de tipo Registro al pool.
        /// </summary>
        /// <param name="registro">Objeto que contiene datos del registro a procesar.</param>
        public void Producir(Linea linea) {
            //Tasks.Add(Task.Factory.StartNew(() => { Consumir(linea); }));
            Task task = new Task(() => { Consumir(linea); });
            task.Start();

            //numHilosActivos++;
        }


        /// <summary>
        /// Metodo encargado de consumir un elemento del pool.
        /// </summary>
        /// <param name="obj">Objeto que contiene datos de una instancia de Registro.</param>
        public void Consumir(Object obj) {
            try {
                // Console.WriteLine("Thread {0} consumes {1}", Thread.CurrentThread.GetHashCode(), //{0}    ((Contador)obj).id); //{1}
                //  validarnumerocampos()
                Linea reg = (Linea)obj;
                //ValidarSeparador(reg.Rqmantenimiento, reg.DatosRegistro, reg.NumLinea);
                RegistroHilo.Procesar(reg.Rqmantenimiento, reg.NumLinea, reg.DatosRegistro, (int)reg.NumEjecucion, (int)reg.Cmodulo,(int)reg.Ctipoarchivo);
            } catch (Exception e) {

                e.GetBaseException();
            } finally {
                numHilosActivos--;
            }
        }




    }

}
