using System;
using facturacionelectronica.comp.catalogo;
using facturacionelectronica.comp.consulta.entidades;
using facturacionelectronica.comp.consulta.generaxml;
using modelo;
using System.Collections.Generic;
using dal.facturacionelectronica;
using facturacionelectronica.comp.consulta.helper;
using System.Globalization;
using es.mityc.firmaJava.libreria.utilidades;
using es.mityc.firmaJava.libreria.xades;
using es.mityc.javasign.pkstore;
using es.mityc.javasign.pkstore.keystore;
using java.io;
using java.security;
using java.security.cert;
using java.util;
using javax.xml.parsers;
using org.w3c.dom;
using sviudes.blogspot.com;
using es.mityc.javasign.xml.refs;
using facturacionelectronica.RecepcionComprobantesOffline;
using System.Text;
using util.servicios.ef;
using System.Threading;
using util;
using dal.generales;
using SevenZip;
using dal.contabilidad;
using System.IO;

namespace facturacionelectronica.comp.consulta.componentegeneracion
{
    public static class CorreccionComprobante
    {
        /// <summary>
        /// Genera tipo de entidad desde documento.
        /// </summary>
        /// <param name="informacionComprobante"></param>
        public static void GenerarEntidadDocumento(EntidadComprobante informacionComprobante)
        {
            try
            {
                AtlasContexto contexto = new AtlasContexto();
                Sessionef.FijarAtlasContexto(contexto);
                tcelinfoempresa informacionEmpresa = new tcelinfoempresa();
                informacionEmpresa = TcelInfoEmpresaDal.GetTcelinfoempresa();
                CatalogoHelper.CodigoDocumento codigoDocumento;
                Enum.TryParse(informacionComprobante.TipoDocumento, out codigoDocumento);
                Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
                switch (codigoDocumento)
                {
                    case CatalogoHelper.CodigoDocumento.Factura:
                        {
                            List<tconparametros> parametro = dal.contabilidad.TconParametrosDal.FindXNombre("SECUENCIA SRI FACTURAS PARQUEADERO", 1);
                            informacionComprobante.ParametroGeneracionComprobante = Math.Round(double.Parse(parametro[0].numero.ToString()), 0).ToString();
                            tcelsecuenciasri secuenciasri = TcelSecuenciaSriDal.FindXSecuencia(informacionComprobante.ParametroGeneracionComprobante.ToString());
                            informacionComprobante.DireccionEstablecimiento = secuenciasri.direccionestablecimiento;
                            informacionComprobante.FechaEmisionComprobante = DateTime.Parse(informacionComprobante.FechaEmisionDocumento).ToString("ddMMyyyy");
                            string xmlFactura = FacturaModel.ObtenerXml(informacionEmpresa, informacionComprobante,2);
                            string ubicacionDocumentoFirmado = GenerarFirmaEnDisco
                                (
                                    StringToByteArrayUtf8(xmlFactura),
                                    informacionComprobante.ClaveAcceso
                                );

                            EntidadRecepcion[] entidadRecepcion = RespuestaRecepcionSri(ubicacionDocumentoFirmado, informacionComprobante.ClaveAcceso);
                            if (entidadRecepcion.Length>0)
                            {
                                tcellogdocumentos log = new tcellogdocumentos();
                                log.tipodocumento = "FA";
                                log.numerodocumento = string.Format("{0}-{1}-{2}",informacionComprobante.Establecimiento,informacionComprobante.PuntoEmision,informacionComprobante.Secuencial);
                                log.estado = 1;
                                StringBuilder sb = new StringBuilder();
                                foreach (EntidadRecepcion recep in entidadRecepcion)
                                {
                                    if (recep.Mensajes != null)
                                    {
                                        foreach (EntidadRecepcionMensaje mens in recep.Mensajes)
                                        {
                                            sb.AppendLine(string.Format("{4}: {0}: {1} {2} {3}", mens.Tipo, mens.Identificador, mens.Mensaje, mens.InformacionAdicional, recep.Estado));
                                        }
                                    }
                                    else
                                    {
                                        sb.AppendLine(recep.Estado);
                                    }
                                }
                                log.mensaje = sb.ToString();
                                                                
                                log.clavedeacceso = entidadRecepcion[0].ClaveAcceso;
                                log.esreenvio = entidadRecepcion[0].Reenvio;
                                log.cusuarioing = informacionComprobante.CusuarioIng;
                                log.fingreso = informacionComprobante.Fingreso;
                                log.xmlfirmado = SevenZipCompressor.CompressBytes(System.IO.File.ReadAllBytes(ubicacionDocumentoFirmado));
                                log.ambiente = TconParametrosDal.FindXCodigo("SRI_AMBIENTE", informacionComprobante.Ccompania).texto.ToString();
                                log.tipoemision = TconParametrosDal.FindXCodigo("SRI_EMISION", informacionComprobante.Ccompania).texto.ToString();
                                TcelLogDocumentosDal.CrearLogDocumentos(log);
                            }
                            if (System.IO.File.Exists(ubicacionDocumentoFirmado))
                            {
                                System.IO.File.Delete(ubicacionDocumentoFirmado);
                            }
                            break;
                        }
                    case CatalogoHelper.CodigoDocumento.NotaCredito:
                        {
                            //return DocumentoNotaCredito(informacionEmpresa, informacionComprobante);
                            break;
                        }
                    case CatalogoHelper.CodigoDocumento.ComprobanteRetencion:
                        {
                            List<tconparametros> parametro = dal.contabilidad.TconParametrosDal.FindXNombre("SECUENCIA SRI FACTURAS PARQUEADERO", 1);
                            informacionComprobante.ParametroGeneracionComprobante = Math.Round(double.Parse(parametro[0].numero.ToString()), 0).ToString();
                            tcelsecuenciasri secuenciasri = TcelSecuenciaSriDal.FindXSecuencia(informacionComprobante.ParametroGeneracionComprobante.ToString());
                            informacionComprobante.DireccionEstablecimiento = secuenciasri.direccionestablecimiento;
                            informacionComprobante.FechaEmisionComprobante = DateTime.Parse(informacionComprobante.FechaEmisionDocumento).ToString("ddMMyyyy");
                            DateTime fechaEmision = DateTime.Parse(informacionComprobante.FechaEmisionDocumento);
                            informacionComprobante.PeriodoFiscal = string.Format("{0}/{1}", fechaEmision.Month.ToString("00"), fechaEmision.Year);
                            string xmlRetencion = ComprobanteRetencionModel.ObtenerXml(informacionEmpresa, informacionComprobante, 2);
                            string ubicacionDocumentoFirmado = GenerarFirmaEnDisco
                                (
                                    StringToByteArrayUtf8(xmlRetencion),
                                    informacionComprobante.ClaveAcceso
                                );

                            EntidadRecepcion[] entidadRecepcion = RespuestaRecepcionSri(ubicacionDocumentoFirmado, informacionComprobante.ClaveAcceso);
                            if (entidadRecepcion.Length > 0)
                            {
                                tcellogdocumentos log = new tcellogdocumentos();
                                log.tipodocumento = "CR";
                                log.numerodocumento = string.Format("{0}-{1}-{2}", informacionComprobante.Establecimiento, informacionComprobante.PuntoEmision, informacionComprobante.Secuencial);
                                log.estado = 1;
                                StringBuilder sb = new StringBuilder();
                                foreach (EntidadRecepcion recep in entidadRecepcion)
                                {
                                    if (recep.Mensajes != null)
                                    {
                                        foreach (EntidadRecepcionMensaje mens in recep.Mensajes)
                                        {
                                            sb.AppendLine(string.Format("{4}: {0}: {1} {2} {3}", mens.Tipo, mens.Identificador, mens.Mensaje, mens.InformacionAdicional, recep.Estado));
                                        }
                                    }
                                    else
                                    {
                                        sb.AppendLine(recep.Estado);
                                    }
                                }
                                log.mensaje = sb.ToString();

                                log.clavedeacceso = entidadRecepcion[0].ClaveAcceso;
                                log.esreenvio = entidadRecepcion[0].Reenvio;
                                log.cusuarioing = informacionComprobante.CusuarioIng;
                                log.fingreso = informacionComprobante.Fingreso;
                                log.xmlfirmado = SevenZipCompressor.CompressBytes(System.IO.File.ReadAllBytes(ubicacionDocumentoFirmado));
                                log.ambiente = TconParametrosDal.FindXCodigo("SRI_AMBIENTE", informacionComprobante.Ccompania).texto.ToString();
                                log.tipoemision = TconParametrosDal.FindXCodigo("SRI_EMISION", informacionComprobante.Ccompania).texto.ToString();
                                TcelLogDocumentosDal.CrearLogDocumentos(log);
                            }
                            if (System.IO.File.Exists(ubicacionDocumentoFirmado))
                            {
                                System.IO.File.Delete(ubicacionDocumentoFirmado);
                            }
                            break;
                        }
                }
            }
            catch (Exception ex)
            {
                throw new AtlasException("CEL-003", "ERROR GENERACIÓN {0}", ex.Message);
            }

        }

        /// <summary>
        /// Firma de documento
        /// </summary>
        /// <param name="archivoFirmar"></param>
        /// /// <param name="pClaveAcesso"></param>
        private static string GenerarFirmaEnDisco(byte[] archivoFirmar, string pClaveAcesso)
        {
            tgenparametros pubicacion = TgenParametrosDal.Find("ARCHIVOS_FIRMADOS_CEL", 1);
            string path = pubicacion.texto; 
            PrivateKey privateKey;
            Provider provider;
            X509Certificate certificate;

            certificate = LoadCertificate(out privateKey, out provider);

            if (certificate != null)
            {
                DataToSign dataToSign = new DataToSign();
                dataToSign.setXadesFormat(EnumFormatoFirma.XAdES_BES);
                dataToSign.setEsquema(XAdESSchemas.XAdES_132);
                dataToSign.setXMLEncoding("UTF-8");
                dataToSign.setEnveloped(true);
                dataToSign.setParentSignNode("comprobante");
                dataToSign.addObject(new ObjectToSign(new InternObjectToSign("comprobante"), "Comprobante", null, "text/xml", null));
                dataToSign.setDocument(CargarXml(archivoFirmar));

                Object[] res = new FirmaXML().signFile(certificate, dataToSign, privateKey, provider);

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);

                path = string.Format(@"{0}{1}_signed.xml", path, pClaveAcesso);


                using (OutputStream stre = new FileOutputStream(path))
                {
                    UtilidadTratarNodo.saveDocumentToOutputStream((Document)res[0], stre, true);
                    stre.close();
                    stre.flush();
                }

                return path;
            }
            return null;
        }

        /// <summary>
        /// Convierte de string a byte Array
        /// </summary>
        /// <param name="cadena"></param>
        private static byte[] StringToByteArrayUtf8(string cadena)
        {
            return Encoding.GetEncoding("UTF-8").GetBytes(cadena);
        }

        /// <summary>
        /// Extraer xml
        /// </summary>
        /// <param name="entrada"></param>
        private static Document CargarXml(byte[] entrada)
        {
            javax.xml.parsers.DocumentBuilderFactory dbf = javax.xml.parsers.DocumentBuilderFactory.newInstance();
            dbf.setNamespaceAware(true);

            InputStream stream = new ByteArrayInputStream(entrada);
            return dbf.newDocumentBuilder().parse(stream);
        }

        /// <summary>
        /// Letura de certificado digital
        /// </summary>
        /// <param name="privateKey"></param>
        /// /// <param name="provider"></param>
        private static X509Certificate LoadCertificate(out PrivateKey privateKey, out Provider provider)
        {
            tcelinfoempresa informacionEmpresa = new tcelinfoempresa();
            informacionEmpresa = TcelInfoEmpresaDal.GetTcelinfoempresa();
            tgenparametros pubicacioncertificado = TgenParametrosDal.Find("UBICACION_FIRMA", 1);
            tcelcertificado tcelcertificado = TcelCertificadoDal.FindActivo();
            string path = string.Format("{0}{1}.{2}", pubicacioncertificado.texto, tcelcertificado.nombrecertificado, tcelcertificado.extension);
            if (!System.IO.File.Exists(path))
            {
                System.IO.File.WriteAllBytes(path, tcelcertificado.firma);
            }
            string password = EncodingPassword.base64Decode(tcelcertificado.clave);

            X509Certificate certificate = null;
            provider = null;
            privateKey = null;

            KeyStore ks = KeyStore.getInstance("PKCS12");
            ks.load(new BufferedInputStream(new FileInputStream(path)), password.ToCharArray());
            IPKStoreManager storeManager = new KSStore(ks, new PassStoreKS(password));
            List certificates = storeManager.getSignCertificates();

            if (certificates.size() > 0)
            {
                certificate = (X509Certificate)certificates.get(0);
                privateKey = storeManager.getPrivateKey(certificate);
                provider = storeManager.getProvider(certificate);
                return certificate;
            }
            return null;
        }

        /// <summary>
        /// Recepción de respuesta de SRI
        /// </summary>
        /// <param name="ubicacionDocumentoFirmado"></param>
        /// /// <param name="claveAcceso"></param>
        private static EntidadRecepcion[] RespuestaRecepcionSri(string ubicacionDocumentoFirmado, string claveAcceso)
        {
            EntidadRecepcion[] respuestaRecepcionSri = null;

            try
            {
                byte[] documentoXmlFirmado = System.IO.File.ReadAllBytes(ubicacionDocumentoFirmado);
                RecepcionComprobantesOfflineClient recepcion = new RecepcionComprobantesOfflineClient();
                respuestaSolicitud respuestaRecepcion = recepcion.validarComprobante(documentoXmlFirmado);

                if (respuestaRecepcion.estado == "RECIBIDA")
                {
                    EntidadRecepcion[] entidadRecepcion = new EntidadRecepcion[1];
                    entidadRecepcion[0] = new EntidadRecepcion()
                    {
                        Estado = respuestaRecepcion.estado,
                        ClaveAcceso = claveAcceso,
                        Reenvio = false
                    };
                    respuestaRecepcionSri = entidadRecepcion;
                }
                else
                {
                    if (respuestaRecepcion.comprobantes.Length > 0)
                    {
                        EntidadRecepcion[] entidadRecepcion = new EntidadRecepcion[respuestaRecepcion.comprobantes.Length];
                        int er = 0;
                        foreach (comprobante RespuestaRecepcion in respuestaRecepcion.comprobantes)
                        {
                            entidadRecepcion[er] = new EntidadRecepcion()
                            {
                                Estado= respuestaRecepcion.estado,
                                ClaveAcceso= RespuestaRecepcion.claveAcceso,
                                Reenvio = true
                        }; 

                            if (RespuestaRecepcion.mensajes.Length > 0)
                            {
                                int me = 0;
                                entidadRecepcion[er].Mensajes = new EntidadRecepcionMensaje[RespuestaRecepcion.mensajes.Length];
                                foreach (mensaje mensajesAutorizacion in RespuestaRecepcion.mensajes)
                                {
                                    entidadRecepcion[er].Mensajes[me] = new EntidadRecepcionMensaje()
                                    {
                                        Identificador = mensajesAutorizacion.identificador,
                                        InformacionAdicional = mensajesAutorizacion.informacionAdicional,
                                        Mensaje = mensajesAutorizacion.mensaje1,
                                        Tipo = mensajesAutorizacion.tipo
                                    };
                                    me = me + 1;
                                }
                            }
                            er = er + 1;
                        }
                        
                        respuestaRecepcionSri = entidadRecepcion;
                    }
                }
                return respuestaRecepcionSri;
            }
            catch (Exception ex)
            {
                throw new AtlasException("CEL-001", "CONEXION SRI RECEPCION {0}",ex.Message);
            }
        }
    }
}
