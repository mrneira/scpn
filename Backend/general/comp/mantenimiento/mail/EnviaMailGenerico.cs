using core.componente;
using dal.contabilidad;
using dal.facturacionelectronica;
using dal.generales;
using modelo;
using NVelocity;
using NVelocity.App;
using SevenZip;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using util;
using util.dto.mantenimiento;
using util.servicios.mail;
using general.xml;
using System.Net.Mail;

namespace general.comp.mantenimiento.mail
{
    public class EnviaMailGenerico : ComponenteMantenimiento
    {
        /// <summary>
        /// Metodo que envia mails
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetDatos("lmails") == null)
            {
                return;
            }
            if (rqmantenimiento.Mdatos.ContainsKey("comprobanteElectronico"))
            {
                EnviarComprobante(rqmantenimiento);
                return;
            }
            object cnotificacionobj = rqmantenimiento.GetDatos("cnotificacion");
            if (cnotificacionobj == null)
            {
                return;
            }
            Velocity.Init();
            int cnotificacion = (int)cnotificacionobj;
            List<string> lmails = (List<string>)rqmantenimiento.GetDatos("lmails");
            tgennotificacion notificacion = TgenNotificacionDal.Find(cnotificacion);
            string asunto = notificacion.asunto;
            string cuerpo = notificacion.texto;

            Dictionary<string, object> context = new Dictionary<string, object>();
            context = (Dictionary<string, object>)rqmantenimiento.Mdatos["parametrosmail"];
            // agrega parametro imagen logo
            context.Add("logoimg", "<img src=\"cid:logoimg\" />");

            VelocityContext velocityContext = new VelocityContext();
            velocityContext.Put("mdatos", context);

            var writerasunto = new StringWriter();
            var writercuerpo = new StringWriter();
            Velocity.Evaluate(velocityContext, writerasunto, null, asunto);
            Velocity.Evaluate(velocityContext, writercuerpo, null, cuerpo);

            asunto = writerasunto.ToString();
            cuerpo = writercuerpo.ToString();

            if (lmails == null || lmails.Count <= 0)
            {
                return;
            }

            tgenparametros pservidor = TgenParametrosDal.Find("MAIL_SRV", rqmantenimiento.Ccompania);
            tgenparametros pfrom = TgenParametrosDal.Find("MAIL_FROM", rqmantenimiento.Ccompania);
            tgenparametros pusuario = TgenParametrosDal.Find("MAIL_USUARIO", rqmantenimiento.Ccompania);
            tgenparametrosseguridad ppassword = TgenParametrosSeguridadDal.Find("MAIL_PWD", rqmantenimiento.Ccompania);
            tgenparametros ppuerto = TgenParametrosDal.Find("MAIL_PUERTO", rqmantenimiento.Ccompania);
            tgenparametros pssl = TgenParametrosDal.Find("MAIL_SSL", rqmantenimiento.Ccompania);

            if (pservidor.texto == null || pfrom.texto == null || pusuario.texto == null ||
                ppassword.texto == null || ppuerto.numero == null || pssl.numero == null)
            {
                throw new AtlasException("GEN-015", "CREDENCIALES PARA ENVÍO DE MAIL NO PARAMETRIZADAS");
            }
            MailHilo mh;

            // Agrega imagen logo
            tgenlogo logo = TgenLogoDal.Find();
            Attachment att = new Attachment(new MemoryStream(logo.logo), "logo");
            att.ContentDisposition.Inline = true;
            att.ContentId = "logoimg";
            // fin agrega imagen

            Dictionary<string, byte[]> adjuntos = new Dictionary<string, byte[]>();
            if (rqmantenimiento.Mdatos.ContainsKey("adjuntos"))
            {
                adjuntos = (Dictionary<string, byte[]>)rqmantenimiento.Mdatos["adjuntos"];
                mh = new MailHilo(lmails, asunto, cuerpo,adjuntos);
            }
            else
            {
                mh = new MailHilo(lmails, asunto, cuerpo);
            }
            mh.Servidor = pservidor.texto;
            mh.Mailfrom = pfrom.texto;
            mh.Usuario = pusuario.texto;
            mh.Password = EncriptarParametros.Desencriptar(ppassword.texto);
            mh.Puerto = (int)ppuerto.numero;
            mh.Usassl = pssl.numero != null ? (pssl.numero == 1 ? true : false) : false;
            mh.Logo = att;

            Thread t = new Thread(new ThreadStart(mh.EnviaMail));
            t.Start();
        }

        public void EnviarComprobante(RqMantenimiento rqmantenimiento)
        {
            string mails =rqmantenimiento.GetDatos("lmails").ToString();
            if (mails == null || mails.Length <= 0)
            {
                return;
            }
            Velocity.Init();
            int cnotificacion = int.Parse(rqmantenimiento.GetDatos("cnotificacion").ToString());

            string numerodocumento = rqmantenimiento.GetDatos("numerodocumento").ToString();
            string tipodocumento = rqmantenimiento.GetDatos("tipodocumento").ToString();
            string claveacceso = rqmantenimiento.GetDatos("clavedeacceso").ToString();
            string modulo = (string)rqmantenimiento.GetDatos("modulo");
            if (modulo==null) {
                modulo = "";
            }

            tgennotificacion notificacion = TgenNotificacionDal.Find(cnotificacion);
            string asunto = notificacion.asunto;
            string cuerpo = notificacion.texto;

            Dictionary<string, object> parametrosmail = new Dictionary<string, object>();
            parametrosmail.Add("numerodocumento", numerodocumento);
            rqmantenimiento.AddDatos("parametrosmail", parametrosmail);

            Dictionary<string, object> context = new Dictionary<string, object>();
            context = (Dictionary<string, object>)rqmantenimiento.Mdatos["parametrosmail"];
            VelocityContext velocityContext = new VelocityContext();
            velocityContext.Put("mdatos", context);

            var writerasunto = new StringWriter();
            var writercuerpo = new StringWriter();
            Velocity.Evaluate(velocityContext, writerasunto, null, asunto);
            Velocity.Evaluate(velocityContext, writercuerpo, null, cuerpo);

            asunto = writerasunto.ToString();
            cuerpo = writercuerpo.ToString();

            ParametrosEmail correo = new ParametrosEmail();
            correo.Pservidor = TgenParametrosDal.Find("MAIL_SRV", rqmantenimiento.Ccompania).texto.ToString();
            correo.Pfrom = TgenParametrosDal.Find("MAIL_FROM", rqmantenimiento.Ccompania).texto.ToString();
            correo.Pusuario = TgenParametrosDal.Find("MAIL_USUARIO", rqmantenimiento.Ccompania).texto.ToString();
            correo.Ppassword = EncriptarParametros.Desencriptar(TgenParametrosSeguridadDal.Find("MAIL_PWD", rqmantenimiento.Ccompania).texto.ToString());
            correo.Ppuerto = (int)TgenParametrosDal.Find("MAIL_PUERTO", rqmantenimiento.Ccompania).numero;
            correo.Pssl = TgenParametrosDal.Find("MAIL_SSL", rqmantenimiento.Ccompania).numero != null ? (TgenParametrosDal.Find("MAIL_SSL", rqmantenimiento.Ccompania).numero == 1 ? true : false) : false;
            correo.PAsunto = asunto;
            correo.PCuerpo = cuerpo;

            if (correo.Pservidor == null || correo.Pfrom == null || correo.Pusuario == null ||
                correo.Ppassword == null || correo.Ppuerto == null || correo.Pssl == null)
            {
                throw new AtlasException("GEN-015", "CREDENCIALES PARA ENVÍO DE MAIL NO PARAMETRIZADAS");
            }

            // Parametros
            Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
            parametrosPdf.Add("i_claveacceso", claveacceso);
            parametrosPdf.Add("i_tipoDocumento", tipodocumento);
            parametrosPdf.Add("i_cinfompresa", rqmantenimiento.Ccompania);
            parametrosPdf.Add("i_numerodocumento", numerodocumento);
            string tipoReporte = "rptCel_RideRetencion";
            if (tipodocumento == "FA")
            {
                parametrosPdf.Add("i_modulo", modulo);
                tipoReporte = "rptCel_RideFactura";
            }
            //consultar xml
            tcellogdocumentos archivoXml = TcelLogDocumentosDal.FindDocumento(tipodocumento, numerodocumento);
            tcellogdocumentos autorizacionXml = TcelLogDocumentosDal.FindDocumentoAutorizado(tipodocumento, numerodocumento);
            tconparametros ambiente = TconParametrosDal.FindTexto("SRI_AMBIENTE", rqmantenimiento.Ccompania, int.Parse(autorizacionXml.ambiente));
            byte[] barchivo = archivoXml.xmlfirmado;
            byte[] archivoSinCompresion = SevenZipExtractor.ExtractBytes(barchivo);
            byte[] xmlCompleto = CompletaXmlHelper.ObtenerDocumentoAutorizado(archivoSinCompresion, autorizacionXml.autorizacion, archivoXml.fingreso.Value, autorizacionXml.mensaje, ambiente.texto);
            //consultar pdf
            
            byte[] archivoPdf = null;
            general.reporte.GenerarArchivo.generarArchivo("PDF", "/CesantiaReportes/FacturacionElectronica/", tipoReporte, "c:\\tmp\\", "pdf_ride", parametrosPdf, true, out archivoPdf);

            Dictionary<string, byte[]> adjuntos = new Dictionary<string, byte[]>();
            adjuntos.Add(string.Format("{0}_{1}.xml", tipodocumento, numerodocumento), xmlCompleto);
            adjuntos.Add(string.Format("{0}_{1}.pdf", tipodocumento, numerodocumento), archivoPdf);

            Thread t = new Thread(() => EnvioEmail.EnviarEmailAdjuntos(adjuntos, correo, mails));
            t.Start();
        }
    }
}
