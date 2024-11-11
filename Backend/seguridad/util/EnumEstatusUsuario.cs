using System.Collections.Generic;

namespace seguridad.util {

    /// <summary>
    /// Enumeraci&oacute;n que contiene los datos del cat&aacute;logo a utilizar en seguridad
    /// </summary>
    public class EnumEstatusUsuario {

        /// <summary>
        /// Codigo de modulo.
        /// </summary>
        private int ccatalogo;

        /// <summary>
        /// Crea una instancia de EnumEstatusUsuario.
        /// </summary>
        /// <param name="pCcatalogo">Codigo de modulo.</param>
        public EnumEstatusUsuario(int pCcatalogo) {
            this.ccatalogo = pCcatalogo;
        }

        public static readonly EnumEstatusUsuario ESTATUS_USUARIO = new EnumEstatusUsuario(1);

        public static IEnumerable<EnumEstatusUsuario> Values {
            get {
                yield return ESTATUS_USUARIO;
            }
        }

        public int Ccatalogo { get => ccatalogo; set => ccatalogo = value; }
    }
   
}
