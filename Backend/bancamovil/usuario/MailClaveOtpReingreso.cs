using core.componente;
using dal.bancaenlinea;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace bancamovil.comp.usuario {
    /// <summary>
    /// Clase encargada de enviar, clave otp de reingreso a la app movil al correo electronico del usuario.
    /// </summary>
    public class MailClaveOtpReingreso : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<string> lmails = new List<string>();

            string serial = rqmantenimiento.GetString("s");
            string cusuario = rqmantenimiento.Cusuario;

            String claveotp = rqmantenimiento.GetString("claveotp");
            if (claveotp == null) {
                return;
            }
            tbanusuarios tbanusuarios = TbanUsuariosDal.Find(cusuario);
            tperpersonadetalle p = TperPersonaDetalleDal.Find(tbanusuarios.cpersona ?? 0, rqmantenimiento.Ccompania);

            lmails.Add(p.email);

            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("claveotp", claveotp);
            parametrosmail.Add("nombre", p.nombre);

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 5);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
        }

    }
}


