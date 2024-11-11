using System;

namespace socio.enums {

    /// <summary>
    /// Enumeracion que almacena estatus del socio.
    /// </summary>
    public class EnumSocio {

        public static readonly EnumSocio ACTIVO = new EnumSocio("ACT");

        public static readonly EnumSocio BAJA = new EnumSocio("BAJ");

        public static readonly EnumSocio BAJA_LIQUIDADO = new EnumSocio("BLQ");


        /// <summary>
        /// Codigo de estatus del socio.
        /// </summary>
        private String cestatus;

        /// <summary>
        /// Entrega o fija el valor de: cestatus
        /// </summary>
        public string Cestatus { get => cestatus; set => cestatus = value; }

        /// <summary>
        /// Crea una instancia de EnumEstatus.
        /// </summary>
        /// <param name="cestatus">Codigo de estatus del socio.</param>
        private EnumSocio(String cestatus)
        {
            this.cestatus = cestatus;
        }
    }
}
