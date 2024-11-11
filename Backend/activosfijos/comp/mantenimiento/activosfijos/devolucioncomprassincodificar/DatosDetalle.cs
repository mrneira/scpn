using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.devolucioncomprassincodificar
{

    /// <summary>
    /// Clase que se encarga de completar información del detalle de una devolucion de compras.
    /// </summary>
    public class DatosDetalle : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            int cegreso = (int)rqmantenimiento.Mdatos["cegreso"];
            List<IBean> lmantenimiento = new List<IBean>();
            if (rqmantenimiento.GetTabla("DETALLE") != null)
            {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0)
                {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
            }

            tacfegresodetalle egrdet;
            List<tacfegresodetalle> legrdet = new List<tacfegresodetalle>();

            tacfingresodetalle ingdet;
            List<tacfingresodetalle> lingdet = new List<tacfingresodetalle>();
            

            List<tacfkardex> lkardex = new List<tacfkardex>();
            tacfkardex kardex;            
            List<tacfproducto> lprod = new List<tacfproducto>();
            tacfproducto prod;
            tacfproducto prodaux = new tacfproducto();
            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfingresodetalle obj in lmantenimiento)
            {
                prodaux = TacfProductoDal.Find(obj.cproducto);
                vtotal = (obj.cantidad.Value * obj.vunitario.Value);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, obj.cantidad.Value, vtotal);
                prodaux.stock -= obj.cantidad.Value;
                prodaux.vunitario = costopromedio;
                lprod.Add(prodaux);

                ingdet = new tacfingresodetalle();
                ingdet = TacfIngresoDetalleDal.FindCproducto(obj.cproducto, obj.cingreso);
                obj.Esnuevo = false;
                obj.Actualizar = true;
                ingdet.cantidaddevuelta = obj.cantidad;
                lingdet.Add(ingdet);

                egrdet = new tacfegresodetalle();

                kardex = new tacfkardex();           

                egrdet = TacfEgresoDetalleDal.Crear(obj.cproducto, cegreso, 0, obj.cantidad.Value,costopromedio, prodaux.stock.Value, rqmantenimiento.Cusuario, rqmantenimiento.Freal);
                legrdet.Add(egrdet);

                kardex = TacfKardexDal.CrearKardex(rqmantenimiento, cegreso, obj.cproducto, false, "DEVCOM", obj.cantidad.Value, obj.vunitario.Value, costopromedio, prodaux.stock.Value);
                lkardex.Add(kardex);
            }

            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfegresodetalle", legrdet, false);
            rqmantenimiento.AdicionarTabla("tacfingresodetalle", lingdet, false);
            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lprod, false);
        }

    }
}
