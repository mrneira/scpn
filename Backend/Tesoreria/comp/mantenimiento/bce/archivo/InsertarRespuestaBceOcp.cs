using core.componente;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;
using tesoreria.archivo;
using System.IO;
using Newtonsoft.Json;
using System;
using System.Threading;
using System.Globalization;
using System.Text;
using dal.generales;
using util;
using System.Linq;
using tesoreria.enums;
using dal.tesoreria;
using tesoreria.util;
using dal.cartera;

namespace tesoreria.comp.mantenimiento.bce.archivo
{
    /// <summary>
    /// Actualizar respuestas de Ocp 
    /// </summary>
    /// <param name="rm"></param>
    public class InsertarRespuestaBceOcp : ComponenteMantenimiento
    {
        readonly log4net.ILog logger = log4net.LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().DeclaringType);

        public override void Ejecutar(RqMantenimiento rm)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            if (rm.GetDatos("cargaarchivo").ToString() == null || rm.GetDatos("tipotransaccion").ToString() == null)
            {
                return;
            }
            string tipotransaccion = (string)rm.Mdatos["tipotransaccion"];
            string extension = (string)rm.Mdatos["extension"];
            if (extension.ToLower() != "zip")
            {
                throw new AtlasException("BCE-010", "ERROR EN CARGA DE ARCHIVO DE RESPUESTA BCE, {0}", "TIPO DE ARCHIVO INVÁLIDO");
            }
            switch (rm.Mdatos["cargaarchivo"].ToString())
            {
                case "upload":
                    int columnasCabecera = 4;
                    int columnasDetalle = 10;
                    string dataCabecera = string.Empty;
                    StringBuilder sbDetalle = new StringBuilder();
                    tgenparametros param = TgenParametrosDal.Find("UBICACION_PAGOS_SPI", rm.Ccompania);
                    string path = param.texto;
                    string narchivo = (string)rm.Mdatos["narchivo"];
                    string tipoarchivo = (string)rm.Mdatos["tipo"];
                    string archivo = rm.Mdatos["archivo"].ToString().Replace(string.Format("data:{0};base64,", tipoarchivo), "");
                    string rutaArchivo = string.Format("{0}{1}", path, narchivo);
                    string rutaArchivoDescomprimido = path + Path.GetFileNameWithoutExtension(rutaArchivo);
                    List<CabeceraRespuestaBce> ldatos = new List<CabeceraRespuestaBce>();
                    if (!Directory.Exists(path))
                        Directory.CreateDirectory(path);
                    try
                    {
                        File.WriteAllBytes(rutaArchivo, Convert.FromBase64String(archivo));
                        general.util.Compression.ZipHelper.Extract(rutaArchivo, rutaArchivoDescomprimido);
                        StreamReader objReader = new StreamReader(rutaArchivoDescomprimido + "\\" + Path.GetFileNameWithoutExtension(rutaArchivoDescomprimido) + ".txt");
                        string linea = string.Empty;
                        int numeroLinea = 0;
                        int numeroDetalles = 0;
                        //int numeroDetallesCabecera = 0;

                        while (linea != null)
                        {
                            linea = objReader.ReadLine();
                            numeroLinea = numeroLinea + 1;
                            if (numeroLinea == 1)
                            {
                                if (linea.Split(',').Length != columnasCabecera)
                                {
                                    objReader.Close();
                                    throw new AtlasException("BCE-010", "ERROR EN CARGA DE ARCHIVO DE RESPUESTA BCE, {0}", string.Format("Número de columnas en cabecera no coinciden, archivo {0} esperadas {1}", linea.Split(',').Length, columnasCabecera));
                                }
                                CabeceraRespuestaBce cab = new CabeceraRespuestaBce();
                                cab.fecha = linea.Split(',')[0]; // Fecha		
                                cab.cantidadregistros = linea.Split(',')[1]; // Total registros
                                cab.valortotal = decimal.Parse(linea.Split(',')[2]); // Total archivo
                                cab.idcabecera = linea.Split(',')[3]; //Id Cabecera
                                //numeroDetallesCabecera = int.Parse(cab.cantidadregistros);
                                ldatos.Add(cab);
                            }
                            else
                            {
                                if (linea != null)
                                {
                                    if (linea.Split(',').Length != columnasDetalle)
                                    {
                                        objReader.Close();
                                        throw new AtlasException("BCE-010", "ERROR EN CARGA DE ARCHIVO DE RESPUESTA BCE, {0}", string.Format("Número de columnas en detalle no coinciden, archivo {0} esperadas {1}", linea.Split(',').Length, columnasDetalle));
                                    }
                                    sbDetalle.AppendLine(linea);
                                    numeroDetalles = numeroDetalles + 1;
                                }
                            }
                        }
                        objReader.Close();
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    finally
                    {
                        if (File.Exists(rutaArchivo))
                        {
                            //File.Delete(rutaArchivo);
                        }
                    }
                    rm.Mdatos.Remove("archivo");
                    rm.Response["cabecera"] = ldatos;
                    rm.Response["rutaarchivo"] = rutaArchivoDescomprimido;
                    rm.Response["cargaarchivo"] = "upload";
                    break;
                case "save":
                    if (rm.GetDatos("CABECERARESPUESTAOCP").ToString() == null || rm.GetDatos("rutaarchivo").ToString() == null)
                    {
                        return;
                    }
                    string rutaArchivoInsertar = (string)rm.Mdatos["rutaarchivo"];
                    try
                    {
                        List<DetalleRespuestaBce> lrespuestas = new List<DetalleRespuestaBce>();
                        StreamReader objReader = new StreamReader(rutaArchivoInsertar + "\\" + Path.GetFileNameWithoutExtension(rutaArchivoInsertar) + ".txt");
                        string linea = string.Empty;
                        dynamic arrayTransaccion = JsonConvert.DeserializeObject(rm.Mdatos["CABECERARESPUESTAOCP"].ToString());
                        CabeceraRespuestaBce cab = new CabeceraRespuestaBce();
                        string numeroReferencia = string.Empty;

                        foreach (var obj in arrayTransaccion)
                        {
                            cab.fecha = obj.fecha;
                            cab.idcabecera = obj.idcabecera;
                            cab.cantidadregistros = obj.cantidadregistros;
                            cab.valortotal = obj.valortotal;
                            //cab.numeroreferencia = obj.numarchivo;
                            //cab.numcuenta = obj.numcuenta;
                        }
                        int numeroLinea = 0;
                        while (linea != null)
                        {
                            numeroLinea = numeroLinea + 1;
                            linea = objReader.ReadLine();
                            if (numeroLinea != 1)
                            {
                                if (linea != null)
                                {
                                    DetalleRespuestaBce res = new DetalleRespuestaBce();
                                    string[] info = linea.Split(',');
                                    res.fecha = DateTime.Parse(info[0].Trim());
                                    res.numeroreferencia = long.Parse(info[1].Trim());
                                    res.numeroreferenciapago = long.Parse(info[2].Trim()); 
                                    res.referenciabce = info[3].Trim();
                                    res.secuencia = long.Parse(info[4].Trim());
                                    res.fecharespuesta = DateTime.Parse(info[5].Trim());
                                    int codigobce = int.Parse(info[6]);
                                    res.codrespuestabce = codigobce.ToString("00");
                                    res.codigoinstitucionbeneficiario = info[8].Trim();
                                    res.procesado = false;
                                    res.tipotransaccion = tipotransaccion;
                                    lrespuestas.Add(res);
                                }
                            }
                        }
                        objReader.Close();
                        List<ttestransaccion> lOcpPendienteRespuesta = TtesTransaccionDal.FindToRespuestaPendienteBce(((int)EnumTesoreria.EstadoPagoBce.Generado).ToString(), tipotransaccion);

                        if (lOcpPendienteRespuesta.Count == 0)
                        {
                            throw new AtlasException("BCE-002", "NO EXISTEN REGISTROS OCP PENDIENTES DE RESPUESTA");
                        }
                        List<ttestransaccion> lOcpPagosRespuesta = ActualizarRespuestaBce.ActualizarCobroOcp(lrespuestas, lOcpPendienteRespuesta);
                        if (lOcpPagosRespuesta.Count == 0)
                        {
                            throw new AtlasException("BCE-013", "NO EXISTEN REGISTROS OCP A ACTUALIZAR EN EL ARCHIVO CARGADO");
                        }
                        List<ttestransaccion> lOcpPagosCorrectos = lOcpPagosRespuesta.Where(x => x.cestado == ((int)EnumTesoreria.RespuestaCobroBce.Cobrado).ToString() && x.tipotransaccion == tipotransaccion).ToList();
                        ActualizarCartera(lOcpPagosCorrectos, rm);
                        decimal totalPagosCarga = lOcpPagosCorrectos.Sum(x => x.valorpago);
                        rm.Monto = totalPagosCarga;
                        rm.Comentario = string.Format("Respuesta BCE {0}-{1}", cab.cantidadregistros, cab.cantidadregistrosok);
                        rm.Documento = cab.numcuenta;
                        decimal valor = totalPagosCarga;
                        TtesTransaccionDal.ActualizarCobrosTransaccion(lOcpPagosRespuesta, rm);
                        if (totalPagosCarga > 0)
                        {
                            ttesenvioarchivo envioarchivo = TtesEnvioArchivoDal.FindByNumeroReferencia(long.Parse(lOcpPagosCorrectos[0].numeroreferencia.Value.ToString()), tipotransaccion);
                            envioarchivo.Actualizar = true;
                            envioarchivo.Esnuevo = false;
                            envioarchivo.estado = ((int)EnumTesoreria.RespuestaCobroBce.Cobrado).ToString();
                            envioarchivo.frecepcion = rm.Freal;
                            envioarchivo.cusuariorec = rm.Cusuario;
                            envioarchivo.referenciabce = lOcpPagosCorrectos[0].referenciabce;
                            rm.AdicionarTabla("ttesenvioarchivo", envioarchivo, false);
                            //rm.AdicionarTabla("ttestransaccion", lOcpPagosRespuesta, false);
                            rm.Response["cargaarchivo"] = "save";
                        }
                        else
                        {
                            rm.Response["ccomprobante"] = "Rechazados";
                            rm.Response["numerocomprobantecesantia"] = "";
                            rm.Response["cargaarchivo"] = "save";
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    finally
                    {
                        if (Directory.Exists(rutaArchivoInsertar))
                        {
                            //Directory.Delete(rutaArchivoInsertar, true);
                        }
                    }
                    break;
            }
        }

        private void ActualizarCartera(List<ttestransaccion> lOcpPagosCorrectos, RqMantenimiento rm)
        {
            //int particion = 0;
            List<tcardescuentosdetalle> ldescuentos = new List<tcardescuentosdetalle>();
            
            List<tcardescuentosarchivo> archivo = TcarDescuentosArchivoDal.FindPorEstadoArchivo("BAN", "GEN");
            List<tcardescuentosdetalle> ldescuentodetalle = TcarDescuentosDetalleDal.FindPendiente(archivo[0].particion, "BAN");
            foreach (ttestransaccion item in lOcpPagosCorrectos)
            {
                logger.Info("procesando ocp =====> " + item.referenciainterna + "-" + item.codigobeneficiario);
                if (item.cmodulo == 7 && item.ctransaccion == 62)
                {

                    //tcardescuentosdetalle descuento = TcarDescuentosDetalleDal.Find(item.secuenciainterna.Value, item.referenciainterna, int.Parse(item.codigobeneficiario.ToString()), "BAN");
                    //tcardescuentosdetalle descuento = TcarDescuentosDetalleDal.Find(item.referenciainterna, int.Parse(item.codigobeneficiario.ToString()));
                    tcardescuentosdetalle descuento = ldescuentodetalle.Where(x => x.coperacion == item.referenciainterna
                                                                               && x.cpersona == item.codigobeneficiario
                                                                               && x.particion == item.secuenciainterna).SingleOrDefault();
                    if (descuento != null)
                    {
                        descuento.frespuesta = Fecha.DateToInteger(item.frespuesta.Value);
                        descuento.montorespuesta = item.valorpago;
                        TcarDescuentosDetalleDal.Actualizar(item.valorpago, Fecha.DateToInteger(item.frespuesta.Value), item.secuenciainterna.Value, 
                            item.referenciainterna, item.codigobeneficiario.Value);
                        //descuento.Esnuevo = false;
                        //descuento.Actualizar = true;
                        //ldescuentos.Add(descuento);
                    }
                    //particion = item.secuenciainterna.Value;
                }
            }
            decimal totalrespuestadescuentos = lOcpPagosCorrectos.Sum(x => x.valorpago);
            //tcardescuentosarchivo archivo = TcarDescuentosArchivoDal.FindArchivo(particion, "BAN");
            if (archivo != null)
            {
                archivo[0].frespuesta = Fecha.DateToInteger(DateTime.Now);
                archivo[0].montorespuesta = totalrespuestadescuentos;
                archivo[0].registrosrespuesta = lOcpPagosCorrectos.Count();
                archivo[0].cdetalleestado = "RES";
                archivo[0].cusuariorespuesta = rm.Cusuario;
                archivo[0].Esnuevo = false;
                archivo[0].Actualizar = true;
                //rm.AdicionarTabla("tcardescuentosdetalle", ldescuentos, false);
                rm.AdicionarTabla("tcardescuentosarchivo", archivo, false);
            }
        }
    }
}
