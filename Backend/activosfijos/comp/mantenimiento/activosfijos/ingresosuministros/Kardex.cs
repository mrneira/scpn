using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.ingresosuministros
{

    /// <summary>
    /// Clase que se encarga de registrar el kardex de ingresos de suministros.
    /// </summary>
    public class Kardex : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardex")) {
                return;
            }

            int cingreso = (int)rqmantenimiento.Mdatos["cingreso"];
            List<tacfingresodetalle> lista = TacfIngresoDetalleDal.FindXCingreso(cingreso);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();

            if (rqmantenimiento.GetTabla("DETALLE") != null)
            {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0)
                {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
                if (rqmantenimiento.GetTabla("DETALLE").Lregeliminar.Count > 0)
                {
                    leliminar = rqmantenimiento.GetTabla("DETALLE").Lregeliminar;
                }
            }

            tacfingreso ingreso = (tacfingreso)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);

            List<tacfkardex> lkardex = new List<tacfkardex>();
            List<tacfproducto> lproducto = new List<tacfproducto>();
            tacfproducto producto = new tacfproducto();
            tacfkardex kardex = new tacfkardex();
            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfingresodetalle obj in ldetalle){
                vtotal = (obj.vunitario.Value * obj.cantidad.Value);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, obj.cantidad.Value, vtotal);
                producto = TacfProductoDal.Find(obj.cproducto);
                producto.stock += obj.cantidad.Value;
                producto.vunitario = costopromedio;               
                lkardex.Add(kardex);
                lproducto.Add(producto);

            }

            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lproducto, false);

        }
    }
}
