using modelo;
using System.Collections.Generic;
using tesoreria.archivo;
using tesoreria.enums;

namespace tesoreria.util
{
    /// <summary>
    /// Actualizar Respuesta Bce
    /// </summary>
    /// <param name="lRespuestaPagosBce"></param>
    /// <param name="lSpiPendienteRespuesta"></param>
    public class ActualizarRespuestaBce
    {
        public static List<ttestransaccion> ActualizarPagoSpi(List<DetalleRespuestaBce> lRespuestaPagosBce, List<ttestransaccion> lSpiPendienteRespuesta)
        {
            List<ttestransaccion> lPagosActualizados = new List<ttestransaccion>();
            foreach (DetalleRespuestaBce respuesta in lRespuestaPagosBce)
            {
                foreach (ttestransaccion pagoPendiente in lSpiPendienteRespuesta)
                {
                    if (!respuesta.procesado)
                    {
                        if (respuesta.numeroreferencia == pagoPendiente.numeroreferencia && respuesta.numeroreferenciapago == pagoPendiente.numeroreferenciapago && respuesta.tipotransaccion == pagoPendiente.tipotransaccion)
                        //if (respuesta.numeroreferenciapago == pagoPendiente.numeroreferenciapago && respuesta.tipotransaccion == pagoPendiente.tipotransaccion)
                        {
                            pagoPendiente.codrespuestabce = respuesta.codrespuestabce;
                            
                            if (pagoPendiente.codrespuestabce== ((int)EnumTesoreria.RespuestaPagoBce.Pagado).ToString("00"))
                            {
                                pagoPendiente.cestado = ((int)EnumTesoreria.EstadoPagoBce.Pagado).ToString();
                            }
                            else
                            {
                                pagoPendiente.cestado = ((int)EnumTesoreria.EstadoPagoBce.Rechazado).ToString();
                            }
                            respuesta.procesado = true;
                            pagoPendiente.Esnuevo = false;
                            pagoPendiente.Actualizar = true;
                            pagoPendiente.frespuesta = respuesta.fecha;
                            pagoPendiente.vrespuesta = respuesta.valorpago;
                            pagoPendiente.referenciabce = respuesta.referenciabce;
                            lPagosActualizados.Add(pagoPendiente);
                            break;
                        }
                    }
                }
            }
            return lPagosActualizados;
        }

        public static List<ttestransaccion> ActualizarCobroOcp(List<DetalleRespuestaBce> lRespuestaPagosBce, List<ttestransaccion> lSpiPendienteRespuesta)
        {
            List<ttestransaccion> lPagosActualizados = new List<ttestransaccion>();
            foreach (DetalleRespuestaBce respuesta in lRespuestaPagosBce)
            {
                foreach (ttestransaccion pagoPendiente in lSpiPendienteRespuesta)
                {
                    if (!respuesta.procesado)
                    {
                        if (respuesta.numeroreferencia == pagoPendiente.numeroreferencia && respuesta.numeroreferenciapago == pagoPendiente.numeroreferenciapago && respuesta.tipotransaccion == pagoPendiente.tipotransaccion)
                        {
                            pagoPendiente.codrespuestabce = respuesta.codrespuestabce;

                            if (pagoPendiente.codrespuestabce == ((int)EnumTesoreria.RespuestaCobroBce.Cobrado).ToString())
                            {
                                pagoPendiente.cestado = ((int)EnumTesoreria.EstadoCobroBce.Cobrado).ToString();
                                
                            }
                            else
                            {
                                pagoPendiente.cestado = ((int)EnumTesoreria.EstadoCobroBce.Rechazado).ToString();
                            }
                            respuesta.procesado = true;
                            pagoPendiente.Esnuevo = false;
                            pagoPendiente.Actualizar = true;
                            pagoPendiente.frespuesta = respuesta.fecha;
                            pagoPendiente.vrespuesta = pagoPendiente.valorpago;
                            pagoPendiente.referenciabce = respuesta.referenciabce;
                            lPagosActualizados.Add(pagoPendiente);
                            break;
                        }
                    }
                }
            }
            return lPagosActualizados;
        }
    }
}
