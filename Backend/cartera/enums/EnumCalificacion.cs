using System;

namespace cartera.enums {

    /// <summary>
    /// Enumeracion que almacena la calificacion de cartera.
    /// </summary>
    public class EnumCalificacion {

        public static readonly EnumCalificacion A_1 = new EnumCalificacion("A-1");

        public static readonly EnumCalificacion A_2 = new EnumCalificacion("A-2");

        public static readonly EnumCalificacion A_3 = new EnumCalificacion("A-3");

        public static readonly EnumCalificacion B_1 = new EnumCalificacion("B-1");

        public static readonly EnumCalificacion B_2 = new EnumCalificacion("B-2");

        public static readonly EnumCalificacion C_1 = new EnumCalificacion("C-1");

        public static readonly EnumCalificacion C_2 = new EnumCalificacion("C-2");

        public static readonly EnumCalificacion D = new EnumCalificacion("D");

        public static readonly EnumCalificacion E = new EnumCalificacion("E");

        /// <summary>
        /// Codigo de calificacion.
        /// </summary>
        private String ccalificacion;

        /// <summary>
        /// Entrega o fija el valor de: ccalificacion
        /// </summary>
        public string Ccalificacion { get => ccalificacion; set => ccalificacion = value; }

        /// <summary>
        /// Crea una instancia de EnumCalificacion.
        /// </summary>
        /// <param name="ccalificacion">Codigo de calificacion.</param>
        private EnumCalificacion(String ccalificacion)
        {
            this.ccalificacion = ccalificacion;
        }
    }
}
