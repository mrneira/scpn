using dal.seguridades;
using modelo;
using modelo.helper;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.mantenimiento.login {

    /// <summary>
    /// Clase que se encarga de verificar que la clave o password ingresado por el usuario sea la registrada en la base de datos.
    /// </summary>
    public class VerificaPassword : GrabaSession {
        /// <summary>
        /// Metodo que busca si el usuario existe
        /// </summary>
        /// <param name="rqmantenimiento">Request de login.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tsegusuariodetalle tsegUsuarioDetalle = (tsegusuariodetalle)rqmantenimiento.GetDatos("TSEGUSUARIODETALLE");
            tsegusuariosession tsegUsuarioSession = (tsegusuariosession)rqmantenimiento.GetDatos("TSEGUSUARIOSESSION");
            String password = (String)rqmantenimiento.GetDatos("p");
            // vl (valida login) llega cuando es un login desde angular
            password = EncriptarPassword.Encriptar(password);
            TsegUsuarioSessionDal.ActualizaIntentos(tsegUsuarioSession);
            //EntityHelper.SetActualizar(tsegUsuarioSession);
            //Sessionef.Grabar(tsegUsuarioSession);
            tsegUsuarioSession.cestado = "I";
            if (tsegUsuarioDetalle.password.CompareTo(password) != 0) {
                tsegUsuarioSession.cestado = "F";
                GrabaSession.GuardaSesion(tsegUsuarioDetalle, tsegUsuarioSession);
                throw new AtlasException("SEG-002", "CLAVE INCORRECTA");
            }
        }
    }
}
