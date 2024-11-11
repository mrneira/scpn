using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace core.componente {
    public abstract class ComponenteMonetarioFin {

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
