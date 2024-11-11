using canalesdigitales.validaciones;
using core.componente;
using dal.seguridades;
using modelo;
using util;
using util.dto.consulta;

namespace canalesdigitales.comp.consulta {

    class ValidaInicioConsulta : ComponenteConsulta {

        private readonly Validar validar = new Validar();

        /// <summary>
        /// Método principal que ejecuta la Validación Inicial al momento de realizar una consulta
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            ValidarCanal(rqconsulta);
            ValidarVersion(rqconsulta);
            ValidarActivacion(rqconsulta);
            ValidarUsuario(rqconsulta);
        }

        /// <summary>
        /// Método que valida el Canal
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ValidarCanal(RqConsulta rqconsulta) {
            validar.Canal(rqconsulta.Ccanal);
        }

        /// <summary>
        /// Método que valida la versión
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ValidarVersion(RqConsulta rqconsulta) {
            string cversion = rqconsulta.GetString(nameof(cversion));
            tsegrol rol = TsegRolDal.Find(rqconsulta.Crol);
            if (rol == null) {
                throw new AtlasException("CAN-024", $"ROL NO REGISTRADO: | {rqconsulta.Crol}");
            }
            validar.Version(cversion, rqconsulta.Ccanal, rqconsulta.Crol);
        }

        /// <summary>
        /// Método que valida la existencia y estado del usuario para el uso de Canales Digitales
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ValidarActivacion(RqConsulta rqconsulta) {
            string credencial = rqconsulta.GetString("credencial");
            validar.Activacion(credencial);
        }

        /// <summary>
        /// Método que valida la existencia y estado del usuario
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ValidarUsuario(RqConsulta rqconsulta) {
            bool validarestadousuario = true;
            if (rqconsulta.Mdatos.ContainsKey("validarestadousuario")) {
                validarestadousuario = false;
            }
            validar.Usuario(rqconsulta.Cusuariobancalinea, rqconsulta.Ccanal, validarestadousuario);
        }

    }

}
