using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.cartera {
    public class AutorizaSolicitudCredito : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private readonly OtpHelper otpHelper = new OtpHelper();

        /// <summary>
        /// Método principal que ejecuta la Autorización de la Solicitud de Crédito
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarSolicitud(rqmantenimiento);
            ValidarOtp(rqmantenimiento);
            ActualizarSolicitudDetalle(rqmantenimiento);
        }

        private void ValidarSolicitud(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));

            validar.Solicitud(csolicitud, cproducto, ctipoproducto, rqmantenimiento.Cusuariobancalinea);
        }

        private void ValidarOtp(RqMantenimiento rqmantenimiento) {
            string tokenotp = rqmantenimiento.GetString(nameof(tokenotp));
            rqmantenimiento.Mdatos["token"] = tokenotp;
            otpHelper.ValidarOtp(rqmantenimiento);
        }

        private void ActualizarSolicitudDetalle(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));

            tcansolicituddetalle solicitudDetalle = TcanSolicitudDetalleDal.Find(csolicitud, cproducto, ctipoproducto);

            if (solicitudDetalle != null) {
                solicitudDetalle.montosolicitado = Convert.ToDecimal(rqmantenimiento.GetDecimal("montooriginal"));
                solicitudDetalle.plazosolicitado = Convert.ToInt32(rqmantenimiento.GetInt("numerocuotas"));
                solicitudDetalle.tasasolicitada = Convert.ToDecimal(rqmantenimiento.GetDecimal("tasa"));
                solicitudDetalle.cuotasolicitada = Convert.ToDecimal(rqmantenimiento.GetDecimal("valorcuota"));

                TcanSolicitudDetalleDal.Actualizar(solicitudDetalle);
            }
        }
    }
}
