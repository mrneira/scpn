using core.componente;
using core.servicios;
using dal.generales;
using general.archivos;
using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.Remoting;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.thread;

namespace general.comp.mantenimiento.archivo {
    public class CargarArchivo : ComponenteMantenimiento {
        public int ctipoarchivo;
        public int numejecucion;
        /// <summary>    
        /// Ejecuta la carga de archivos, levanta un hilo para que el proceso sea asincronico.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string path = "";
            string narchivo = "";
            try {
                ctipoarchivo = Int32.Parse(rqmantenimiento.Mdatos["ctipoarchivo"].ToString());
                tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
                path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
                narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                path = path + "/" + narchivo;
                if (File.Exists(path)) {
                    rqmantenimiento.AddDatos("path", path);
                    numejecucion = this.CreaControl(rqmantenimiento, ctipoarchivo);

                    // Ejecuta carga del archivo en forma asincronica. 
                    ArchivoHilo.LeerArchivoSincrono(rqmantenimiento, ctipoarchivo, numejecucion);
                } else {
                    throw new AtlasException("GEN-018", "ARCHIVO NO EXISTE: {0}", narchivo);
                }
            } catch (Exception e) {
                rqmantenimiento.Response.SetCod("0001");
                rqmantenimiento.Response.SetMsgusu(e.Message + numejecucion);
            }
        }

        /// <summary>
        /// Verifica que no se este ejecutando una carga de archvio, crea una registro de control de carga de archvio y retorna el numero de ejecucion de carga de archivo.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="ctipoarchivo">Codigo de toipo de archvio.</param>
        /// <returns></returns>
        private int CreaControl(RqMantenimiento rqmantenimiento, int ctipoarchivo) {
            tgencargacontrol controlExistente = TgenCargaControlDal.ValidaenEjecucion((int)rqmantenimiento.Ftrabajo, rqmantenimiento.Cmodulo, ctipoarchivo, (string)rqmantenimiento.Mdatos["narchivo"]);
            if (controlExistente == null) {
                int numeroejecucion = TgenCargaControlDal.GetNumeroEjecucion((int)rqmantenimiento.Ftrabajo, rqmantenimiento.Cmodulo,ctipoarchivo, (string)rqmantenimiento.Mdatos["narchivo"]);
                tgencargacontrol control = TgenCargaControlDal.Crear((int)Fecha.DateToInteger(rqmantenimiento.Freal), rqmantenimiento.Cmodulo,ctipoarchivo, numeroejecucion, (string)rqmantenimiento.Mdatos["narchivo"]);
                //Inserta en la base un registro de ejecucion del archvio.
                InsertAnidadoThread.Grabar(1, control);
                tgencargabitacora bitacora = TgenCargaBitacoraDal.Crear((int)Fecha.DateToInteger(rqmantenimiento.Freal), rqmantenimiento.Cmodulo, ctipoarchivo, numeroejecucion, control.idproceso);
                InsertAnidadoThread.Grabar(1, bitacora);
                rqmantenimiento.AddDatos("idproceso", control.idproceso);
                return numeroejecucion;
            } else {
                tgencargacontrol statusControl = TgenCargaControlDal.Find(controlExistente.fproceso, rqmantenimiento.Cmodulo, controlExistente.ctipoarchivo, controlExistente.numeroejecucion, controlExistente.idproceso);
                if (statusControl.cestado == "F") {
                    throw new AtlasException("0001", "Archivo ya se cargo " + controlExistente.nombre);
                } else {
                    throw new AtlasException("0001", "Archivo se encuentra en proceso de carga " + controlExistente.nombre);
                }
            }


        }

        public void MarcarFinCargaArchivo(RqMantenimiento rqmantenimiento, int ctipoarchivo, int numejecucion) {
            AtlasContexto contexto = new AtlasContexto();
            Sessionef.FijarAtlasContexto(contexto);
            tgencargacontrol controlExistente = TgenCargaControlDal.ValidaenEjecucion(Fecha.DateToInteger(rqmantenimiento.Freal), rqmantenimiento.Cmodulo, ctipoarchivo, (string)rqmantenimiento.Mdatos["narchivo"]);
            tgencargabitacora bitacora = new tgencargabitacora();
            tgencargacontrol control = TgenCargaControlDal.Find(Fecha.DateToInteger(rqmantenimiento.Freal), rqmantenimiento.Cmodulo, ctipoarchivo, numejecucion, controlExistente.idproceso);
            control.cestado = "F";
            Sessionef.Actualizar(control);
            bitacora = TgenCargaBitacoraDal.Find(Fecha.DateToInteger(rqmantenimiento.Freal), rqmantenimiento.Cmodulo, ctipoarchivo, numejecucion, controlExistente.idproceso);
            if (bitacora != null) {
                bitacora.cusuario = rqmantenimiento.Cusuario;
                bitacora.ffinalizacion = DateTime.Now;
                bitacora.totalexisto = TgenCargaControlErroresDal.ContarOK(Fecha.DateToInteger(rqmantenimiento.Freal), ctipoarchivo, numejecucion, controlExistente.idproceso);
                bitacora.totalerror = TgenCargaControlErroresDal.ContarErrores(Fecha.DateToInteger(rqmantenimiento.Freal), ctipoarchivo, numejecucion, controlExistente.idproceso);
                bitacora.totalregistros = bitacora.totalexisto + bitacora.totalerror;

            } else {
                bitacora = new tgencargabitacora();
                bitacora.cusuario = rqmantenimiento.Cusuario;
                bitacora.cmodulo = rqmantenimiento.Cmodulo;
                bitacora.ctipoarchivo = ctipoarchivo;
                bitacora.fproceso = (int)rqmantenimiento.Ftrabajo;
                bitacora.numeroejecucion = numejecucion;
                bitacora.ffinalizacion = DateTime.Now;
                bitacora.totalerror = TgenCargaControlErroresDal.ContarErrores(Fecha.DateToInteger(rqmantenimiento.Freal), ctipoarchivo, numejecucion, controlExistente.idproceso);

            }
            Sessionef.Actualizar(bitacora);
            rqmantenimiento.Response.SetCod("0000");
            rqmantenimiento.Response.SetMsgusu("ID PROCESO:" + controlExistente.idproceso + "EJECUCION: " + numejecucion + " : TERMINADO");
            rqmantenimiento.Response["numejecucion"] = numejecucion;
            rqmantenimiento.Response["idproceso"] = controlExistente.idproceso;


            using (var contextoDB = contexto.Database.BeginTransaction()) {
                try {
                    contexto.SaveChanges();
                    contextoDB.Commit();
                } catch (Exception ex) {
                    contextoDB.Rollback();
                } finally {
                    contextoDB.Dispose();
                }
            }
        }



    }

}
