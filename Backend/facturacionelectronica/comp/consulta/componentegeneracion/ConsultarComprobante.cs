using System;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using facturacionelectronica.AutorizacionComprobantesOffline;
using System.Text;
using dal.facturacionelectronica;
using util;

namespace facturacionelectronica.comp.consulta.componentegeneracion
{
    public static class ConsultarComprobante
    {
        /// <summary>
        /// Consulta para obtener autorización de documentos.
        /// </summary>
        /// <param name="logdocumento"></param>
        /// <param name="ccompania"></param>
        public static void ObtenerAutorizacionComprobante(tcellogdocumentos logdocumento, int ccompania)
        {
            try
            {
                AutorizacionComprobantesOfflineClient autorizacion = new AutorizacionComprobantesOfflineClient();
                respuestaComprobante respuesta = autorizacion.autorizacionComprobante(logdocumento.clavedeacceso);
                tcellogdocumentos log = new tcellogdocumentos();
                if (respuesta.autorizaciones.Length>0)
                {
                    EntidadAutorizacion[] entidadAutorizacion = new EntidadAutorizacion[respuesta.autorizaciones.Length];
                    int ea = 0;
                    foreach (autorizacion RespuestaAutorizacion in respuesta.autorizaciones)
                    {
                        entidadAutorizacion[ea] = new EntidadAutorizacion()
                        {
                            Ambiente = RespuestaAutorizacion.ambiente,
                            Comprobante = RespuestaAutorizacion.comprobante,
                            Estado = RespuestaAutorizacion.estado,
                            FechaAutorizacion = RespuestaAutorizacion.fechaAutorizacion,
                            NumeroAutorizacion = RespuestaAutorizacion.numeroAutorizacion
                        };
                        if (RespuestaAutorizacion.mensajes.Length>0)
                        {
                            int me = 0;
                            entidadAutorizacion[ea].Mensajes = new EntidadAutorizacionMensaje[RespuestaAutorizacion.mensajes.Length];
                            foreach (mensaje mensajesAutorizacion in RespuestaAutorizacion.mensajes)
                            {
                                entidadAutorizacion[ea].Mensajes[me] = new EntidadAutorizacionMensaje()
                                {
                                    Identificador = mensajesAutorizacion.identificador,
                                    InformacionAdicional = mensajesAutorizacion.informacionAdicional,
                                    Mensaje = mensajesAutorizacion.mensaje1,
                                    Tipo = mensajesAutorizacion.tipo
                                };                                
                                me = me + 1;
                            }
                        }                        
                        ea = ea + 1;
                    }

                    if (entidadAutorizacion.Length > 0)
                    {
                        
                        log.tipodocumento = logdocumento.tipodocumento;
                        string establecimiento = logdocumento.numerodocumento.Substring(0, 3);
                        string puntoEmision = logdocumento.numerodocumento.Substring(4, 3);
                        string secuencial = logdocumento.numerodocumento.Substring(8, 9);
                        log.numerodocumento = string.Format("{0}-{1}-{2}", establecimiento, puntoEmision, secuencial);
                        log.estado = 2;
                        StringBuilder sb = new StringBuilder();
                        foreach (EntidadAutorizacion auto in entidadAutorizacion)
                        {
                            if (auto.Mensajes != null)
                            {
                                foreach (EntidadAutorizacionMensaje mens in auto.Mensajes)
                                {
                                    sb.AppendLine(string.Format("{0}: {1} {2} {3}", mens.Tipo, mens.Identificador, mens.Mensaje, mens.InformacionAdicional));
                                }
                            }
                            else
                            {
                                sb.AppendLine(entidadAutorizacion[0].Estado);
                            }
                            log.autorizacion = auto.NumeroAutorizacion;
                        }
                        log.mensaje = sb.ToString();

                        log.clavedeacceso = logdocumento.clavedeacceso;
                        log.esreenvio = false;
                        log.cusuarioing = logdocumento.cusuarioing;
                        log.fingreso = logdocumento.fingreso;
                        log.ambiente = logdocumento.ambiente;
                        log.tipoemision = logdocumento.tipoemision;
                    }
                    TcelLogDocumentosDal.CrearLogDocumentos(log);
                }
            }
            catch (Exception ex)
            {
                throw new AtlasException("CEL-002", "CONEXION SRI AUTORIZACION {0}", ex.Message);
            }
            
        }

    }
}
