using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.devolucionesuministro
{

    /// <summary>
    /// Clase que se encarga de completar información del detalle de devoluciones de productos asignados a un funcionario.
    /// </summary>
    public class DatosDetalle : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            int cingreso = (int)rqmantenimiento.Mdatos["cingreso"];
            List<IBean> lmantenimiento = new List<IBean>();
            if (rqmantenimiento.GetTabla("DETALLE") != null)
            {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0)
                {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
            }

            tacfingresodetalle ingdet;
            List<tacfingresodetalle> lingdet = new List<tacfingresodetalle>();

            tacfegreso egreso;
            List<tacfegreso> legreso = new List<tacfegreso>();

            List<tacfkardex> lkardex = new List<tacfkardex>();
            tacfkardex kardex;

            List<tacfproducto> lprod = new List<tacfproducto>();
            tacfproducto prod;
            tacfproducto prodaux = new tacfproducto();

            foreach (tacfkardex obj in lmantenimiento)
            {

                    ingdet = new tacfingresodetalle();
                   
                    kardex = new tacfkardex();
                    prod = new tacfproducto();

                    egreso = new tacfegreso();
                    prodaux = TacfProductoDal.Find(obj.cproducto);

                    egreso = TacfEgresoDal.FindEgreso(obj.cmovimiento);
                    egreso.Esnuevo = false;
                    egreso.Actualizar = true;
                    egreso.estadocdetalle = "EGRDEV";
                    legreso.Add(egreso);

                    ingdet = TacfIngresoDetalleDal.Crear(obj.cantidad.Value, cingreso, obj.cproducto, rqmantenimiento.Cusuario, rqmantenimiento.Freal, 0, prodaux.stock.Value, prodaux.vunitario.Value);
                    lingdet.Add(ingdet);

                    kardex = TacfKardexDal.CrearKardex(rqmantenimiento, cingreso, obj.cproducto, true, "DEVSUM", obj.cantidad.Value, prodaux.vunitario.Value, prodaux.vunitario.Value, prodaux.stock.Value + obj.cantidad.Value);
                    lkardex.Add(kardex);

                    prod = TacfProductoDal.Find(obj.cproducto);
                    prod.stock += obj.cantidad.Value;
                    lprod.Add(prod);  
            }

            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfingresodetalle", lingdet, false);
            rqmantenimiento.AdicionarTabla("tacfegreso", legreso, false);
            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lprod, false);
        }

    }
}
