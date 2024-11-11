using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.componente {

    /// <summary>
    /// Calse a extender por los componentes de negocio monetarios que se ejecutan al inicio de la transaccion monetaria.
    /// </summary>
    public abstract class ComponenteMonetarioInicio {

        /// <summary>
        /// Implementa logica de negocio a invocar cuando una transaccion se ejecuta en modo normal.
        /// </summary>
        /// <param name="comprobantemonetario">Objeto que contiene los datos del comprobante moentario.</param>
        public abstract void Ejecutar(Object comprobantemonetario);

        /// <summary>
        /// Implementa logica de negocio a invocar cuando una transaccion se ejecuta en modo reverso.
        /// </summary>
        /// <param name="comprobantemonetario">Objeto que contiene los datos del comprobante moentario.</param>
        public abstract void EjecutarReverso(Object comprobantemonetario);
    }
}
