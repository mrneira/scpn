using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using dal.generales;
using dal.persona;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.agendamiento {
    class ValidaCitaSolicitud : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private readonly OtpHelper otpHelper = new OtpHelper();

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarHorarioDisponible(rqmantenimiento);
            ValidarCita(rqmantenimiento);
            ConsultarReferenciaBancaria(rqmantenimiento);
            GenerarOtp(rqmantenimiento);
        }

        private void ValidarHorarioDisponible(RqMantenimiento rqmantenimiento) {
            long chorario = Convert.ToInt64(rqmantenimiento.GetLong(nameof(chorario)));
            string hagendamiento = rqmantenimiento.GetString(nameof(hagendamiento));

            validar.HorarioDisponible(chorario, hagendamiento);
        }

        private void ValidarCita(RqMantenimiento rqmantenimiento) {
            long chorario = Convert.ToInt64(rqmantenimiento.GetLong(nameof(chorario)));

            validar.Cita(rqmantenimiento.Cusuariobancalinea, chorario);
        }

        private void ConsultarReferenciaBancaria(RqMantenimiento rqmantenimiento) {
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperreferenciabancaria referenciaBancaria = TperReferenciaBancariaDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (referenciaBancaria == null || !referenciaBancaria.estado.Equals(EnumEstadosReferenciaBancaria.REFERENCIA_ACTIVA)) {
                throw new AtlasException("CAN-034", "REFERENCIA BANCARIA NO EXISTE PARA USUARIO: {0}", rqmantenimiento.Cusuariobancalinea);
            }

            tgencatalogodetalle detalleBanco = TgenCatalogoDetalleDal.Find(Convert.ToInt32(referenciaBancaria.tipoinstitucionccatalogo), referenciaBancaria.tipoinstitucioncdetalle);
            tgencatalogodetalle detalleCuenta = TgenCatalogoDetalleDal.Find(Convert.ToInt32(referenciaBancaria.tipocuentaccatalogo), referenciaBancaria.tipocuentacdetalle);

            rqmantenimiento.Response.Add("institucion", detalleBanco.nombre);
            rqmantenimiento.Response.Add("tipocuenta", detalleCuenta.nombre);
            rqmantenimiento.Response.Add("cuenta", referenciaBancaria.numero);
        }

        private void GenerarOtp(RqMantenimiento rqmantenimiento) {
            tcanusuariootp tcanusuariootp = otpHelper.GenerarOtp(rqmantenimiento);

            rqmantenimiento.Response.Add("tokenotp", tcanusuariootp.token);
            rqmantenimiento.Response.Add(nameof(tcanusuariootp.cotp), tcanusuariootp.cotp);
        }
    }
}
