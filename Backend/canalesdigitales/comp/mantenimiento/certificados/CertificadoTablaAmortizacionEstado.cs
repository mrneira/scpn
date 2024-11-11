using canalesdigitales.enums;
using canalesdigitales.helper;
using core.componente;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.certificados {
    class CertificadoTablaAmortizacionEstado : ComponenteMantenimiento {

        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            GenerarCertificado(rqmantenimiento);
        }

        private void GenerarCertificado(RqMantenimiento rqmantenimiento) {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            int opcion = Convert.ToInt32(rqmantenimiento.GetInt(nameof(opcion)));
            string tituloReporte;
            string nombreAdjunto;

            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();

            parametros.Add("@i_coperacion", rqmantenimiento.GetString("coperacion"));
            parametros.Add("@i_usuario", EnumGeneral.NOMBRE_PERSONA_BMOVIL);

            if (opcion == 1) {
                tituloReporte = "Certificado de Tabla de Amotización";
                nombreAdjunto = "Certificado_Tabla_Amortizacion";
                parametros.Add("archivoReporteUrl", "/CesantiaReportes/Prestamos/rptCarDocumentoOperacionAmortizacion");
            } else if (opcion == 2) {
                tituloReporte = "Certificado de Estado de Cuenta";
                nombreAdjunto = "Certificado_Estado_Cuenta";
                parametros.Add("archivoReporteUrl", "/CesantiaReportes/Prestamos/rptCarDocumentoOperacioEstadoCuenta");
            } else {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {opcion}");
            }
            
            parametros.Add("imagen", null);
            parametros.Add("estilo", null);
            parametros.Add("ccompania", EnumGeneral.COMPANIA_COD);
            parametros.Add("cusuario", rqmantenimiento.Cusuario);
            parametros.Add("path", null);
            parametros.Add("nombreArchivo", "ReporteCertificado");
            parametros.Add("formatoexportar", "pdf");
            parametros.Add("tituloreporte", tituloReporte);

            rq.Mdatos.Add(nameof(parametros), JsonConvert.SerializeObject(parametros));
            rq.Response = new Response();

            componenteHelper.ProcesarComponenteMantenimiento(rq, EnumComponentes.EJECUTA_REPORTE);

            rqmantenimiento.AddDatos("certificado", tituloReporte);
            rqmantenimiento.AddDatos(nameof(nombreAdjunto), nombreAdjunto);
            rqmantenimiento.AddDatos("reportebyte", rq.Response["reportebyte"]);
        }
    }
}
