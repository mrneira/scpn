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
    /// Clase que se encarga de registrar el código de barras y numero de serie de los productos ingresados
    /// </summary>
    public class CodificarProducto : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            bool codificado = bool.Parse(rqmantenimiento.Mdatos["codificado"].ToString());

            int cingreso = int.Parse(rqmantenimiento.Mdatos["cingreso"].ToString());
            bool salir = false;
            tacfingreso ingreso = TacfIngresoDal.FindIngreso(cingreso);
            if (rqmantenimiento.GetTabla("AF_PRODUCTOCODIFICADO") == null)
            {
                salir = true;
            }

            if (codificado)
            {

                ingreso.estadoingresocdetalle = "CODIFI";
                ingreso.codificado = true;
                //rqmantenimiento.AdicionarTabla("tacfproductocodificado", lproductos, false);
                if (salir) {
                    return;
                }

            }

            List<IBean> lmantenimiento = new List<IBean>();
            lmantenimiento = rqmantenimiento.GetTabla("AF_PRODUCTOCODIFICADO").Lregistros;


            List<tacfproductocodificado> lproductos = new List<tacfproductocodificado>();
            tacfproductocodificado pc = new tacfproductocodificado();
            List<tacfkardexprodcodi> lkpc = new List<tacfkardexprodcodi>();
            tacfkardexprodcodi kpc = new tacfkardexprodcodi();
            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfproductocodificado obj in lmantenimiento)
            {


                if (obj.Esnuevo)
                {
                    pc.Esnuevo = true;
                    pc.Actualizar = false;
                    pc.fingreso = rqmantenimiento.Freal;
                    pc.cusuarioing = rqmantenimiento.Cusuario;
                }
                else
                {
                    pc.Esnuevo = false;
                    pc.Actualizar = true;
                    pc.cusuariomod = rqmantenimiento.Cusuario;
                    pc.fmodificacion = rqmantenimiento.Freal;
                }
                lproductos.Add(obj);

                tacfparametros p = TacfParametrosDal.FindXCodigo("USUARIO_CUSTODIO_BO", rqmantenimiento.Ccompania);
                tacfproducto prod = TacfProductoDal.Find(obj.cproducto);

                vtotal = (obj.vunitario.Value * 1);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, 1, vtotal);

                kpc = new tacfkardexprodcodi();
                kpc.Esnuevo = true;
                kpc.serial = obj.serial;
                kpc.cbarras = obj.cbarras;
                kpc.cproducto = obj.cproducto;
                kpc.esingreso = true;
                kpc.tipomovimiento = "INGRES";
                kpc.cmovimiento = cingreso;
                kpc.cantidad = 1;
                kpc.vunitario = obj.vunitario.Value;
                kpc.costopromedio = costopromedio;
                kpc.cusuarioasignado = p.texto;
                kpc.infoadicional = "";
                kpc.ubicacionccatalogo = 1309;
                kpc.ubicacioncdetalle = obj.ubicacioncdetalle;
                kpc.cusuarioing = rqmantenimiento.Cusuario;
                kpc.fingreso = rqmantenimiento.Freal;
                lkpc.Add(kpc);

            }

            
            rqmantenimiento.Mtablas["CABECERA"] = null;
            ingreso.memocodificacion = rqmantenimiento.Mdatos["memocodificacion"].ToString();
            ingreso.Actualizar = true;
            ingreso.Esnuevo = false;
            

            rqmantenimiento.AdicionarTabla("tacfingreso", ingreso, false);

            //rqmantenimiento.AdicionarTabla("tacfkardexprodcodi", lkpc, false);

        }
    }
}
