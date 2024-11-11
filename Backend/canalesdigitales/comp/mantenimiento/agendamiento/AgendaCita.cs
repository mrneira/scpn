using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using modelo;
using System;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento.agendamiento {
    class AgendaCita : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private tcanagendamiento agendamiento;

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarHorarioDisponible(rqmantenimiento);
            ValidarCita(rqmantenimiento);
            AgendarCita(rqmantenimiento);
        }

        private void ValidarHorarioDisponible(RqMantenimiento rqmantenimiento) {
            long chorario = Convert.ToInt64(rqmantenimiento.GetLong(nameof(chorario)));
            string hagendamiento = rqmantenimiento.GetString(nameof(hagendamiento));

            validar.HorarioDisponible(chorario, hagendamiento);
        }

        private void ValidarCita(RqMantenimiento rqmantenimiento) {
            long chorario = Convert.ToInt64(rqmantenimiento.GetLong(nameof(chorario)));

            validar.Cita(rqmantenimiento.Cusuariobancalinea, chorario);
        }

        private void AgendarCita(RqMantenimiento rqmantenimiento) {
            long chorario = Convert.ToInt64(rqmantenimiento.GetLong(nameof(chorario)));
            string hagendamiento = rqmantenimiento.GetString(nameof(hagendamiento));
            string token = rqmantenimiento.GetString(nameof(token));
            tcanagendamiento agendamiento = TcanAgendamientoDal.FindPorUsuario(rqmantenimiento.Cusuariobancalinea).Where(x => x.atendido == false).LastOrDefault();

            if (agendamiento == null) {
                CrearAgendamiento(rqmantenimiento);
            } else {
                tcanhorarioatencion horario = TcanHorarioAtencionDal.Find(agendamiento.chorario);
                if (horario != null) {
                    if (horario.fatencion > Fecha.GetFechaSistemaIntger()) {
                        agendamiento.chorario = chorario;
                        agendamiento.token = token;
                        agendamiento.hagendamiento = hagendamiento;
                        agendamiento.cusuariomod = rqmantenimiento.Cusuariobancalinea;
                        agendamiento.fmodificacion = Fecha.GetFechaSistema();

                        TcanAgendamientoDal.Actualizar(agendamiento);
                    } else {
                        if (horario.fatencion == Fecha.GetFechaSistemaIntger())
                        {
                            throw new AtlasException("CAN-054", "TIENE UN TURNO ACTIVO EL DÍA DE HOY. PODRÄ TOMAR UN NUEVO TURNO DESDE MAÑANA");
                        }
                        CrearAgendamiento(rqmantenimiento);
                    }
                } else {
                    CrearAgendamiento(rqmantenimiento);
                }
            }
        }

        private void CrearAgendamiento(RqMantenimiento rqmantenimiento) {
            long chorario = Convert.ToInt64(rqmantenimiento.GetLong(nameof(chorario)));
            string hagendamiento = rqmantenimiento.GetString(nameof(hagendamiento));
            string token = rqmantenimiento.GetString(nameof(token));
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);

            agendamiento = new tcanagendamiento() {
                cusuario = rqmantenimiento.Cusuariobancalinea,
                ccanal = rqmantenimiento.Ccanal,
                cpersona = Convert.ToInt64(usuario.cpersona),
                chorario = chorario,
                token = token,
                agendado = true,
                hagendamiento = hagendamiento,
                cusuarioing = rqmantenimiento.Cusuariobancalinea,
                fingreso = Fecha.GetFechaSistema()
            };

            TcanAgendamientoDal.Crear(agendamiento);
        }
    }
}
