using core.componente;
using util.dto.mantenimiento;
using System.Linq;
using modelo;
using util;
using dal.persona;
using util.servicios.ef;
using dal.bancaenlinea;
using System;

namespace bancaenlinea.comp.mantenimiento.subscripcion
{

    /// <summary>
    /// Clase que se encarga de completar el password temporal OTP de subscripcion.
    /// </summary>
    public class CompletaPasswordOtp : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("TBANSUSCRIPCION") == null) {
                return;
            }

            DateTime fsistema = Fecha.GetFechaSistema();

            tbansuscripcion subscripcion = (tbansuscripcion)rqmantenimiento.GetTabla("TBANSUSCRIPCION").Lregistros.ElementAt(0);
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

        }

    }
}
