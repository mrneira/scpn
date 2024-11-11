using core.componente;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using util;
using util.dto.mantenimiento;

namespace cobranza.comp.mantenimiento.notificacionCobranza
{
    public class NotificacionCobranza : ComponenteMantenimiento
    {
        /// <summary>
        /// Metodo que genera el codigo otp.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            List<string> lmails = new List<string>();

            List<tcobcobranzaaccion> lacciones = rqmantenimiento.GetTabla("INGRESOACCIONES").Lregistros.Cast<tcobcobranzaaccion>().ToList();
            foreach (tcobcobranzaaccion accion in lacciones)
            {
                if ((bool)accion.GetDatos("enviocorreo"))
                {

                    ValidaEmail(accion.correo);
                    lmails.Add(accion.correo);

                    DateTime factual = Fecha.GetFechaSistema();//NCH 20220810

                    // Generacion de parametros para el envio de mail
                    Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
                    parametrosmail.Add("nombre", accion.GetDatos("nombre").ToString());
                    //NCH 20220810 Aumento de parametros en el envio de mail
                    parametrosmail.Add("identificacion", accion.GetDatos("identificacion").ToString());
                    parametrosmail.Add("coperacion", accion.GetDatos("coperacion").ToString());
                    parametrosmail.Add("saldovencido", accion.GetDatos("saldovencido").ToString());
                    parametrosmail.Add("numcuotavencido", accion.GetDatos("numcuotavencido").ToString());
                    parametrosmail.Add("diasvencido", accion.GetDatos("diasvencido").ToString());
                    parametrosmail.Add("ntipoprod", accion.GetDatos("ntipoprod").ToString());
                    parametrosmail.Add("fechahora", factual.ToString("yyyy-MM-dd"));
                    parametrosmail.Add("estado", accion.GetDatos("estado").ToString());

                    //

                    // Codigo de plantilla de notificacion
                    rqmantenimiento.AddDatos("cnotificacion", 4);
                    // Lista de mails a enviar
                    rqmantenimiento.AddDatos("lmails", lmails);
                    // fija variables a utilizar en velocity.
                    rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
                }
            }
        }

        /// <summary>
        /// Metodo que valida correo electronico
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public void ValidaEmail(string email)
        {
            String expresion;
            expresion = "\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*";
            if (Regex.IsMatch(email, expresion))
            {
                if (Regex.Replace(email, expresion, String.Empty).Length != 0)
                {
                    throw new AtlasException("BPER-009", "EMAIL NO TIENE EL FORMATO CORRECTO {0}", email);
                }
            }
            else
            {
                throw new AtlasException("BPER-009", "EMAIL NO TIENE EL FORMATO CORRECTO {0}", email);
            }

        }
    }
}
