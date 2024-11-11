using System;

namespace cartera.enums {

    /// <summary>
    /// Enumeracion que almacena el tipo de operacion de cartera.
    /// </summary>
    public class EnumTipoOperacion {

        public static readonly EnumTipoOperacion QUIROGRAFARIO = new EnumTipoOperacion(700, 1);

        public static readonly EnumTipoOperacion HIPOTECARIO = new EnumTipoOperacion(701, 3);

        public static readonly EnumTipoOperacion PRENDARIO = new EnumTipoOperacion(706, 2);


        /// <summary>
        /// Codigo de tipo de operacion.
        /// </summary>
        private int tipooperacion;

        /// <summary>
        /// Codigo de producto.
        /// </summary>
        private int cproducto;

        /// <summary>
        /// Entrega o fija el valor de: tipooperacion
        /// </summary>
        public int TipoOperacion { get => tipooperacion; set => tipooperacion = value; }

        /// <summary>
        /// Entrega o fija el valor de: tipooperacion
        /// </summary>
        public int Cproducto { get => cproducto; set => cproducto = value; }

        /// <summary>
        /// Crea una instancia de EnumTipoOperacion.
        /// </summary>
        /// <param name="tipooperacion">Codigo de tipo de operacion.</param>
        private EnumTipoOperacion(int tipooperacion, int cproducto)
        {
            this.tipooperacion = tipooperacion;
            this.cproducto = cproducto;
        }
    }
}
