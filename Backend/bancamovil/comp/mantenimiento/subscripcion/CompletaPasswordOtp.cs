using core.componente;
using util.dto.mantenimiento;
using modelo;
using util;
using util.servicios.ef;
using System;
using dal.bancamovil;

namespace bancamovil.comp.mantenimiento.subscripcion {

    /// <summary>
    /// Clase que se encarga de completar el password temporal OTP de subscripcion movil.
    /// </summary>
    public class CompletaPasswordOtp : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.GetString("u");

            tbansuscripcionmovil subscripcion = null;
            if (rqmantenimiento.GetDatos("TBANSUSCRIPCIONMOVIL") != null) {
                subscripcion = (tbansuscripcionmovil)rqmantenimiento.GetDatos("TBANSUSCRIPCIONMOVIL");
            }
            if (subscripcion == null) {
                subscripcion = TbanSuscripcionMovilDal.Find(cusuario, serial);
            }
            DateTime fsistema = Fecha.GetFechaSistema();
            subscripcion.fcreacionotp = fsistema;

            DateTime fcaducidad = fsistema;
            fcaducidad = fcaducidad.AddMinutes(5);
            subscripcion.fcaducidadotp = fcaducidad;

            // Crea password temporal.
            String p = ClaveTemporal.GetClave();
            String encriptado = EncriptarPassword.Encriptar(p);

            // adiciona clave temporal al request, para enviar al mail o sms.
            rqmantenimiento.AddDatos("claveotp", p);
            rqmantenimiento.AddDatos("fcaducidadclaveotp", fcaducidad.ToString("yyyy-MM-dd HH:mm:ss"));
            subscripcion.passwordotp = encriptado;

            if (!subscripcion.Esnuevo) {
                Sessionef.Actualizar(subscripcion);
            }
        }

    }
}
