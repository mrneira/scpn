using System;

namespace cartera.enums {

    /// <summary>
    /// Enumeracion que almacena estatus de cartera.
    /// </summary>
    public class EnumPersonas {

        public static readonly EnumPersonas DEUDOR = new EnumPersonas(1);

        public static readonly EnumPersonas CODEUDOR = new EnumPersonas(3);

        public static readonly EnumPersonas GARANTE = new EnumPersonas(2);

        /// <summary>
        /// Codigo de tipo de persona.
        /// </summary>
        private int ctipo;

        /// <summary>
        /// Entrega o fija el valor de: ctipo
        /// </summary>
        public int Ctipo { get => ctipo; set => ctipo = value; }

        /// <summary>
        /// Crea una instancia de EnumPersonas.
        /// </summary>
        /// <param name="ctipo">Codigo de tipo de persona.</param>
        private EnumPersonas(int ctipo)
        {
            this.ctipo = ctipo;
        }
    }
}
