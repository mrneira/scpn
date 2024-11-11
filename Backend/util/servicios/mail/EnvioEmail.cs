using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using modelo;

namespace util.servicios.mail
{

    /// <summary>
    /// Clase que se encarga de enviar correos electronicos con adjuntos genérico.
    /// </summary>
    public class EnvioEmail
    {

        public static void EnviarEmailAdjuntos(Dictionary<string, byte[]> adjuntos, ParametrosEmail parametrosEnvioCorreo, string emails)
        {
            MailMessage mail = new MailMessage();
            foreach (string email in emails.Split(';'))
            {
                mail.To.Add(new MailAddress(email));
            }
            mail.From = new MailAddress(parametrosEnvioCorreo.Pfrom);
            mail.Subject = parametrosEnvioCorreo.PAsunto;
            mail.Body = parametrosEnvioCorreo.PCuerpo;
            mail.IsBodyHtml = true;

            //Envía el mensaje.
            SmtpClient smtp = new SmtpClient();
            smtp.Host = parametrosEnvioCorreo.Pservidor;
            smtp.Port = parametrosEnvioCorreo.Ppuerto;
            smtp.EnableSsl = parametrosEnvioCorreo.Pssl;
            smtp.Credentials = new NetworkCredential(parametrosEnvioCorreo.Pusuario, parametrosEnvioCorreo.Ppassword);
            //agregar adjuntos
            foreach (KeyValuePair<string, byte[]> entry in adjuntos)
            {
                mail.Attachments.Add(new Attachment(new MemoryStream(entry.Value), entry.Key));
            }
            try
            {
                smtp.Send(mail);
                mail.Dispose();
            }
            catch (Exception ex)
            {
                Console.Out.WriteLine(ex.StackTrace);
            }
        }
    }
}
