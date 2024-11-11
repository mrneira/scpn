using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using dal.persona;
using dal.seguridades;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.usuario {
    class ValidaRegistro : ComponenteMantenimiento {
        private readonly Validar validar = new Validar();
        private readonly OtpHelper otpHelper = new OtpHelper();

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            // string clave = EncriptarPassword.Encriptar("Prueba1234");
            ValidarCelular(rqmantenimiento);
            ValidarContrasena(rqmantenimiento);
            GenerarOtp(rqmantenimiento);
        }

        private void ValidarCelular(RqMantenimiento rqmantenimiento) {
            string celular = rqmantenimiento.GetString(nameof(celular));
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperpersonadetalle personadetalle = TperPersonaDetalleDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (string.IsNullOrEmpty(personadetalle.celular)) {
                throw new AtlasException("CAN-026", $"NO EXISTE UN NÚMERO DE CELULAR REGISTRADO: {rqmantenimiento.Cusuariobancalinea} | {rqmantenimiento.Ccanal} | {usuario.cpersona}");
            }

            if (!personadetalle.celular.Equals(celular)) {
                throw new AtlasException("CAN-027", $"NÚMERO DE CELULAR INCORRECTO: {rqmantenimiento.Cusuariobancalinea} | {rqmantenimiento.Ccanal} | {usuario.cpersona} |{celular}");
            }
        }

        private void ValidarContrasena(RqMantenimiento rqmantenimiento) {
            int csubcanal = rqmantenimiento.Crol;
            string password = rqmantenimiento.GetString(nameof(password));
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tcanusuarioclave usuarioclave = TcanUsuarioClaveDal.Find(usuario.cclave, rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            bool estemporal;

            if(csubcanal == EnumSubcanal.SUBCANAL_WEB) {
                if (usuario.estadodetalle == EnumEstados.USUARIO_ACTIVO) {
                    throw new AtlasException("CAN-007", $"EL USUARIO YA REALIZÓ EL CAMBIO DE CLAVE: {rqmantenimiento.Cusuariobancalinea} | {rqmantenimiento.Ccanal}");
                }
            }

            if (usuarioclave == null) {
                throw new AtlasException("CAN-012", $"INFORMACIÓN INCORRECTA: {rqmantenimiento.Cusuariobancalinea} | {rqmantenimiento.Ccanal} | {usuario.cclave}");
            }

            if (usuarioclave.temporal == true) {
                DateTime fcaducidad = usuarioclave.fcreacion.AddDays(EnumGeneral.CADUCIDAD_CLAVE_TEMP);

                if (!usuarioclave.password.Equals(EncriptarPassword.Encriptar(password))) {
                    throw new AtlasException("CAN-012", $"INFORMACIÓN INCORRECTA: {rqmantenimiento.Cusuariobancalinea} | {rqmantenimiento.Ccanal} | {usuario.cclave} | {EncriptarPassword.Encriptar(password)}");
                }

                if (fcaducidad.Ticks < Fecha.GetFechaSistema().Ticks) {
                    throw new AtlasException("BLI-006", $"CLAVE TEMPORAL EXPIRADA: {fcaducidad}");
                }
                estemporal = true;
            } else {
                validar.UsuarioClave(usuario, password);
                estemporal = false;
            }
            

            rqmantenimiento.Response.Add(nameof(estemporal), estemporal);
        }

        private void GenerarOtp(RqMantenimiento rqmantenimiento) {
            tcanusuariootp tcanusuariootp = otpHelper.GenerarOtp(rqmantenimiento);
            rqmantenimiento.Response.Add(nameof(tcanusuariootp.token), tcanusuariootp.token);
            rqmantenimiento.Response.Add(nameof(tcanusuariootp.cotp), tcanusuariootp.cotp);
        }
    }
}
