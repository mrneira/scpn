using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace core.componente {

    /// <summary>
    /// Clase a extender por los componentes de negocio de reverso que se ejecutan a nivel de transaccion.
    /// </summary>
    public abstract class ComponenteMantenimientoReverso {
        /// <summary>
        /// Implementa logica de negocio a invocar cuando una transaccion se ejecuta en modo normal.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con beans utilizados en el proceso de una transaccion.</param>
        public abstract void EjecutarReverso(RqMantenimiento rqmantenimiento);
    }
}
