using dal.bancaenlinea;
using modelo;
using seguridad.comp.login.helper;
using System;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.blinea.login {

    /// <summary>
    /// Clase que se encarga de verificar que la clave o password ingresado por el usuario sea la registrada en la base de datos.
    /// </summary>
    public class VerificaPassword : GrabaSessionBancaLinea {
        /// <summary>
        /// Metodo que busca si el usuario existe
        /// </summary>
        /// <param name="rqmantenimiento">Request de login.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tbanusuarios tbanusuarios = (tbanusuarios)rqmantenimiento.GetDatos("TBANUSUARIOS");
            tbanusuariosession tbanusuariosession = (tbanusuariosession)rqmantenimiento.GetDatos("TBANUSUARIOSESSION");
            String password = (String)rqmantenimiento.GetDatos("p");
            // vl (valida login) llega cuando es un login desde angular
            password = EncriptarPassword.Encriptar(password);
            TbanUsuarioSessionDal.ActualizaIntentos(tbanusuariosession);

            tbanusuariosession.cestado = "I";
            if (tbanusuarios.password.CompareTo(password) != 0) {
                // Usuario con autenticacion fallida
                tbanusuariosession.cestado = "F";
                GrabaSessionBancaLinea.GuardaSesion(tbanusuarios, tbanusuariosession, rqmantenimiento.Ccompania);
                throw new AtlasException("SEG-002", "CLAVE INCORRECTA");
            }
        }
    }
}
