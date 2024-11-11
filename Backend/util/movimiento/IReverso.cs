using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace util.movimiento {

    /// <summary>
    /// Interface que tiene que implementar los modulos para ejecutar reversos.
    /// </summary>
    public interface IReverso {

        /// <summary>
        /// Ejecuta un reverso para el modulo, operacion y numeor de mensaje.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta el reverso.</param>
        /// <param name="tmonmovimiento">OBjeto que contiene el mensaje, opracion y modulo a reversar.</param>
        void Ejecutar(RqMantenimiento rqmantenimiento, IBean tmonmovimiento);
    }
}
