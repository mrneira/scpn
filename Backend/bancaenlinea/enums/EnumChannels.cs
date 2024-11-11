using System;

namespace bancaenlinea.enums {

    /// <summary>
    /// Enumeracion que almacena el canal por defecto.
    /// </summary>
    public class EnumChannels {

        public static readonly EnumChannels BLINEA = new EnumChannels("BAN");

        public static readonly EnumChannels BMOVIL = new EnumChannels("BMV");

        /// <summary>
        /// Codigo de canal.
        /// </summary>
        private String cchannel;

        /// <summary>
        /// Entrega o fija el valor de: cchannel
        /// </summary>
        public string Cchannel { get => cchannel; set => cchannel = value; }

        /// <summary>
        /// Crea una instancia de cchannel.
        /// </summary>
        /// <param name="cchannel">Codigo de canal.</param>
        private EnumChannels(String cchannel)
        {
            this.cchannel = cchannel;
        }
    }
}
