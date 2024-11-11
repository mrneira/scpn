using core.componente;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace bancaenlinea.comp.consulta.socios {

    /// <summary>
    /// Clase que se encarga de consultar datos personales.
    /// </summary>
    public class InformacionPersonal : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos de la persona.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long cpersona = (long)rqconsulta.Mdatos["cpersona"];

            tpernatural natural = TperNaturalDal.Find(cpersona, (int)rqconsulta.Ccompania);
            tperpersonadetalle personadetalle = TperPersonaDetalleDal.Find(cpersona, (int)rqconsulta.Ccompania);

            List<Dictionary<string, object>> ldatos = new List<Dictionary<string, object>>();
            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["identificacion"] = personadetalle.identificacion,
                ["primernombre"] = natural.primernombre,
                ["segundonombre"] = natural.segundonombre,
                ["apellidopaterno"] = natural.apellidopaterno,
                ["apellidomaterno"] = natural.apellidomaterno,
                ["fnacimiento"] = natural.fnacimiento,
                ["celular"] = personadetalle.celular,
                ["email"] = personadetalle.email
            };
            ldatos.Add(mdatos);

            resp["DATOSPERSONALES"] = ldatos;
        }
    }
}

