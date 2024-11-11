using canalesdigitales.enums;
using core.componente;
using dal.canalesdigitales;
using dal.persona;
using dal.socio;
using modelo;
using System;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace canalesdigitales.comp.mantenimiento {

    class ActivacionMantenimiento : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            bool generarClave = Convert.ToBoolean(rqmantenimiento.GetDatos("clave"));
            if (!generarClave) {
                RegistroDeUsuarioActivacion(rqmantenimiento);
            }
        }

        /// <summary>
        /// Se realiza la validación de la existencia de una persona
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        private void RegistroDeUsuarioActivacion(RqMantenimiento rqmantenimiento) {

            if (rqmantenimiento.Mtablas.ContainsKey("TCANACTIVACION")) {
                tcanactivacion activacion = (tcanactivacion)rqmantenimiento.GetTabla("TCANACTIVACION").Lregistros.ElementAt(0);


                string credencial = Convert.ToString(activacion.GetDatos(nameof(credencial)));
                string celular = Convert.ToString(activacion.GetDatos(nameof(celular))).Replace("-", string.Empty);
                string email = Convert.ToString(activacion.GetDatos(nameof(email)));

                if (string.IsNullOrEmpty(credencial)) {
                    throw new AtlasException("CAN-001", "CREDENCIAL VACÍA");
                }

                tcanactivacion activacionExiste = TcanActivacionDal.Find(activacion.cpersona, credencial);

                if (activacionExiste != null) {
                    throw new AtlasException("CAN-002", "ESTA PERSONA YA SE ENCUENTRA REGISTRADA");
                }

                tperpersonadetalle persona = TperPersonaDetalleDal.Find(activacion.cpersona, rqmantenimiento.Ccompania);
                tsoccesantia cesantia = TsocCesantiaDal.Find(persona.cpersona, persona.ccompania);

                if (!string.Equals(cesantia.credencial, credencial)) {
                    throw new AtlasException("CAN-003", "LA CREDENCIAL NO COINCIDE CON LA DE LA PERSONA");
                }

                if (!string.Equals(cesantia.ccdetalletipoestado, "ACT")) {
                    throw new AtlasException("CAN-006", "ESTA PERSONA NO SE ENCUENTRA ACTIVA");
                }

                if (TperPersonaDetalleDal.ExisteCelular(persona.identificacion, celular)) {
                    throw new AtlasException("CAN-004", "YA EXISTE UNA PERSONA REGISTRADA CON EL NÚMERO {0}", celular);
                }

                if (TperPersonaDetalleDal.ExisteEmail(persona.identificacion, email)) {
                    throw new AtlasException("CAN-005", "YA EXISTE UNA PERSONA REGISTRADA CON EL CORREO {0}", email);
                }

                if (!string.Equals(persona.celular, celular) || !string.Equals(persona.email, email)) {
                    persona.celular = celular;
                    persona.email = email;
                    Sessionef.Actualizar(persona);
                }

                //Creación y registro de activacion, usuario y usuario clave
                //ACTIVACION
                activacion.credencial = credencial;
                activacion.ccanal = EnumCanalDigital.CANAL_DIGITAL;
                activacion.fsistema = Fecha.GetFechaSistemaIntger();
                activacion.freal = Fecha.GetFechaSistema();
                activacion.cusuarioing = rqmantenimiento.Cusuario;
                activacion.fingreso = rqmantenimiento.Freal;
                activacion.cusuariomod = null;
                activacion.fmodificacion = null;

                string nombreUsuario = activacion.credencial.Replace("-", string.Empty);

                //Código de identificación de la clave
                int cclave = TcanUsuarioClaveDal.GetProximaClave(nombreUsuario, activacion.ccanal);

                //USUARIO
                tcanusuario usuario = new tcanusuario {
                    cusuario = nombreUsuario,
                    ccanal = activacion.ccanal,
                    cpersona = persona.cpersona,
                    cclave = cclave,
                    estadocatalogo = 3001,
                    estadodetalle = EnumEstados.USUARIO_REGISTRADO,
                    fultimoingreso = Fecha.GetFechaSistema(),
                    numerointentos = 0
                };

                TcanUsuarioDal.Crear(usuario);

                string claveTemp = ClaveTemporal.GetClave();

                //USUARIO CLAVE
                tcanusuarioclave usuarioClave = new tcanusuarioclave {
                    cclave = cclave,
                    ccanal = usuario.ccanal,
                    cusuario = usuario.cusuario,
                    password = EncriptarPassword.Encriptar(claveTemp),
                    temporal = true,
                    fcreacion = Fecha.GetFechaSistema()
                };

                rqmantenimiento.AddDatos("identificacion", persona.identificacion);
                rqmantenimiento.AddDatos("email", persona.email);
                rqmantenimiento.AddDatos("clavetemp", claveTemp);

                TcanUsuarioClaveDal.Crear(usuarioClave);
            }
        }

    }

}
