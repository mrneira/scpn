using canalesdigitales.enums;
using core.componente;
using dal.canalesdigitales;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.mails {
    internal class MailTurnoAgendado : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<string> lmails = new List<string>();
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperpersonadetalle personaDetalle = TperPersonaDetalleDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (string.IsNullOrEmpty(personaDetalle.email)) {
                throw new AtlasException("GEN-014", "MAIL DE LA PERSONA: {0} REQUERIDO", personaDetalle.nombre);
            }

            lmails.Add(personaDetalle.email);
            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("nombre", personaDetalle.nombre);

            // Adjuntos para el envio de mail
            Dictionary<string, byte[]> adjuntos = new Dictionary<string, byte[]>();
            adjuntos.Add(string.Format("{0}.pdf", rqmantenimiento.GetString("nombreAdjunto")), (byte[])rqmantenimiento.GetDatos("reportebyte"));

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 35);
            // Lista de mails a enviar
            if (rqmantenimiento.Mdatos.ContainsKey("nombreAdjunto")) {
                rqmantenimiento.AddDatos("lmails", lmails);
            }
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
            rqmantenimiento.Mdatos.Add("adjuntos", adjuntos);
        }
    }
}
