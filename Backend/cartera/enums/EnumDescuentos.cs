using System;

namespace cartera.enums {

    /// <summary>
    /// Enumeracion que almacena estatus de cartera.
    /// </summary>
    public class EnumDescuentos {

        public static readonly EnumDescuentos COMANDANCIA = new EnumDescuentos("COM", "COMANDANCIA");

        public static readonly EnumDescuentos ISSPOL = new EnumDescuentos("ISP", "ISSPOL");

        public static readonly EnumDescuentos BANCOS = new EnumDescuentos("BAN", "BANCOCENTRAL");

        /// <summary>
        /// Codigo de institucion de descuento.
        /// </summary>
        private String cinstitucion;
        /// <summary>
        /// Codigo de saldo de descuento.
        /// </summary>
        private String csaldo;

        /// <summary>
        /// Entrega o fija el valor de: cinstitucion
        /// </summary>
        public string Cinstitucion { get => cinstitucion; set => cinstitucion = value; }
        /// <summary>
        /// Entrega o fija el valor de: csaldo
        /// </summary>
        public string Csaldo { get => csaldo; set => csaldo = value; }

        /// <summary>
        /// Crea una instancia de EnumDescuentos.
        /// </summary>
        /// <param name="cinstitucion">Codigo de institucion de descuento.</param>
        private EnumDescuentos(String cinstitucion, String csaldo)
        {
            this.cinstitucion = cinstitucion;
            this.csaldo = csaldo;
        }
    }
}
