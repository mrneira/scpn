using dal.generales;
using Microsoft.Reporting.WebForms.Internal.Soap.ReportingServices2005.Execution;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Services.Protocols;
using util;

namespace general.reporte
{
    public static class GenerarArchivo
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="formatosalida">ej. PDF - XLSX - DOCX</param>
        /// <param name="pathreporteorigen">ej. /CesantiaReportes/Contabilidad/  (incluir los caracteres / al inicio y final de la ruta)</param>
        /// <param name="nombrereporteorigen">ej. ComprobanteContable</param>
        /// <param name="pathreportedestino">ej. c:\\temp\\  (si envia en blanco "" no se genera el archivo)</param>
        /// <param name="nombrereportedestino">ej. archivosalida</param>
        /// <param name="parametros">diccionario de parámetros</param>
        /// <param name="devolverarchivo">true o false para devolver archivo en bytes</param>
        /// <param name="archivobyte">nombre del archivo en bytes (parametro de salida)</param>
        public static void generarArchivo(string formatosalida, string pathreporteorigen, string nombrereporteorigen, 
        string pathreportedestino, string nombrereportedestino, Dictionary<string, object> parametros, bool devolverarchivo, out byte[] archivobyte)
        {
            ReportExecutionService rs = new ReportExecutionService();
            string usuarioReportes = TgenParametrosDal.Find("SRV_USER", 1).texto;
            string pwdUsuarioReportes = EncriptarParametros.Desencriptar(TgenParametrosSeguridadDal.Find("SRV_PASS", 1).texto);
            string urlServidorReportes = TgenParametrosDal.Find("SRV_RS", 1).texto;

            rs.Credentials = new NetworkCredential(usuarioReportes, pwdUsuarioReportes);
            rs.Url = urlServidorReportes + "/ReportExecution2005.asmx?wsdl";
            archivobyte = null;
            // render
            byte[] result = null;
            string reportPath = pathreporteorigen + nombrereporteorigen;
            string format = formatosalida;
            string historyID = null;
            string devInfo = @"<DeviceInfo><Toolbar>False</Toolbar></DeviceInfo>";

            // parámetros
            ParameterValue[] parameters = new ParameterValue[parametros.Count];
            int i = 0;
            foreach (string key in parametros.Keys)
            {
                parameters[i] = new ParameterValue();
                //parameters[i].Label = key;
                parameters[i].Name = key;
                parameters[i].Value = parametros[key].ToString();
                i++;
            }


            //DataSourceCredentials[] credentials = null;
            string encoding;
            string mimeType;
            string extension;
            Warning[] warnings = null;
            string[] streamIDs = null;

            ExecutionInfo execInfo = new ExecutionInfo();
            ExecutionHeader execHeader = new ExecutionHeader();

            rs.ExecutionHeaderValue = execHeader;
            execInfo = rs.LoadReport(reportPath, historyID);

            //rs.SetExecutionParameters(parameters, "en-US");
            rs.SetExecutionParameters(parameters, "es-EC");

            String SessionId = rs.ExecutionHeaderValue.ExecutionID;

            try
            {
                result = rs.Render(format, devInfo, out extension, out encoding, out mimeType, out warnings, out streamIDs);
                execInfo = rs.GetExecutionInfo();
            }
            catch (SoapException e)
            {
                //Console.WriteLine(e.Detail.OuterXml);
            }
            // Devolver resultados.
            try
            {
                if (!pathreportedestino.Equals("")) 
                { 
                    Directory.CreateDirectory(pathreportedestino);
                    FileStream stream = File.Create(pathreportedestino + nombrereportedestino + "." + formatosalida, result.Length);
                    stream.Write(result, 0, result.Length);
                    stream.Close();
                }
                if (devolverarchivo)
                {
                    archivobyte = result;
                }
            }
            catch (Exception e)
            {
                //Console.WriteLine(e.Message);
            }
        }
    }
}
