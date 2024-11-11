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
using util;
using util.dto;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.certificados {
    class TurnoAgendado : ComponenteMantenimiento {

        private readonly ComponenteHelper componenteHelper = new ComponenteHelper();
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarCita(rqmantenimiento);
            GenerarTurno(rqmantenimiento);
        }

        private void ValidarCita(RqMantenimiento rqmantenimiento) {
            bool validar = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(validar)));

            if (validar) {
                tcanagendamiento cita = TcanAgendamientoDal.FindPorUsuario(rqmantenimiento.Cusuariobancalinea).Where(x => x.atendido == false).LastOrDefault();

                if (cita == null) {
                    throw new AtlasException("CAN-050", "ACTUALMENTE NO CUENTA CON UN TURNO AGENDADO");
                }

                tcanhorarioatencion horario = TcanHorarioAtencionDal.Find(cita.chorario);
                if (horario == null) {
                    throw new AtlasException("CAN-050", "ACTUALMENTE NO CUENTA CON UN TURNO AGENDADO");
                }
                if (horario.fatencion < Fecha.GetFechaSistemaIntger()) {
                    throw new AtlasException("CAN-050", "ACTUALMENTE NO CUENTA CON UN TURNO AGENDADO");
                }
            }
        }

        private void GenerarTurno(RqMantenimiento rqmantenimiento) {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            long cpersona = Convert.ToInt64(usuario.cpersona);

            string tituloReporte = "Turno Agendado";
            string nombreAdjunto = "Turno_Agendado";

            RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();

            parametros.Add("@i_cpersona", cpersona);
            parametros.Add("@i_usuario", EnumGeneral.NOMBRE_PERSONA_BMOVIL);
            parametros.Add("archivoReporteUrl", "/CesantiaReportes/BancaEnLinea/ReporteTurnosEnLinea");
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

            rqmantenimiento.AddDatos(nameof(nombreAdjunto), nombreAdjunto);
            rqmantenimiento.AddDatos("reportebyte", rq.Response["reportebyte"]);
        }
    }
}
