using core.componente;
using seguridad.util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto;
using util.dto.consulta;

namespace seguridad.comp.consulta.usuario {

    /// <summary>
    /// Clase encargada de validar el horario de acceso a la aplicacion.
    /// </summary>
    /// <author>amerchan</author>
    public class HorarioAcceso : ComponenteConsulta {

        /// <summary>
        /// Metodo que valida el horario de acceso a la aplicacion.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            int ccompania = rqconsulta.Ccompania;
            String cusuario = rqconsulta.Cusuario;
            DateTime freal = rqconsulta.Freal;
            HorarioAccesoUsuario.validaHorarioAccesoPorUsuario(ccompania, cusuario, freal);
        }

    }
}
