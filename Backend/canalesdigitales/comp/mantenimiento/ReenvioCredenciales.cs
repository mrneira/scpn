using canalesdigitales.enums;
using core.componente;
using dal.canalesdigitales;
using dal.persona;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento {
    class ReenvioCredenciales : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            long cpersona = rqmantenimiento.GetLong(nameof(cpersona)).Value;
            string credencial = Convert.ToString(rqmantenimiento.GetDatos(nameof(credencial)));
            string cusuario = credencial.Replace("-", string.Empty);

            rqmantenimiento.Ccanal = EnumCanalDigital.CANAL_DIGITAL;
            tcanusuario usuario = TcanUsuarioDal.Find(cusuario, rqmantenimiento.Ccanal);

            if (!usuario.estadodetalle.Equals(EnumEstados.USUARIO_REGISTRADO)) {
                throw new AtlasException("CAN-013", "USUARIO SE ENCUENTRA {0}", usuario.estadodetalle);
            }

            tperpersonadetalle persona = TperPersonaDetalleDal.Find(cpersona, rqmantenimiento.Ccompania);

            tcanusuarioclave claveActual = TcanUsuarioClaveDal.Find(usuario.cclave, usuario.cusuario, rqmantenimiento.Ccanal);

            if (!claveActual.temporal.Value) {
                throw new AtlasException("CAN-007", "EL USUARIO YA REALIZÓ EL CAMBIO DE CLAVE");
            }

            GenerarClaveTemporal(rqmantenimiento, persona, usuario);
        }

        private void GenerarClaveTemporal(RqMantenimiento rqmantenimiento, tperpersonadetalle persona, tcanusuario usuario) {
            int cclave = TcanUsuarioClaveDal.GetProximaClave(usuario.cusuario, usuario.ccanal);
            string claveTemp = ClaveTemporal.GetClave();

            tcanusuarioclave usuarioClave = new tcanusuarioclave {
                cclave = cclave,
                ccanal = usuario.ccanal,
                cusuario = usuario.cusuario,
                password = EncriptarPassword.Encriptar(claveTemp),
                temporal = true,
                fcreacion = Fecha.GetFechaSistema()
            };

            TcanUsuarioClaveDal.Crear(usuarioClave);

            usuario.cclave = cclave;
            TcanUsuarioDal.Actualizar(usuario);

            rqmantenimiento.AddDatos("identificacion", persona.identificacion);
            rqmantenimiento.AddDatos("email", persona.email);
            rqmantenimiento.AddDatos("clavetemp", claveTemp);
        }
    }
}
