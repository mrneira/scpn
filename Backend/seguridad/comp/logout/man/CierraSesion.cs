using core.componente;
using dal.seguridades;
using modelo;
using seguridad.util;
using System;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.logout.man {

    /// <summary>
    /// Clase que se encarga de cerrar la sesi&oacute;n
    /// </summary>
    public class CierraSesion : ComponenteMantenimiento {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Boolean? logoutuser = (Boolean)rqmantenimiento.GetDatos("logoutuser");
            tsegusuariosession tsegUsuarioSession = TsegUsuarioSessionDal.FindTracking(rqmantenimiento.Cusuario, rqmantenimiento.Ccompania);
            tsegUsuarioSession.fsalida = Fecha.GetDataBaseTimestamp();
            if (logoutuser != null && logoutuser == true) {
                tsegUsuarioSession.cestado = "L";
            } else {
                tsegUsuarioSession.cestado = "S";
            }

            TsegUsuarioSessionHistoriaDal.Crearhistoria(tsegUsuarioSession);
            if (tsegUsuarioSession != null && tsegUsuarioSession.activo.CompareTo("1") == 0) {
                //tsegUsuarioSession.Activo = "0";
                Sessionef.Eliminar(tsegUsuarioSession);
            }
        }

    }
}
