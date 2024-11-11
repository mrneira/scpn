using core.componente;
using core.servicios;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.devolucionbodega
{

    /// <summary>
    /// Clase que se encarga de completar información de los movimientos para una devolucion de bodega.
    /// </summary>
    public class DevolucionBodega : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardexproductocodificado")) {
                return;
            }

            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0)
            {
                return;
            }

            tacfparametros p = TacfParametrosDal.FindXCodigo("USUARIO_CUSTODIO_AF", rqmantenimiento.Ccompania);
            tacfparametros parKardex = TacfParametrosDal.FindXCodigo("USUARIO_CUSTODIO_BO", rqmantenimiento.Ccompania);
            int cingreso = int.Parse(Secuencia.GetProximovalor("AFINGRESO").ToString());
            tacfingreso ingreso = (tacfingreso)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            ingreso.cingreso = cingreso;
            ingreso.cusuarioing = rqmantenimiento.Cusuario;
            ingreso.fingreso = rqmantenimiento.Freal;
            ingreso.cusuariodevolucion = p.texto;
            ingreso.fechaingreso = Convert.ToDateTime(rqmantenimiento.Mdatos["fecha"].ToString());
            List<IBean> lmantenimiento = new List<IBean>();
            List<tacfingresodetalle> lingresodetalle = new List<tacfingresodetalle>();
            lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
            string tipomovimiento = rqmantenimiento.Mdatos["tipomovimiento"].ToString();
            List<tacfkardexprodcodi> lkardexpc = new List<tacfkardexprodcodi>();
            List<tacfproductocodificado> lprodcodifi = new List<tacfproductocodificado>();
            List<tacfproducto> lproducto = new List<tacfproducto>();
            List<tacfkardex> lkardex = new List<tacfkardex>();
            tacfkardex kardex;
            tacfproducto producto;
            tacfkardexprodcodi kpc = new tacfkardexprodcodi();
            tacfproductocodificado prodcodif;
            tacfingresodetalle ingresodetalle;
            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfingresodetalle obj in lmantenimiento) {
                kpc = new tacfkardexprodcodi();
                prodcodif = TacfProductoCodificadoDal.Find(obj.cproducto, obj.Mdatos["cbarras"].ToString(), obj.Mdatos["serial"].ToString());
                prodcodif.cusuarioasignado = parKardex.texto;
                kardex = new tacfkardex();
                producto = TacfProductoDal.Find(obj.cproducto);

                vtotal = (producto.vunitario.Value * lmantenimiento.Count);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, lmantenimiento.Count, vtotal);
                ingresodetalle = new tacfingresodetalle();

                ingresodetalle = lingresodetalle.Find(x => x.cproducto == obj.cproducto) ;
                if (ingresodetalle != null)
                {
                    lingresodetalle.Find(x => x.cproducto == obj.cproducto).cantidad += 1;
                    lingresodetalle.Find(x => x.cproducto == obj.cproducto).stock += 1;
                    lkardex.Find(x => x.cproducto == obj.cproducto).cantidad += 1;
                    lkardex.Find(x => x.cproducto == obj.cproducto).stock += 1;
                    lproducto.Find(x => x.cproducto == obj.cproducto).stock += 1;
                }
                else
                {
                    ingresodetalle = new tacfingresodetalle();
                    ingresodetalle.cingreso = cingreso;
                    ingresodetalle.cproducto = obj.cproducto;
                    ingresodetalle.cusuarioing = rqmantenimiento.Cusuario;
                    ingresodetalle.fingreso = rqmantenimiento.Freal;
                    ingresodetalle.optlock = 0;
                    ingresodetalle.vunitario = producto.vunitario.Value;
                    ingresodetalle.stock = producto.stock+1;
                    ingresodetalle.cantidad = 1;
                    ingresodetalle.cantidaddevuelta = 0;
                    producto.stock = producto.stock + 1;

                    kardex = TacfKardexDal.Crear(rqmantenimiento, cingreso, obj.cproducto, true, "DEVBOD", 1, producto.vunitario.Value, costopromedio, producto.stock.Value, Convert.ToDateTime(rqmantenimiento.Mdatos["fecha"].ToString()));

                    lkardex.Add(kardex);
                    lingresodetalle.Add(ingresodetalle);
                    lproducto.Add(producto);
                }
               
                kpc = TacfKardexProdCodiDal.Crear(rqmantenimiento, cingreso, obj.cproducto, true, obj.Mdatos["cbarras"].ToString(),
                    obj.Mdatos["serial"].ToString(), parKardex.texto,tipomovimiento, 1, obj.vunitario.Value, producto.vunitario.Value, "", 1309, "UIO");
                lkardexpc.Add(kpc);

                lprodcodifi.Add(prodcodif);
            }

            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfingresodetalle", lingresodetalle, false);
            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfkardexprodcodi", lkardexpc, false);
            rqmantenimiento.AdicionarTabla("tacfproductocodificado", lprodcodifi, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lproducto, false);
            rqmantenimiento.Response["cingreso"] = cingreso;
        }
    }
}
