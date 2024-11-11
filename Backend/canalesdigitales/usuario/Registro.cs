using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.usuario {

    public class Registro : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private readonly OtpHelper otpHelper = new OtpHelper();
        private tcanusuario usuario;

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarClave(rqmantenimiento);
            ValidarOtp(rqmantenimiento);
            RegistrarContrasena(rqmantenimiento);
            RegistrarEquipo(rqmantenimiento);
        }

        private void ValidarClave(RqMantenimiento rqmantenimiento) {
            bool estemporal = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(estemporal)));
            if (estemporal == true) {
                string password = rqmantenimiento.GetString("password");
                validar.PoliticaSeguridadClave(rqmantenimiento.Ccanal, rqmantenimiento.Cusuariobancalinea, password);
            }
        }

        private void ValidarOtp(RqMantenimiento rqmantenimiento) {
            otpHelper.ValidarOtp(rqmantenimiento);
        }

        private void RegistrarContrasena(RqMantenimiento rqmantenimiento) {
            usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            bool estemporal = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(estemporal)));
            if (estemporal == true) {
                tcanusuarioclave usuarioclave = new tcanusuarioclave();
                string password = rqmantenimiento.GetString("password");
                int cclave = TcanUsuarioClaveDal.FindMaxValue(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal) + 1;

                usuarioclave.cclave = cclave;
                usuarioclave.cusuario = rqmantenimiento.Cusuariobancalinea;
                usuarioclave.ccanal = rqmantenimiento.Ccanal;
                usuarioclave.password = EncriptarPassword.Encriptar(password);
                TcanUsuarioClaveDal.Crear(usuarioclave);

                usuario.cclave = cclave;
                usuario.estadodetalle = EnumEstados.USUARIO_ACTIVO;
            }
        }

        private void RegistrarEquipo(RqMantenimiento rqmantenimiento) {
            int csubcanal = rqmantenimiento.Crol;

            if (csubcanal == EnumSubcanal.SUBCANAL_MOVIL) {
                tcanequipo equipo = new tcanequipo();
                int cequipo = TcanEquipoDal.FindMaxValue(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal) + 1;

                equipo.cequipo = cequipo;
                equipo.cusuario = rqmantenimiento.Cusuariobancalinea;
                equipo.ccanal = rqmantenimiento.Ccanal;
                equipo.alias = rqmantenimiento.GetString("alias");
                equipo.equipo = rqmantenimiento.GetString("equipo");
                equipo.mac = rqmantenimiento.GetString("mac");
                equipo.cusuarioing = rqmantenimiento.Cusuario;
                TcanEquipoDal.Crear(equipo);

                usuario.cequipo = cequipo;
            }
            TcanUsuarioDal.Actualizar(usuario);
        }
    }

}
