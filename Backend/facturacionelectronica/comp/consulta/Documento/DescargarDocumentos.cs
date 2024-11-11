using core.componente;
using modelo;
using System;
using util.dto.consulta;
using dal.facturacionelectronica;
using SevenZip;
using System.Collections.Generic;
using dal.contabilidad;
using general.xml;

namespace facturacionelectronica.comp.consulta.documento
{

    public class DescargarDocumentos : ComponenteConsulta
    {
        /// <summary>
        /// Metodo que valida la clave del certificado
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (rqconsulta.GetDatos("numerodocumento") == null && rqconsulta.GetDatos("tipodocumento") == null)
            {
                return;
            }
            if (rqconsulta.GetDatos("numerodocumento") != null && rqconsulta.GetDatos("tipodocumento") != null)
            {
                string numeroDocumento = rqconsulta.GetString("numerodocumento");
                string tipoDocumento = rqconsulta.GetString("tipodocumento");
                string tipoDescarga = rqconsulta.GetString("tipodescarga");
                string claveacceso = rqconsulta.GetString("clavedeacceso");
                string modulo = (string)rqconsulta.GetDatos("modulo");
                if (modulo == null)
                {
                    modulo = "";
                }
                int ccompania = rqconsulta.Ccompania;
                string tipoArchivo = string.Empty;
                switch (tipoDescarga)
                {
                    case "btnxml":
                        tipoArchivo = "xml";
                        tcellogdocumentos archivoXml = TcelLogDocumentosDal.FindDocumento(tipoDocumento, numeroDocumento);
                        tcellogdocumentos autorizacionXml = TcelLogDocumentosDal.FindDocumentoAutorizado(tipoDocumento, numeroDocumento);
                        tconparametros ambiente = TconParametrosDal.FindTexto("SRI_AMBIENTE",rqconsulta.Ccompania, int.Parse(autorizacionXml.ambiente));
                        byte[] barchivo = archivoXml.xmlfirmado;
                        byte[] archivoSinCompresion = SevenZipExtractor.ExtractBytes(barchivo);
                        byte[] xmlCompleto= CompletaXmlHelper.ObtenerDocumentoAutorizado(archivoSinCompresion, autorizacionXml.autorizacion, archivoXml.fingreso.Value, autorizacionXml.mensaje, ambiente.texto);
                        if (xmlCompleto != null)
                        {
                            rqconsulta.Response["archivoDescarga"] = xmlCompleto;
                            rqconsulta.Response["nombre"] = string.Format("{0}_{1}.{2}", tipoDocumento, numeroDocumento, tipoArchivo);
                        }
                        else
                        {
                            rqconsulta.Response["archivoDescarga"] = null;
                        }
                        break;
                    case "btnpdf":
                        tipoArchivo = "pdf";
                        Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
                        parametrosPdf.Add("i_claveacceso", claveacceso);
                        parametrosPdf.Add("i_tipoDocumento", tipoDocumento);
                        parametrosPdf.Add("i_cinfompresa", ccompania);
                        parametrosPdf.Add("i_numerodocumento", numeroDocumento);
                        string tipoReporte = "rptCel_RideRetencion";
                        if (tipoDocumento == "FA")
                        {
                            parametrosPdf.Add("i_modulo", modulo);
                            tipoReporte = "rptCel_RideFactura";
                        }

                        byte[] archivoPdf = null;
                        general.reporte.GenerarArchivo.generarArchivo("PDF", "/CesantiaReportes/FacturacionElectronica/", tipoReporte, "c:\\tmp\\", "pdf_ride", parametrosPdf, true, out archivoPdf);
                        if (archivoPdf != null)
                        {
                            rqconsulta.Response["archivoDescarga"] = archivoPdf;
                            rqconsulta.Response["nombre"] = string.Format("{0}_{1}.{2}", tipoDocumento, numeroDocumento, tipoArchivo);
                        }
                        else
                        {
                            rqconsulta.Response["archivoDescarga"] = null;
                        }
                        break;
                }
            }
        }
    }
}
