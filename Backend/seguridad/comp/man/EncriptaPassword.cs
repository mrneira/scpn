using core.componente;
using modelo;
using System;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.man {

    /// <summary>
    /// Clase encargada encriptar el password cuando viene plano y asignar al registro de TsegusuarioDetalle.
    /// </summary>
    public class EncriptaPassword : ComponenteMantenimiento {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("USUARIODETALLE") == null || rqmantenimiento.GetTabla("USUARIODETALLE").Lregistros == null || rqmantenimiento.GetDatos("bas64") == null) {
                return;
            }
            tsegusuariodetalle tsegUsuarioDetalle = (tsegusuariodetalle)rqmantenimiento.GetTabla("USUARIODETALLE").Lregistros.ElementAt(0);
            if (tsegUsuarioDetalle == null) {
                return;
            }
            String pwdSinEncriptar = rqmantenimiento.GetDatos("bas64").ToString();
            tsegUsuarioDetalle.password = EncriptarPassword.Encriptar(pwdSinEncriptar);
        }

    }
}
