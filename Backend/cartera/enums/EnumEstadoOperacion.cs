using System;

namespace cartera.enums {

    /// <summary>
    /// Enumeracion que almacena el estado de operacion de cartera.
    /// </summary>
    public class EnumEstadoOperacion {

        public static readonly EnumEstadoOperacion ORIGINAL = new EnumEstadoOperacion("N");

        public static readonly EnumEstadoOperacion NOVADA = new EnumEstadoOperacion("V");

        public static readonly EnumEstadoOperacion RESTRUCTURADA = new EnumEstadoOperacion("E");

        public static readonly EnumEstadoOperacion REFINANCIADA = new EnumEstadoOperacion("F");

        /// <summary>
        /// Codigo de estado de operacion.
        /// </summary>
        private String cestadooperacion;

        /// <summary>
        /// Entrega o fija el valor de: cestadooperacion
        /// </summary>
        public string CestadoOperacion { get => cestadooperacion; set => cestadooperacion = value; }

        /// <summary>
        /// Crea una instancia de EnumEstadoOperacion.
        /// </summary>
        /// <param name="cestadooperacion">Codigo de estado de operacion.</param>
        private EnumEstadoOperacion(String cestadooperacion)
        {
            this.cestadooperacion = cestadooperacion;
        }
    }
}
