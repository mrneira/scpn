using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using general.util;
using util;
using util.dto.mantenimiento;
using dal.cartera;

namespace tesoreria.archivo.generacion
{
    /// <summary>
    /// Generar Archivo CashManagement
    /// </summary>
    /// <param name="lcobros"></param>
    /// <param name="rm"></param>
    public static class EnvioCashManagement
    {
        public static Descarga GenerarArchivoCashManagement(List<ttesrecaudaciondetalle> lcobros, RqMantenimiento rm)
        {
            Descarga descarga = new Descarga();
            try
            {
                string rutaBase = TcarParametrosDal.GetValorTexto("UBICACION_COBROS_CASH", rm.Ccompania);
                if (!Directory.Exists(rutaBase))
                    Directory.CreateDirectory(rutaBase);

                string nombreArchivo = string.Format(TcarParametrosDal.GetValorTexto("NOMBRE_TXT_COBROS_CASH", rm.Ccompania), rm.Fconatable);
                string rutaArchivo = rutaBase + nombreArchivo;
                if (File.Exists(rutaArchivo))
                {
                    File.Delete(rutaArchivo);
                }
                Encoding utf8WithoutBom = new UTF8Encoding(false);
                using (StreamWriter file = new StreamWriter(rutaArchivo, true, utf8WithoutBom))
                {
                    StringBuilder sb = new StringBuilder();
                    foreach (ttesrecaudaciondetalle recaudacion in lcobros)
                    {
                        long valorEntero = long.Parse(Math.Round(Convert.ToDecimal(recaudacion.valor), 2).ToString().Replace(",", "").Replace(".", ""));
                        sb.AppendLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}\t{9}\t{10}",
                            recaudacion.tipo, recaudacion.referencia, recaudacion.moneda, valorEntero, recaudacion.formacobro, "",
                           "", recaudacion.referencia, recaudacion.tipoidentificacioncliente, recaudacion.identificacioncliente, recaudacion.nombrecliente)
                            );
                    }
                    file.WriteLine(sb);
                }
                string Param1 = Path.GetFullPath(rutaArchivo);

                byte[] archivo = File.ReadAllBytes(rutaArchivo);

                descarga.nombre = Path.GetFileNameWithoutExtension(Param1);
                descarga.contenido= Convert.ToBase64String(archivo);
                descarga.tipo = "text/plain";
                descarga.extension = Path.GetExtension(rutaArchivo);
            }
            catch (Exception ex)
            {
                throw new AtlasException("CAR-0062", "ERROR EN GENERACIÓN ARCHIVO COBRO CASH MANAGEMENT {0}", ex.Message);
            }

            return descarga;
        }
    }
}

