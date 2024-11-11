using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using dal.persona;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.usuario {
    class ValidaCambioClave : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private readonly OtpHelper otpHelper = new OtpHelper();

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarCambioClave(rqmantenimiento);
            GenerarOtp(rqmantenimiento);
        }

        private void ValidarCambioClave(RqMantenimiento rqmantenimiento) {
            string email = rqmantenimiento.GetString(nameof(email));
            bool escaduca = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(escaduca)));
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperpersonadetalle personadetalle = TperPersonaDetalleDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (string.IsNullOrEmpty(personadetalle.email)) {
                throw new AtlasException("CAN-019", "NO EXISTE UN EMAIL REGISTRADO");
            }

            if (!personadetalle.email.Equals(email)) {
                throw new AtlasException("CAN-020", $"EMAIL INCORRECTO: {rqmantenimiento.Cusuariobancalinea} | {rqmantenimiento.Ccanal} | {email}");
            }

            if (escaduca == true) {
                string passwordactual = rqmantenimiento.GetString(nameof(passwordactual));
                tcanusuarioclave usuarioclave = TcanUsuarioClaveDal.Find(usuario.cclave, rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
                if (!usuarioclave.password.Equals(EncriptarPassword.Encriptar(passwordactual))) {
                    throw new AtlasException("CAN-021", $"CLAVE ACTUAL INCORRECTA: {rqmantenimiento.Cusuariobancalinea} | {rqmantenimiento.Ccanal} | {EncriptarPassword.Encriptar(passwordactual)}");
                }
            }
        }

        private void GenerarOtp(RqMantenimiento rqmantenimiento) {
            tcanusuariootp tcanusuariootp = otpHelper.GenerarOtp(rqmantenimiento);
            rqmantenimiento.Response.Add(nameof(tcanusuariootp.token), tcanusuariootp.token);
            rqmantenimiento.Response.Add(nameof(tcanusuariootp.cotp), tcanusuariootp.cotp);
        }
    }
}
