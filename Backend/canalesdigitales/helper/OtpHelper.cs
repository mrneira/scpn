using canalesdigitales.enums;
using core.servicios;
using dal.canalesdigitales;
using modelo;
using System;
using util;
using util.dto;

namespace canalesdigitales.helper {

    internal class OtpHelper {

        public tcanusuariootp GenerarOtp(RequestBase rqbase) {
            string otp = ClaveTemporal.GetClave();
            string token = (rqbase.Mdatos.ContainsKey("token") && !string.IsNullOrEmpty(rqbase.GetString("token"))) ? rqbase.GetString("token") : TokenHelper.GenerarToken();

            tcanusuariootp usuariootp = new tcanusuariootp();
            usuariootp.cotp = Secuencia.GetProximovalor("CAN-OTP");
            usuariootp.cusuario = rqbase.Cusuariobancalinea;
            usuariootp.ccanal = rqbase.Ccanal;
            usuariootp.token =  token;
            usuariootp.cmodulo = Convert.ToInt16(rqbase.Cmodulo);
            usuariootp.ctransaccion = rqbase.Ctransaccion;
            usuariootp.cseguridad = EncriptarPassword.Encriptar(otp);

            rqbase.AddDatos("claveotp", otp);

            return TcanUsuarioOtpDal.Crear(usuariootp, EnumGeneral.CADUCIDAD_OTP);
        }

        public void ValidarOtp(RequestBase rqbase) {
            long cotp = Convert.ToInt64(rqbase.GetLong("cotp"));
            string cseguridad = rqbase.GetString("cseguridad");
            string token = rqbase.GetString("token");
            tcanusuariootp usuariootp = TcanUsuarioOtpDal.Find(cotp);

            if (usuariootp == null) {
                throw new AtlasException("CAN-015", $"CÓDIGO OTP NO EXISTE: {cotp}");
            }

            if (usuariootp.validado != null && usuariootp.validado == true) {
                throw new AtlasException("CAN-016", $"CÓDIGO OTP YA VALIDADO: {cotp}");
            }

            if (!string.Equals(usuariootp.cusuario, rqbase.Cusuariobancalinea) || !string.Equals(usuariootp.ccanal, rqbase.Ccanal) || !string.Equals(usuariootp.token, token)) {
                throw new AtlasException("CAN-017", $"CÓDIGO OTP INCORRECTO: {cotp} | {rqbase.Cusuariobancalinea} | {rqbase.Ccanal} | {token}");
            }

            if (usuariootp.fcaducidad.Ticks < Fecha.GetFechaSistema().Ticks) {
                throw new AtlasException("CAN-018", $"CÓDIGO OTP CADUCADO: {cotp}");
            }

            if (!string.Equals(usuariootp.cseguridad, EncriptarPassword.Encriptar(cseguridad))) {
                throw new AtlasException("CAN-017", $"CÓDIGO OTP INCORRECTO: {cotp} | {cseguridad}");
            }

            TcanUsuarioOtpDal.Actualizar(usuariootp);
        }
    }
}
