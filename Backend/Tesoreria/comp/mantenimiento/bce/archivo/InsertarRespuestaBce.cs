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
using dal.contabilidad;
using core.servicios;
using dal.monetario;
using System.Linq;
using tesoreria.enums;
using dal.tesoreria;
using tesoreria.util;
using dal.inversiones.inversiones;
using util.servicios.ef;

namespace tesoreria.comp.mantenimiento.bce.archivo
{
    /// <summary>
    /// Actualizar respuestas de Bce 
    /// </summary>
    /// <param name="rm"></param>
    public class InsertarRespuestaBce : ComponenteMantenimiento
    {
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
                    int columnasCabecera = 6;
                    int columnasDetalle = 11;
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
                    List<CabeceraRespuestaBce> lcabecera = new List<CabeceraRespuestaBce>();
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
                        int numeroDetallesCabecera = 0;

                        while (linea != null)
                        {
                            bool escabecera = false;
                            linea = objReader.ReadLine();
                            numeroLinea = numeroLinea + 1;
                            if (linea != null)
                            {
                                DateTime fecha;
                                escabecera = DateTime.TryParse(linea.Split(',')[0], out fecha);
                                if (escabecera)
                                {
                                    if (linea.Split(',').Length != columnasCabecera)
                                    {
                                        objReader.Close();
                                        throw new AtlasException("BCE-010", "ERROR EN CARGA DE ARCHIVO DE RESPUESTA BCE, {0}", string.Format("Número de columnas en cabecera no coinciden, archivo {0} esperadas {1}", linea.Split(',').Length, columnasCabecera));
                                    }
                                    CabeceraRespuestaBce cab = new CabeceraRespuestaBce();
                                    cab.fecha = linea.Split(',')[0];
                                    cab.idcabecera = linea.Split(',')[1];
                                    cab.numcuenta = linea.Split(',')[2];
                                    cab.cantidadregistros = linea.Split(',')[3];
                                    numeroDetallesCabecera = int.Parse(cab.cantidadregistros);
                                    cab.valortotal = decimal.Parse(linea.Split(',')[4]);
                                    cab.numeroreferencia = long.Parse(linea.Split(',')[5]);
                                    lcabecera.Add(cab);
                                }

                                if (linea != null && !escabecera)
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
                        int reg = 0;
                        decimal total = 0;
                        CabeceraRespuestaBce cabf = new CabeceraRespuestaBce();
                        foreach (CabeceraRespuestaBce cab in lcabecera)
                        {
                            reg = reg + int.Parse(cab.cantidadregistros);
                            total = total + cab.valortotal;
                            cabf.fecha = cab.fecha;
                            cabf.idcabecera = cab.idcabecera;
                            cabf.numcuenta = cab.numcuenta;
                            cabf.cantidadregistros = reg.ToString();
                            cabf.valortotal = total;
                            cabf.numeroreferencia = cab.numeroreferencia;
                        }
                        ldatos.Add(cabf);
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    finally
                    {
                        if (File.Exists(rutaArchivo))
                        {
                            File.Delete(rutaArchivo);
                        }
                    }
                    rm.Mdatos.Remove("archivo");
                    rm.Response["cabecera"] = ldatos;
                    rm.Response["rutaarchivo"] = rutaArchivoDescomprimido;
                    rm.Response["cargaarchivo"] = "upload";
                    break;
                case "save":
                    if (rm.GetDatos("CABECERARESPUESTASPI").ToString() == null || rm.GetDatos("rutaarchivo").ToString() == null)
                    {
                        return;
                    }
                    string rutaArchivoInsertar = (string)rm.Mdatos["rutaarchivo"];
                    try
                    {
                        StreamReader objReader = new StreamReader(rutaArchivoInsertar + "\\" + Path.GetFileNameWithoutExtension(rutaArchivoInsertar) + ".txt");
                        string linea = string.Empty;
                        dynamic arrayTransaccion = JsonConvert.DeserializeObject(rm.Mdatos["CABECERARESPUESTASPI"].ToString());
                        List<CabeceraRespuestaBce> lcabeceras = new List<CabeceraRespuestaBce>();
                        List<DetalleRespuestaBce> lrespuestas = new List<DetalleRespuestaBce>();
                        long cabecerActual = 0;

                        while (linea != null)
                        {
                            bool escabecera = false;

                            linea = objReader.ReadLine();
                            if (linea != null)
                            {
                                DateTime fecha;
                                escabecera = DateTime.TryParse(linea.Split(',')[0], out fecha);
                                if (escabecera)
                                {
                                    CabeceraRespuestaBce cab = new CabeceraRespuestaBce();
                                    cab.fecha = linea.Split(',')[0];
                                    cab.idcabecera = linea.Split(',')[1];
                                    cab.numcuenta = linea.Split(',')[2];
                                    cab.cantidadregistros = linea.Split(',')[3];
                                    cab.valortotal = decimal.Parse(linea.Split(',')[4]);
                                    cab.numeroreferencia = long.Parse(linea.Split(',')[5]);
                                    cabecerActual = cab.numeroreferencia;
                                    cab.referenciabce = cab.idcabecera;
                                    lcabeceras.Add(cab);
                                }

                                if (linea != null && !escabecera)
                                {
                                    DetalleRespuestaBce res = new DetalleRespuestaBce();
                                    string[] info = linea.Split(',');
                                    res.idcabecera = long.Parse(info[0].Trim());
                                    res.identificacionbeneficiario = info[1].Trim();
                                    res.numeroreferencia = cabecerActual;
                                    res.valorpago = decimal.Parse(info[3].Trim());
                                    res.numerocuentabeneficiario = info[4].Trim();
                                    res.numero = int.Parse(info[5].Trim());
                                    res.nombrebeneficiario = info[6].Trim();
                                    int codigobce = int.Parse(info[7]);
                                    res.codrespuestabce = codigobce.ToString("00");
                                    res.fecha = DateTime.Parse(info[8].Trim());
                                    res.detalle = info[9].Trim();
                                    res.numeroreferenciapago = long.Parse(info[10].Trim());
                                    res.procesado = false;
                                    res.tipotransaccion = tipotransaccion;
                                    res.referenciabce = res.idcabecera.ToString();
                                    lrespuestas.Add(res);
                                }
                            }
                        }
                        objReader.Close();
                        List<ttestransaccion> lSpiPendienteRespuesta = TtesTransaccionDal.FindToRespuestaPendienteBce(((int)EnumTesoreria.EstadoPagoBce.Generado).ToString(), tipotransaccion);
                        if (lSpiPendienteRespuesta.Count == 0)
                        {
                            throw new AtlasException("BCE-002", "NO EXISTEN REGISTROS SPI PENDIENTES DE RESPUESTA");
                        }
                        List<ttestransaccion> lSpiPagosRespuesta = ActualizarRespuestaBce.ActualizarPagoSpi(lrespuestas, lSpiPendienteRespuesta);
                        if (lSpiPagosRespuesta.Count == 0)
                        {
                            throw new AtlasException("BCE-012", "NO EXISTEN REGISTROS SPI A ACTUALIZAR EN EL ARCHIVO CARGADO");
                        }
                        List<ttestransaccion> lSpiPagosCorrectos = lSpiPagosRespuesta.Where(x => x.cestado == ((int)EnumTesoreria.EstadoPagoBce.Pagado).ToString()).ToList();
                        decimal totalPagosCarga = lSpiPagosCorrectos.Sum(x => x.valorpago);
                        
                        string cuenta = string.Empty;

                        foreach (ttestransaccion tra in lSpiPagosCorrectos)
                        {
                            foreach (CabeceraRespuestaBce cab in lcabeceras)
                            {
                                if (tra.numeroreferencia == cab.numeroreferencia)
                                {
                                    cab.pagado = true;
                                }
                            }
                        }

                        foreach (CabeceraRespuestaBce tran in lcabeceras)
                        {
                            ttesenvioarchivo envioarchivo = TtesEnvioArchivoDal.FindByNumeroReferencia(tran.numeroreferencia, tipotransaccion);
                            envioarchivo.Actualizar = true;
                            envioarchivo.Esnuevo = false;
                            envioarchivo.estado = ((int)EnumTesoreria.EstadoPagoBce.Pagado).ToString();
                            envioarchivo.frecepcion = rm.Freal;
                            envioarchivo.cusuariorec = rm.Cusuario;
                            cuenta = envioarchivo.cuentaorigen;
                            envioarchivo.referenciabce = tran.referenciabce;
                            rm.AdicionarTabla("ttesenvioarchivo", envioarchivo, false);
                        }
                        rm.Response["cargaarchivo"] = "save";

                        if (totalPagosCarga > 0)
                        {
                            ContabilizarRespuestaBce(rm, lSpiPagosCorrectos, lcabeceras, lSpiPagosRespuesta);
                        }
                        else
                        {
                            List<DetalleComprobanteBce> ldetalleComprobanteBce = new List<DetalleComprobanteBce>();
                            DetalleComprobanteBce detalleComprobanteBce = new DetalleComprobanteBce();
                            detalleComprobanteBce.descripcioncomprobante = "Rechazado";
                            ldetalleComprobanteBce.Add(detalleComprobanteBce);

                            rm.AdicionarTabla("ttestransaccion", lSpiPagosRespuesta, false);
                            rm.Response["comprobantes"] = ldetalleComprobanteBce;
                        }
                        //rm.Response["comprobantes"] = null;
                        //rm.Monto = totalPagosCarga;
                        //rm.Comentario = string.Format("Respuesta BCE {0}", DateTime.Now.ToShortDateString());
                        //rm.Documento = cab.numcuenta;
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

        public static void ContabilizarRespuestaBce(RqMantenimiento rqmantenimiento, List<ttestransaccion> lSpiPagosCorrectos, List<CabeceraRespuestaBce> lcabeceras, List<ttestransaccion> lSpiPagosRespuesta)
        {
            List<DetalleComprobanteBce> ldetalleComprobanteBce = new List<DetalleComprobanteBce>();
            List<ttestransaccion> lpagosFinal = new List<ttestransaccion>();
            List<tconcomprobante> lcomprobante = new List<tconcomprobante>();
            List<tconcomprobantedetalle> lcomprobanteDetalle = new List<tconcomprobantedetalle>();
            foreach (CabeceraRespuestaBce cabecera in lcabeceras)
            {
                if (cabecera.pagado)
                {
                    ttesenvioarchivo ttesenvioarchivo = TtesEnvioArchivoDal.FindByNumeroReferencia(cabecera.numeroreferencia, EnumTesoreria.PAGO.Cpago);
                    decimal totalPago = lSpiPagosCorrectos.Where(x => x.numeroreferencia == cabecera.numeroreferencia).Sum(x => x.valorpago);
                    tconparametros cplantilla = TconParametrosDal.FindXCodigo(string.Format("PLANTILLA_CONTABLE_SPI_BCE_{0}", ttesenvioarchivo.cuentaorigen), rqmantenimiento.Ccompania);

                    if (cplantilla.numero == 0)
                    {
                        throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", string.Format("PLANTILLA_CONTABLE_SPI_BCE_{ 0 }", ttesenvioarchivo.cuentaorigen));
                    }

                    List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find((int)cplantilla.numero, rqmantenimiento.Ccompania);
                    tconplantilla plantilla = TconPlantillaDal.Find((int)cplantilla.numero, rqmantenimiento.Ccompania);
                    tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, plantilla, cabecera, totalPago, lSpiPagosRespuesta);
                    List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, cplantilla, comprobante, plantillaDetalle);
                    foreach (ttestransaccion transaccion in lSpiPagosRespuesta)
                    {
                        if (transaccion.numeroreferencia == cabecera.numeroreferencia && transaccion.cestado == ((int)EnumTesoreria.EstadoPagoBce.Pagado).ToString())
                        {
                            transaccion.ccomprobante = comprobante.ccomprobante;
                            transaccion.numerocomprobantecesantia = comprobante.numerocomprobantecesantia;
                            lpagosFinal.Add(transaccion);
                        }
                        else
                        {
                            lpagosFinal.Add(transaccion);
                        }
                    }
                    foreach (tconcomprobantedetalle comprobantedetalle in comprobanteDetalle)
                    {
                        lcomprobanteDetalle.Add(comprobantedetalle);
                    }

                    lcomprobante.Add(comprobante);
                    DetalleComprobanteBce detalleComprobanteBce = new DetalleComprobanteBce();
                    detalleComprobanteBce.numerocomprobante = comprobante.ccomprobante;
                    detalleComprobanteBce.descripcioncomprobante = comprobante.numerocomprobantecesantia;
                    detalleComprobanteBce.valorpago = totalPago;
                    ldetalleComprobanteBce.Add(detalleComprobanteBce);
                }
            }

            rqmantenimiento.AdicionarTabla("ttestransaccion", lpagosFinal, false);
            rqmantenimiento.AdicionarTabla("tconcomprobante", lcomprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", lcomprobanteDetalle, false);

            rqmantenimiento.Response["comprobantes"] = ldetalleComprobanteBce;
            rqmantenimiento.Response["cargaarchivo"] = "save";
            rqmantenimiento.AddDatos("actualizarsaldosenlinealote", true);
        }

        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tconplantilla plantilla, CabeceraRespuestaBce cabecera, decimal valorComprobante, List<ttestransaccion> lSpiPagosRespuesta)
        {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "EGRESO");
            List<ttestransaccion> lPagosObligacion = lSpiPagosRespuesta.Where(x => x.numeroreferencia == cabecera.numeroreferencia
                                                                                && x.ccomprobanteobligacion != null).ToList();
            string obligacion = string.Empty;
            var unicasObligaciones = lPagosObligacion
           .GroupBy(x => x.ccomprobanteobligacion)
           .ToDictionary(g => g.Key, g => g.Sum(v => v.valorpago));
            
            foreach (var unica in unicasObligaciones)
            {
                obligacion = obligacion + string.Format("{0},", unica.Key);
            }
            string comentario = string.Format("Respuesta BCE {0}-{1}, obligación/s {2}", DateTime.Now.ToShortDateString(), cabecera.idcabecera, obligacion);

            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                rqmantenimiento.Ccompania, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, comentario.Substring(0, comentario.Length - 1), true, true, true, false, false, false, false,
                plantilla.cplantilla, plantilla.cconcepto, 1, 1, rqmantenimiento.Ctransaccion, rqmantenimiento.Cmodulo, 1003, "EGRESO", 1, 1, valorComprobante, numerocomprobantecesantia,
                cabecera.idcabecera, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconparametros cplantilla,
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle)
        {
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (tconplantilladetalle pd2 in plantillaDetalle)
            {
                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = comprobante.cagencia;
                cd.csucursal = comprobante.csucursal;
                cd.ccuenta = pd2.ccuenta;
                cd.debito = pd2.debito;
                cd.numerodocumentobancario = null;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = pd2.centrocostosccatalogo;
                cd.centrocostoscdetalle = pd2.centrocostoscdetalle;
                cd.monto = comprobante.montocomprobante;
                cd.montooficial = comprobante.montocomprobante;
                cd.numerodocumentobancario = comprobante.numerodocumentobancario;
                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }

            if (sumatorioCreditos != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            return comprobanteDetalle;
        }
    }
}
