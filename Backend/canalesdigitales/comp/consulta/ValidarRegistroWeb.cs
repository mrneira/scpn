using canalesdigitales.enums;
using core.componente;
using dal.persona;
using dal.socio;
using modelo;
using System;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace canalesdigitales.comp.consulta {

    public class ValidarRegistroWeb : ComponenteConsulta {

        public override void Ejecutar(RqConsulta rqconsulta) {

            ValidacionDeDatosParaRegistro(rqconsulta);
        }


        /// <summary>
        /// Se realiza la validación de la existencia de una persona
        /// </summary>
        /// <param name="rqconsulta"></param>
        private void ValidacionDeDatosParaRegistro(RqConsulta rqconsulta) {

            string identificacion = (string)rqconsulta.Mdatos["identificacion"];
            string credencial = (string)rqconsulta.Mdatos["credencial"];

            tperpersonadetalle persona = TperPersonaDetalleDal.Find(identificacion);

            if (persona is null) {

                throw new util.AtlasException("BPER-006", "NO EXISTE ESTA PERSONA");
            }

            tsoccesantia cesantia = TsocCesantiaDal.FindByCredencial(persona.cpersona, persona.ccompania, credencial);

            if (cesantia is null) {

                throw new util.AtlasException("BMV-001", "NO EXISTE REGISTRO CON ESTA CREDENCIAL");
            }

            if (cesantia.ccatalogotipoestado.Value.Equals("BLQ")) {

                throw new util.AtlasException("BMV-002", "LA CREDENCIAL DE ESTA PERSONA SE ENCUENTRA BLOQUEADA");
            }

            if (cesantia.ccatalogotipoestado.Value.Equals("BAJ")) {

                throw new util.AtlasException("BMV-002", "LA CREDENCIAL ESTA DADA DE BAJA");
            }

            Response resp = rqconsulta.Response;

            Dictionary<string, object> datosPersona = new Dictionary<string, object> {
                ["usuario"] = credencial,
                ["celular"] = persona.celular,
                ["fregistro"] = DateTime.Now,
                ["estado"] = EnumEstados.USUARIO_REGISTRADO,
                ["observacion"] = "INICIO DE REGISTRO DEL USUARIO"
            };

            resp["DatosPersona"] = datosPersona;
        }

    }

}
