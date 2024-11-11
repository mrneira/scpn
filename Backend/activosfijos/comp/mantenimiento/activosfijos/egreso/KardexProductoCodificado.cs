using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.egreso
{

    
    public class KardexProductoCodificado : ComponenteMantenimiento {

        /// <summary>
        /// Clase que registra los movimientos de activos entregados a un funcionario.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardexproductocodificado")) {
                return;
            }

            int cegreso = int.Parse(rqmantenimiento.Mdatos["cegreso"].ToString());
            List<IBean> lmantenimiento = new List<IBean>();
            lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
            string tipomovimiento = rqmantenimiento.Mdatos["tipomovimiento"].ToString();
            string  cusuarioasignado = rqmantenimiento.Mdatos["cusuarioasignado"].ToString();
            List<tacfkardexprodcodi> lkardexpc = new List<tacfkardexprodcodi>();
            tacfkardexprodcodi kpc = new tacfkardexprodcodi();

            List<tacfproductocodificado> lprodcodifi = new List<tacfproductocodificado>();
            tacfproductocodificado prodcodif;
            List<tacfegreso> legreso = new List<tacfegreso>();
            tacfegreso egreso;

            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfegresodetalle obj in lmantenimiento) {
                kpc = new tacfkardexprodcodi();
                prodcodif = new tacfproductocodificado();

                vtotal = (obj.vunitario.Value * 1);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, 1, vtotal);

                kpc = TacfKardexProdCodiDal.Crear(rqmantenimiento, cegreso, obj.cproducto, false, obj.Mdatos["cbarras"].ToString(),
                    obj.Mdatos["serial"].ToString(), cusuarioasignado,tipomovimiento, 1, obj.vunitario.Value, costopromedio,obj.Mdatos["infoadicional"].ToString(),1309,"UIO");
                lkardexpc.Add(kpc);

                prodcodif = TacfProductoCodificadoDal.Find(obj.cproducto, obj.Mdatos["cbarras"].ToString(), obj.Mdatos["serial"].ToString());
                prodcodif.estado = 0;
                prodcodif.ubicacioncdetalle = "UIO";
                lprodcodifi.Add(prodcodif);

            }
            egreso = TacfEgresoDal.FindEgreso(cegreso);
            egreso.estadocdetalle = "EGRENT";
            legreso.Add(egreso);

            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfkardexprodcodi", lkardexpc, false);
            rqmantenimiento.AdicionarTabla("tacfproductocodificado", lprodcodifi, false);
            rqmantenimiento.AdicionarTabla("tacfegreso", legreso, false);
        }
    }
}
