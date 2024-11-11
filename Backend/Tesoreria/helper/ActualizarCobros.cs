using tesoreria.archivo;
using modelo;
using System;
using System.Collections.Generic;
using tesoreria.enums;
using util.dto.mantenimiento;
using System.Linq;
using util;

namespace tesoreria.helper
{
    /// <summary>
    /// Actualizar Cobros
    /// </summary>
    /// <param name="lRespuestasCash"></param>
    /// <param name="lCobrosPendienteRespuesta"></param>
    public class ActualizarCobros
    {
        public static List<ttesrecaudaciondetalle> ActualizarCobroDetalleCash(List<DetalleRespuestaCash> lRespuestasCash, List<ttesrecaudaciondetalle> lCobrosPendienteRespuesta)
        {
            List<ttesrecaudaciondetalle> lPagosActualizados = new List<ttesrecaudaciondetalle>();
            List<DetalleRespuestaCash> duplicados = lRespuestasCash;
            List<DetalleRespuestaCash> respuestafinal = new List<DetalleRespuestaCash>();

            var unicosCash = lRespuestasCash                       
            .GroupBy(x => x.contrapartida)       
            .ToDictionary(g => g.Key, g => g.Sum(v => v.valorprocc));
            foreach (var unico in unicosCash)
            {
                DetalleRespuestaCash d =  lRespuestasCash.Find(t => t.contrapartida == unico.Key);
                d.valorprocc = unico.Value;
                respuestafinal.Add(d);
            }
            //DetalleRespuestaCash a = respuestafinal.Find(t => t.contrapartida == "71005287");

            foreach (DetalleRespuestaCash respuesta in respuestafinal)
            {
                foreach (ttesrecaudaciondetalle pagoPendiente in lCobrosPendienteRespuesta)
                {
                    if (!respuesta.procesado)
                    {
                        if (respuesta.contrapartida == pagoPendiente.referencia)
                        {
                            if (respuesta.valorprocc > pagoPendiente.valor)
                            {
                                //throw new AtlasException("BCE-016", "VALOR RECIBIDO NO PUEDE SER MAYOR QUE EL ENVIADO CONTRAPARTIDA {0}", respuesta.contrapartida);
                            }
                            pagoPendiente.valorprocesado = respuesta.valorprocc;
                            if (respuesta.mensaje == "PROCESO OK")
                            {
                                pagoPendiente.cestado = ((int)EnumTesoreria.EstadoRecaudacionCash.AutorizadoAplicar).ToString();
                            }
                            respuesta.procesado = true;
                            pagoPendiente.Esnuevo = false;
                            pagoPendiente.Actualizar = true;
                            pagoPendiente.mensajeproceso = respuesta.mensaje;
                            pagoPendiente.numerodocumento = int.Parse(respuesta.numerodocumento);
                            pagoPendiente.canal = respuesta.banco;
                            string fecha = respuesta.fechaprocesodate.ToShortDateString();
                            string hora = respuesta.horaproceso.ToLongTimeString();
                            DateTime fechaProceso = DateTime.Parse(fecha + ' ' + hora);
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
