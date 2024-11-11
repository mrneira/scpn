using core.componente;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.mails {
    internal class MailClaveTemporal : ComponenteMantenimiento {
        /// <summary>
        /// Método principal que ejecuta el envio de emails con la clave temporal
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<string> lmails = new List<string>();
            tperpersonadetalle personaDetalle = TperPersonaDetalleDal.Find(rqmantenimiento.GetString("identificacion"));

            //if (string.IsNullOrEmpty(personaDetalle.email)) {
            //    throw new AtlasException("GEN-014", "MAIL DE LA PERSONA: {0} REQUERIDO", personaDetalle.nombre);
            //}

            lmails.Add(rqmantenimiento.GetString("email"));
            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("clavetemp", rqmantenimiento.GetString("clavetemp"));
            parametrosmail.Add("nombre", personaDetalle.nombre);

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 31);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
        }
    }
}
