using modelo;
using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Runtime.Remoting;
using util;
using util.dto.interfaces.lote;
using util.interfaces;
using util.servicios.ef;

namespace dal.lote {
    /// <summary>
    ///     Clase que implemeta, dml's manuales de la tabla TloteTareas.
    /// </summary>
    public class TloteTareasDal {

        /// <summary>
        ///    Metodo que entrega la definicion de una tarea de lotes. Busca los datos en cahce, si no encuentra los datos en cache busca en la 
        ///    base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="ctarea">Codigo de tarea.</param>
        /// <param name="cmodulo">Codigo de modulo.</param>
        public static tlotetareas Find(string ctarea, int? cmodulo) {
            tlotetareas obj = null;
            string key = "" + ctarea + "^" + cmodulo;
            CacheStore cs = CacheStore.Instance;

            obj = (tlotetareas)cs.GetDatos("tlotetareas", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tlotetareas");
                obj = FindInDataBase(ctarea, cmodulo);
                Sessionef.GetAtlasContexto().Entry(obj).State = System.Data.Entity.EntityState.Detached;
                m.TryAdd(key, obj);
                cs.PutDatos("tlotetareas", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una tarea de un lote.
        /// </summary>
        /// <param name="ctarea">Codigo de tarea.</param>
        /// <param name="cmodulo">Codigo de modulo.</param>
        public static tlotetareas FindInDataBase(string ctarea, int? cmodulo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tlotetareas obj = null;

            obj = contexto.tlotetareas.Where(x => x.ctarea == ctarea && x.cmodulo == cmodulo).Single();
            return obj;
        }

        /// <summary>
        /// Entrega una instancia de tipo TareaOperacion dada la tarea a ejecutar por operacion.
        /// </summary>
        public static ITareaOperacion GetComponenteOperacion(string ctarea, int? cmodulo) {
            tlotetareas tarea = TloteTareasDal.Find(ctarea, cmodulo);
            ITareaOperacion toperacion = null;
            if (tarea.ccomponenteoperacion == null) {
                return toperacion;
            }

            try {
                string assembly = tarea.ccomponenteoperacion.Substring(0, tarea.ccomponenteoperacion.IndexOf("."));
                ObjectHandle handle = Activator.CreateInstance(assembly, tarea.ccomponenteoperacion);
                object comp = handle.Unwrap();
                toperacion = (ITareaOperacion)comp;
                return toperacion;
            } catch (TypeLoadException e) {
                throw new AtlasException("BLOTE-0001", "COMPONENTE {0} A EJECUTAR NO DEFINIDO EN TLOTETAREAS CTAREA: {1} CMODULO: {2}", e,
                    tarea.ccomponenteoperacion, ctarea, cmodulo);
            } catch (InvalidCastException e) {
                throw new AtlasException("BLOTE-0002", "COMPONENTE {0} A EJECUTAR NO IMPLEMENTA: {1} CTAREA: {2} CMODULO: {3}", e,
                    tarea.ccomponenteoperacion, toperacion.GetType().FullName, ctarea, cmodulo);
            }
        }


    }
}
