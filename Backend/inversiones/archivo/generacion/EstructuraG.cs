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
using System.Data;
using dal.inversiones.parametros;

namespace inversiones.comp.mantenimiento.archivo.generacion
{
    /// <summary>
    /// Generar estructuas G Inversiones
    /// </summary>
    /// <param name="ltransaccion"></param>
    /// <param name="envioarchivo"></param>
    /// <param name="empresa"></param>
    /// <param name="rm"></param>
    /// <param name="envioarchivo"></param>
    /// <param name="tipoTransaccion"></param>
    public static class EstructuraG
    {
        public static Descarga GenerarEstructurasInversion(string[] storesConsulta, Dictionary<string, object> parametros, string tipoEstructura, RqMantenimiento rm)
        {
            Descarga descarga = new Descarga();

            try
            {
                #region generar archivos

                if (tipoEstructura == "g01")
                {
                    descarga = GenerarEstructuraG01(storesConsulta, parametros, rm);
                }
                else
                {
                    descarga = GenerarEstructuraG02(storesConsulta, parametros, rm);
                }

                #endregion

            }
            catch (Exception ex)
            {
                throw new AtlasException("INV-021", "ERROR GENERAL DE ESTRUCTURA G {0}", ex.Message);
            }
            return descarga;
        }

        private static Descarga GenerarEstructuraG01(string[] storesConsulta, Dictionary<string, object> parametros, RqMantenimiento rm)
        {
            Descarga descarga = new Descarga();
            try
            {
                string rutaBase = TgenParametrosDal.GetValorTexto("UBICACION_PAGOS_SPI", rm.Ccompania);
                if (!Directory.Exists(rutaBase))
                    Directory.CreateDirectory(rutaBase);

                #region generar txt

                string nombreArchivo = string.Format("G01E{0}{1}.txt", TinvParametrosDal.GetValorTexto("GS_CODIGO_ENTIDAD", rm.Ccompania), DateTime.Now.ToShortDateString().Replace("/", "").Replace("-",""));
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
                Encoding utf8WithoutBom = new UTF8Encoding(false);
                //Dictionary<string, object> parametros = new Dictionary<string, object>();
                DataTable dtCabecera = ConsultaStore(storesConsulta[0], parametros);
                DataTable dtDetalle = ConsultaStore(storesConsulta[1], parametros);
                using (StreamWriter file = new StreamWriter(rutaArchivo, true, utf8WithoutBom))
                {
                    DateTime fecha = new DateTime();
                    DateTime.TryParse(dtCabecera.Rows[0]["fecha"].ToString(), out fecha);

                    file.WriteLine(string.Format("{0}{1}{2}{3}", dtCabecera.Rows[0]["codigo"].ToString().PadRight(3, ' '), dtCabecera.Rows[0]["codigoentidad"].ToString().PadRight(4, ' '),
                       fecha.ToString("dd/MM/yyyy").PadRight(10, ' '), dtCabecera.Rows[0]["totalreg"].ToString().PadRight(8, ' ')));
                    foreach (DataRow row in dtDetalle.Rows)
                    {
                        decimal patrimonio, capitalsocial;
                        decimal.TryParse(row["patrimonio"].ToString(), out patrimonio);
                        decimal.TryParse(row["capitalsocial"].ToString(), out capitalsocial);

                        file.WriteLine(string.Format("{0}{1}{2}{3}{4}{5}{6}{7}", row["tipoidentificacion"].ToString().PadRight(1, ' '), row["identificacion"].ToString().PadRight(13, ' '),
                            row["pais"].ToString().PadRight(2, ' '), row["tipoemisor"].ToString().PadRight(1, ' '), patrimonio.ToString("N2").PadRight(18, ' '), capitalsocial.ToString("N2").PadRight(18, ' '), row["calificacion"].ToString().PadRight(2, ' '), row["calificadorariesgo"].ToString().PadRight(1, ' ')));
                    }
                }
                string Param1 = Path.GetFullPath(rutaArchivo);
                string salida = string.Empty;

                Descarga txt = new Descarga();

                txt.nombre = Path.GetFileNameWithoutExtension(Param1);
                txt.contenido = Convert.ToBase64String(File.ReadAllBytes(rutaArchivo));
                txt.tipo = "text/plain";
                txt.extension = "txt";
                descarga = txt;

                #endregion
            }
            catch (Exception ex)
            {
                throw new AtlasException("INV-018", "ERROR ARCHIVO G01 {0}", ex.Message);
            }
            return descarga;
        }

        private static Descarga GenerarEstructuraG02(string[] storesConsulta, Dictionary<string, object> parametros, RqMantenimiento rm)
        {
            Descarga descarga = new Descarga();
            try
            {
                string rutaBase = TgenParametrosDal.GetValorTexto("UBICACION_PAGOS_SPI", rm.Ccompania);
                if (!Directory.Exists(rutaBase))
                    Directory.CreateDirectory(rutaBase);

                #region generar txt

                string nombreArchivo = string.Format("G02E{0}{1}.txt", TinvParametrosDal.GetValorTexto("GS_CODIGO_ENTIDAD",rm.Ccompania), DateTime.Now.ToShortDateString().Replace("/", "").Replace("-", ""));
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
                Encoding utf8WithoutBom = new UTF8Encoding(false);
                Dictionary<string, object> parametrosc = new Dictionary<string, object>();
                DataTable dtCabecera = ConsultaStore(storesConsulta[0], parametrosc);
                DataTable dtDetalle = ConsultaStore(storesConsulta[1], parametros);
                using (StreamWriter file = new StreamWriter(rutaArchivo, true, utf8WithoutBom))
                {
                    DateTime fecha = new DateTime();
                    DateTime.TryParse(dtCabecera.Rows[0]["fecha"].ToString(), out fecha);


                    file.WriteLine(string.Format("{0}{1}{2}{3}", dtCabecera.Rows[0]["codigo"].ToString().PadRight(3,' '), dtCabecera.Rows[0]["codigoentidad"].ToString().PadRight(4,' '),
                        fecha.ToString("dd/MM/yyyy").PadRight(10, ' '), dtCabecera.Rows[0]["totalreg"].ToString().PadRight(8,' ')));
                    foreach (DataRow row in dtDetalle.Rows)
                    {
                        DateTime fcompra, femision, fvencimiento;
                        DateTime.TryParse(row["fcompra"].ToString(), out fcompra);
                        DateTime.TryParse(row["femision"].ToString(), out femision);
                        DateTime.TryParse(row["fvencimiento"].ToString(), out fvencimiento);

                        decimal valornominal, tasa, valorcompra, preciomercado, valormercado, interesacumulado;

                        decimal.TryParse(row["valornominal"].ToString(), out valornominal);
                        decimal.TryParse(row["tasa"].ToString(), out tasa);
                        decimal.TryParse(row["valorcompra"].ToString(), out valorcompra);
                        decimal.TryParse(row["preciomercado"].ToString(), out preciomercado);
                        decimal.TryParse(row["valormercado"].ToString(), out valormercado);

                        decimal.TryParse(row["interesacumulado"].ToString(), out interesacumulado);



                        file.WriteLine(string.Format("{0}{1}{2}{3}{4}{5}{6}{7}{8}{9}{10}{11}{12}{13}{14}{15}{16}", row["tipoidentificacion"].ToString().PadRight(1,' '), row["identificacion"].ToString().PadRight(13,' '),
                            row["tipoinstrumento"].ToString().PadRight(2,' '), row["numeroinstrumento"].ToString().PadRight(20,' '), femision.ToString("dd/MM/yyyy").PadRight(10,' '), fcompra.ToString("dd/MM/yyyy").PadRight(10, ' '), fvencimiento.ToString("dd/MM/yyyy").PadRight(10, ' '),
                            row["plazo"].ToString().PadRight(4, ' '), tasa.ToString("N5").Replace(",", "").PadRight(15, ' '), valornominal.ToString("N2").Replace(",", "").PadRight(18, ' '), valorcompra.ToString("N2").Replace(",", "").PadRight(18, ' '), preciomercado.ToString("N5").Replace(",", "").PadRight(15, ' '),
                            valormercado.ToString("N2").Replace(",","").PadRight(18, ' '), interesacumulado.ToString("N2").Replace(",", "").PadRight(18, ' '), row["periodopago"].ToString().PadRight(2,' '), row["periodoamortizacion"].ToString().PadRight(2,' '), row["renta"].ToString().PadRight(2,' ')));
                    }
                }
                string Param1 = Path.GetFullPath(rutaArchivo);
                string salida = string.Empty;

                Descarga txt = new Descarga();

                txt.nombre = Path.GetFileNameWithoutExtension(Param1);
                txt.contenido = Convert.ToBase64String(File.ReadAllBytes(rutaArchivo));
                txt.tipo = "text/plain";
                txt.extension = "txt";
                descarga = txt;

                #endregion
            }
            catch (Exception ex)
            {
                throw new AtlasException("INV-019", "ERROR ARCHIVO G02 {0}", ex.Message);
            }
            return descarga;
        }

        private static string AnsitoUtf8(string cadena)
        {
            byte[] utf8Bytes = Encoding.UTF8.GetBytes(cadena);
            string s_unicode2 = Encoding.UTF8.GetString(utf8Bytes);
            return s_unicode2;
        }

        public static DataTable ConsultaStore(string store , Dictionary<string, object> parametros)
        {
            try
            {
                DataTable dt = dal.storeprocedure.StoreProcedureDal.GetDataTable(store, parametros);
                return dt;
            }
            catch (Exception ex)
            {
                throw new AtlasException("INV-020", "ERROR CONSULTA DE DATA SP {0}", ex.Message);
            }
        }
    }
}
