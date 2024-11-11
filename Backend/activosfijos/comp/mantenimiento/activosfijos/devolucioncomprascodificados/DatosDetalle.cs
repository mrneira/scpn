using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.devolucioncomprascodificados
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

            List<tacfkardexprodcodi> lkardexcodi = new List<tacfkardexprodcodi>();
            tacfkardexprodcodi kardexcodi;

            List<tacfproducto> lprod = new List<tacfproducto>();
            tacfproducto prod;
            tacfproducto prodaux = new tacfproducto();
            List<tacfproductocodificado> lprodcodi = new List<tacfproductocodificado>();
            tacfproductocodificado prodcodi = new tacfproductocodificado();
            tacfparametros p = TacfParametrosDal.FindXCodigo("USUARIO_CUSTODIO_BO", rqmantenimiento.Ccompania);
            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfproductocodificado obj in lmantenimiento)
            {

                    egrdet = new tacfegresodetalle();
                    ingdet = new tacfingresodetalle();
                    kardex = new tacfkardex();
                    kardexcodi = new tacfkardexprodcodi();
                    prodcodi = new tacfproductocodificado();

                    ingdet = TacfIngresoDetalleDal.Find(int.Parse(rqmantenimiento.Mdatos["cingreso"].ToString()));
                    ingdet.cantidaddevuelta = lmantenimiento.Count;
                    ingdet.stock -= lmantenimiento.Count;
                    lingdet.Add(ingdet);

                    prodaux = TacfProductoDal.Find(obj.cproducto);
                    vtotal = (obj.vunitario.Value * lmantenimiento.Count);
                    costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, lmantenimiento.Count, vtotal);

                    prodaux.stock -= lmantenimiento.Count;
                    lprod.Add(prodaux);

                    egrdet = TacfEgresoDetalleDal.Crear(obj.cproducto, cegreso,0, lmantenimiento.Count, obj.vunitario.Value, prodaux.stock.Value, rqmantenimiento.Cusuario, rqmantenimiento.Freal);
                    legrdet.Add(egrdet);

                    kardex = TacfKardexDal.CrearKardex(rqmantenimiento, cegreso, obj.cproducto, false, "DEVCOM", lmantenimiento.Count, obj.vunitario.Value, costopromedio, prodaux.stock.Value);
                    lkardex.Add(kardex);

                    kardexcodi = TacfKardexProdCodiDal.Crear(rqmantenimiento, cegreso, obj.cproducto, false, obj.cbarras, obj.serial, p.texto, "DEVCOM", 1, obj.vunitario.Value, prodaux.vunitario.Value, "DEVOLUCIÓN COMPRA", 1309, "BOD");
                    lkardexcodi.Add(kardexcodi);

                    prodcodi = TacfProductoCodificadoDal.FindxCproducto(obj.cproducto, obj.cbarras);
                    prodcodi.estado = 3;
                    prodcodi.cusuarioasignado = p.texto;
                    lprodcodi.Add(prodcodi);
            }

            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfegresodetalle", legrdet, false);
            rqmantenimiento.AdicionarTabla("tacfingresodetalle", lingdet, false);
            rqmantenimiento.AdicionarTabla("tacfkardeprodcodi", lkardexcodi, false);
            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lprod, false);
            rqmantenimiento.AdicionarTabla("tacfproductocodificado", lprodcodi, false);
        }

    }
}
