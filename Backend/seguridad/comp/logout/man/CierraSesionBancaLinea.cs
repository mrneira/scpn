using core.componente;
using dal.bancaenlinea;
using dal.seguridades;
using modelo;
using System;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace seguridad.comp.logout.man {

    /// <summary>
    /// Clase que se encarga de cerrar la sesion en banca en linea
    /// </summary>
    public class CierraSesionBancaLinea : ComponenteMantenimiento {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Boolean? logoutuser = (Boolean)rqmantenimiento.GetDatos("logoutuser");
            tbanusuariosession tbanUsuarioSession = TbanUsuarioSessionDal.FindTracking(rqmantenimiento.Cusuario);
            tbanUsuarioSession.fsalida = Fecha.GetDataBaseTimestamp();
            if (logoutuser != null && logoutuser == true) {
                tbanUsuarioSession.cestado = "L";
            } else {
                tbanUsuarioSession.cestado = "S";
            }

            TbanUsuarioSessionHistoriaDal.Crearhistoria(tbanUsuarioSession);
            if (tbanUsuarioSession != null && tbanUsuarioSession.activo.CompareTo("1") == 0) {
                Sessionef.Eliminar(tbanUsuarioSession);
            }
        }

    }
}
