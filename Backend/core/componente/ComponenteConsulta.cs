using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;

namespace core.componente {
    /// <summary>
    /// Clase a implementar por los componentes de negocio encargados de ejecutar consultas especiales.
    /// </summary>
    public abstract class ComponenteConsulta {

        /// <summary>
        /// Implementa logica de negocio a invocar cuando una consulta.
        /// </summary>
        /// <param name="rqconsulta">Objeto con beans utilizados en el proceso de una consulta.</param>
        public abstract void Ejecutar(RqConsulta rqconsulta) ;
    }
}
