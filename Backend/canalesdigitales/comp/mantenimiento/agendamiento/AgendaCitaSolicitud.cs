using canalesdigitales.helper;
using canalesdigitales.validaciones;
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
    class AgendaCitaSolicitud : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        private readonly OtpHelper otpHelper = new OtpHelper();
        private tcanagendamiento agendamiento;

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarHorarioDisponible(rqmantenimiento);
            ValidarCita(rqmantenimiento);
            ValidarSolicitud(rqmantenimiento);
            ValidarOtp(rqmantenimiento);
            ActualizarSolicitudDetalle(rqmantenimiento);
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
        private void ValidarSolicitud(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));

            validar.Solicitud(csolicitud, cproducto, ctipoproducto, rqmantenimiento.Cusuariobancalinea);
        }

        private void ValidarOtp(RqMantenimiento rqmantenimiento) {
            string tokenotp = rqmantenimiento.GetString(nameof(tokenotp));
            rqmantenimiento.Mdatos["token"] = tokenotp;
            otpHelper.ValidarOtp(rqmantenimiento);
        }

        private void ActualizarSolicitudDetalle(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));

            tcansolicituddetalle solicitudDetalle = TcanSolicitudDetalleDal.Find(csolicitud, cproducto, ctipoproducto);
            
            if (solicitudDetalle != null) {
                solicitudDetalle.montosolicitado = Convert.ToDecimal(rqmantenimiento.GetDecimal("montooriginal"));
                solicitudDetalle.plazosolicitado = Convert.ToInt32(rqmantenimiento.GetInt("numerocuotas"));
                solicitudDetalle.tasasolicitada = Convert.ToDecimal(rqmantenimiento.GetDecimal("tasa"));
                solicitudDetalle.cuotasolicitada = Convert.ToDecimal(rqmantenimiento.GetDecimal("valorcuota"));

                TcanSolicitudDetalleDal.Actualizar(solicitudDetalle);
            }
        }

        private void AgendarCita(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));
            long chorario = Convert.ToInt64(rqmantenimiento.GetLong(nameof(chorario)));
            string hagendamiento = rqmantenimiento.GetString(nameof(hagendamiento));
            string token = rqmantenimiento.GetString(nameof(token));
            tcanagendamiento agendamiento = TcanAgendamientoDal.FindPorUsuario(rqmantenimiento.Cusuariobancalinea).Where(x => x.atendido == false).LastOrDefault();

            if (agendamiento == null) {
                CrearAgendamiento(rqmantenimiento);
            } else {
                tcanhorarioatencion horario = TcanHorarioAtencionDal.Find(agendamiento.chorario);
                if(horario != null) {
                    if (horario.fatencion >= Fecha.GetFechaSistemaIntger()) {
                        agendamiento.chorario = chorario;
                        agendamiento.csolicitud = csolicitud;
                        agendamiento.cproducto = cproducto;
                        agendamiento.ctipoproducto = ctipoproducto;
                        agendamiento.token = token;
                        agendamiento.hagendamiento = hagendamiento;
                        agendamiento.cusuariomod = rqmantenimiento.Cusuariobancalinea;
                        agendamiento.fmodificacion = Fecha.GetFechaSistema();

                        TcanAgendamientoDal.Actualizar(agendamiento);
                    } else {
                        CrearAgendamiento(rqmantenimiento);
                    }
                } else {
                    CrearAgendamiento(rqmantenimiento);
                }
            }
        }

        private void CrearAgendamiento(RqMantenimiento rqmantenimiento) {
            long csolicitud = Convert.ToInt64(rqmantenimiento.GetLong(nameof(csolicitud)));
            int cproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(cproducto)));
            int ctipoproducto = Convert.ToInt32(rqmantenimiento.GetInt(nameof(ctipoproducto)));
            long chorario = Convert.ToInt64(rqmantenimiento.GetLong(nameof(chorario)));
            string hagendamiento = rqmantenimiento.GetString(nameof(hagendamiento));
            string token = rqmantenimiento.GetString(nameof(token));
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);

            agendamiento = new tcanagendamiento() {
                cusuario = rqmantenimiento.Cusuariobancalinea,
                ccanal = rqmantenimiento.Ccanal,
                chorario = chorario,
                cpersona = Convert.ToInt64(usuario.cpersona),
                csolicitud = csolicitud,
                cproducto = cproducto,
                ctipoproducto = ctipoproducto,
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
