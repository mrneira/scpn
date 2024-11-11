using util.dto.mantenimiento;

namespace util.dto.interfaces.lote {
    public interface ITareaOperacion {

        /// <summary>
        ///     Metodo a implemtar en cada una de las clases que se encargan de obtener la tarea a ejecutar por operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta el lote.</param>
        /// <param name="requestoperacion">Request de la operacion.</param>
        void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion);
    }
}
