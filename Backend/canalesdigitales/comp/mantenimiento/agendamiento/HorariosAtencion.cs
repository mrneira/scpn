using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.models;
using core.componente;
using core.servicios;
using dal.canalesdigitales;
using dal.generales;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.agendamiento {
    class HorariosAtencion : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            RegistrarHorariosAtencion(rqmantenimiento);
        }

        private void RegistrarHorariosAtencion(RqMantenimiento rqmantenimiento) {
            tcanhorarioatencion horarioAtencion = null;
            DateTime finicio = new DateTime();
            DateTime ffin = new DateTime();

            if (rqmantenimiento.Mdatos.ContainsKey("finicio") && rqmantenimiento.Mdatos.ContainsKey("ffin")) {
                finicio = (DateTime)rqmantenimiento.GetDate(nameof(finicio));
                ffin = (DateTime)rqmantenimiento.GetDate(nameof(ffin));
            }

            if (rqmantenimiento.Mtablas.ContainsKey("TCANHORARIOATENCION")) {
                horarioAtencion = (tcanhorarioatencion)rqmantenimiento.GetTabla("TCANHORARIOATENCION").Lregistros.ElementAt(0);
            }

            if (horarioAtencion != null) {
                List<tcanagendamiento> lagendamientos = new List<tcanagendamiento>();
                if (horarioAtencion.Esnuevo == true) {
                    List<tcanhorarioatencion> lhorarios = new List<tcanhorarioatencion>();
                    long chorario = TcanHorarioAtencionDal.FindMaxValue() + 1;
                    while (finicio.Ticks <= ffin.Ticks) {
                        tcanhorarioatencion horarioDB = TcanHorarioAtencionDal.FindOnePorFecha(horarioAtencion.cagencia, 1, EnumGeneral.COMPANIA_COD, Fecha.DateToInteger(finicio));
                        if (horarioDB == null) {
                            tcanhorarioatencion horario = new tcanhorarioatencion();
                            horario = (tcanhorarioatencion)horarioAtencion.Clone();
                            horario.chorario = chorario;
                            horario.csucursal = 1;
                            horario.ccompania = EnumGeneral.COMPANIA_COD;
                            horario.fatencion = Fecha.DateToInteger(finicio);
                            horario.cusuarioing = rqmantenimiento.Cusuario;
                            horario.fingreso = Fecha.GetFechaSistema();

                            ReservarCitas(horario, rqmantenimiento, lagendamientos);
                            lhorarios.Add(horario);
                            chorario += 1;
                        }
                        finicio = finicio.AddDays(1);
                    }
                    if (lhorarios.Count > 0) {
                        rqmantenimiento.AdicionarTabla("TCANHORARIOATENCION", lhorarios, false);
                    } else {
                        rqmantenimiento.EncerarTablas();
                    }
                } else {
                    bool validarNumAgendamientos = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(validarNumAgendamientos)));

                    if (horarioAtencion.activo == false && validarNumAgendamientos == true) {
                        IList<tcanagendamiento> lagendamientosDB = TcanAgendamientoDal.FindPorHorario(horarioAtencion.chorario).Where(x => x.agendado == true).ToList();
                        if (lagendamientosDB.Count > 0) {
                            throw new AtlasException("CAN-047", "EXISTEN {0} AGENDAMIENTO/S PARA EL DÍA SELECCIONADO: " + horarioAtencion.chorario + " | " + rqmantenimiento.Cusuario, lagendamientosDB.Count);
                        }
                    }

                    ActualizarCitas(horarioAtencion, rqmantenimiento, lagendamientos);
                }
                rqmantenimiento.AdicionarTabla("TCANAGENDAMIENTO", lagendamientos, false);
            }
        }

        private void ReservarCitas(tcanhorarioatencion horario, RqMantenimiento rqmantenimiento, List<tcanagendamiento> lagendamientos) {
            if (horario.citasreservadas > 0) {
                DateTime fecha = new DateTime();
                string[] hfinArr = horario.hfin.Split(':');
                DateTime hfin = new DateTime(fecha.Year, fecha.Month, fecha.Day, Convert.ToInt32(hfinArr[0]), Convert.ToInt32(hfinArr[1]), 0);
                for (int i = 0; i < horario.citasreservadas; i++) {

                    tcanagendamiento agendamiento = new tcanagendamiento() {
                        cusuario = EnumGeneral.USUARIO_BMOVIL,
                        ccanal = EnumCanalDigital.CANAL_DIGITAL,
                        cpersona = EnumGeneral.PERSONA_BMOVIL,
                        chorario = horario.chorario,
                        token = TokenHelper.GenerarToken(),
                        hagendamiento = Fecha.GetHoraString(hfin),
                        agendado = false,
                        cusuarioing = rqmantenimiento.Cusuario,
                        fingreso = Fecha.GetFechaSistema(),
                        Actualizar = false,
                        Esnuevo = true
                    };
                    lagendamientos.Add(agendamiento);
                    hfin = hfin.AddMinutes(-horario.intervalo);
                }
            }
        }

        private void ActualizarCitas(tcanhorarioatencion horarioAtencion, RqMantenimiento rqmantenimiento, List<tcanagendamiento> lagendamientos) {

            IList<tcanagendamiento> lagendamientosDel = TcanAgendamientoDal.FindNoAgendados(horarioAtencion.chorario);
            foreach (tcanagendamiento agenda in lagendamientosDel) {
                TcanAgendamientoDal.Eliminar(agenda);
            }

            if (horarioAtencion.activo == true) {
                ReservarCitas(horarioAtencion, rqmantenimiento, lagendamientos);
            }
        }
    }
}
