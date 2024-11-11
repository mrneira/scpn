using System;
using core.componente;
using modelo;
using util.dto.mantenimiento;
using Newtonsoft.Json;
using util.servicios.ef;
using dal.contabilidad.conciliacionbancaria;
using util;
using dal.contabilidad;
using contabilidad.enums;
using System.Collections.Generic;
using System.Linq;
using contabilidad.datos;
using dal.tesoreria;

namespace contabilidad.comp.mantenimiento.conciliacionbancaria.conciliacionbancaria
{
    /// <summary>
    /// Clase que encapsula los procedimientos de mantenimiento de la conciliación bancaria.
    /// </summary>
    public class ConciliacionPichincha : ComponenteMantenimiento
    {
        /// <summary>
        /// Ejecuta la conciliación bancaria.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            dynamic lAjustesMayor = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosajustemayor"].ToString());
            dynamic lAjustesExtracto = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosajustextracto"].ToString());
            dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosgrabar"].ToString());
            dynamic lrecaudacion = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistroscashgrabar"].ToString());
            dynamic lparqueadero = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosparqueadero"].ToString());

            long cConciliacionBancaria = TconConciliacionBancariaDal.GetcConciliacionBancaria();  //obtiene id
            List<ConciliacionBancariaFinal> ltconConciliacionBancaria = new List<ConciliacionBancariaFinal>();
            List<MayorActualizarUnico> lmayorunicoauto = new List<MayorActualizarUnico>();
            List<MayorActualizarUnico> lmayorunico = new List<MayorActualizarUnico>();

            foreach (var item in array)
            {
                tconconciliacionbancaria tconConciliacionBancaria = new tconconciliacionbancaria();

                if ((bool)item.rautomatico)
                {
                    tconConciliacionBancaria.cconconciliacionbancaria = cConciliacionBancaria;
                    tconConciliacionBancaria.cconciliacionbancariamayor = item.mccomprobante;
                    tconConciliacionBancaria.cconconciliacionbancariaextracto = item.conconciliacionbancariaextracto;
                    tconConciliacionBancaria.conciliacionbancariaid = item.rcodigounico;
                    tconConciliacionBancaria.cusuarioconcilia = rqmantenimiento.Cusuario;
                    tconConciliacionBancaria.fconcilia = DateTime.Now;
                    tconConciliacionBancaria.cestado = ((int)EnumContabilidad.EstadoConciliacion.ING).ToString();
                    tconConciliacionBancaria.automatico = true;
                    tconConciliacionBancaria.secuencia = item.msecuencia;
                    Sessionef.Grabar(tconConciliacionBancaria);
                    cConciliacionBancaria++;

                    MayorActualizarUnico mayorunico = new MayorActualizarUnico();
                    mayorunico.codigounico = item.rcodigounico;
                    mayorunico.iccomprobante = item.mccomprobante.Value;
                    mayorunico.ifcontable = (int)item.mfcontable.Value;
                    mayorunico.isecuencia = (int)item.msecuencia.Value;
                    mayorunico.iccomsec = item.mccomprobante.Value + '|' + item.msecuencia.Value + '|' + item.mfcontable.Value;
                    lmayorunicoauto.Add(mayorunico);

                    tconconciliacionbancariaeb control = tconconciliacionbancariaextDal.Find(item.conconciliacionbancariaextracto.Value);
                    control.estadoconciliacioncdetalle = "1";
                    Sessionef.Actualizar(control);

                    ttesrecaudaciondetalle recaudacion = TtesRecaudacionDetalleDal.FindCcomprobante((long)item.crecaudaciondetalle);
                    recaudacion.conciliado = true;
                    Sessionef.Actualizar(recaudacion);
                }
                else
                {
                    tconConciliacionBancaria.cconconciliacionbancaria = cConciliacionBancaria;
                    tconConciliacionBancaria.cconciliacionbancariamayor = item.mccomprobante;
                    tconConciliacionBancaria.cconconciliacionbancariaextracto = item.conconciliacionbancariaextracto;
                    tconConciliacionBancaria.conciliacionbancariaid = item.rcodigounico;
                    tconConciliacionBancaria.cusuarioconcilia = rqmantenimiento.Cusuario;
                    tconConciliacionBancaria.fconcilia = DateTime.Now;
                    tconConciliacionBancaria.cestado = ((int)EnumContabilidad.EstadoConciliacion.ING).ToString();
                    tconConciliacionBancaria.automatico = true;
                    tconConciliacionBancaria.secuencia = item.msecuencia;
                    Sessionef.Grabar(tconConciliacionBancaria);
                    cConciliacionBancaria++;

                    MayorActualizarUnico mayorunico = new MayorActualizarUnico();
                    mayorunico.codigounico = item.rcodigounico;
                    mayorunico.iccomprobante = item.mccomprobante.Value;
                    mayorunico.ifcontable = (int)item.mfcontable.Value;
                    mayorunico.isecuencia = (int)item.msecuencia.Value;
                    lmayorunico.Add(mayorunico);

                    tconconciliacionbancariaeb control = tconconciliacionbancariaextDal.Find(item.conconciliacionbancariaextracto.Value);
                    control.estadoconciliacioncdetalle = "1";
                    Sessionef.Actualizar(control);
                }
            }

            // Para automáticos mayor
            if (lmayorunicoauto.Count > 0)
            {
                var unico = lmayorunicoauto
            .GroupBy(x => x.iccomsec)
            .ToDictionary(g => g.Key);
                foreach (var item in unico)
                {
                    List<MayorActualizarUnico> mayor = lmayorunicoauto.Where(z => z.iccomsec == item.Key).ToList();
                    string[] compsec = item.Key.Split('|');
                    string ccomprobante = compsec[0];
                    int secuencia = int.Parse(compsec[1]);
                    int fecha = int.Parse(compsec[2]);
                    tconcomprobantedetalle controlConDet = TconComprobanteDetalleDal.FindSecuencia(
                       ccomprobante,
                       fecha,
                       secuencia);
                    controlConDet.conciliacionbancariaid = mayor[0].codigounico;
                    Sessionef.Actualizar(controlConDet);
                }
            }
            // Para manuales mayor
            if (lmayorunico.Count > 0)
            {
                var unico = lmayorunico
            .GroupBy(x => x.codigounico)
            .ToDictionary(g => g.Key);
                foreach (var item in unico)
                {
                    List<MayorActualizarUnico> mayor = lmayorunico.Where(z => z.codigounico == item.Key).ToList();
                    tconcomprobantedetalle controlConDet = TconComprobanteDetalleDal.FindSecuencia(
                        mayor[0].iccomprobante,
                        mayor[0].ifcontable,
                        mayor[0].isecuencia);
                    controlConDet.conciliacionbancariaid = mayor[0].codigounico;
                    Sessionef.Actualizar(controlConDet);
                }
            }

            foreach (var rec in lrecaudacion)
            {
                ttesrecaudaciondetalle recaudacion = TtesRecaudacionDetalleDal.FindCcomprobante((long)rec.crecaudaciondetalle);
                recaudacion.conciliado = true;
                Sessionef.Actualizar(recaudacion);
            }

            List<tconcomprobantedetalle> lcomprobantesajuste = new List<tconcomprobantedetalle>();
            List<tconconciliacionbancariaeb> lextractoajuste = new List<tconconciliacionbancariaeb>();
            foreach (var item in lAjustesMayor)
            {
                tconcomprobantedetalle detalle = new tconcomprobantedetalle();
                detalle = TconComprobanteDetalleDal.FindSecuencia((string)item.mccomprobante, (int)item.mfcontable, (int)item.msecuencia);
                detalle.ajustemayor = true;
                lcomprobantesajuste.Add(detalle);
            }

            foreach (var item in lAjustesExtracto)
            {
                tconconciliacionbancariaeb extracto = new tconconciliacionbancariaeb();
                extracto = tconconciliacionbancariaextDal.GetExtracto((int)item.fecha, (string)item.cuentabancaria, (string)item.numerodocumentobancario, (decimal)item.valorcredito, (decimal)item.valordebito);
                extracto.ajustextracto = true;
                lextractoajuste.Add(extracto);
            }

            // PARQUEADERO
            if (lparqueadero != null)
            {
                List<MayorActualizarUnico> lmayorunicoparqueadero = new List<MayorActualizarUnico>();
                List<tconconciliacionbancariaeb> lextractoparqueadero = new List<tconconciliacionbancariaeb>();
                long unicoid = 0;
                foreach (var item in lparqueadero)
                {
                    if (!(bool)item.mmayor && !(bool)item.extracto)
                    {
                        unicoid = item.rcodigounico;
                    }
                }

                foreach (var item in lparqueadero)
                {
                    if ((bool)item.mmayor)
                    {
                        MayorActualizarUnico mayorunico = new MayorActualizarUnico();
                        mayorunico.codigounico = unicoid;
                        mayorunico.iccomprobante = item.mccomprobante.Value;
                        mayorunico.ifcontable = (int)item.mfcontable.Value;
                        mayorunico.isecuencia = (int)item.msecuencia.Value;
                        lmayorunicoparqueadero.Add(mayorunico);
                    }
                }
                //long[] extractos;
                foreach (var item in lparqueadero)
                {
                    if ((bool)item.extracto)
                    {
                        tconconciliacionbancariaeb extracto = new tconconciliacionbancariaeb();
                        extracto.cconconciliacionbancariaextracto = (long)item.cconconciliacionbancariaextracto;
                        extracto.cusuariocreacion = (string)item.cusuariocreacion;
                        lextractoparqueadero.Add(extracto);
                    }
                }

                foreach (tconconciliacionbancariaeb extracto in lextractoparqueadero)
                {
                    foreach (MayorActualizarUnico mayor in lmayorunicoparqueadero)
                    {
                        tconconciliacionbancaria tconConciliacionBancaria = new tconconciliacionbancaria();
                        tconConciliacionBancaria.cconconciliacionbancaria = cConciliacionBancaria;
                        tconConciliacionBancaria.cconciliacionbancariamayor = long.Parse(mayor.iccomprobante);
                        tconConciliacionBancaria.cconconciliacionbancariaextracto = extracto.cconconciliacionbancariaextracto;
                        tconConciliacionBancaria.conciliacionbancariaid = mayor.codigounico;
                        tconConciliacionBancaria.cusuarioconcilia = rqmantenimiento.Cusuario;
                        tconConciliacionBancaria.fconcilia = DateTime.Now;
                        tconConciliacionBancaria.cestado = ((int)EnumContabilidad.EstadoConciliacion.ING).ToString();
                        tconConciliacionBancaria.automatico = false;
                        tconConciliacionBancaria.secuencia = mayor.isecuencia;
                        Sessionef.Grabar(tconConciliacionBancaria);
                        cConciliacionBancaria++;
                    }
                    tconconciliacionbancariaeb control = tconconciliacionbancariaextDal.Find(extracto.cconconciliacionbancariaextracto);
                    control.estadoconciliacioncdetalle = "1";
                    Sessionef.Actualizar(control);
                }
                foreach (MayorActualizarUnico mayor in lmayorunicoparqueadero)
                {
                    tconcomprobantedetalle comprobantedetalle = TconComprobanteDetalleDal.FindSecuencia(
                            mayor.iccomprobante,
                            mayor.ifcontable,
                            mayor.isecuencia);
                    comprobantedetalle.conciliacionbancariaid = mayor.codigounico;
                    Sessionef.Actualizar(comprobantedetalle);
                }
            }
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobantesajuste, false);
            rqmantenimiento.AdicionarTabla("tconconciliacionbancariaeb", lextractoajuste, false);
            rqmantenimiento.Mdatos["lregistroscashgrabar"] = null;
            rqmantenimiento.Mdatos["lregistrosgrabar"] = null;
            rqmantenimiento.Mdatos["lregistrosajustemayor"] = null;
            rqmantenimiento.Mdatos["lregistrosajustextracto"] = null;
            rqmantenimiento.Mdatos["lregistrosparqueadero"] = null;
        }
    }
}
