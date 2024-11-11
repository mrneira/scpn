using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.ingreso
{

    /// <summary>
    /// Clase que se encarga de registrar el kardex de los productos codificados.
    /// </summary>
    public class KardexProductoCodificado : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardexproductocodificado")) {
                return;
            }

            int cingreso = int.Parse(rqmantenimiento.Mdatos["cingreso"].ToString());
            List<IBean> lmantenimiento = new List<IBean>();
            lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
            string tipomovimiento = rqmantenimiento.Mdatos["tipomovimiento"].ToString();
            string  cusuarioasignado = rqmantenimiento.Cusuario;
            List<tacfkardexprodcodi> lkardexpc = new List<tacfkardexprodcodi>();
            tacfkardexprodcodi kpc = new tacfkardexprodcodi();
            tacfproducto producto = new tacfproducto();
            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfingresodetalle obj in lmantenimiento) {
                kpc = new tacfkardexprodcodi();
                vtotal = (obj.vunitario.Value * obj.cantidad.Value);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, obj.cantidad.Value, vtotal);
                producto = TacfProductoDal.Find(obj.cproducto);
                kpc = TacfKardexProdCodiDal.Crear(rqmantenimiento, cingreso, obj.cproducto, true, obj.Mdatos["cbarras"].ToString(),
                    obj.Mdatos["serial"].ToString(), cusuarioasignado, tipomovimiento, 1, producto.vunitario.Value, costopromedio,"", 1309,"BOD");
                lkardexpc.Add(kpc);
            }

            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfkardexprodcodi", lkardexpc, false);

        }
    }
}
