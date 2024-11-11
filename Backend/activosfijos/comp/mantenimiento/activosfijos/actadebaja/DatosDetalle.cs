using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.actadebaja
{
   
    public class DatosDetalle : ComponenteMantenimiento {

        /// <summary>
        ///  Clase que se encarga de completar información del detalle de un egreso para actas de baja de un activo.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

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
              
            }
            TacfEgresoDetalleDal.Completar(rqmantenimiento, lmantenimiento);
            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);

            tacfegreso egreso = (tacfegreso)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
           
            List<tacfproducto> lproducto = new List<tacfproducto>();
            tacfproducto producto = new tacfproducto();

            List<tacfkardex> lkardex = new List<tacfkardex>();
            tacfkardex kardex = new tacfkardex();

            List<tacfproductocodificado> lprodcodifi = new List<tacfproductocodificado>();
            tacfproductocodificado prodcodif;

            tacfkardexprodcodi karprocod;
            List<tacfkardexprodcodi> lkarprocod = new List<tacfkardexprodcodi>();

            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfegresodetalle obj in ldetalle)
            {
                vtotal = (decimal.Parse(obj.Mdatos["vunitario"].ToString()) * 1);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, 1, -vtotal);

                int cproducto = int.Parse(obj.cproducto.ToString());
                prodcodif = new tacfproductocodificado();
                producto = new tacfproducto();
                producto =  TacfProductoDal.Find(cproducto);
                karprocod = new tacfkardexprodcodi();

                producto.stock -= 1;

                obj.vunitario = producto.vunitario.Value;

                kardex = TacfKardexDal.CrearKardex(rqmantenimiento, cegreso, cproducto, false, egreso.tipoegresocdetalle,
                            1, obj.vunitario.Value, costopromedio, producto.stock.Value);
                lkardex.Add(kardex);
                lproducto.Add(producto);

                karprocod = TacfKardexProdCodiDal.Crear(rqmantenimiento, cegreso, obj.cproducto, false, obj.Mdatos["cbarras"].ToString(),
                                                  obj.Mdatos["serial"].ToString(), "BODEGA", "ACTBAJ", 1, decimal.Parse(obj.Mdatos["vunitario"].ToString()), costopromedio, obj.Mdatos["infoadicional"].ToString(),1309,"BOD");
                lkarprocod.Add(karprocod);

                prodcodif = TacfProductoCodificadoDal.FindxCproducto(cproducto, obj.Mdatos["cbarras"].ToString());
                prodcodif.estado = 0;
                prodcodif.cusuarioasignado = "BODEGA";
                lprodcodifi.Add(prodcodif);

            }

            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lproducto, false);
            rqmantenimiento.AdicionarTabla("tacfproductocodificado", lprodcodifi, false);
            rqmantenimiento.AdicionarTabla("tacfKardexProdCodi",lkarprocod, false);
        }
    }
    

}
    

