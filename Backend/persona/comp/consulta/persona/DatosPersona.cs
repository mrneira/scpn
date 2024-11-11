using core.componente;
using dal.persona;
using modelo;
using System.Collections.Generic;
using util.dto;
using util.dto.consulta;

namespace persona.comp.consulta.persona {

    /// <summary>
    /// Clase que se encarga de consultar datos basicos de la persona.
    /// </summary>
    public class DatosPersona : ComponenteConsulta {

        /// <summary>
        /// Consulta datos basicos de la persona.
        /// </summary>
        /// <param name="rqconsulta"></param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            Response resp = rqconsulta.Response;
            long cpersona = long.Parse(rqconsulta.Mdatos["cpersona"].ToString());
            tperpersonadireccion dir = null;

            tperpersonadetalle personadetalle = TperPersonaDetalleDal.Find(cpersona, (int)rqconsulta.Ccompania);
            List<tperpersonadireccion> ldireccion = TperPersonaDireccionDal.FindToList(cpersona, (int)rqconsulta.Ccompania);
            if (ldireccion.Count > 0) {
                dir = ldireccion[0];
            }

            List<Dictionary<string, object>> ldatos = new List<Dictionary<string, object>>();
            Dictionary<string, object> mdatos = new Dictionary<string, object> {
                ["regimen"] = personadetalle.regimen,
                ["celular"] = personadetalle.celular,
                ["email"] = personadetalle.email,
                ["direccion"] = (dir == null) ? "" : dir.direccion
            };
            ldatos.Add(mdatos);

            resp["DATOSPERSONA"] = ldatos;
        }
    }
}
