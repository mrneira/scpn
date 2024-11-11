using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.egresosuministros
{

    /// <summary>
    /// Clase que se encarga de realizar los movimientos en el kardez al registrar un egreso.
    /// </summary>
    public class Kardex : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardex")) {
                return;
            }

            int cegreso = (int)rqmantenimiento.Mdatos["cegreso"];
            List<tacfegresodetalle> lista = TacfEgresoDetalleDal.FindXCegreso(cegreso);
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

            tacfegreso egreso = (tacfegreso)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);

            List<tacfkardex> lkardex = new List<tacfkardex>();
            List<tacfproducto> lproducto = new List<tacfproducto>();
            tacfproducto producto = new tacfproducto();
            tacfkardex kardex = new tacfkardex();
            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfegresodetalle obj in ldetalle)
            {
                vtotal = (obj.vunitario.Value * obj.cantidad.Value);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto,  obj.cantidad.Value,  vtotal);                

                producto = TacfProductoDal.Find(obj.cproducto);
                producto.stock -= obj.cantidad.Value;
                producto.vunitario = costopromedio;
            
                kardex = TacfKardexDal.Crear(rqmantenimiento, cegreso, obj.cproducto, false, egreso.tipoegresocdetalle,
                            obj.cantidad.Value, obj.vunitario.Value, costopromedio, producto.stock.Value, Convert.ToDateTime(rqmantenimiento.Mdatos["fecha"].ToString()));
                lkardex.Add(kardex);
                lproducto.Add(producto);               

            }

            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lproducto, false);

        }
    }
}
