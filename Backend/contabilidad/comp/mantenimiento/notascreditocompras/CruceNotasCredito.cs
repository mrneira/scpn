using core.componente;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar.notascreditocompras {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de notas de crédito que afectan a una cuenta por pagar
    /// </summary>
    public class CruceNotasCredito : ComponenteMantenimiento {

        /// <summary>
        /// ejecuta la clase datosdetalle del comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("NOTASCREDITOCOMPRAS") == null || rqmantenimiento.GetTabla("NOTASCREDITOCOMPRAS").Lregistros.Count() < 0) {
                return;
            }

            string cctaporpagar = rqmantenimiento.Mdatos["cctaporpagar"].ToString();
            decimal valornotascredito = 0;
            tconcuentaporpagar cxp = TconCuentaporpagarDal.Find(cctaporpagar);

            List<IBean> lmantenimiento = new List<IBean>();
            List<tconnotacreditocompras> lnotascredito = new List<tconnotacreditocompras>();
            lmantenimiento = rqmantenimiento.GetTabla("NOTASCREDITOCOMPRAS").Lregistros;
            foreach(tconnotacreditocompras obj in lmantenimiento) {
                if ((bool)obj.Mdatos["seleccionado"]) {
                    obj.cctaporpagar = cctaporpagar;
                    valornotascredito += obj.total.Value;
                    lnotascredito.Add(obj);
                }
            }
            cxp.valornotascredito += valornotascredito;
            rqmantenimiento.AdicionarTabla("tconcuentaporpagar", cxp, false);
            rqmantenimiento.AdicionarTabla("tconnotacreditocompras", lnotascredito, false);
            rqmantenimiento.Mtablas["NOTASCREDITOCOMPRAS"] = null;
        }
    }
}
