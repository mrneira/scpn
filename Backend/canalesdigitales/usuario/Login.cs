using canalesdigitales.enums;
using canalesdigitales.helper;
using canalesdigitales.validaciones;
using core.componente;
using dal.canalesdigitales;
using dal.persona;
using dal.seguridades;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.usuario {
    public class Login : ComponenteMantenimiento {

        private readonly Validar validar = new Validar();
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            ValidarEquipo(rqmantenimiento);
            ProcesarLogin(rqmantenimiento);
            RegistrarSesion(rqmantenimiento);
            CompletarResponse(rqmantenimiento);
        }

        private void ValidarEquipo(RqMantenimiento rqmantenimiento) {
            int csubcanal = rqmantenimiento.Crol;

            if (csubcanal == EnumSubcanal.SUBCANAL_MOVIL) {
                string mac = rqmantenimiento.GetString("mac");
                validar.Equipo(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal, mac);
            }
        }

        private void ProcesarLogin(RqMantenimiento rqmantenimiento) {
            int csubcanal = rqmantenimiento.Crol;
            bool biometrico;

            if (csubcanal == EnumSubcanal.SUBCANAL_WEB) {
                biometrico = false;
            } else {    
                biometrico = Convert.ToBoolean(rqmantenimiento.GetDatos(nameof(biometrico)));
            }

            if (biometrico == false) {
                string password = rqmantenimiento.GetString("password");
                tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
                validar.UsuarioClave(usuario, password);
            }
        }

        private void RegistrarSesion(RqMantenimiento rqmantenimiento) {
            tcanusuariosesion sesion;
            string token = TokenHelper.GenerarToken();

            tcanusuariosesionhistoria sesionhistoria = new tcanusuariosesionhistoria {
                cusuario = rqmantenimiento.Cusuariobancalinea,
                ccanal = rqmantenimiento.Ccanal,
                csubcanal = rqmantenimiento.Crol,
                cversion = rqmantenimiento.GetString("cversion"),
                token = token,
                ip = rqmantenimiento.Cterminal,
                navegador = rqmantenimiento.GetString("navegador")
            };
            TcanUsuarioSesionHistoriaDal.Crear(sesionhistoria);

            tsegpolitica politica = TsegPoliticaDal.FindPorCanal(rqmantenimiento.Ccanal);
            short tiemposesion = Convert.ToInt16(politica.tiemposesion);
            sesion = TcanUsuarioSesionDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            if (sesion != null) {
                TcanUsuarioSesionDal.Eliminar(sesion);
            }
            sesion = new tcanusuariosesion {
                cusuario = rqmantenimiento.Cusuariobancalinea,
                ccanal = rqmantenimiento.Ccanal,
                csubcanal = rqmantenimiento.Crol,
                token = token,
                ip = rqmantenimiento.Cterminal,
                navegador = rqmantenimiento.GetString("navegador"),
                tiemposesion = tiemposesion,
            };
            TcanUsuarioSesionDal.Crear(sesion);

            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            //Se obtiene la fecha del ultimo ingreso antes de actualizar

            rqmantenimiento.Response.Add(nameof(usuario.fultimoingreso), usuario.fultimoingreso);

            usuario.fultimoingreso = Fecha.GetFechaSistema();
            usuario.numerointentos = 0;
            TcanUsuarioDal.Actualizar(usuario);

            rqmantenimiento.Response.Add(nameof(token), token);
            rqmantenimiento.Response.Add(nameof(tiemposesion), tiemposesion);
        }

        private void CompletarResponse(RqMantenimiento rqmantenimiento) {
            tcanusuario usuario = TcanUsuarioDal.Find(rqmantenimiento.Cusuariobancalinea, rqmantenimiento.Ccanal);
            tperpersonadetalle personaDetalle = TperPersonaDetalleDal.Find(Convert.ToInt64(usuario.cpersona), EnumGeneral.COMPANIA_COD);

            rqmantenimiento.Response.Add(nameof(personaDetalle.identificacion), personaDetalle.identificacion);
            rqmantenimiento.Response.Add(nameof(personaDetalle.nombre), personaDetalle.nombre);
            rqmantenimiento.Response.Add(nameof(personaDetalle.email), personaDetalle.email);
            
        }
    }
}
