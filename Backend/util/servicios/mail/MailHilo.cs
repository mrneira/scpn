using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Reflection;
using System.Threading;
using static System.Net.Mime.MediaTypeNames;

namespace util.servicios.mail {

    /// <summary>
    /// Clase que se encarga de enviar correos electronicos en hilos de manera asincronica.
    /// </summary>
    public class MailHilo {

        /// Lista de correos electronicos a los cuales se envia las notificaciones.
        private List<string> lemails;
 
        /// Asunto del mail.
        private string asunto;

        /// Texto del mail.
        private string texto;

        /// Texto del mail.
        private string servidor;

        /// Mail from
        private string mailfrom;

        /// Usuario
        private string usuario;

        /// Password
        private string password;

        /// Puerto
        private int puerto;

        /// SSL
        private Boolean usassl;

        /// Logo
        private Attachment logo;

        public string Asunto { get => asunto; set => asunto = value; }
        public string Texto { get => texto; set => texto = value; }
        public string Servidor { get => servidor; set => servidor = value; }
        public string Mailfrom { get => mailfrom; set => mailfrom = value; }
        public string Usuario { get => usuario; set => usuario = value; }
        public string Password { get => password; set => password = value; }
        public int Puerto { get => puerto; set => puerto = value; }
        public bool Usassl { get => usassl; set => usassl = value; }
        public Dictionary<string, byte[]> adjuntosm { get; set; }
        public Attachment Logo { get => logo; set => logo = value; }

        /// Crea una instancia de MailHilo.
        public MailHilo(List<string> lemails, string asunto, string texto) {
            this.lemails = lemails;
            this.asunto = asunto;
            this.texto = texto;
            
        }
        /// Crea una instancia de MailHilo con archivos Adjuntos
        public MailHilo(List<string> lemails, string asunto, string texto, Dictionary<string, byte[]> adjuntos)
        {
            this.lemails = lemails;
            this.asunto = asunto;
            this.texto = texto;
            this.adjuntosm = adjuntos;
        }
        public void EnviaMail() {
            // Crea el mensaje estableciendo quién lo manda y quién lo recibe
            MailMessage mail = new MailMessage();
            foreach (string email in lemails) {
                mail.To.Add(new MailAddress(email));
            }
            mail.From = new MailAddress(mailfrom);
            mail.Subject = asunto;
            mail.Body = texto;
            mail.IsBodyHtml = true;

            // Agrega imagen logo
            if (logo!=null) {
                mail.Attachments.Add(logo);
            }
            // fin agrega imagen

            if (this.adjuntosm != null)
            {
                foreach (KeyValuePair<string, byte[]> entry in this.adjuntosm)
                {
                    mail.Attachments.Add(new Attachment(new MemoryStream(entry.Value), entry.Key));
                }
            }
            //Envía el mensaje.
            SmtpClient smtp = new SmtpClient();
            smtp.Host = servidor;
            smtp.Port = puerto;
            smtp.EnableSsl = usassl;
            smtp.Credentials = new NetworkCredential(usuario, password);
           
            try {
                smtp.Send(mail);
                mail.Dispose();
            } catch (Exception ex) {
                Console.Out.WriteLine(ex.StackTrace);
            }

        }
    }    

}
