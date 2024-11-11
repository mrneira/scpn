using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using modelo;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.usuario {
    public class CambioClave : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private readonly OtpHelper otpHelper = new OtpHelper();
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarClave(rqmantenimiento);
            ValidarOtp(rqmantenimiento);
            RegistrarContrasena(rqmantenimiento);
        }

        private void ValidarClave(RqMantenimiento rqmantenimiento) {
            string password = rqmantenimiento.GetString("password");
            validar.PoliticaSeguridadClave(rqmantenimiento.Ccanal, rqmantenimiento.Cusuariobancalinea, password);
        }

        private void ValidarOtp(RqMantenimiento rqmantenimiento) {
            otpHelper.ValidarOtp(rqmantenimiento);
        }

        private void RegistrarContrasena(RqMantenimiento rqMantenimiento) {
            tcanusuarioclave usuarioclave = new tcanusuarioclave();
            string password = rqMantenimiento.GetString("password");
            int cclave = TcanUsuarioClaveDal.FindMaxValue(rqMantenimiento.Cusuariobancalinea, rqMantenimiento.Ccanal) + 1;

            usuarioclave.cclave = cclave;
            usuarioclave.cusuario = rqMantenimiento.Cusuariobancalinea;
            usuarioclave.ccanal = rqMantenimiento.Ccanal;
            usuarioclave.password = EncriptarPassword.Encriptar(password);
            TcanUsuarioClaveDal.Crear(usuarioclave);

            tcanusuario usuario = TcanUsuarioDal.Find(rqMantenimiento.Cusuariobancalinea, rqMantenimiento.Ccanal);
            usuario.cclave = cclave;
            usuario.estadodetalle = EnumEstados.USUARIO_ACTIVO;
            usuario.numerointentos = 0;
            TcanUsuarioDal.Actualizar(usuario);
        }
    }
}
