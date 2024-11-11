using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace core.componente {

    /// <summary>
    /// Clase a extender por los componentes de negocio que se ejecutan a nivel de transaccion.
    /// </summary>
    public abstract class ComponenteMantenimiento {

        /// <summary>
        /// Codigo de flujo, con el que crea un a instancia ProcessInstanceInfo
        /// </summary>
        private String flujo;
        /// <summary>
        /// Base de conocimiento al que pertenece el flujo.
        /// </summary>
        private String cbaseconocimiento;
        /// <summary>
        /// Nombre del store procedure a ejecutar.
        /// </summary>
        private String storeprocedure;

        public string Flujo { get => flujo; set => flujo = value; }
        public string Cbaseconocimiento { get => cbaseconocimiento; set => cbaseconocimiento = value; }
        public string Storeprocedure { get => storeprocedure; set => storeprocedure = value; }

        /// <summary>
        /// Implementa logica de negocio a invocar cuando una transaccion se ejecuta en modo normal.
        /// </summary>
        /// <param name="rqmantenimiento">Objeto con beans utilizados en el proceso de una transaccion.</param>
        public abstract void Ejecutar(RqMantenimiento rqmantenimiento);

    }
}
