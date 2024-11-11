using core.componente;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;
using System.IO;
using System;
using System.Threading;
using System.Globalization;
using System.Text;
using dal.cartera;
using util;
using dal.contabilidad;
using dal.monetario;
using util.dto.consulta;
using dal.generales;

namespace contabilidad.comp.consulta.comprobante
{
    /// <summary>
    /// Carga masiva de detalles de comprobantes contables por ajustes de conciliación
    /// </summary>
    public class CargarAjustes : ComponenteConsulta
    {
        public override void Ejecutar(RqConsulta rq)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rq.Mdatos.ContainsKey("cargaajstes"))
            {
                string extension = (string)rq.Mdatos["extension"];
                if (extension.ToLower() != "txt")
                {
                    throw new AtlasException("BCE-010", "ERROR EN CARGA DE ARCHIVO DE RESPUESTA BCE, {0}", "TIPO DE ARCHIVO INVÁLIDO");
                }
                int filasCabecera = 1;
                StringBuilder sbDetalle = new StringBuilder();
                string param = TcarParametrosDal.GetValorTexto("UBICACION_COBROS_CASH", rq.Ccompania);
                string path = param;
                string narchivo = (string)rq.Mdatos["narchivo"];
                string tipoarchivo = (string)rq.Mdatos["tipo"];
                string archivo = rq.Mdatos["archivo"].ToString().Replace(string.Format("data:{0};base64,", tipoarchivo), "");
                string rutaArchivo = string.Format("{0}{1}", path, narchivo);

                if (!Directory.Exists(path))
                    Directory.CreateDirectory(path);
                File.WriteAllBytes(rutaArchivo, Convert.FromBase64String(archivo));
                StreamReader objReader = new StreamReader(rutaArchivo);

                try
                {
                    string linea = string.Empty;
                    int numeroLinea = 0;
                    List<tconcomprobantedetalle> lcomprobantedetalles = new List<tconcomprobantedetalle>();
                    while (linea != null)
                    {
                        linea = objReader.ReadLine();
                        numeroLinea = numeroLinea + 1;
                        if (!filasCabecera.Equals(1))
                        {
                            if (linea != null)
                            {
                                tconcomprobantedetalle detalle = new tconcomprobantedetalle();
                                string[] info = linea.Split('\t');
                                //detalle.ccomprobante = info[0].Trim();
                                detalle.fcontable = rq.Fconatable;
                                detalle.particion = Constantes.GetParticion((int)rq.Fconatable);
                                
                                //detalle.secuencia = info[0].Trim();
                                detalle.ccompania = rq.Ccompania;
                                detalle.optlock = 0;
                                detalle.ccompromiso = info[3].Trim();
                                detalle.cpartida = info[4].Trim();
                                detalle.cagencia = rq.Cagencia;
                                detalle.csucursal = rq.Csucursal;
                                detalle.ccuenta = info[0].Trim();
                                detalle.Mdatos.Add("ncuenta", TconCatalogoDal.Find(rq.Ccompania,detalle.ccuenta).nombre);
                                bool debito = false;
                                decimal vcredito = 0;
                                decimal vdebito = 0;
                                if (decimal.Parse(info[5].Trim()) == 0)
                                {
                                    vcredito = decimal.Parse(info[6].Trim());
                                    detalle.monto = vcredito;
                                    detalle.montooficial = vcredito;
                                }
                                else
                                {
                                    vdebito = decimal.Parse(info[5].Trim());
                                    debito = true;
                                    detalle.monto = vdebito;
                                    detalle.montooficial = vdebito;
                                }

                                detalle.debito = debito;
                                detalle.cclase = TconCatalogoDal.Find(rq.Ccompania, info[0].Trim()).cclase;
                                detalle.cmoneda = TgenParametrosDal.GetValorTexto("MONEDALOCAL", rq.Ccompania);
                                detalle.cusuario = rq.Cusuario;
                                detalle.cmonedaoficial = TgenParametrosDal.GetValorTexto("MONEDALOCAL", rq.Ccompania);
                                detalle.Mdatos.Add("moneda", detalle.cmonedaoficial);
                                detalle.suma = TmonClaseDal.Suma(detalle.cclase, detalle.debito);
                                detalle.numerodocumentobancario = info[1].Trim();
                                //if (string.IsNullOrEmpty(detalle.numerodocumentobancario))
                                //{
                                  //  throw new AtlasException("CONTA-023", "NÚMERO DE DOCUMENTO OBLIGATORIO");
                                //}
                                //detalle.centrocostosccatalogo = 1002;
                                //detalle.centrocostoscdetalle = info[2].Trim();
                                detalle.Mdatos.Add("centrocostosccatalogo", 1002);
                                detalle.Mdatos.Add("ncentrocostoscdetalle", info[2].Trim());
                                //detalle.conciliacionbancariaid = info[0].Trim();
                                //detalle.ajustemayor = info[0].Trim();
                                detalle.Esnuevo = true;
                                lcomprobantedetalles.Add(detalle);
                            }
                        }
                        filasCabecera = filasCabecera + 1;
                    }
                    objReader.Close();
                    rq.Response["ldatos"] = lcomprobantedetalles;
                    
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
        }
    }
}
