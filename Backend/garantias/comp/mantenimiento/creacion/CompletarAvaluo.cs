using core.componente;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.creacion {

    /// <summary>
    /// Clase que se encarga de completar informacion del avaluo de una garantia.
    /// </summary>
    public class CompletarAvaluo : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("AVALUOGAR") == null) {
                return;
            }
            List<IBean> lavaluos = rqmantenimiento.GetTabla("AVALUOGAR").Lregistros;
            if (!lavaluos.Any()) {
                return;
            }
            tgaroperacionavaluo aval = (tgaroperacionavaluo)lavaluos.ElementAt(0);
            if (aval.coperacion == null) {
                aval.coperacion = rqmantenimiento.Coperacion;
            }
        }

    }
}
