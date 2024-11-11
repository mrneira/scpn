using canalesdigitales.enums;
using core.componente;
using dal.canalesdigitales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.agendamiento {
    class RegistraCita : ComponenteMantenimiento {
        private tcanagendamiento agendamientoReq = null;
        private tcanhorarioatencion horarioAtencion = null;
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarCita(rqmantenimiento);
            RegistrarCita(rqmantenimiento);
        }

        private void ValidarCita(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.Mtablas.ContainsKey("TCANAGENDAMIENTO")) {
                agendamientoReq = (tcanagendamiento)rqmantenimiento.GetTabla("TCANAGENDAMIENTO").Lregistros.ElementAt(0);
            }

            if (agendamientoReq == null) {
                throw new AtlasException("CAN-041", $"HORARIO NO DISPONIBLE: {agendamientoReq}");
            }

            int fatencion = Convert.ToInt32(agendamientoReq.GetInt(nameof(fatencion)));
            horarioAtencion = TcanHorarioAtencionDal.FindOnePorFecha(rqmantenimiento.Cagencia, rqmantenimiento.Csucursal, rqmantenimiento.Ccompania, fatencion);
            if (horarioAtencion == null) {
                throw new AtlasException("CAN-041", $"HORARIO NO DISPONIBLE: {rqmantenimiento.Cagencia} | {rqmantenimiento.Csucursal} | {rqmantenimiento.Ccompania} | {Fecha.GetFechaSistemaIntger()}");
            }

            IList<tcanagendamiento> lagendamientos = TcanAgendamientoDal.FindPorHorario(horarioAtencion.chorario);
            foreach (tcanagendamiento agend in lagendamientos) {
                if(agend.cpersona == agendamientoReq.cpersona) {
                    throw new AtlasException("CAN-042", $"YA TIENE UNA CITA RESERVADA PARA ESE HORARIO: {horarioAtencion.chorario} | {agend.cpersona}");
                }
            }
        }

        private void RegistrarCita(RqMantenimiento rqmantenimiento) {
            List<tcanagendamiento> lagendamientos = new List<tcanagendamiento>();
            IList<tcanagendamiento> lagendamientosNoAgendados = TcanAgendamientoDal.FindNoAgendados(horarioAtencion.chorario);
            tcanagendamiento agendamiento = lagendamientosNoAgendados.OrderByDescending(x => x.cagendamiento).FirstOrDefault();

            agendamiento.cpersona = agendamientoReq.cpersona;
            agendamiento.agendado = true;
            agendamiento.Actualizar = true;
            agendamiento.Esnuevo = false;

            lagendamientos.Add(agendamiento);
            rqmantenimiento.AdicionarTabla("TCANAGENDAMIENTO", lagendamientos, false);
        }
    }
}
