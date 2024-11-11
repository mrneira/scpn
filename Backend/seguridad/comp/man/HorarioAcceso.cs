using core.componente;
using seguridad.util;
using System;
using util;
using util.dto.mantenimiento;

namespace seguridad.comp.man {

    /// <summary>
    /// Clase encargada de validar el horario de acceso a la aplicacion.
    /// </summary>
    /// <author>amerchan</author>
    public class HorarioAcceso : ComponenteMantenimiento {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            int ccompania = rqmantenimiento.Ccompania;
            String cusuario = rqmantenimiento.Cusuario;
            DateTime freal = rqmantenimiento.Freal;
            HorarioAccesoUsuario.validaHorarioAccesoPorUsuario(ccompania, cusuario, freal);
        }

    }
}
