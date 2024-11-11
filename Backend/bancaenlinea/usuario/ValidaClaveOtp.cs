using core.componente;
using dal.bancaenlinea;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace bancaenlinea.usuario {

    /// <summary>
    /// Clase que se encarga de validar la clave temporal OTP, cuando ya se tiene creado un usuario de banca en linea en la base.
    /// </summary>
    public class ValidaClaveOtp : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            rqmantenimiento.Response["resultadovalidaotp"] = false;

            String copcion = rqmantenimiento.GetString("copcion");
            if (copcion != null && !copcion.Equals("VCT")) { // valida datos para cambio clave banca linea
                return;
            }
            if (copcion != null && copcion.Equals("VCT")) {
                String identificacion = rqmantenimiento.Identificacion;
                tbansuscripcion tbanSuscripcion = TbanSuscripcionDal.FindPorIdentificacion(identificacion);
                rqmantenimiento.Cusuario = tbanSuscripcion.cusuario;
            }

            tbanusuariootp uotp = TbanUsuarioOtpDal.Find(rqmantenimiento.Cusuario);
            string claveotp = rqmantenimiento.GetString("claveotp");
            string encriptado = EncriptarPassword.Encriptar(claveotp);
            if (encriptado.CompareTo(uotp.password) != 0) {
                throw new AtlasException("BLI-004", "CLAVE INCORRECTA");
            }
            DateTime t = Fecha.GetFechaSistema();
            DateTime fcreacion = uotp.fcreacion ?? DateTime.Now;
            DateTime fcaducidad = uotp.fcaducidad ?? DateTime.Now;

            if (fcreacion.CompareTo(t) > 0 || fcaducidad.CompareTo(t) < 0) {
                throw new AtlasException("BLI-006", "CLAVE TEMPORAL EXPIRADA");
            }
            if (copcion != null && copcion.Equals("VCT")) { // valida datos para cambio clave banca linea
                                                            // en cambio de clave entrega el codigo de usuario para mostrar en la pantalla.
                rqmantenimiento.Response.Add("cu", rqmantenimiento.Cusuario);
            }

            rqmantenimiento.Response["resultadovalidaotp"] = true;
        }

    }
}
