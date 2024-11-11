using core.componente;
using dal.bancaenlinea;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;

namespace bancaenlinea.usuario {

    /// <summary>
    /// Clase encargada de enviar, clave temporal al correo electronico del usuario.
    /// </summary>
    public class MailClaveOtp : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
           
            List<string> lmails = new List<string>();

            tbanusuarios obj = TbanUsuariosDal.Find(rqmantenimiento.Cusuario);
            tperpersonadetalle pd = TperPersonaDetalleDal.Find(obj.cpersona??0, rqmantenimiento.Ccompania);

            if (pd.email == null) {
                throw new AtlasException("GEN-014", "MAIL DE LA PERSONA: {0} REQUERIDO", pd.nombre);
            }

            lmails.Add(pd.email);

            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("claveotp", rqmantenimiento.GetString("claveotp"));
            parametrosmail.Add("nombre", pd.nombre);

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 5);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
            
        }

    }
}
