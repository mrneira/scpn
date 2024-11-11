using canalesdigitales.validaciones;
using core.componente;
using dal.seguridades;
using modelo;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento {

    class ValidaInicioMantenimiento : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();

        /// <summary>
        /// Método principal que ejecuta la Validación Inicial al momento de realizar un mantenimiento
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarCanal(rqmantenimiento);
            ValidarVersion(rqmantenimiento);
            ValidarActivacion(rqmantenimiento);
            ValidarUsuario(rqmantenimiento);
        }

        /// <summary>
        /// Método que valida el Canal
        /// </summary>
        /// <param name="rqmantenimiento"></param>

        private void ValidarCanal(RqMantenimiento rqmantenimiento) {
            validar.Canal(rqmantenimiento.Ccanal);
        }

        /// <summary>
        /// Método que valida la versión
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void ValidarVersion(RqMantenimiento rqmantenimiento) {
            string cversion = rqmantenimiento.GetString(nameof(cversion));
            tsegrol rol = TsegRolDal.Find(rqmantenimiento.Crol);
            if (rol == null) {
                throw new AtlasException("CAN-024", $"ROL NO REGISTRADO: {rqmantenimiento.Crol}");
            }
            validar.Version(cversion, rqmantenimiento.Ccanal, rqmantenimiento.Crol);
        }

        /// <summary>
        /// Método que valida la existencia y estado del usuario para el uso de Canales Digitales
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void ValidarActivacion(RqMantenimiento rqmantenimiento) {
            string credencial = rqmantenimiento.GetString("credencial");
            validar.Activacion(credencial);
        }

        /// <summary>
        /// Método que valida la existencia y estado del usuario
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void ValidarUsuario(RqMantenimiento rqmantenimiento) {
            bool validarestadousuario = true;
            if (rqmantenimiento.Mdatos.ContainsKey("validarestadousuario")) {
                validarestadousuario = false;
            }
            validar.Usuario(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal, validarestadousuario);
        }
    }

}
