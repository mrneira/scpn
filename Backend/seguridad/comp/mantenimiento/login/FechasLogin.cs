using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.login {

    /// <summary>
    /// Clase que completa fecha de trabajo y contable en el login.
    /// </summary>
    public class FechasLogin : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que activa el usuario para que se encuentre en sesion.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Dictionary<string, object> map = (Dictionary<string, object>)rqmantenimiento.Response["mradicacion"];
            map["fcontable"] = rqmantenimiento.Fconatable;
            map["ftrabajo"] = rqmantenimiento.Ftrabajo;
            map["factual"] = rqmantenimiento.Freal;
        }
    }
}
