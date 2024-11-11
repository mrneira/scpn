using core.componente;
using dal.cartera;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.param {
    public class ValidaTraslapeProductoRangosMonto : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<IBean> lmod = null;
            List<IBean> leliminados = null;
            if (rqmantenimiento.GetTabla("TCARPRODUCTORANGOS") != null && rqmantenimiento.GetTabla("TCARPRODUCTORANGOS").Lregistros.Count > 0) {
                lmod = rqmantenimiento.GetTabla("TCARPRODUCTORANGOS").Lregistros.Cast<tcarproductorangos>().Cast<IBean>().ToList();
                if (rqmantenimiento.GetTabla("TCARPRODUCTORANGOS").Lregeliminar.Count > 0) {
                    leliminados = rqmantenimiento.GetTabla("TCARPRODUCTORANGOS").Lregeliminar.Cast<tcarproductorangos>().Cast<IBean>().ToList();
                }


                tcarproductorangos item = lmod != null ? (tcarproductorangos)lmod[0] : null;
                if (item == null) {
                    item = leliminados != null ? (tcarproductorangos)leliminados[0] : null;
                }
                if (item != null) {
                    List<tcarproductorangos> ldb = TcarProductoRangosDal.findInDataBase(item.cmodulo, item.cproducto, item.ctipoproducto);
                    // Validar traslape de montos
                    List<tcarproductorangos> lfinal = DtoUtil.GetMergedList(ldb.Cast<IBean>().ToList(), lmod, leliminados).Cast<tcarproductorangos>().ToList();
                    for (int i = 0; i < lfinal.Count(); i++) {
                        tcarproductorangos itemgasto = lfinal[i];

                        this.validaTraslapeMontos(itemgasto, i + 1, lfinal);
                    }
                }
            }
        }

        private void validaTraslapeMontos(tcarproductorangos itemgasto, int index, List<tcarproductorangos> lfinal) {
            Decimal montomin1 = itemgasto.montominimo;
            Decimal montomax1 = itemgasto.montomaximo;

            for (int i = index; i < lfinal.Count(); i++) {
                tcarproductorangos itemval = lfinal[i];
                if (itemgasto.secuencia != itemval.secuencia) {
                    Decimal montomin2 = itemval.montominimo;
                    Decimal montomax2 = itemval.montomaximo;
                    FUtil.ValidaTraslapeMontos("MONTO MÍNIMO", "MONTO MÁXIMO", montomin1, montomax1, montomin2, montomax2);
                }
            }
        }
    }
}
