using canalesdigitales.enums;
using core.componente;
using dal.canalesdigitales;
using dal.generales;
using dal.persona;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace canalesdigitales.comp.mantenimiento {
    class BloqueoUsuario : ComponenteMantenimiento {

        /// <summary>
        /// Método principal que ejecuta el Bloqueo de Usuario
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            BloqueoDelUsuario(rqmantenimiento);

        }

        /// <summary>
        /// Se realiza el bloqueo del usuario
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void BloqueoDelUsuario(RqMantenimiento rqmantenimiento) {

            long cpersona = rqmantenimiento.GetLong(nameof(cpersona)).Value;
            string credencial = Convert.ToString(rqmantenimiento.GetDatos(nameof(credencial)));
            string estado = Convert.ToString(rqmantenimiento.GetDatos(nameof(estado)));

            //Se obtiene la información de la activación de la persona
            tcanactivacion activacion = TcanActivacionDal.Find(cpersona, credencial);

            string cusuario = credencial.Replace("-", string.Empty);

            //Se inactiva a la persona
            activacion.activo = estado.Equals(EnumEstados.USUARIO_ACTIVO) || estado.Equals(EnumEstados.USUARIO_REGISTRADO);

            //Se actualiza la información en la base de datos
            TcanActivacionDal.Actualizar(activacion);

            //Se obtiene la información del usuario
            tcanusuario usuario = TcanUsuarioDal.Find(cusuario, EnumCanalDigital.CANAL_DIGITAL);

            //Se cambia el estado del usuario a bloqueado
            usuario.estadodetalle = estado;

            //Se actualiza al usuario en la base de datos
            TcanUsuarioDal.Actualizar(usuario);

            //Se obtiene la información de la persona que se está bloqueando
            var persona = TperPersonaDetalleDal.Find(cpersona, EnumGeneral.COMPANIA_COD);

            tcanequipo equipo = usuario.cequipo.HasValue ? TcanEquipoDal.Find(cusuario, usuario.cequipo.Value) : null;

            tgencatalogodetalle catalogodetalle = TgenCatalogoDetalleDal.Find(usuario.estadocatalogo, usuario.estadodetalle);

            //Se envia la información del usario al que se cambio el estado
            var mdatos = new {
                cpersona = cpersona,
                npersona = persona.nombre,
                identificacion = persona.identificacion,
                cusuario = cusuario,
                credencial = credencial,
                celular = persona.celular,
                email = persona.email,
                equipo = equipo == null ? string.Empty : equipo.equipo,
                cestado = usuario.estadodetalle,
                estado = catalogodetalle.nombre,
                fregistro = activacion.fsistema.HasValue ? Fecha.GetFechaPresentacionAnioMesDia(activacion.fsistema.Value) : string.Empty
            };

            rqmantenimiento.Response.Add(nameof(mdatos), mdatos);
        }
    }
}
