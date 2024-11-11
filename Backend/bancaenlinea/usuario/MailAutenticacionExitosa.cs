using core.componente;
using dal.bancaenlinea;
using dal.persona;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace bancaenlinea.usuario {
    /// <summary>
    /// Clase encargada de enviar, clave temporal al correo electronico del usuario.
    /// </summary>
    public class MailAutenticacionExitosa : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<string> lmails = new List<string>();

            tbanusuarios obj = TbanUsuariosDal.Find(rqmantenimiento.Cusuario);
            tperpersonadetalle pd = TperPersonaDetalleDal.Find(obj.cpersona??0, rqmantenimiento.Ccompania);
            lmails.Add(pd.email);

            DateTime factual = Fecha.GetFechaSistema();
            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("fechahora", factual.ToString("yyyy-MM-dd HH:mm:ss"));
            parametrosmail.Add("nombre", pd.nombre);

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 6);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
        }

    }
}


