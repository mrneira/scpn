using core.componente;
using dal.persona;
using dal.talentohumano;
using dal.seguridades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.mantenimiento.olvidoContrasenia.gen {
    /// <summary>
    /// Clase encargada de enviar, clave temporal al correo electronico del usuario.
    /// </summary>
    public class MailClaveTemp : ComponenteMantenimiento {

        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            List<string> lmails = new List<string>();
            Dictionary<string, object> mdatos = new Dictionary<string, object>();

            tthfuncionariodetalle tthfuncionariodetalle = TthFuncionarioDal.Find(rqmantenimiento.GetString("identificacion"));
            string nombre = tthfuncionariodetalle.primernombre + " " + tthfuncionariodetalle.primerapellido;

            //tperpersonadetalle objpersona = TperPersonaDetalleDal.Find(rqmantenimiento.GetString("identificacion"));
            //long? cpersonab = objpersona.cpersona;
            //tsegusuariodetalle usuariodet = TsegUsuarioDetalleDal.FindCpersona(cpersonab, rqmantenimiento.Ccompania);
            //long cpersona = (long)usuariodet.cpersona;
            //int ccompania = (int)usuariodet.ccompania;
            //object detallepersonaobj = TperPersonaDetalleDal.Find(cpersona, ccompania);
            //object mailobj = DtoUtil.GetValorCampo((IBean)detallepersonaobj, "email");
            //string nombre = DtoUtil.GetValorCampo((IBean)detallepersonaobj, "nombre").ToString();
            if (tthfuncionariodetalle.email != null)
                if (!tthfuncionariodetalle.email.Equals(""))
                    lmails.Add(tthfuncionariodetalle.email);

            if (tthfuncionariodetalle.emailinstitucion != null)
                if (!tthfuncionariodetalle.emailinstitucion.Equals(""))
                    lmails.Add(tthfuncionariodetalle.emailinstitucion);       

            if (lmails.Count() == 0) {
                throw new AtlasException("GEN-014", "MAIL DE LA PERSONA: {0} REQUERIDO", nombre);
            }

            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("clavetemp", rqmantenimiento.GetString("clavetemp"));
            parametrosmail.Add("nombre", nombre);

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 2);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
        }

    }
}


