using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.ingreso
{
    
    public class Kardex : ComponenteMantenimiento {
        /// <summary>
        ///  Clase que se encarga de registrar los movimientos en el kardex al realizar ingresos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
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

                producto = TacfProductoDal.Find(obj.cproducto);

                vtotal = (obj.cantidad.Value * obj.vunitario.Value);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, obj.cantidad.Value, vtotal);

                
                producto.Esnuevo = false;
                producto.Actualizar = true;
                if (producto.ctipoproducto == 1)
                {
                    producto.valorresidual = costopromedio;
                }
                else
                {
                    producto.valorresidual = 0;
                }
                producto.stock += obj.cantidad.Value;
                producto.cantidadtotal += obj.cantidad.Value;
                producto.vunitario = costopromedio;
                producto.fultcompra = obj.fingreso;
                lproducto.Add(producto);

                kardex = TacfKardexDal.Crear(rqmantenimiento, cingreso, obj.cproducto, true, ingreso.tipoingresocdetalle,
                obj.cantidad.Value, obj.vunitario.Value, costopromedio, producto.stock.Value, Convert.ToDateTime(rqmantenimiento.Mdatos["fecha"].ToString()));
                lkardex.Add(kardex);                
            }
            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lproducto, false);

        }
    }
}
