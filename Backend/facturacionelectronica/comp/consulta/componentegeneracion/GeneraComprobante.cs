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
    public static class GeneraComprobante
    {
        /// <summary>
        /// Generar Entidad Documento
        /// </summary>
        /// <param name="informacionComprobante"></param>
        public static void GenerarEntidadDocumento(EntidadComprobante informacionComprobante)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            try
            {
                //AtlasContexto contexto = new AtlasContexto();
                //Sessionef.FijarAtlasContexto(contexto);
                tcelinfoempresa informacionEmpresa = new tcelinfoempresa();
                informacionEmpresa = TcelInfoEmpresaDal.GetTcelinfoempresa();
                CatalogoHelper.CodigoDocumento codigoDocumento;
                Enum.TryParse(informacionComprobante.TipoDocumento, out codigoDocumento);
                Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
                switch (codigoDocumento)
                {
                    case CatalogoHelper.CodigoDocumento.Factura:
                        {
                            tconparametros parametro = TconParametrosDal.FindXCodigo("SEC_SRI_FAC_PARQ", 1);
                            informacionComprobante.ParametroGeneracionComprobante = Math.Round(double.Parse(parametro.numero.ToString()), 0).ToString();
                            tcelsecuenciasri secuenciasri = TcelSecuenciaSriDal.FindXSecuencia(informacionComprobante.ParametroGeneracionComprobante.ToString());
                            informacionComprobante.DireccionEstablecimiento = secuenciasri.direccionestablecimiento;
                            informacionComprobante.FechaEmisionComprobante = DateTime.Parse(informacionComprobante.FechaEmisionDocumento).ToString("ddMMyyyy");
                            informacionComprobante.ClaveAcceso = GenerarClaveAcceso(informacionEmpresa, informacionComprobante);
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
                                log.xmlfirmado= SevenZipCompressor.CompressBytes(System.IO.File.ReadAllBytes(ubicacionDocumentoFirmado));
                                log.ambiente = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_AMBIENTE", informacionComprobante.Ccompania).numero.Value).ToString();
                                log.tipoemision = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_EMISION", informacionComprobante.Ccompania).numero.Value).ToString();
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
                            break;
                        }
                    case CatalogoHelper.CodigoDocumento.ComprobanteRetencion:
                        {
                            tconparametros parametro = TconParametrosDal.FindXCodigo("SEC_SRI_COMRET_CESANTIA", 1);
                           
                            informacionComprobante.ParametroGeneracionComprobante = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_AMBIENTE", informacionComprobante.Ccompania).numero.Value).ToString();
                            tcelsecuenciasri secuenciasri = TcelSecuenciaSriDal.FindXSecuencia(informacionComprobante.ParametroGeneracionComprobante.ToString());
                            informacionComprobante.DireccionEstablecimiento = secuenciasri.direccionestablecimiento;
                            informacionComprobante.FechaEmisionComprobante = DateTime.Parse(informacionComprobante.FechaEmisionDocumento).ToString("ddMMyyyy");
                            informacionComprobante.ClaveAcceso = GenerarClaveAcceso(informacionEmpresa, informacionComprobante);
                            DateTime fechaEmision= DateTime.Parse(informacionComprobante.FechaEmisionDocumento);
                            informacionComprobante.PeriodoFiscal = string.Format("{0}/{1}",fechaEmision.Month.ToString("00"),fechaEmision.Year);
                            string xmlRetencion = ComprobanteRetencionModel.ObtenerXml(informacionEmpresa, informacionComprobante,2);
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
                                log.ambiente = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_AMBIENTE", informacionComprobante.Ccompania).numero.Value).ToString();
                                log.tipoemision = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_EMISION", informacionComprobante.Ccompania).numero.Value).ToString();
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
                throw new AtlasException("CEL-003", "ERROR GENERACIÓN DOCUMENTO ELECTRÓNICO {0}", ex.Message);
            }

        }

        /// <summary>
        /// Firmar Documento
        /// </summary>
        /// <param name="archivoFirmar"></param>
        /// <param name="pClaveAcesso"></param>
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
        /// convierte de string a byte array
        /// </summary>
        /// <param name="cadena"></param>
        private static byte[] StringToByteArrayUtf8(string cadena)
        {
            return Encoding.GetEncoding("UTF-8").GetBytes(cadena);
        }

        /// <summary>
        /// Generar Clave Acceso
        /// </summary>
        /// <param name="informacionEmpresa"></param>
        /// <param name="informacionComprobante"></param>
        private static string GenerarClaveAcceso(tcelinfoempresa informacionEmpresa, EntidadComprobante informacionComprobante)
        {
            string pCodigoNumerico = GenerarCodigoNumerico();
            string ambiente = Math.Truncate(TconParametrosDal.FindXCodigo("SRI_AMBIENTE", informacionComprobante.Ccompania).numero.Value).ToString();

            string clave = string.Concat(
                informacionComprobante.FechaEmisionComprobante, informacionComprobante.TipoDocumento, informacionEmpresa.ruc,ambiente,
                informacionComprobante.Establecimiento + informacionComprobante.PuntoEmision + informacionComprobante.Secuencial, pCodigoNumerico, "1");

            clave = string.Concat(clave, CalcularDigitoVerificador(clave));
            return clave;
        }

        /// <summary>
        /// Generar Código Númerico
        /// </summary>
        private static string GenerarCodigoNumerico()
        {
            return DateTime.Now.ToString("hhmmssMM");
        }

        /// <summary>
        /// Calcular Dígito Verificador
        /// </summary>
        /// <param name="pClave"></param>
        private static string CalcularDigitoVerificador(string pClave)
        {
            if (pClave.Length != 48)
                throw new ApplicationException("No se generó correctamente la cadena contenedora de la clave de acceso");

            int contador;
            int factor = 2;
            int suma = 0;
            char[] digitos = pClave.ToCharArray();

            for (contador = 47; contador >= 0; contador--)
            {
                suma += short.Parse(digitos[contador].ToString(CultureInfo.InvariantCulture)) * factor;
                factor += 1;
                if (factor > 7)
                {
                    factor = 2;
                }
            }

            int digitoVerificador = 11 - (suma % 11);
            if (digitoVerificador == 11)
            {
                digitoVerificador = 0;
            }
            else if (digitoVerificador == 10)
            {
                digitoVerificador = 1;
            }
            return digitoVerificador.ToString(CultureInfo.InvariantCulture);
        }

        /// <summary>
        /// Cargar XML
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
        /// Cargar certificado
        /// </summary>
        /// <param name="provider"></param>
        /// <param name="privateKey"></param>
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
        /// <param name="claveAcceso"></param>
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
