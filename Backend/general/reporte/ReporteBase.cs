using Microsoft.Reporting.WebForms;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;

namespace general.reporte {
    public class ReporteBase {
        ReportViewer reportViewer = new ReportViewer();
        Warning[] warnings;
        string[] streamids;
        string mimeType;
        string encoding;
        string extension;
        ReportParameter[] paramsw;
        public Byte[] ReporteByte(Dictionary<String, Object> objDictionaryParametros) {

            // string Nombre = (string)objDictionaryParametros["nombre"];
            string ArchivoReporteUrl = (string)objDictionaryParametros["archivoReporteUrl"];
            string UrlServidor = (string)objDictionaryParametros["urlServidor"];
            string User = (string)objDictionaryParametros["user"];
            string Pass = (string)objDictionaryParametros["pass"];
            string Dom = (string)objDictionaryParametros["dom"];
            // UrlServidor = "http://192.168.252.144/ReportServer_SQL2016DESA";
            //UrlServidor = "http://192.168.0.6/ReportServer_ATLASSCPNPRU";
            // ArchivoReporteUrl = + ArchivoReporteUrl;
            string Tipo = (string)objDictionaryParametros["formatoexportar"];
            if (Tipo.Equals("xls"))
                Tipo = "Excel";
            else if (Tipo.Equals("txt"))
                Tipo = "CSV";
            else if (Tipo.Equals("word"))
                Tipo = "Word";
            else
                Tipo = "Pdf";

            try {
                //  @"http://myserver/reportserver"
                //  @"/AdventureWorks Sample Reports/Company Sales"
                reportViewer.ShowCredentialPrompts = false;
                reportViewer.ServerReport.ReportServerCredentials = new CredencialesReporting(User, Pass, Dom);
                reportViewer.ProcessingMode = ProcessingMode.Remote;
                reportViewer.ServerReport.ReportServerUrl = new System.Uri(UrlServidor);
                reportViewer.ServerReport.ReportPath = ArchivoReporteUrl;
                

                this.paramsw = Parametros(objDictionaryParametros);
                if (this.paramsw != null)
                    reportViewer.ServerReport.SetParameters(this.paramsw);
                reportViewer.ServerReport.Refresh();
                // tipo = "Excel"
                Byte[] arreglo = reportViewer.ServerReport.Render(Tipo, null, out mimeType, out encoding, out extension, out streamids, out warnings);
                
                return arreglo;
            } catch (Exception ex) {
                //throw new AtlasException("REP001", ex.Message);
                throw new AtlasException("REP001", "ERROR AL EJECUTAR EL REPORTE: {0}", ex.Message );
            }
        }

        public ReportParameter[] Parametros(Dictionary<String, Object> objDictionaryParametrosIn) {
            ReportParameter[] paramsw = null;
            int i = 0;
            try {
                if (countCharacter(objDictionaryParametrosIn) > 0) {
                    paramsw = new ReportParameter[countCharacter(objDictionaryParametrosIn)];
                    foreach (KeyValuePair<String, Object> pr in objDictionaryParametrosIn) {
                        string name = "";
                        string value = "";
                        string searchForThis = "@";
                        int firstCharacter = -1;
                        if (pr.Value != null)
                            firstCharacter = pr.Key.ToString().IndexOf(searchForThis);
                        if (firstCharacter >= 0) {
                            name = pr.Key.ToString();
                            name = name.Replace(searchForThis, "");
                            value = pr.Value.ToString();
                            paramsw[i] = new ReportParameter(name, value, false);
                            i++;
                        }
                    }
                }
            } catch (Exception ex) {
                throw new AtlasException("REP002", ex.Message);
            }
            return paramsw;
        }

        public int countCharacter(Dictionary<String, Object> objDictionaryParametrosIn) {
            int count = 0;
            try {
                foreach (KeyValuePair<String, Object> pr in objDictionaryParametrosIn) {
                    string searchForThis = "@";
                    int firstCharacter = -1;
                    if (pr.Value != null)
                        firstCharacter = pr.Key.ToString().IndexOf(searchForThis);
                    if (firstCharacter >= 0)
                        count++;
                }

            } catch (Exception ex) {
                throw new AtlasException("REP002", ex.Message);
            }
            return count;
        }
    }
}
