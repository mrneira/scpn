using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace util.thread {

    /// <summary>
    /// Crea una instancia del Thread de negocio.
    /// </summary>
    public class ThreadNegocio {

        /// <summary>
        /// Almacena una instancia de SaaveRequest con los datos de entrada.
        /// </summary>
        [ThreadStatic]
        private static Datos threadNegocio = null;

        /// <summary>
        /// Fija una instancia de datos en el ThreadNegocio.
        /// </summary>
        /// <param name="datos"></param>
        public static void FijarDatos(Datos datos) {
            ThreadNegocio.threadNegocio = datos;
        }

        /// <summary>
        /// Entrega una instancia de Datos del ThreadNegocio.
        /// </summary>
        /// <returns></returns>
        public static Datos GetDatos() {
            Datos datos = ThreadNegocio.threadNegocio;
            return datos;
        }

        /// <summary>
        /// Libera informacion del ThreadNegocio.
        /// </summary>
        public static void RemoveDatos() {
            if (ThreadNegocio.threadNegocio != null) {
                ThreadNegocio.threadNegocio = null;
            }

        }

    }
}
