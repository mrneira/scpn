using core.componente;
using dal.seguridades;
using modelo;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.otp.gen {

    /// <summary>
    /// Clase que se encarga de generar el codigo otp de seguridad por usuario.
    /// </summary>
    public class GeneraClaveOtp : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tsegusuariootp obj = TsegUsuarioOtpDal.Crear(rqmantenimiento.Cusuario, ClaveTemporal.GetClave());

            // adiciona clave temporal al request, para enviar al mail o sms.
            rqmantenimiento.AddDatos("claveotp", obj.Mdatos["claveotp"]);
            rqmantenimiento.AddDatos("fcaducidadclaveotp", obj.fcaducidad.GetValueOrDefault().ToString("yyyy-MM-dd HH:mm:ss"));
            rqmantenimiento.Response["validarotp"] = true;
        }

    }
}
