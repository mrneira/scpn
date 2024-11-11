using dal.lote;
using modelo;
using System;
using System.Collections.Generic;
using System.Runtime.Remoting;
using System.Threading;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;

namespace lote.helper {

    /// <summary>
    /// Clase que se encarga de ejecutar tareas de finalizacion asociadas al codigo de lote, que llenar tareas a ejecutar por operacion.
    /// </summary>
    public class TareasFin {


        /// <summary>
        /// Metodo que obtiene una lista de componentes de negocio que se ejecutan al finalizar la ejecucion de un lote.
        /// </summary>
        public static void Procesar(tlotemodulo tlotemodulo, RequestModulo rqmodulo) {
            List<tlotemodulotareas> ltareas = TloteModuloTareasDal.FindActivos(rqmodulo.Clote, rqmodulo.Cmodulo);
		        foreach (tlotemodulotareas tarea in ltareas) {

                    Ejecutataraea(tarea, rqmodulo);
            }
        }

        /// <summary>
        /// Metodo que obtiene una instancia del proceso a ejecutar y lo invoca.
        /// </summary>
        public static void Ejecutataraea(tlotemodulotareas modulotarea, RequestModulo rqmodulo) {
            ITareaFin tfin = GetComponente(modulotarea);
		    if (tfin == null) {
			    return;
		    }
            TareasFinHilo pth = new TareasFinHilo(tfin, rqmodulo, modulotarea.ctarea, modulotarea.orden);
            Thread thread = new Thread(pth.Ejecutar);
            thread.Start();
            thread.Join();
	    }

        /// <summary>
        /// Entrega una instancia del componente a ejecutar.
        /// </summary>
        private static ITareaFin GetComponente(tlotemodulotareas modulotarea) {
            tlotetareas tarea = TloteTareasDal.Find(modulotarea.ctarea, modulotarea.cmodulo);
            ITareaFin tfin = null;
		    if (tarea.ccomponentefin == null) {
                return tfin;
            }
            try {
                string assembly = tarea.ccomponentefin.Substring(0, tarea.ccomponentefin.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, tarea.ccomponentefin);
                object comp = handle.Unwrap();
                    tfin = (ITareaFin)comp;
                return tfin;
            } catch (TypeLoadException e) {
                throw new AtlasException("BLOTE-0001", "COMPONENTE {0} A EJECUTAR NO DEFINIDO EN TLOTETAREAS CTAREA: {1} CMODULO: {2}", e,
                    tarea.ccomponentefin, modulotarea.ctarea, modulotarea.cmodulo);
            } catch (InvalidCastException e) {
                throw new AtlasException("BLOTE-0002", "COMPONENTE {0} A EJECUTAR NO IMPLEMENTA: {1} CTAREA: {2} CMODULO: {3}", e,
                    tarea.ccomponentefin, tfin.GetType().FullName, modulotarea.ctarea, modulotarea.cmodulo);
            }
	    }

  


    }
}
