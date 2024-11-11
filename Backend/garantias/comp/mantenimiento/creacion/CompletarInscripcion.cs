using core.componente;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.creacion {

    /// <summary>
    /// Clase que se encarga de completar informacion de la inscripcion de una garantia.
    /// </summary>
    public class CompletarInscripcion : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("INSCRIPCIONGAR") == null) {
                return;
            }
            List<IBean> linscrip = rqmantenimiento.GetTabla("INSCRIPCIONGAR").Lregistros;
            if (!linscrip.Any()) {
                return;
            }
            tgaroperacioninscripcion ins = (tgaroperacioninscripcion)linscrip.ElementAt(0);
            if (ins.coperacion == null) {
                ins.coperacion = rqmantenimiento.Coperacion;
            }
        }

    }
}
