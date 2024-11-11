using System;

namespace bancaenlinea.enums {

    /// <summary>
    /// Enumeracion que almacena usuarios por defecto.
    /// </summary>
    public class EnumUsers {

        public static readonly EnumUsers BLINEA = new EnumUsers("BLINEA");

        public static readonly EnumUsers BMOVIL = new EnumUsers("BMOVIL");

        /// <summary>
        /// Codigo de usuario.
        /// </summary>
        private String cuser;

        /// <summary>
        /// Entrega o fija el valor de: cuser
        /// </summary>
        public string Cuser { get => cuser; set => cuser = value; }

        /// <summary>
        /// Crea una instancia de cuser.
        /// </summary>
        /// <param name="cuser">Codigo de usuario.</param>
        private EnumUsers(String cuser)
        {
            this.cuser = cuser;
        }
    }
}
