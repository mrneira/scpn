using canalesdigitales.enums;
using core.componente;
using dal.canalesdigitales;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.mails {
    internal class MailLoginExitoso : ComponenteMantenimiento {
        /// <summary>
        /// Método principal que ejecuta el envio de emails con Login exitoso
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<string> lmails = new List<string>();
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperpersonadetalle personaDetalle = TperPersonaDetalleDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            if (string.IsNullOrEmpty(personaDetalle.email)) {
                throw new AtlasException("GEN-014", "MAIL DE LA PERSONA: {0} REQUERIDO", personaDetalle.nombre);
            }

            lmails.Add(personaDetalle.email);
            DateTime factual = Fecha.GetFechaSistema();
            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("fechahora", factual.ToString("yyyy-MM-dd HH:mm:ss"));
            parametrosmail.Add("nombre", personaDetalle.nombre);

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 32);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
        }
    }
}
