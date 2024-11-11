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
    /// Clase que se encarga de ejecutar tareas previas asociadas al codigo de lote, que llenar tareas a ejecutar por operacion.
    /// </summary>
    public class TareasPrevias {


        /// <summary>
        /// Metodo que obtiene una lista de componentes de negocio que llenan tareas a ejecutar por operacion.
        /// </summary>
        public static void Procesar(tlotemodulo tlotemodulo, RequestModulo rqmodulo) {
            List<tlotemodulotareas> ltareas = TloteModuloTareasDal.FindActivos(rqmodulo.Clote, rqmodulo.Cmodulo);
		    foreach (tlotemodulotareas modtarea in ltareas) {
                Ejecutatarea(modtarea, rqmodulo);
            }
        }

        /// <summary>
        /// Metodo que entrega los datos comunes para el procesamiento de tareas.
        /// </summary>
        public static void Ejecutatarea(tlotemodulotareas modulotarea, RequestModulo rqmodulo) {
            ITareaPrevia tprevia = GetComponente(modulotarea);
		    if (tprevia == null) {
			    return;
		    }
		    TareasPreviasHilo pth = new TareasPreviasHilo(tprevia, rqmodulo, modulotarea.ctarea, modulotarea.orden);
            Thread thread = new Thread(pth.Ejecutar);
            thread.Start();
            thread.Join();
	    }

        /// <summary>
        /// Entrega una instancia del componente a ejecutar.
        /// </summary>
        private static ITareaPrevia GetComponente(tlotemodulotareas modulotarea) {
            tlotetareas tarea = dal.lote.TloteTareasDal.Find(modulotarea.ctarea, modulotarea.cmodulo);
		    ITareaPrevia tprevia = null;
		    if (tarea.ccomponenteprevio == null) {
			    return tprevia;
		    }

            try {
                string assembly = tarea.ccomponenteprevio.Substring(0, tarea.ccomponenteprevio.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, tarea.ccomponenteprevio);
                object comp = handle.Unwrap();
                tprevia = (ITareaPrevia)comp;
                return tprevia;
            } catch (TypeLoadException e) {
                throw new AtlasException("BLOTE-0001", "COMPONENTE {0} A EJECUTAR NO DEFINIDO EN TLOTETAREAS CTAREA: {1} CMODULO: {2}", e, 
                    tarea.ccomponenteprevio, modulotarea.ctarea, modulotarea.cmodulo);
            } catch (InvalidCastException e) {
                throw new AtlasException("BLOTE-0002", "COMPONENTE {0} A EJECUTAR NO IMPLEMENTA: {1} CTAREA: {2} CMODULO: {3}", e, 
                    tarea.ccomponenteprevio, tprevia.GetType().FullName, modulotarea.ctarea, modulotarea.cmodulo);
            }

	    }
    }
}
