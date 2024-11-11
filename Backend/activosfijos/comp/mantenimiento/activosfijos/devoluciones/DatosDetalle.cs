using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.devoluciones
{

    /// <summary>
    /// Clase que se encarga de completar información del detalle de devoluciones de productos asignados a un funcionario.
    /// </summary>
    public class DatosDetalle : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
     
            int cingreso = (int)rqmantenimiento.Mdatos["cingreso"];
            int cegreso = (int)rqmantenimiento.Mdatos["cegreso"];

            List <IBean> lmantenimiento = new List<IBean>();
            if (rqmantenimiento.GetTabla("DETALLE") != null)
            {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0)
                {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
            }

            tacfingresodetalle ingdet;
            List<tacfingresodetalle> lingdet = new List<tacfingresodetalle>();

            tacfegresodetalle egredet;
            List<tacfegresodetalle> legredet = new List<tacfegresodetalle>();

            tacfkardexprodcodi karprocod ;
            List<tacfkardexprodcodi> lkarprocod = new List<tacfkardexprodcodi>();

            tacfkardexprodcodi karprocodactualiza;
            List<tacfkardexprodcodi> lkarprocodactualiza = new List<tacfkardexprodcodi>();

            tacfkardexprodcodi karprocodegreso;
            List<tacfkardexprodcodi> lkarprocodegreso = new List<tacfkardexprodcodi>();

            List<tacfkardex> lkardex = new List<tacfkardex>();
            tacfkardex kardex ;

            List<tacfkardex> lkardexegreso = new List<tacfkardex>();
            tacfkardex kardexegreso;

            List<tacfproducto> lprod = new List<tacfproducto>();
            tacfproducto prod ;

            List<tacfproductocodificado> lprodcodifi = new List<tacfproductocodificado>();
            tacfproductocodificado prodcodif;

            tacfproducto prodaux = new tacfproducto();
            

            foreach (tacfkardexprodcodi obj in lmantenimiento)
            {


                if ((bool)obj.Mdatos["seleccionado"])
                {
                    ingdet = new tacfingresodetalle();
                    egredet = new tacfegresodetalle();
                    karprocod = new tacfkardexprodcodi();
                    karprocodactualiza = new tacfkardexprodcodi();
                    karprocodegreso = new tacfkardexprodcodi();
                    kardex = new tacfkardex();
                    kardexegreso = new tacfkardex();
                    prod = new tacfproducto();
                    prodcodif = new tacfproductocodificado();
                    prodaux = TacfProductoDal.Find(obj.cproducto);

                    lprod.Add(prodaux);

                    int pkckardexprodcodi = int.Parse((obj.ckardexprodcodi).ToString());
                    
                    karprocodactualiza = TacfKardexProdCodiDal.Find(pkckardexprodcodi);
                    karprocodactualiza.Esnuevo = false;
                    karprocodactualiza.Actualizar = true;
                    karprocodactualiza.devuelto = true;
                    lkarprocodactualiza.Add(karprocodactualiza);

                    prodcodif = TacfProductoCodificadoDal.Find(obj.cproducto, obj.cbarras, obj.serial);
                    prodcodif.estado = 1;
                    prodcodif.cusuarioasignado = "CUSTODIOAF";
                    prodcodif.ubicacioncdetalle = "UIO";
                    lprodcodifi.Add(prodcodif);

                  
                    ingdet = TacfIngresoDetalleDal.Crear(1, cingreso, obj.cproducto, rqmantenimiento.Cusuario, rqmantenimiento.Freal, 0, prodaux.stock.Value, prodaux.vunitario.Value);
                    lingdet.Add(ingdet);
                  
                    karprocod = TacfKardexProdCodiDal.Crear(rqmantenimiento, cingreso, obj.cproducto, true, obj.cbarras.ToString(),
                                                    obj.serial.ToString(),"BODEGA", "DEVFUN",  1, prodaux.vunitario.Value, prodaux.vunitario.Value,  obj.infoadicional,1309,"UIO");
                    
                    lkarprocod.Add(karprocod);


                    egredet = TacfEgresoDetalleDal.Crear(obj.cproducto, cegreso, 0, 1, prodaux.vunitario.Value, prodaux.stock.Value-1, rqmantenimiento.Cusuario, rqmantenimiento.Freal);
                    legredet.Add(egredet);

                    karprocod = TacfKardexProdCodiDal.CrearDevolucion(rqmantenimiento, cegreso, obj.cproducto, false, obj.cbarras.ToString(), obj.serial.ToString(), "CUSTODIOAF", "ENTREG", 1, obj.vunitario.Value,
                                       prodaux.vunitario.Value, prodaux.stock.Value-1, obj.infoadicional, 1309, "UIO");
                    lkarprocod.Add(karprocod);

                }
            }

            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfkardexprodcodi", lkarprocodactualiza, false);
            rqmantenimiento.AdicionarTabla("tacfingresodetalle", lingdet, false);
            rqmantenimiento.AdicionarTabla("tacfkardexprodcodi", lkarprocod, false);
            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tafegresodetalle", legredet, false);
            rqmantenimiento.AdicionarTabla("tacfproductocodificado", lprodcodifi, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lprod, false);
        }

    }
}
