using canalesdigitales.enums;
using canalesdigitales.helper;
using core.componente;
using dal.canalesdigitales;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.certificados {
    class CertificadoSocioActivo : ComponenteMantenimiento {

        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ConsultarSaldosOperacion(rqmantenimiento);
        }

        private void ConsultarSaldosOperacion(RqMantenimiento rqmantenimiento) {
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            //long cpersona = 54210;
            long cpersona = Convert.ToInt64(usuario.cpersona);

            RqConsulta rq = new RqConsulta();

            rq.Fconatable = rqmantenimiento.Fconatable;
            rq.AddDatos("cpersona", cpersona);
            rq.Response = new Response();

            componenteHelper.ProcesarComponenteConsulta(rq, EnumComponentes.SALDOS_VENCIDOS);

            GenerarCertificado(rqmantenimiento, cpersona, (List<Dictionary<string, object>>)rq.Response["SALDOSOPERACION"]);
        }

        private void GenerarCertificado(RqMantenimiento rqmantenimiento, long cpersona, List<Dictionary<string, object>> lsaldosoperaciones) {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            string tituloReporte = "Certificado de Socio Activo";
            string nombreAdjunto = "Certificado_Socio_Activo";

            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();

            parametros.Add("@i_loperaciones", lsaldosoperaciones);
            parametros.Add("@i_cpersona", cpersona);
            parametros.Add("@i_usuario", EnumGeneral.NOMBRE_PERSONA_BMOVIL);
            parametros.Add("archivoReporteUrl", "/CesantiaReportes/BancaEnLinea/ReporteSocioActivoCanales");
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
