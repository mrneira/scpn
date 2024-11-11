using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using general.util;
using util;
using util.dto.mantenimiento;

namespace tesoreria.archivo.generacion
{
    /// <summary>
    /// Generar Archivo Bce
    /// </summary>
    /// <param name="ltransaccion"></param>
    /// <param name="envioarchivo"></param>
    /// <param name="empresa"></param>
    /// <param name="rm"></param>
    /// <param name="envioarchivo"></param>
    /// <param name="tipoTransaccion"></param>
    public static class Generar
    {
        public static Descarga GenerarArchivoBce(List<ttestransaccion> ltransaccion, ttesenvioarchivo envioarchivo, ttesempresa empresa, RqMantenimiento rm, string tipoTransaccion)
        {
            Descarga descarga = new Descarga();
            try
            {
                if (tipoTransaccion == enums.EnumTesoreria.PAGO.Cpago)
                {
                    string rutaBase = TgenParametrosDal.GetValorTexto("UBICACION_PAGOS_SPI", rm.Ccompania);
                    if (!Directory.Exists(rutaBase))
                        Directory.CreateDirectory(rutaBase);
                    if (envioarchivo.esproveedor.Value)
                    {
                        string nombreArchivo = TgenParametrosDal.GetValorTexto("NOMBRE_TXT_PAGOS_SPI_PRO", rm.Ccompania);
                        string rutaArchivo = rutaBase + nombreArchivo;
                        if (!Directory.Exists(rutaBase))
                        {
                            Directory.CreateDirectory(rutaBase);
                        }
                        if (File.Exists(rutaArchivo))
                        {
                            File.Delete(rutaArchivo);
                        }
                        StringBuilder sbCabecera = new StringBuilder();
                        sbCabecera.AppendLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}", envioarchivo.fingreso.Value.ToString("dd-MM-yyyy"), envioarchivo.cuentaorigen, envioarchivo.razonsocial, null, null, null));
                        using (StreamWriter file = new StreamWriter(rutaArchivo, true, Encoding.UTF8))
                        {
                            StringBuilder sb = new StringBuilder();
                            sb.Append(sbCabecera.ToString());
                            foreach (ttestransaccion transaccion in ltransaccion)
                            {
                                string cuentabeneficiario = TgenCatalogoDetalleDal.Find(transaccion.institucionccatalogo, transaccion.institucioncdetalle).clegal;
                                sb.AppendLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}", transaccion.identificacionbeneficiario, transaccion.nombrebeneficiario, transaccion.numerocuentabeneficiario,
                                    transaccion.valorpago, cuentabeneficiario, envioarchivo.control));
                            }
                            file.WriteLine(sb);
                        }
                        string Param1 = Path.GetFullPath(rutaArchivo);
                        string salida = string.Empty;

                        descarga.nombre = Path.GetFileNameWithoutExtension(Param1);
                        descarga.contenido = Convert.ToBase64String(File.ReadAllBytes(rutaArchivo));
                        descarga.tipo = "text/plain";
                        descarga.extension = "txt";
                    }
                    else
                    {
                        string nombreArchivo = TgenParametrosDal.GetValorTexto("NOMBRE_TXT_PAGOS_SPI", rm.Ccompania);
                        string rutaArchivo = rutaBase + nombreArchivo;
                        if (!Directory.Exists(rutaBase))
                        {
                            Directory.CreateDirectory(rutaBase);
                        }
                        if (File.Exists(rutaArchivo))
                        {
                            File.Delete(rutaArchivo);
                        }
                        StringBuilder sbCabecera = new StringBuilder();
                        sbCabecera.AppendLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10}", envioarchivo.fingreso.Value.ToString("dd-MM-yyyy 00:00:00"), envioarchivo.numeroreferencia, envioarchivo.cantidadpago,
                            envioarchivo.control, envioarchivo.valorpago, envioarchivo.sumcontrol, envioarchivo.cuentaorigen, envioarchivo.cuentaorigen, envioarchivo.razonsocial, envioarchivo.localidad, envioarchivo.mespago));
                        using (StreamWriter file = new StreamWriter(rutaArchivo, true, Encoding.UTF8))
                        {
                            StringBuilder sb = new StringBuilder();
                            sb.Append(sbCabecera.ToString());
                            foreach (ttestransaccion transaccion in ltransaccion)
                            {
                                string cuentabeneficiario = TgenCatalogoDetalleDal.Find(transaccion.institucionccatalogo, transaccion.institucioncdetalle).clegal;
                                sb.AppendLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8}", transaccion.numeroreferenciapago, transaccion.valorpago, empresa.subcuenta,
                                    cuentabeneficiario, transaccion.numerocuentabeneficiario, transaccion.tipocuentacdetalle, transaccion.nombrebeneficiario, transaccion.detalle,
                                    transaccion.identificacionbeneficiario));
                            }
                            file.WriteLine(sb);
                        }
                        string Param1 = Path.GetFullPath(rutaArchivo);
                        string Param2 = Path.GetFullPath(rutaArchivo).Replace(".txt", ".md5");

                        Encoding utf8WithoutBom = new UTF8Encoding(false);
                        using (var md5 = MD5.Create())
                        {
                            using (var stream = File.OpenRead(Param1))
                            {
                                var hash = md5.ComputeHash(stream);
                                string a = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                                using (StreamWriter file = new StreamWriter(Param2, true, utf8WithoutBom))
                                {
                                    file.WriteLine(string.Format("{0}  {1}", a, Param1));
                                }
                            }
                        }
                        string nombreZip = TgenParametrosDal.GetValorTexto("NOMBRE_ZIP_PAGOS_SPI", rm.Ccompania);
                        string sevenZOutput = Path.GetDirectoryName(rutaArchivo) + nombreZip;
                        string[] filePaths = new string[] { Param1, Param2 };
                        string salida = string.Empty;
                        byte[] resultadoComprimir = general.util.Compression.ZipHelper.FileCompress(filePaths, out salida);

                        descarga.nombre = Path.GetFileNameWithoutExtension(sevenZOutput);
                        descarga.contenido = Convert.ToBase64String(resultadoComprimir);
                        descarga.tipo = "application/zip";
                        descarga.extension = "zip";
                    }
                }
                if (tipoTransaccion == enums.EnumTesoreria.COBRO.Cpago)
                {
                    string rutaBase = TgenParametrosDal.GetValorTexto("UBICACION_COBROS_OCP", rm.Ccompania);
                    if (!Directory.Exists(rutaBase))
                        Directory.CreateDirectory(rutaBase);
                    if (envioarchivo.esproveedor.Value)
                    {
                        string nombreArchivo = TgenParametrosDal.GetValorTexto("NOMBRE_TXT_COBROS_OCP", rm.Ccompania);
                        string rutaArchivo = rutaBase + nombreArchivo;
                        if (!Directory.Exists(rutaBase))
                        {
                            Directory.CreateDirectory(rutaBase);
                        }
                        if (File.Exists(rutaArchivo))
                        {
                            File.Delete(rutaArchivo);
                        }
                        StringBuilder sbCabecera = new StringBuilder();
                        sbCabecera.AppendLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}\t{6}\t{7}\t{8}", envioarchivo.fingreso.Value, envioarchivo.numeroreferencia, envioarchivo.cantidadpago, envioarchivo.valorpago, envioarchivo.cuentaorigen, envioarchivo.cuentaorigen, "7", envioarchivo.control, envioarchivo.control));
                        using (StreamWriter file = new StreamWriter(rutaArchivo, true, Encoding.UTF8))
                        {
                            StringBuilder sb = new StringBuilder();
                            sb.Append(sbCabecera.ToString());
                            foreach (ttestransaccion transaccion in ltransaccion)
                            {
                                string cuentabeneficiario = TgenCatalogoDetalleDal.Find(transaccion.institucionccatalogo, transaccion.institucioncdetalle).clegal;
                                sb.AppendLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}", transaccion.identificacionbeneficiario, transaccion.nombrebeneficiario, transaccion.numerocuentabeneficiario,
                                    transaccion.valorpago, cuentabeneficiario, envioarchivo.control));
                            }
                            file.WriteLine(sb);
                        }
                        string Param1 = Path.GetFullPath(rutaArchivo);
                        string salida = string.Empty;

                        descarga.nombre = Path.GetFileNameWithoutExtension(Param1);
                        descarga.contenido = Convert.ToBase64String(File.ReadAllBytes(rutaArchivo));
                        descarga.tipo = "text/plain";
                        descarga.extension = "txt";
                    }
                    else
                    {
                        string nombreArchivo = TgenParametrosDal.GetValorTexto("NOMBRE_TXT_COBROS_OCP", rm.Ccompania);
                        string rutaArchivo = rutaBase + nombreArchivo;
                        if (!Directory.Exists(rutaBase))
                        {
                            Directory.CreateDirectory(rutaBase);
                        }
                        if (File.Exists(rutaArchivo))
                        {
                            File.Delete(rutaArchivo);
                        }
                        StringBuilder sbCabecera = new StringBuilder();
                        sbCabecera.AppendLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8}", envioarchivo.fingreso.Value, envioarchivo.numeroreferencia, envioarchivo.cantidadpago, envioarchivo.valorpago, envioarchivo.cuentaorigen, envioarchivo.cuentaorigen, "7", envioarchivo.control, envioarchivo.control));
                        using (StreamWriter file = new StreamWriter(rutaArchivo, true, Encoding.UTF8))
                        {
                            StringBuilder sb = new StringBuilder();
                            sb.Append(sbCabecera.ToString());
                            foreach (ttestransaccion transaccion in ltransaccion)
                            {
                                string cuentabeneficiario = TgenCatalogoDetalleDal.Find(transaccion.institucionccatalogo, transaccion.institucioncdetalle).clegal;
                                sb.AppendLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12}", transaccion.fingreso, transaccion.numeroreferenciapago, transaccion.valorpago, transaccion.subcuenta,
                                    cuentabeneficiario, transaccion.numerocuentabeneficiario, transaccion.tipocuentacdetalle, transaccion.nombrebeneficiario,
                                    transaccion.identificacionbeneficiario, transaccion.email, transaccion.telefono, transaccion.detalle, transaccion.numerosuministro));
                            }
                            file.WriteLine(sb);
                        }
                        string Param1 = Path.GetFullPath(rutaArchivo);
                        string Param2 = Path.GetFullPath(rutaArchivo).Replace(".txt", ".md5");

                        Encoding utf8WithoutBom = new UTF8Encoding(false);
                        using (var md5 = MD5.Create())
                        {
                            using (var stream = File.OpenRead(Param1))
                            {
                                var hash = md5.ComputeHash(stream);
                                string a = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                                using (StreamWriter file = new StreamWriter(Param2, true, utf8WithoutBom))
                                {
                                    file.WriteLine(string.Format("{0}  {1}", a, Param1));
                                }
                            }
                        }
                        string nombreZip = TgenParametrosDal.GetValorTexto("NOMBRE_ZIP_COBROS_OCP", rm.Ccompania);
                        string sevenZOutput = Path.GetDirectoryName(rutaArchivo) + nombreZip;
                        string[] filePaths = new string[] { Param1, Param2 };
                        string salida = string.Empty;
                        byte[] resultadoComprimir = general.util.Compression.ZipHelper.FileCompress(filePaths, out salida);

                        descarga.nombre = Path.GetFileNameWithoutExtension(sevenZOutput);
                        descarga.contenido = Convert.ToBase64String(resultadoComprimir);
                        descarga.tipo = "application/zip";
                        descarga.extension = "zip";
                    }
                }

            }
            catch (Exception ex)
            {
                throw new AtlasException("BCE-006", "ERROR EN GENERACIÓN DE ARCHIVO COMPRIMIDO {0}", ex.Message);
            }

            return descarga;
        }

        public static Descarga[] GenerarArchivoBceScpn(List<ttestransaccion> ltransaccion, ttesenvioarchivo envioarchivo, ttesempresa empresa, RqMantenimiento rm, string tipoTransaccion)
        {
            Descarga[] descarga = new Descarga[2];
            try
            {
                if (tipoTransaccion == enums.EnumTesoreria.PAGO.Cpago)
                {
                    string rutaBase = TgenParametrosDal.GetValorTexto("UBICACION_PAGOS_SPI", rm.Ccompania);
                    if (!Directory.Exists(rutaBase))
                        Directory.CreateDirectory(rutaBase);

                    #region generar txt

                    string nombreArchivo = TgenParametrosDal.GetValorTexto("NOMBRE_TXT_PAGOS_SPI_PRO", rm.Ccompania);
                    string rutaArchivo = rutaBase + nombreArchivo;
                    if (!Directory.Exists(rutaBase))
                    {
                        Directory.CreateDirectory(rutaBase);
                    }
                    if (File.Exists(rutaArchivo))
                    {
                        File.Delete(rutaArchivo);
                    }
                    StringBuilder sbCabecera = new StringBuilder();
                    //sbCabecera.AppendLine()
                    using (StreamWriter file = new StreamWriter(rutaArchivo, true, Encoding.GetEncoding(1252)))
                    {
                        file.WriteLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}", envioarchivo.fingreso.Value.ToString("dd/MM/yyyy"), envioarchivo.cuentaorigen, envioarchivo.razonsocial, null, null, null));
                        //StringBuilder sb = new StringBuilder();
                        //file.WriteLine(sbCabecera.ToString());
                        //sb.Append(sbCabecera.ToString());
                        foreach (ttestransaccion transaccion in ltransaccion)
                        {
                            string cuentabeneficiario = TgenCatalogoDetalleDal.Find(transaccion.institucionccatalogo, transaccion.institucioncdetalle).clegal;
                            file.WriteLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}", transaccion.identificacionbeneficiario, AnsitoUtf8(transaccion.nombrebeneficiario), AnsitoUtf8(transaccion.numerocuentabeneficiario),
                                transaccion.valorpago.ToString("0.00"), cuentabeneficiario, envioarchivo.control));
                            //sb.AppendLine(string.Format("{0}\t{1}\t{2}\t{3}\t{4}\t{5}", transaccion.identificacionbeneficiario, transaccion.nombrebeneficiario, transaccion.numerocuentabeneficiario, transaccion.valorpago, cuentabeneficiario, envioarchivo.control));

                        }
                        //file.WriteLine(sb);
                    }
                    string Param1 = Path.GetFullPath(rutaArchivo);
                    string salida = string.Empty;

                    Descarga txt = new Descarga();

                    txt.nombre = Path.GetFileNameWithoutExtension(Param1);
                    txt.contenido = Convert.ToBase64String(File.ReadAllBytes(rutaArchivo));
                    txt.tipo = "text/plain";
                    txt.extension = "txt";
                    descarga[0] = txt;

                    #endregion

                    #region generar zip

                    string nombreArchivoZip = TgenParametrosDal.GetValorTexto("NOMBRE_TXT_PAGOS_SPI", rm.Ccompania);
                    string rutaArchivoZip = rutaBase + nombreArchivoZip;
                    if (!Directory.Exists(rutaBase))
                    {
                        Directory.CreateDirectory(rutaBase);
                    }
                    if (File.Exists(rutaArchivoZip))
                    {
                        File.Delete(rutaArchivoZip);
                    }
                    //StringBuilder sbCabeceraZip = new StringBuilder();
                    //sbCabeceraZip.AppendLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10}", envioarchivo.fingreso.Value.ToString("dd/MM/yyyy 00:00:00"), envioarchivo.numeroreferencia, envioarchivo.cantidadpago,
                    //    envioarchivo.control, envioarchivo.valorpago, envioarchivo.sumcontrol, envioarchivo.cuentaorigen, envioarchivo.cuentaorigen, envioarchivo.razonsocial, envioarchivo.localidad, envioarchivo.mespago));
                    using (StreamWriter file = new StreamWriter(rutaArchivoZip, true, Encoding.GetEncoding(1252)))
                    {
                        //StringBuilder sb = new StringBuilder();//CCA 20231016 aumenta decimales
                        file.WriteLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10}", envioarchivo.fingreso.Value.ToString("dd/MM/yyyy 00:00:00"), envioarchivo.numeroreferencia, envioarchivo.cantidadpago,
                        envioarchivo.control, envioarchivo.valorpago.Value.ToString("0.00"), envioarchivo.sumcontrol, envioarchivo.cuentaorigen, envioarchivo.cuentaorigen, envioarchivo.razonsocial, envioarchivo.localidad, envioarchivo.mespago));
                        //sb.Append(sbCabeceraZip.ToString());
                        foreach (ttestransaccion transaccion in ltransaccion)
                        {
                            string cuentabeneficiario = TgenCatalogoDetalleDal.Find(transaccion.institucionccatalogo, transaccion.institucioncdetalle).clegal;
                            //sb.AppendLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8}", transaccion.numeroreferenciapago, transaccion.valorpago, empresa.subcuenta,
                            //    cuentabeneficiario, transaccion.numerocuentabeneficiario, transaccion.tipocuentacdetalle, transaccion.nombrebeneficiario, transaccion.detalle,
                            //    transaccion.identificacionbeneficiario));
                            file.WriteLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8}", transaccion.numeroreferenciapago, transaccion.valorpago.ToString("0.00"), empresa.subcuenta,
                                cuentabeneficiario, transaccion.numerocuentabeneficiario, transaccion.tipocuentacdetalle, AnsitoUtf8(transaccion.nombrebeneficiario), AnsitoUtf8(transaccion.detalle),
                                transaccion.identificacionbeneficiario));
                        }
                    }
                    string Param1Zip = Path.GetFullPath(rutaArchivoZip);
                    string Param2Zip = Path.GetFullPath(rutaArchivoZip).Replace(".TXT", ".md5");
                    //CCA 20231011 Banco Central SPI --- nueva web BCE
                    if (File.Exists(Param2Zip))
                    {
                        File.Delete(Param2Zip);
                    }
                    Encoding utf8WithoutBom = new UTF8Encoding(false);
                    using (var md5 = MD5.Create())
                    {
                        using (var stream = File.OpenRead(Param1Zip))
                        {
                            var hash = md5.ComputeHash(stream);
                            string a = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                            using (StreamWriter file = new StreamWriter(Param2Zip, true, utf8WithoutBom))
                            {
                                file.WriteLine(string.Format("{0}  {1}", a, @"c:\SPI-2005\" + nombreArchivoZip.ToLower()));
                            }
                        }
                    }
                    string nombreZip = TgenParametrosDal.GetValorTexto("NOMBRE_ZIP_PAGOS_SPI", rm.Ccompania);
                    string sevenZOutput = Path.GetDirectoryName(rutaArchivoZip) + nombreZip;
                    string[] filePaths = new string[] { Param1Zip, Param2Zip };
                    string salidaZip = string.Empty;
                    byte[] resultadoComprimirZip = general.util.Compression.ZipHelper.FileCompress(filePaths, out salidaZip);

                    Descarga zip = new Descarga();

                    zip.nombre = Path.GetFileNameWithoutExtension(sevenZOutput);
                    zip.contenido = Convert.ToBase64String(resultadoComprimirZip);
                    zip.tipo = "application/zip";
                    zip.extension = "zip";

                    descarga[1] = zip;
                    #endregion
                }
                if (tipoTransaccion == enums.EnumTesoreria.COBRO.Cpago)
                {
                    string rutaBase = TgenParametrosDal.GetValorTexto("UBICACION_COBROS_OCP", rm.Ccompania);
                    if (!Directory.Exists(rutaBase))
                        Directory.CreateDirectory(rutaBase);

                    string nombreArchivo = TgenParametrosDal.GetValorTexto("NOMBRE_TXT_COBROS_OCP", rm.Ccompania);
                    string rutaArchivo = rutaBase + nombreArchivo;
                    if (!Directory.Exists(rutaBase))
                    {
                        Directory.CreateDirectory(rutaBase);
                    }
                    if (File.Exists(rutaArchivo))
                    {
                        File.Delete(rutaArchivo);
                    }
                    StringBuilder sbCabecera = new StringBuilder();
                    sbCabecera.AppendLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8}", DateTime.Now.ToString("dd/MM/yyyy 00:00:00"), envioarchivo.numeroreferencia, envioarchivo.cantidadpago, envioarchivo.valorpago.Value.ToString("0.00"), envioarchivo.cuentaorigen, envioarchivo.cuentaorigen, "7", envioarchivo.control, envioarchivo.control));
                    StringBuilder sb = new StringBuilder();
                    foreach (ttestransaccion transaccion in ltransaccion)
                    {
                        string cuentabeneficiario = TgenCatalogoDetalleDal.Find(transaccion.institucionccatalogo, transaccion.institucioncdetalle).clegal;
                        string nombrebeneficiario = transaccion.nombrebeneficiario;
                        if (nombrebeneficiario.Length > 30)
                        {
                            nombrebeneficiario.Substring(0, 30);
                        }
                        sb.AppendLine(string.Format("{0},{1},{2},{3},{4},{5},{6},{7},{8},{9},{10},{11},{12}",
                            DateTime.Now.ToString("dd/MM/yyyy 00:00:00"), transaccion.numeroreferenciapago, transaccion.valorpago.ToString("0.00"),
                            69, cuentabeneficiario, transaccion.numerocuentabeneficiario, transaccion.tipocuentacdetalle,
                            AnsitoUtf8(nombrebeneficiario), transaccion.identificacionbeneficiario, "NA",
                            0, transaccion.detalle, "NA"));
                    }
                    sbCabecera.AppendLine(sb.ToString());
                    File.WriteAllText(rutaArchivo, sbCabecera.ToString().TrimEnd(), Encoding.GetEncoding(1252));

                    string Param1 = Path.GetFullPath(rutaArchivo);
                    string Param2 = Path.GetFullPath(rutaArchivo).Replace(".txt", ".md5");

                    if (File.Exists(Param2))
                    {
                        File.Delete(Param2);
                    }

                    Encoding utf8WithoutBom = new UTF8Encoding(false);
                    using (var md5 = MD5.Create())
                    {
                        using (var stream = File.OpenRead(Param1))
                        {
                            var hash = md5.ComputeHash(stream);
                            string a = BitConverter.ToString(hash).Replace("-", "").ToLowerInvariant();
                            using (StreamWriter file = new StreamWriter(Param2, false, utf8WithoutBom))
                            {
                                file.WriteLine(string.Format("{0}  {1}", a, Param1));
                            }
                        }
                    }
                    string nombreZip = TgenParametrosDal.GetValorTexto("NOMBRE_ZIP_COBROS_OCP", rm.Ccompania);
                    string sevenZOutput = Path.GetDirectoryName(rutaArchivo) + nombreZip;
                    string[] filePaths = new string[] { Param1, Param2 };
                    string salida = string.Empty;
                    byte[] resultadoComprimir = general.util.Compression.ZipHelper.FileCompress(filePaths, out salida);
                    File.WriteAllBytes(sevenZOutput, resultadoComprimir);
                    Descarga zip = new Descarga();

                    zip.nombre = Path.GetFileNameWithoutExtension(sevenZOutput);
                    zip.contenido = Convert.ToBase64String(resultadoComprimir);
                    zip.tipo = "application/zip";
                    zip.extension = "zip";
                    File.WriteAllBytes(sevenZOutput, resultadoComprimir);

                    descarga[0] = zip;
                }
            }
            catch (Exception ex)
            {
                throw new AtlasException("BCE-006", "ERROR EN GENERACIÓN DE ARCHIVO COMPRIMIDO {0}", ex.Message);
            }

            return descarga;
        }

        private static string AnsitoUtf8(string cadena)
        {
            byte[] utf8Bytes = Encoding.UTF8.GetBytes(cadena);

            string s_unicode2 = Encoding.UTF8.GetString(utf8Bytes);
            return s_unicode2;
        }
    }
}
