using core.componente;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace bancaenlinea.comp.mantenimiento.subscripcion {
    /// <summary>
    /// Clase encargada de enviar, clave temporal al correo electronico del usuario.
    /// </summary>
    public class MailClaveTemporal : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<string> lmails = new List<string>();

            if (rqmantenimiento.GetTabla("TBANSUSCRIPCION") == null) {
                return;
            }
            tbansuscripcion subscripcion = (tbansuscripcion)rqmantenimiento.GetTabla("TBANSUSCRIPCION").Lregistros.ElementAt(0);
            String claveotp = rqmantenimiento.GetString("claveotp");
            if (claveotp == null) {
                return;
            }

            lmails.Add(subscripcion.email);

            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("claveotp", claveotp);
            parametrosmail.Add("nombre", TperPersonaDetalleDal.Find(subscripcion.identificacion).nombre);

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 5);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
        }

    }
}


