using util.dto.lote;

namespace util.dto.interfaces.lote {
    public interface ITareaPrevia {

        /// <summary>
        ///     Metodo a implemtar en cada una de las clases que se encargan de obtener la tarea a ejecutar por operacion.
        /// </summary>
        /// <param name="requestmodulo">Objeto que contiene fechas contables, y transaccion desde el lote.</param>
        /// <param name="ctarea">Codigo de tarea.</param>
        /// <param name="orden">Orden de ejecucion de tarea por operacion.</param>
        void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden);
    }
}
