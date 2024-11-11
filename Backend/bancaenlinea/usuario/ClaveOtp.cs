using core.componente;
using dal.bancaenlinea;
using dal.seguridades;
using modelo;
using util;
using util.dto.mantenimiento;

namespace bancaenlinea.usuario {

    /// <summary>
    /// Clase que se encarga de generar el codigo otp de seguridad por usuario.
    /// </summary>
    public class ClaveOtp : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tbanusuariootp obj = TbanUsuarioOtpDal.Crear(rqmantenimiento.Cusuario, ClaveTemporal.GetClave());

            // adiciona clave temporal al request, para enviar al mail o sms.
            rqmantenimiento.AddDatos("claveotp", obj.Mdatos["claveotp"]);
            rqmantenimiento.AddDatos("fcaducidadclaveotp", obj.fcaducidad.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss"));
            rqmantenimiento.Response["validarotp"] = true;
        }

    }
}
