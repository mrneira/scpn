using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using modelo;
using util;
using core.componente;

namespace general.comp.mantenimiento.parametros {
    public class InsertarActualizar : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("PARAMETROSSEGURIDAD") == null || rqmantenimiento.GetTabla("PARAMETROSSEGURIDAD").Lregistros.Count() <= 0) {
                return;
            }

            List<tgenparametrosseguridad> lparamseg = null;
            lparamseg = rqmantenimiento.GetTabla("PARAMETROSSEGURIDAD").Lregistros.Cast<tgenparametrosseguridad>().ToList();

            foreach (tgenparametrosseguridad paramseg in lparamseg) {
                paramseg.texto = EncriptarParametros.Encriptar(paramseg.texto);
            }
        }
    }
}
