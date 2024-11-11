using core.componente;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace garantias.comp.mantenimiento.creacion {

    /// <summary>
    /// Clase que se encarga de completar los campos adicionales de una garantia.
    /// </summary>
    public class CompletarGarantiaInfAdicional : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("TGAROPERACIONINFADICIONAL") == null) {
                return;
            }
            List<IBean> lcampos = rqmantenimiento.GetTabla("TGAROPERACIONINFADICIONAL").Lregistros;
            if (!lcampos.Any()) {
                return;
            }

            // Completa datos del pk
            CompletarGarantiaInfAdicional.CompletaPk(lcampos, rqmantenimiento.GetString("coperacion"));
        }

        private static void CompletaPk(List<IBean> linfadic, string coperacion) {
		    foreach (tgaroperacioninfadicional p in linfadic) {
			    if (p.coperacion == null) {
				    p.coperacion = coperacion;
                }
            }
	    }

    }
}
