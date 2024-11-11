using core.servicios;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Remoting;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.interfaces.archivo;
using util.servicios.ef;
using util.thread;

namespace general.archivos {

    public class RegistroHilo {

        private tgencargaarchivo tgenCargaArchivo;
        private int ctipoarchivo,cmodulo;

        /// <summary>
        /// Clase que se encarga de procesar un registro del archivo.
        /// </summary>
        /// <param name="csecuencia">Codigo de secuencia.</param>
        public static void Procesar(RqMantenimiento rqmantenimiento, int numlinea, string datosRegistro, int numeroEjecucion, int cmodulo,int ctipoarchivo) {
            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["rqmantenimiento"] = rqmantenimiento,
                ["numlinea"] = numlinea,
                ["datosRegistro"] = datosRegistro,
                ["numEjecucion"] = numeroEjecucion,
                ["cmodulo"] = cmodulo,
                ["ctipoarchivo"] = ctipoarchivo
            };
            RegistroHilo rh = new RegistroHilo();
            rh.Ejecutar(mdatos);
            /*RegistroHilo rh = new RegistroHilo();
            Thread thread = new Thread(rh.Ejecutar);
            thread.Start(mdatos);
            thread.Join();*/
        }

        /// <summary>
        /// Obtiene y actualiza en la base el proximo codigo de secuencia.
        /// </summary>
        /// <param name="datos"></param>
        public void Ejecutar(object datos) {


            Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
            RqMantenimiento rqmantenimiento = (RqMantenimiento)mdatos["rqmantenimiento"];
            cmodulo = (int)mdatos["cmodulo"];
            ctipoarchivo = (int)mdatos["ctipoarchivo"];

            AtlasContexto contexto = new AtlasContexto();
            using (var contextodb = contexto.Database.BeginTransaction()) {
                try {
                    Sessionef.FijarAtlasContexto(contexto);
                    tgenCargaArchivo = TgenCargaArchivoDal.Find(cmodulo,ctipoarchivo);
                    this.ValidarForma(mdatos);
                    this.ProcesarRegistro(mdatos);
                    contexto.SaveChanges();
                    contextodb.Commit();
                    this.BitacoraLineaOK(mdatos);
                } catch (Exception e) {
                    //contextodb.Rollback();
                    //rqmantenimiento.Grabar();
                    BitacoraLineaError(datos, e);
                    //throw new AtlasException("0000",e.Message);
                } finally {
                    contexto.Dispose();
                    //contextodb.Dispose();
                }
            }


        }

        /// <summary>
        /// Metodo que se encarga de procesar un registro del archivo, si existe errores registra en la tabla tgencargacontrolerrores.
        /// </summary>
        /// <param name="mdatos">Objeto que contiene los datos con los que se procesa un registro del archivo.</param>
        private void ProcesarRegistro(Dictionary<string, object> mdatos) {

            string method = string.Format("{0}.{1}", MethodBase.GetCurrentMethod().DeclaringType.FullName, MethodBase.GetCurrentMethod().Name);
            RqMantenimiento rqmantenimiento = (RqMantenimiento)mdatos["rqmantenimiento"];

            ThreadNegocio.RemoveDatos();
            Datos d = new Datos();
            ThreadNegocio.FijarDatos(d);
            d.Compania = rqmantenimiento.Ccompania;
            ThreadNegocio.GetDatos().Request = rqmantenimiento;
            int numlinea = (int)mdatos["numlinea"];
            string datosRegistro = (string)mdatos["datosRegistro"];

            // Obtiene una instancia de la clase encargada de procesar un registro.
            ICargaRegistro cr = this.GetInstanciaCargaRegistro(tgenCargaArchivo.claseregistro, (int)tgenCargaArchivo.ctipoarchivo);
            try {

                cr.Procesar(rqmantenimiento, datosRegistro, numlinea, cmodulo, ctipoarchivo);
            } catch (Exception e) {
                throw e;
            }

        }

        /// <summary>
        /// Entrega una instancia de la clase encargada de procesar un registro del archivo.
        /// </summary>
        /// <param name="claseregistro">Clase a obtener la instancia.</param>
        /// <param name="ctipoarchivo">Codigo de tipo de archivo.</param>
        /// <returns></returns>
        private ICargaRegistro GetInstanciaCargaRegistro(string claseregistro, int ctipoarchivo) {
            ICargaRegistro cr = null;
            try {
                string assembly = claseregistro.Substring(0, claseregistro.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, claseregistro);
                object comp = handle.Unwrap();
                cr = (ICargaRegistro)comp;

            } catch (TypeLoadException e) {
                throw new AtlasException("BGEN-019", string.Format("CLASE: {0} A EJECUTAR NO EXISTE TIPO ARCHIVO: {1} "), e, claseregistro,
                                 ctipoarchivo);
            } catch (InvalidCastException e) {
                throw new AtlasException("BGEN-020", string.Format("PROCESO {0} A EJECUTAR PARA EL TIPO ARCHIVO: {1} NO IMPLEMENTA {3}"), e, claseregistro,
                                 ctipoarchivo, cr.GetType().FullName);
            }
            return cr;
        }


        public void BitacoraLineaError(object datos, Exception e) {
            Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
            RqMantenimiento rqmantenimiento = (RqMantenimiento)mdatos["rqmantenimiento"];
            int cnumerolinea = (int)mdatos["numlinea"];
            int numejecucion = (int)mdatos["numEjecucion"];
            int fechaproceso = (int)rqmantenimiento.Ftrabajo;
            int idproceso = (int)rqmantenimiento.Mdatos["idproceso"];
            int cmodulo = rqmantenimiento.Cmodulo;
            //tgencargacontrol control = new tgencargacontrol();

            tgencargacontrolerrores controlreg = new tgencargacontrolerrores();
            controlreg.idproceso = idproceso;
            controlreg.cmodulo = cmodulo;
            controlreg.ctipoarchivo = ctipoarchivo;
            controlreg.fproceso = Fecha.DateToInteger(rqmantenimiento.Freal);
            controlreg.numeroejecucion = numejecucion;
            controlreg.numerolinea = cnumerolinea;
            controlreg.mensaje = (e.InnerException == null) ? e.Message : e.InnerException.ToString().Substring(0, 490);
            controlreg.Esnuevo = true;
            controlreg.freal = DateTime.Now; // Fecha.GetFecha((int)rqmantenimiento.Ftrabajo); // DateTime.Parse( rqmantenimiento.Ftrabajo.ToString()); 
            controlreg.cresultado = "E";
            if (cmodulo == 28 && ctipoarchivo == 1) {
                InsertAnidadoThread.Grabar(1, controlreg);
            } else {
                InsertAnidadoThread.GrabarJoin(1, controlreg);
            }


        }

        public void BitacoraLineaOK(object datos) {
            Dictionary<string, object> mdatos = (Dictionary<string, object>)datos;
            RqMantenimiento rqmantenimiento = (RqMantenimiento)mdatos["rqmantenimiento"];
            long tipoArchivo = (long)rqmantenimiento.Mdatos["ctipoarchivo"];
            int cnumerolinea = (int)mdatos["numlinea"];
            int numejecucion = (int)mdatos["numEjecucion"];
            int idproceso = (int)rqmantenimiento.Mdatos["idproceso"];
            int fechaproceso = (int)Fecha.DateToInteger(rqmantenimiento.Freal);
            int cmodulo = rqmantenimiento.Cmodulo;
            tgencargacontrol control = new tgencargacontrol();
            control = TgenCargaControlDal.Find(fechaproceso, cmodulo, ctipoarchivo, numejecucion, 1);
            tgencargacontrolerrores controlreg = new tgencargacontrolerrores();
            controlreg.idproceso = idproceso;
            controlreg.cmodulo = cmodulo;
            controlreg.ctipoarchivo = (int)tipoArchivo;
            controlreg.fproceso = Fecha.DateToInteger(rqmantenimiento.Freal);
            controlreg.numeroejecucion = numejecucion;
            controlreg.numerolinea = cnumerolinea;
            controlreg.cresultado = "OK";
            controlreg.mensaje = "OK";
            controlreg.Esnuevo = true;
            controlreg.freal = rqmantenimiento.Freal;//Fecha.GetFecha((int)rqmantenimiento.Ftrabajo); // DateTime.Parse( rqmantenimiento.Ftrabajo.ToString()); 

            InsertAnidadoThread.Grabar(1, controlreg);

        }

        private void ValidarForma(Dictionary<string, object> mdatos) {
            RqMantenimiento rqmantenimiento = (RqMantenimiento)mdatos["rqmantenimiento"];
            int numlinea = (int)mdatos["numlinea"];
            int cmodulo = (int)mdatos["cmodulo"];
            int numeroarchivo = (int)mdatos["ctipoarchivo"];
            string linea = (string)mdatos["datosRegistro"];
            string cadenaerror = string.Empty;

            IList<tgencargacampos> campos = TgenCargaCamposDal.FindInDataBase(cmodulo,numeroarchivo);
            
            String[] lcampos = linea.Split(Convert.ToChar(tgenCargaArchivo.separadorcolumnas));
            if (campos.Count != lcampos.Length)
                cadenaerror = cadenaerror + string.Format("CANTIDAD DE CAMPOS DIFERENTE  {0}", lcampos.Length.ToString());

            if (!string.IsNullOrEmpty(cadenaerror))
                throw new Exception(cadenaerror);

        }

    }
}
