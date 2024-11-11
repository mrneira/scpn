using dal.generales;
using modelo;
using seguridad.comp.login.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.blinea.login {

    /// <summary>
    /// Metodo que se encarga de validar que el usuario este activo.
    /// </summary>
    public class VerificaUsuarioActivo : GrabaSession {

        /// <summary>
        /// Metodo que valida que el usuario este activo.
        /// </summary>
        /// <param name="rqmantenimiento">Request de login.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tbanusuarios tbanusuarios = (tbanusuarios)rqmantenimiento.GetDatos("TBANUSUARIOS");
            if (tbanusuarios.estatuscusuariocdetalle.CompareTo("ACT") != 0) {
                tgencatalogodetalle tgenCatalogoDetalle = TgenCatalogoDetalleDal.Find((int)tbanusuarios.estatuscusuariocatalogo, tbanusuarios.estatuscusuariocdetalle);
                //GrabaSession.GuardaSesion(tsegUsuarioDetalle, null);
                throw new AtlasException("SEG-015", "EL USUARIO {0} SE ENCUENTRA EN ESTATUS {1}", tbanusuarios.cusuario, tgenCatalogoDetalle.nombre);
            }
        }
    }
}
