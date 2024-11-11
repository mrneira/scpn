using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace seguridad {

    /// <summary>
    /// Enumeracion que almacena estatus de usuairos.
    /// </summary>
    class DetalleEstatusUsuario {

        /// <summary>
        /// Almacena el codigo de estatus de usuario.
        /// </summary>
        private string cestatus;

        public DetalleEstatusUsuario(string estatus) {
            this.cestatus = estatus;
        }

        public string Cestatus { get => cestatus; set => cestatus = value; }

        public static readonly DetalleEstatusUsuario ACTIVO = new DetalleEstatusUsuario("ACT");
        public static readonly DetalleEstatusUsuario CREADO = new DetalleEstatusUsuario("CRE");
        public static readonly DetalleEstatusUsuario INACTIVO = new DetalleEstatusUsuario("INA");


    }
}
