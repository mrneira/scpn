using dal.seguridades;
using modelo;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.login {

    /// <summary>
    /// Clase que se encarga de verificar que el usuario existe.
    /// </summary>
    public class VerificaUsuario : GrabaSession {

        /// <summary>
        /// Metodo que busca si el usuario existe
        /// </summary>
        /// <param name="rqmantenimiento">Request de login.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tsegusuariodetalle obj = TsegUsuarioDetalleDal.Find(rqmantenimiento.Cusuario, rqmantenimiento.Ccompania);
            rqmantenimiento.AddDatos("TSEGUSUARIODETALLE", obj);
        }
    }
}
