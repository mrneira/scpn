using core.componente;
using dal.persona;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Threading;
using util;
using util.dto.mantenimiento;
using util.servicios.mail;

namespace seguridad.comp.mantenimiento.otp.gen {

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
            tsegusuariodetalle usuariodet = TsegUsuarioDetalleDal.Find(rqmantenimiento.Cusuario, rqmantenimiento.Ccompania);

            long cpersona = (long)usuariodet.cpersona;
            int ccompania = (int)usuariodet.ccompania;
            object detallepersonaobj = TperPersonaDetalleDal.Find(cpersona, ccompania);
            object mailobj = DtoUtil.GetValorCampo((IBean)detallepersonaobj, "email");
            string nombre = DtoUtil.GetValorCampo((IBean)detallepersonaobj, "nombre").ToString();

            if (mailobj==null) {
                throw new AtlasException("GEN-014", "MAIL DE LA PERSONA: {0} REQUERIDO", nombre);
            }

            lmails.Add(mailobj.ToString());

            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("claveotp", rqmantenimiento.GetString("claveotp"));
            parametrosmail.Add("nombre", nombre);

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 1);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
            
        }

    }
}
