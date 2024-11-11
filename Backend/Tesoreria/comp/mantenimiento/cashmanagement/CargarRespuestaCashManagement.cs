using core.componente;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;
using System.IO;
using System;
using System.Threading;
using System.Globalization;
using System.Text;
using tesoreria.archivo;
using dal.tesoreria;
using tesoreria.enums;
using dal.cartera;
using tesoreria.helper;
using util;
using System.Linq;
using modelo.interfaces;
using Newtonsoft.Json;
using dal.contabilidad.conciliacionbancaria;
using dal.generales;

namespace tesoreria.comp.mantenimiento.cashmanagement
{
    /// <summary>
    /// Carga respuesta de cash management
    /// </summary>
    /// <param name="ltransaccion"></param>
    public class CargarRespuestaCashManagement : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rm)
        {

            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetString("cargaarchivo").Equals("cargainicial"))
            {
                List<DetalleRespuestaCash> lRespuestasCash = new List<DetalleRespuestaCash>();

                string extension = (string)rm.Mdatos["extension"];
                int fcontable = int.Parse(rm.GetDatos("fcontable").ToString());
                if (extension.ToLower() != "txt")
                {
                    throw new AtlasException("BCE-010", "ERROR EN CARGA DE ARCHIVO DE RESPUESTA BCE, {0}", "TIPO DE ARCHIVO INVÁLIDO");
                }
                int filasCabecera = 1;
                StringBuilder sbDetalle = new StringBuilder();
                string param = TcarParametrosDal.GetValorTexto("UBICACION_COBROS_CASH", rm.Ccompania);
                string path = param;
                string narchivo = (string)rm.Mdatos["narchivo"];
                string tipoarchivo = (string)rm.Mdatos["tipo"];
                string archivo = rm.Mdatos["archivo"].ToString().Replace(string.Format("data:{0};base64,", tipoarchivo), "");
                string rutaArchivo = string.Format("{0}{1}", path, narchivo);


                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);
                File.WriteAllBytes(rutaArchivo, Convert.FromBase64String(archivo));
                StreamReader objReader = new StreamReader(rutaArchivo);

                try
                {
                    string linea = string.Empty;
                    int numeroLinea = 0;

                    while (linea != null)
                    {
                        linea = objReader.ReadLine();
                        numeroLinea = numeroLinea + 1;
                        if (linea != null)
                        {
                            DetalleRespuestaCash res = new DetalleRespuestaCash();
                            string[] info = linea.Split('\t');
                            res.referenciasobre = info[0].Trim();
                            res.estadosobre = info[1].Trim();
                            res.fechainicioproceso = DateTime.Parse(info[2].Trim().Replace(" ", "-"));
                            res.fechavencimiento_proceso = DateTime.Parse(info[3].Trim().Replace(" ", "-"));
                            res.contrapartida = info[4].Trim();
                            res.nombrecontrapartida = info[5].Trim();
                            res.moneda = info[6].Trim();
                            res.valor = decimal.Parse(info[8].Trim());
                            res.tipopago = info[9].Trim();
                            res.tipoidcliente = info[10].Trim();
                            res.numeroidcliente = info[11].Trim();
                            res.estadoproceso = info[12].Trim();
                            res.idcontrato = info[13].Trim();
                            res.idsobre = info[14].Trim();
                            res.iditem = info[15].Trim();
                            res.paisbancocuenta = info[16].Trim();
                            res.eliminado = info[17].Trim();
                            res.canal = info[18].Trim();
                            res.medio = info[19].Trim();
                            res.numerodocumento = info[20].Trim();
                            res.horario = info[21].Trim();
                            res.mensaje = info[22].Trim();
                            res.oficina = info[23].Trim();
                            res.fechaprocesodate = DateTime.Parse(info[24].Trim().Replace(" ", "-"));
                            res.fechaproceso = DateTime.Parse(info[25].Trim().Replace(" ", "-"));
                            res.valorprocc = decimal.Parse(info[27].Trim());
                            res.estadoimpresion = info[28].Trim();
                            res.formapago = info[29].Trim();
                            res.tabla = info[30].Trim();
                            res.pais = info[31].Trim();
                            res.banco = info[32].Trim();
                            res.referencia_adicional = info[33].Trim();
                            res.secuencialcobro = info[34].Trim();
                            res.numerocomprobante = info[35].Trim();
                            res.numerocuenta = info[36].Trim();
                            res.nodocumento = info[37].Trim();
                            res.tipocuenta = info[38].Trim();
                            res.numerocuenta1 = info[39].Trim();
                            res.condicionproceso = info[40].Trim();
                            res.numerotransaccion = info[41].Trim();
                            lRespuestasCash.Add(res);
                        }

                    }

                    List<Dictionary<string, object>> objerr = new List<Dictionary<string, object>>();
                    foreach (DetalleRespuestaCash lRes in lRespuestasCash)
                    {
                        int cont = 0;
                        foreach (DetalleRespuestaCash lDuplicados in lRespuestasCash)
                        {

                            if (lRes.contrapartida == lDuplicados.contrapartida)
                            {

                                cont++;
                            }


                        }
                        if (cont > 1)
                        {
                            Dictionary<string, object> parerror = new Dictionary<string, object>();
                            parerror["err"] = "La operación se encuentra duplicada " + lRes.contrapartida + " con valor : " + lRes.valorprocc;
                            objerr.Add(parerror);
                        }

                    }
                    rm.Response["duplicados"] = objerr;
                    rm.Response["ldatos"] = lRespuestasCash;
                    objReader.Close();
                }
                catch (Exception ex)
                {
                    objReader.Close();
                    throw ex;
                }
                finally
                {

                    if (File.Exists(rutaArchivo))
                    {
                        //    File.Delete(rutaArchivo);
                    }
                }
            }


            if (rm.GetString("cargaarchivo").Equals("save"))
            {

                var lrespuestacashfront = JsonConvert.DeserializeObject<List<DetalleRespuestaCash>>(@rm.Mdatos["lreg"].ToString());
                tgenparametros cuentaContable = TgenParametrosDal.Find("CUENTA_CONTABLE_PICHINCHA", rm.Ccompania);
                tconbanco tcb = TconBancoDal.Find(cuentaContable.texto);
                foreach (DetalleRespuestaCash detalle in lrespuestacashfront)
                {
                    if (TconLibroBancosDal.FindByParameters(tcb.ccuentabanco, rm.Cmodulo, rm.Ctransaccion, detalle.numerodocumento) == null)
                    {
                        if (tcb != null)
                        {
                            // RRP
                            //TconLibroBancosDal.Crear(tcb.ccuentabanco, rm.Fconatable, null, rm.Cmodulo, rm.Ctransaccion, detalle.valorprocc, 0,
                            //    detalle.numerodocumento);

                            // RRP - agrega operacion
                            TconLibroBancosDal.Crear(tcb.ccuentabanco, rm.Fconatable, null, rm.Cmodulo, rm.Ctransaccion, detalle.valorprocc, 0,
                                detalle.numerodocumento, detalle.referencia_adicional, detalle.formapago);//RRO 20230130
                        }
                    }
                }
                List<ttesrecaudaciondetalle> lCobrosPendienteRespuesta = TtesRecaudacionDetalleDal.FindByEstado(((int)EnumTesoreria.EstadoRecaudacionCash.Generado).ToString());
                List<ttesrecaudaciondetalle> lCobrosActualizar = ActualizarCobros.ActualizarCobroDetalleCash(lrespuestacashfront, lCobrosPendienteRespuesta);
                List<ttesrecaudacion> lrecaudacion = new List<ttesrecaudacion>();
                foreach (var item in from p in lCobrosActualizar group p.crecaudacion by p.crecaudacion into g select new { Recaudacion = g.Key })
                {
                    ttesrecaudacion recaudacion = TtesRecaudacionDal.Find(item.Recaudacion);
                    recaudacion.cestado = ((int)EnumTesoreria.EstadoRecaudacionCash.AutorizadoAplicar).ToString();
                    recaudacion.registrosrecibido = lCobrosActualizar.Where(x => x.crecaudacion == item.Recaudacion).Count();
                    recaudacion.cusuariodescarga = rm.Cusuario;
                    recaudacion.fdescarga = rm.Freal;
                    recaudacion.Esnuevo = false;
                    recaudacion.Actualizar = true;
                    lrecaudacion.Add(recaudacion);
                }
                List<Dictionary<string, object>> resumen = new List<Dictionary<string, object>>();
                if (lCobrosActualizar.Count > 0)
                {
                    rm.AdicionarTabla("ttesrecaudaciondetalle", lCobrosActualizar, false);
                    rm.AdicionarTabla("ttesrecaudacion", lrecaudacion, false);
                    rm.Response["actualizado"] = "OK";
                    Dictionary<string, object> parametros = new Dictionary<string, object>();
                    parametros["registros"] = lCobrosActualizar.Count;
                    resumen.Add(parametros);
                }

                rm.Response["resumen"] = resumen;
            }
        }


    }
}
