using core.componente;
using dal.seguridades;
using modelo;
using modelo.helper;
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
    /// Clase que se encarga de activar la session del usuario.
    /// </summary>
    public class ActivaSesion : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que activa el usuario para que se encuentre en sesion.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tsegpolitica pol = TsegPoliticaDal.FindInDataBase(rqmantenimiento.Ccompania, rqmantenimiento.Ccanal);

            tsegusuariosession tsegUsuarioSession = (tsegusuariosession)rqmantenimiento.GetDatos("TSEGUSUARIOSESSION");
            EntityHelper.SetActualizar(tsegUsuarioSession);
            tsegUsuarioSession.cterminal = rqmantenimiento.Cterminal;
            tsegUsuarioSession.activo = "1";
            tsegUsuarioSession.numerointentos = 0;
            tsegUsuarioSession.finicio = rqmantenimiento.Freal;
            tsegUsuarioSession.fultimaaccion = rqmantenimiento.Freal;
            tsegUsuarioSession.tiemposesion = pol.tiemposesion;
            Sessionef.Actualizar(tsegUsuarioSession);
            TsegUsuarioSessionHistoriaDal.Crearhistoria(tsegUsuarioSession);
        }

    }
}
