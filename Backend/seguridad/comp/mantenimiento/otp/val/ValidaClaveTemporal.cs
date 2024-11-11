using core.componente;
using dal.seguridades;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.otp.val {

    /// <summary>
    /// Clase que se encarga de validar la clave temporal OTP, cuando ya se tiene creado un usuario de banca en linea en la base.
    /// </summary>
    public class ValidaClaveTemporal : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            rqmantenimiento.Response["resultadovalidaotp"] = false;

            object claveotp = rqmantenimiento.GetDatos("claveotp");
            if (claveotp == null) {
                return;
            }
            tsegusuariootp uotp = TsegUsuarioOtpDal.Find(rqmantenimiento.Cusuario);
            
            string encriptado = EncriptarPassword.Encriptar(claveotp.ToString());
            if (encriptado.CompareTo(uotp.cseguridad) != 0) {
                throw new AtlasException("BLI-004", "CLAVE INCORRECTA");
            }
            DateTime t = Fecha.GetFechaSistema();
            if (uotp.fcreacion.GetValueOrDefault().CompareTo(t) > 0 || uotp.fcaducidad.GetValueOrDefault().CompareTo(t) < 0) {
                throw new AtlasException("BLI-006", "CLAVE TEMPORAL EXPIRADA");
            }

            rqmantenimiento.Response["resultadovalidaotp"] = true;
        }

    }
}
