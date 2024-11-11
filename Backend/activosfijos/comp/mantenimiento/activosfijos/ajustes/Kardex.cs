using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.ajustes
{

   
    public class Kardex : ComponenteMantenimiento {
        /// <summary>
        /// Clase que actualiza los movimientos del kardex al realizar ajustes de bodega
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardex")) {
                return;
            }

            int cajuste = (int)rqmantenimiento.Mdatos["cajuste"];
            List<tacfajustedetalle> lista = TacfAjusteDetalleDal.FindXCajuste(cajuste);
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

            tacfajuste ajuste= (tacfajuste)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);

            List<tacfkardex> lkardex = new List<tacfkardex>();
            List<tacfproducto> lproducto = new List<tacfproducto>();
            tacfproducto producto = new tacfproducto();
            tacfkardex kardex = new tacfkardex();
            decimal costopromedio = 0;
            decimal diferencia = 0;
            foreach (tacfajustedetalle obj in ldetalle){
                
                producto = TacfProductoDal.Find(obj.cproducto);
                costopromedio = producto.vunitario.Value;
                diferencia = obj.stockcongelado.Value - obj.fisico.Value;
                bool ingreso = false;
                if(obj.stockcongelado.Value < obj.fisico.Value)
                {
                    producto.stock = obj.stockcongelado.Value + Math.Abs(diferencia);
                    ingreso = true;
                }
                else
                {
                    producto.stock = obj.stockcongelado - Math.Abs(diferencia);
                    ingreso = false;
                }
                
                

                kardex = TacfKardexDal.CrearKardex(rqmantenimiento, cajuste, obj.cproducto, ingreso, "AJUSTE",
                           Math.Abs(diferencia), costopromedio, costopromedio, producto.stock.Value);
                lkardex.Add(kardex);
                lproducto.Add(producto);

            }

            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lproducto, false);

        }
    }
}
