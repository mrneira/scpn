using core.componente;
using dal.generales;
using modelo;
using System;
using util.dto.consulta;
using File = System.IO.File;
using System.IO;
using util;
using System.Text;
using System.Collections.Generic;
using tesoreria.archivo;
using System.Threading;
using System.Globalization;

namespace tesoreria.comp.consulta.bce.archivo
{
    public class ValidarArchivoRespuesta : ComponenteConsulta
    {
        /// <summary>
        /// Metodo que valida la clave del certificado
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            int columnasCabecera = 6;
            int columnasDetalle = 11;
            string dataCabecera = string.Empty;
            StringBuilder sbDetalle = new StringBuilder();
            tgenparametros param = TgenParametrosDal.Find("UBICACION_PAGOS_SPI", rqconsulta.Ccompania);
            string path = param.texto;
            string narchivo = (string)rqconsulta.Mdatos["narchivo"];
            string tipoarchivo = (string)rqconsulta.Mdatos["tipo"];
            string archivo = rqconsulta.Mdatos["archivo"].ToString().Replace(string.Format("data:{0};base64,", tipoarchivo) , "");
            string extension = (string)rqconsulta.Mdatos["extension"];
            string rutaArchivo = string.Format("{0}{1}", path, narchivo);
            string rutaArchivoDescomprimido = path + Path.GetFileNameWithoutExtension(rutaArchivo);
            List<CabeceraRespuestaBce> ldatos = new List<CabeceraRespuestaBce>();
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            try
            {
                File.WriteAllBytes(rutaArchivo, Convert.FromBase64String(archivo));
                general.util.Compression.ZipHelper.Extract(rutaArchivo, rutaArchivoDescomprimido);
                StreamReader objReader = new StreamReader(rutaArchivoDescomprimido+ "\\" + Path.GetFileNameWithoutExtension(rutaArchivoDescomprimido)+".txt");
                string linea = string.Empty;
                int numeroLinea = 0;
                int numeroDetalles = 0;
                int numeroDetallesCabecera = 0;

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
                        cab.fecha = linea.Split(',')[0]; 					
                        cab.idcabecera = linea.Split(',')[1]; 
                        cab.numcuenta = linea.Split(',')[2];
                        cab.cantidadregistros = linea.Split(',')[3]; 
                        numeroDetallesCabecera = int.Parse(cab.cantidadregistros);
                        cab.valortotal = decimal.Parse(linea.Split(',')[4]); 
                        cab.numeroreferencia = long.Parse(linea.Split(',')[5]); 
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
                if (numeroDetalles != numeroDetallesCabecera)
                {
                    throw new AtlasException("BCE-010", "ERROR EN CARGA DE ARCHIVO DE RESPUESTA BCE, {0}", string.Format("Número de registros de cabecera no coinciden con el número de detalles, archivo {0} esperadas {1}", numeroDetalles, numeroDetallesCabecera));
                }
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
            rqconsulta.Response["cabecera"] = ldatos;
            rqconsulta.Response["rutaarchivo"] = rutaArchivoDescomprimido;
        }
    }
}
