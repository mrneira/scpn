using core.componente;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.contabilidad.cuentasporpagar.liquidacionviaticos;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar.liquidacionviaticos{

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de una liquidacion de viaticos
    /// </summary>
    public class DatosDetalle : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (rqmantenimiento.GetTabla("DETALLE") == null || rqmantenimiento.GetTabla("DETALLE").Lregistros.Count() < 0) {
                return;
            }
            long clquidacionviaticos = long.Parse(rqmantenimiento.Response["cliquidaciongastos"].ToString());
            List<tconliqgastosdetalle> lista = TconLiqGastosDetalleDal.Find(clquidacionviaticos,rqmantenimiento.Ccompania);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();

            if (rqmantenimiento.GetTabla("DETALLE") != null) {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0) {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
                if (rqmantenimiento.GetTabla("DETALLE").Lregeliminar.Count > 0) {
                    leliminar = rqmantenimiento.GetTabla("DETALLE").Lregeliminar;
                }
            }
            TconLiqGastosDetalleDal.Completar(rqmantenimiento, lmantenimiento);
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);

        }
    }
}
