using System.Collections.Generic;

namespace seguridad.util {

    /// <summary>
    /// Enumeraci&oacute;n que contiene los codigos del detalle de catalogo de los usuarios
    /// </summary>
    public class EnumDetalleEstatusUsuario {

        /// <summary>
        /// C&oacute;digo de cat&aacute;logo
        /// </summary>
        private string detalle;

        /// <summary>
        /// M&eacute;todo que devuelve el c&oacute;digo del cat&aacute;logo respectivo
        /// </summary>
        /// <param name="pCcatalogo">Codigo de modulo.</param>
        public EnumDetalleEstatusUsuario(string pCdetalle) {
            this.detalle = pCdetalle;
        }

        public static readonly EnumDetalleEstatusUsuario ACTIVO = new EnumDetalleEstatusUsuario("ACT");

        public static readonly EnumDetalleEstatusUsuario CREADO = new EnumDetalleEstatusUsuario("CRE");

        public static readonly EnumDetalleEstatusUsuario INACTIVO = new EnumDetalleEstatusUsuario("INA");

        public static IEnumerable<EnumDetalleEstatusUsuario> Values {
            get {
                yield return ACTIVO;
                yield return CREADO;
                yield return INACTIVO;
            }
        }

        public string Detalle { get => detalle; set => detalle = value; }
    }
   
}
