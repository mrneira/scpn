using modelo;

namespace garantias.datos {

    /// <summary>
    /// Clase que se encarga de manejar una operacion de garantias.
    /// </summary>
    public class Operacion {

        /// <summary>
        /// Numero de garantia.
        /// </summary>
        private string coperacion;
        /// <summary>
        /// Objeto que almacena informacion de una garantia.
        /// </summary>
        private tgaroperacion tgaroperacion;

        /// <summary>
        /// Crea una instancia de Operacion.
        /// </summary>
        /// <param name="tgaroperacion"></param>
        public Operacion(tgaroperacion tgaroperacion) {
            this.tgaroperacion = tgaroperacion;
        }

        /// <summary>
        /// Entrega el valor de: coperacion
        /// </summary>
        /// <returns></returns>
        public string getCoperacion() {
            return coperacion;
        }

        /// <summary>
        /// Fija el valor de: coperacion
        /// </summary>
        /// <param name="coperacion"></param>
        public void setCoperacion(string coperacion) {
            this.coperacion = coperacion;
        }

        /// <summary>
        /// Entrega el valor de: tgaroperacion
        /// </summary>
        /// <returns></returns>
        public tgaroperacion getTgaroperacion() {
            return tgaroperacion;
        }

    }
}
