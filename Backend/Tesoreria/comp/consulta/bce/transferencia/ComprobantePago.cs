using core.componente;
using dal.tesoreria;
using general.util;
using modelo;
using System;
using System.Collections.Generic;
using tesoreria.enums;
using util.dto.consulta;


namespace tesoreria.comp.consulta.bce.transferencia
{
    public class ComprobantePago : ComponenteConsulta
    {
        /// <summary>
        /// Consulta datos basicos de la empresa.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            if (rqconsulta.GetDatos("ctestransaccion") == null)
            {
                return;
            }
            if (rqconsulta.GetDatos("ctestransaccion") != null)
            {
                Descarga descarga = new Descarga();
                long ctestransaccion = rqconsulta.GetLong("ctestransaccion").Value;
                string tipoReporte = rqconsulta.GetString("tiporeporte");
                string rutaReporte = rqconsulta.GetString("rutareporte");
                string extension = rqconsulta.GetString("extension");
                ttestransaccion transaccion = TtesTransaccionDal.FindSpiPorCodigo(ctestransaccion);
                ttesenvioarchivo cabecera = TtesEnvioArchivoDal.FindByNumeroReferencia(transaccion.numeroreferencia, EnumTesoreria.TRANSFERENCIA.Cpago);

                string nombreArchivo = string.Format("ComprobantePago{0}", transaccion.referenciainterna);
                Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();

                parametrosPdf.Add("i_ctestransaccion", ctestransaccion);
                byte[] archivoComprobante = null;
                general.reporte.GenerarArchivo.generarArchivo(extension, rutaReporte, tipoReporte, "c:\\tmp\\", nombreArchivo, parametrosPdf, true, out archivoComprobante);

                descarga.nombre = nombreArchivo;
                descarga.contenido = Convert.ToBase64String(archivoComprobante);
                descarga.tipo = "application/pdf";
                descarga.extension = extension;
                rqconsulta.Response["archivogenerado"] = descarga;
            }
        }
    }
}
