using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util {

    /// <summary>
    /// Interface a implementar en la clase que se encarga de entregar la version actual, de registros que manejan versionamiento de registros.
    /// </summary>
    public interface IVersionActual {

        /// <summary>
        /// Entrega la version actual del registro.
        /// </summary>
        /// <param name="bean">Objeto a obtener la version actual del registro.</param>
        /// <returns></returns>
        int GetVersionActual(AbstractDto bean);
    }

}
