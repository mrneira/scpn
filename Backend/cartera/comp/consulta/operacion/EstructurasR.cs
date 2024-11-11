using core.componente;
using general.util;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using util.dto.consulta;

namespace cartera.comp.consulta.operacion
{
    class EstructurasR : ComponenteConsulta
    {
        /// <summary>
        /// Clase que entrega los datos de las polizas masivas
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Descarga descarga = new Descarga();
            try
            {
                string storeprocedure = rqconsulta.Mdatos["storeprocedure"].ToString();
                Dictionary<string, object> parametros = new Dictionary<string, object>();
                foreach (var pair in rqconsulta.Mdatos)
                {
                    if (pair.Key.Contains("parametro_"))
                    {
                        parametros[pair.Key.Replace("parametro_", "@")] = pair.Value;
                    }
                }
                DataTable dt = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros);
                var rows = dt.AsEnumerable()
                    .Select(r => r.Table.Columns.Cast<DataColumn>()
                    .Select(c => new KeyValuePair<string, object>(c.ColumnName, r[c.Ordinal]))
                    .ToDictionary(z => z.Key, z => z.Value))
                    .ToList();

                string nameFile = "", rutaArchivo = null, contentTxt = null;
                foreach (var row in rows)
                {
                    foreach (var pair in row)
                    {
                        string valor = pair.Value.ToString();
                        if (valor != null && valor != "")
                        {
                            contentTxt = (contentTxt == null) ? valor : contentTxt + "\t" + valor;
                            nameFile = (valor == "R81" || valor == "R82" || valor == "R83" || valor == "R84" || valor == "R85") ? valor : ((valor == "2144") ? (nameFile + "M" + valor) : ((valor.Split('/').Length == 3) ? (nameFile + valor.Split('/')[0] + valor.Split('/')[1] + valor.Split('/')[2]) : nameFile));
                        }
                    }
                    if (nameFile.Length != 16)
                    {
                        throw new Exception("CAR-777 NO FUE POSIBLE COMPLETAR CORRECTAMENTE EL NOMBRE DEL ARCHIVO");
                    }
                    rutaArchivo = Path.GetTempPath() + nameFile;
                    if (File.Exists(rutaArchivo + ".txt"))
                    {
                        File.Delete(rutaArchivo + ".txt");
                    }
                    if (File.Exists(rutaArchivo + ".zip"))
                    {
                        File.Delete(rutaArchivo + ".zip");
                    }
                    break;
                }
                
                using (StreamWriter sw = File.CreateText(rutaArchivo + ".txt"))
                {
                    int f = 0;
                    foreach (var row in rows)
                    {
                        if (f != 0)
                        {
                            contentTxt = null;
                            foreach (var pair in row)
                            {
                                string valor = pair.Value.ToString();
                                if (valor != null && valor != "")
                                {
                                    contentTxt = (contentTxt == null) ? "\n" + valor : contentTxt + "\t" + valor;
                                }
                                else
                                {
                                    throw new Exception("CAR-777 EXISTEN REGISTROS CON VALORES NULL");
                                }
                            }
                            sw.Write(contentTxt);
                        }
                        else
                        {
                            sw.Write(contentTxt);
                            f = 1;
                        }
                    }
                    sw.Close();
                }
                string[] filePaths = new string[] { rutaArchivo + ".txt", rutaArchivo + ".md5" };
                string salida = string.Empty;
                byte[] resultadoComprimir = general.util.Compression.ZipHelper.FileCompress(filePaths, out salida);
                descarga.nombre = nameFile;
                descarga.contenido = Convert.ToBase64String(resultadoComprimir);
                descarga.tipo = "application/zip";
                descarga.extension = "zip";
                rqconsulta.Response["ESTRUCTURACARTERAR"] = descarga;
            }
            catch (Exception e)
            {
                throw new Exception("CAR-777 EXISTE UNA EXCEPCIÓN AL GENERAR EL .ZIP");
            }
        }
    }
}
