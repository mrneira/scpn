using canalesdigitales.models;
using core.componente;
using dal.canalesdigitales;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace canalesdigitales.comp.consulta.agendamiento {
    public class ConsultaHorariosAtencion : ComponenteConsulta {

        private IList<tgenagencia> lagencias;

        public override void Ejecutar(RqConsulta rqconsulta) {
            ConsultarAgencias(rqconsulta);
            ConsultarHorariosDisponibles(rqconsulta);
        }

        private void ConsultarAgencias(RqConsulta rqconsulta) {
            lagencias = TgenAgenciaDal.FindAll();
            rqconsulta.Response.Add(nameof(lagencias), lagencias);
        }

        private void ConsultarHorariosDisponibles(RqConsulta rqconsulta) {
            List<HorarioDisponibleModel> lhorariosDisponibles = new List<HorarioDisponibleModel>();
            DateTime finicio = Fecha.GetFechaSistema();
            
            foreach (tgenagencia agencia in lagencias) {
                IList<tcanhorarioatencion> lhorariosAtencion = TcanHorarioAtencionDal.FindDisponibles(agencia.cagencia, agencia.csucursal, agencia.ccompania, Fecha.DateToInteger(finicio));
                foreach (tcanhorarioatencion hatencion in lhorariosAtencion) {
                    List<string> horasDisponibles = ConsultarHorasDisponibles(hatencion);
                    if (horasDisponibles.Count > 0) {
                        lhorariosDisponibles.Add(new HorarioDisponibleModel {
                            chorario = hatencion.chorario,
                            cagencia = hatencion.cagencia,
                            csucursal = hatencion.csucursal,
                            ccompania = hatencion.ccompania,
                            fatencion = hatencion.fatencion,
                            lhoras = horasDisponibles
                        });
                    }
                }
            }
            rqconsulta.Response.Add(nameof(lhorariosDisponibles), lhorariosDisponibles);
        }

        private List<string> ConsultarHorasDisponibles(tcanhorarioatencion hatencion) {
            List<string> lhorasDisponibles = new List<string>();
            bool descanso = hatencion.descanso;
            string[] hinicioArr = hatencion.hinicio.Split(':');
            string[] hfinArr = hatencion.hfin.Split(':');
            string[] hiniciodescansoArr = descanso ? hatencion.hiniciodescanso.Split(':') : hinicioArr;
            DateTime fecha = new DateTime();
            DateTime hinicio = new DateTime(fecha.Year, fecha.Month, fecha.Day, Convert.ToInt32(hinicioArr[0]), Convert.ToInt32(hinicioArr[1]), 0);
            DateTime hfin = new DateTime(fecha.Year, fecha.Month, fecha.Day, Convert.ToInt32(hfinArr[0]), Convert.ToInt32(hfinArr[1]), 0);
            DateTime hiniciodescanso = new DateTime(fecha.Year, fecha.Month, fecha.Day, Convert.ToInt32(hiniciodescansoArr[0]), Convert.ToInt32(hiniciodescansoArr[1]), 0);
            DateTime hfindescanso = descanso ? hiniciodescanso.AddHours(1) : hfin;
            int turnosPorHora = hatencion.agentes;

            while (hinicio.Ticks <= hfin.Ticks) {
                int turnosAgendados = TcanAgendamientoDal.CountAgendamientosPorHora(hatencion.chorario, Fecha.GetHoraString(hinicio));
                if (turnosAgendados < turnosPorHora) {
                    if (descanso)
                    {
                        if (hiniciodescanso.Ticks > hinicio.Ticks || hinicio.Ticks > hfindescanso.Ticks)
                        {
                            lhorasDisponibles.Add(Fecha.GetHoraString(hinicio));
                        }
                    }
                    else
                    {
                        lhorasDisponibles.Add(Fecha.GetHoraString(hinicio));
                    }
                }
                hinicio = hinicio.AddMinutes(hatencion.intervalo);
            }

            return lhorasDisponibles;
        }
    }
}
