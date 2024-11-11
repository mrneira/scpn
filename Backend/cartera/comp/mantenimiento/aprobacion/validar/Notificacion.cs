using cartera.datos;
using core.componente;
using dal.cartera;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.aprobacion.validar {
    public class Notificacion : ComponenteMantenimiento {
        /// <summary>
        /// Metodo ejecuta la validacion de envio de notificacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            tperpersonadetalle per = TperPersonaDetalleDal.Find((long)tcarsolicitud.cpersona, (int)tcarsolicitud.ccompania);

            // Verifica email
            List<string> lmails = new List<string>();
            ValidaEmail(per.email);
            lmails.Add(per.email);

            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("nombre", per.nombre);
            parametrosmail.Add("netapa", TcarEstatusSolicitudDal.Find(tcarsolicitud.cestatussolicitud).nombre);
            rqmantenimiento.AddDatos("cnotificacion", 11);
            rqmantenimiento.AddDatos("lmails", lmails);

            // fija variables a utilizar en rqmantenimiento.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
        }

        /// <summary>
        /// Metodo que valida correo electronico
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public void ValidaEmail(string email)
        {
            if (email == null) {
                throw new AtlasException("BPER-004", "EMAIL NO DEFINIDO EN PARA PERSONA: {0}", email);
            }

            String expresion;
            expresion = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
            if (Regex.IsMatch(email, expresion)) {
                if (Regex.Replace(email, expresion, String.Empty).Length != 0) {
                    throw new AtlasException("BPER-009", "EMAIL NO TIENE EL FORMATO CORRECTO {0}", email);
                }
            } else {
                throw new AtlasException("BPER-009", "EMAIL NO TIENE EL FORMATO CORRECTO {0}", email);
            }
        }
    }
}
