using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace util.thread {
    /// <summary>
    /// Interface a implemnetar las clases de modulos cuentas vista, cuentas plazo, prestamos etc.. Que mantiene informacion temporal utilizada  en la ejecucion de una transaccion.
    /// </summary>
    public interface IDatosModulo {

        /// <summary>
        /// Metodo encargado de encerar o limpiar datos de objetos utilizados en transacciones monetarias.
        /// </summary>
        void Encerardatos();
    }
}