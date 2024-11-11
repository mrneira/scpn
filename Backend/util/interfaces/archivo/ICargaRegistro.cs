using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace util.interfaces.archivo {
    /// <summary>
    /// Interface a implementar por la clase que se encarga de procesar un registro en la carga de archivos.
    /// </summary>
    public interface ICargaRegistro {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="registro">Linea de un registro.</param>
        /// <param name="numerolinea">Numero de linea del archvio asociada al registro.</param>
        void Procesar(RqMantenimiento rqmantenimiento, string registro, int numerolinea, int cmodulo,int ctipoarchivo);

    }
}
