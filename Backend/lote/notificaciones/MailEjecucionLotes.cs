using core.componente;
using dal.generales;
using dal.lote;
using modelo;
using System;
using System.Collections.Generic;
using util.dto.mantenimiento;

namespace lote.notificaciones
{
    /// <summary>
    /// Clase encargada de enviar, clave temporal al correo electronico del usuario.
    /// </summary>
    public class MailEjecucionLotes : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            string clote = (String)rqmantenimiento.GetDatos("clote");
            int cmodulolote = (int)rqmantenimiento.GetDatos("cmodulolote");
            int fcontablelote = (int)rqmantenimiento.GetDatos("fcontablelote");
            int numeroejecucionlote = (int)rqmantenimiento.GetDatos("numeroejecucionlote");

            tlotecodigo lote = TloteCodigoDal.Find(clote);
            tlotemodulo lotemod = TloteModuloDal.Find(cmodulolote, clote);
            tloteresultado result = TloteResultadoDal.Find(cmodulolote, clote, fcontablelote, numeroejecucionlote);
            tgenmodulo modulo = TgenModuloDal.Find(cmodulolote);

            String mail = null;
            if (lotemod.cpersonaresponsable != null) {
                mail = TloteResultadoDal.ObtenerMailLote(lotemod.ccompania??0, lotemod.cpersonaresponsable??0);
            }
            if (mail==null) {
                return;
            }


            List<string> lmails = new List<string>();
            lmails.Add(mail);

            // Generacion de parametros para el envio de mail
            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            String nlote = lote.nombre;
            if (result != null) {
                String finicio = ((DateTime)result.finicio).ToString("yyyy-MM-dd hh:mm:ss");
                String ffin = ((DateTime)result.ffinalizacion).ToString("yyyy-MM-dd hh:mm:ss");
                String cusuariolote = result.cusuario;
                int? nejecutados = result.ejecutados;
                int? nerrores = result.error;
                int? nexitos = result.exito;

                // fija variables a utilizar en velocity para el mensaje a entregar.
                parametrosmail.Add("nlote", nlote);
                parametrosmail.Add("nmodulo", modulo.nombre);
                parametrosmail.Add("finicio", finicio);
                parametrosmail.Add("ffin", ffin);
                parametrosmail.Add("usuariolote", cusuariolote);
                parametrosmail.Add("nejecutados", nejecutados);
                parametrosmail.Add("nerrores", nerrores);
                parametrosmail.Add("nexitos", nexitos);
            }

            // Codigo de plantilla de notificacion
            rqmantenimiento.AddDatos("cnotificacion", 3);
            // Lista de mails a enviar
            rqmantenimiento.AddDatos("lmails", lmails);
            // fija variables a utilizar en velocity.
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);
        }


    }
}
