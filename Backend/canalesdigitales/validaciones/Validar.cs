using canalesdigitales.enums;
using core.servicios;
using dal.canalesdigitales;
using dal.generales;
using dal.seguridades;
using modelo;
using System;
using System.Linq;
using util;

namespace canalesdigitales.validaciones {
    internal class Validar {

        public void Canal(string ccanal) {
            tgencanales canal = TgenCanalesDal.Find(ccanal);
            if (canal == null) {
                throw new AtlasException("BGEN-005", "CANAL NO DEFINIDO EN TGENCANALES CODIGO: {0}", ccanal);
            }
        }


        public void Version(string cversion, string ccanal, int csubcanal) {
            tcanversion version = TcanVersionDal.Find(cversion, ccanal, csubcanal);
            if (version == null) {
                throw new AtlasException("CAN-011", $"EXISTE UNA NUEVA VERSIÓN DISPONIBLE: {cversion} | {ccanal} | {csubcanal}");
            }
        }


        public void Activacion(string credencial) {
            tcanactivacion activacion = TcanActivacionDal.FindPorCredencial(credencial);
            if (activacion == null || activacion.activo == false) {
                throw new AtlasException("CAN-012", "INFORMACIÓN INCORRECTA");
            }
        }

        public tcanusuario Usuario(string cusuario, string ccanal, bool validarestadousuario = true) {
            tcanusuario usuario = TcanUsuarioDal.Find(cusuario, ccanal);
            if (usuario == null) {
                throw new AtlasException("SEG-001", "USUARIO: {0} NO EXISTE", cusuario);
            }

            if (validarestadousuario == true) {
                if (!usuario.estadodetalle.Equals(EnumEstados.USUARIO_ACTIVO) && !usuario.estadodetalle.Equals(EnumEstados.USUARIO_REGISTRADO)) {
                    tgencatalogodetalle catalogodetalle = TgenCatalogoDetalleDal.FindActivo(usuario.estadocatalogo, usuario.estadodetalle);
                    if (catalogodetalle == null) {
                        throw new AtlasException("CAN-013", "USUARIO SE ENCUENTRA {0}", usuario.estadodetalle);
                    } else {
                        throw new AtlasException("CAN-013", "USUARIO SE ENCUENTRA {0}", catalogodetalle.nombre);
                    }
                }
            }

            return usuario;
        }


        public void Equipo(string cusuario, string ccanal, string mac) {
            tcanusuario usuario = TcanUsuarioDal.Find(cusuario, ccanal);
            tcanequipo equipo = TcanEquipoDal.Find(cusuario, Convert.ToInt32(usuario.cequipo));
            if (equipo == null) {
                throw new AtlasException("CAN-022", $"EQUIPO NO REGISTRADO: {cusuario} | {ccanal} | {usuario.cequipo}");
            }

            if (!equipo.mac.Equals(mac)) {
                throw new AtlasException("CAN-023", $"MAC NO CORRESPONDE AL EQUIPO: {cusuario} | {ccanal} | {mac}");
            }
        }


        public void PoliticaSeguridadClave(string ccanal, string cusuario, string password) {
            tsegpolitica politica = TsegPoliticaDal.FindPorCanal(ccanal);
            new PoliticaSeguridad().Validate(politica, cusuario, password);
        }


        public void UsuarioClave(tcanusuario usuario, string password) {
            tcanusuarioclave usuarioclave = TcanUsuarioClaveDal.Find(usuario.cclave, usuario.cusuario, usuario.ccanal);
            tsegpolitica politica = TsegPoliticaDal.FindPorCanal(usuario.ccanal);

            if (usuarioclave != null && Convert.ToBoolean(usuarioclave.temporal)) {
                throw new AtlasException("CAN-053", "PARA ACCEDER A SUS CANALES REGISTRE SU USUARIO");
            }

            if (usuarioclave == null || !usuarioclave.password.Equals(EncriptarPassword.Encriptar(password))) {
                usuario.numerointentos++;
                if (usuario.numerointentos >= politica.intentos) {
                    usuario.estadodetalle = EnumEstados.USUARIO_BLOQUEADO;
                }

                UpdateAnidadoThread.Actualizar(EnumGeneral.COMPANIA_COD, usuario);
                throw new AtlasException("CAN-025", "CLAVE INCORRECTA, LE QUEDAN {0} INTENTOS DE {1}" + $" | {EncriptarPassword.Encriptar(password)}", usuario.numerointentos, politica.intentos);

            }

            DateTime fcaducidad = usuarioclave.fcreacion.AddDays((double)politica.diasvalidez);
            if (fcaducidad.Ticks < Fecha.GetFechaSistema().Ticks) {
                throw new AtlasException("CAN-014", $"CLAVE EXPIRADA, POR FAVOR ACTUALICE SU CLAVE: {fcaducidad}");
            }
        }

        public void Solicitud(long csolicitud, int cproducto, int ctipoproducto, string cusuario) {
            tcansolicitud solicitud = TcanSolicitudDal.Find(csolicitud);
            if (solicitud == null) {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {csolicitud}");
            }

            if (!cusuario.Equals(solicitud.cusuario)) {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA: {cusuario} | {solicitud.cusuario}");
            }

            tcansolicituddetalle solicitudDetalle = TcanSolicitudDetalleDal.Find(csolicitud, cproducto, ctipoproducto);
            if (solicitudDetalle == null) {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA - SOLICITUDDETALLE: {csolicitud} | {cproducto} | {ctipoproducto}");
            }

            if (solicitudDetalle.montosugerido == 0) {
                throw new AtlasException("CAN-036", $"SOLICITUD NO AUTORIZADA - SOLICITUDDETALLE: {csolicitud} | {cproducto} | {ctipoproducto} | {solicitudDetalle.montosugerido}");
            }
        }

        public void HorarioDisponible(long chorario, string hagendamiento) {
            tcanhorarioatencion horarioAtencion = TcanHorarioAtencionDal.Find(chorario);
            int turnosPorHora = horarioAtencion.agentes;
            int turnosAgendados = TcanAgendamientoDal.CountAgendamientosPorHora(horarioAtencion.chorario, hagendamiento);

            if (turnosAgendados >= turnosPorHora) {
                throw new AtlasException("CAN-041", $"HORARIO NO DISPONIBLE: {turnosAgendados} | {turnosPorHora}");
            }
        }

        public void Cita(string cusuario, long chorario) {
            tcanagendamiento cita;

            cita = TcanAgendamientoDal.FindPorUsuarioHorario(cusuario, chorario);
            if (cita != null) {
                tcanhorarioatencion horario = TcanHorarioAtencionDal.Find(cita.chorario);
                if (horario != null) {
                    throw new AtlasException("CAN-042", "YA TIENE UNA CITA RESERVADA PARA El DÍA {0}", Fecha.GetFechaPresentacionAnioMesDia(horario.fatencion));
                }
            }

            cita = TcanAgendamientoDal.FindPorUsuario(cusuario).Where(x => x.atendido == false).LastOrDefault();
            if (cita != null) {
                tcanhorarioatencion horario = TcanHorarioAtencionDal.Find(cita.chorario);
                if (horario != null) {
                    if (horario.fatencion >= Fecha.GetFechaSistemaIntger()) {
                        if (cita.csolicitud != null) {
                            throw new AtlasException("CAN-042", "YA TIENE UNA CITA RESERVADA PARA El DÍA {0}: " + cita.cusuario, Fecha.GetFechaPresentacionAnioMesDia(horario.fatencion));
                        }
                    }
                }
            }
        }

        public void DisponibilidaCreditoEmergentes() {
            tcanparametro parametro = TcanParametroDal.Find("DISPONIBILIDAD-CREDITO-EMERGENTE");
            string[] fecArray = parametro.valor.Split('/');
            DateTime finicio = Fecha.StringToFecha(fecArray[0]);
            DateTime ffin = Fecha.StringToFecha(fecArray[1]);
            DateTime factual = Fecha.GetFechaSistema();

            if (factual.Ticks < finicio.Ticks || factual.Ticks > ffin.Ticks) {
                throw new AtlasException("CAN-045", $"EN ESTE MOMENTO NO SE PUEDE REALIZAR LA SOLICITUD DE CRÉDITO EMERGENTE: {finicio} | {ffin}");
            }
        }
    }
}
