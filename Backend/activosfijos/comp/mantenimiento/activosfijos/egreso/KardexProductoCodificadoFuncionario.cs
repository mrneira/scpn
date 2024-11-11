using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.egreso
{

    /// <summary>
    /// Clase que registra los movimientos de activos entregados a un funcionario.
    /// </summary>
    public class KardexProductoCodificadoFuncionario : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardexproductocodificado")) {
                return;
            }
            List<IBean> lmantenimiento = new List<IBean>();
            lmantenimiento = rqmantenimiento.GetTabla("CUSTODIOACTIVOSFUNCIONARIO").Lregistros;
            string cusuarioasignado = rqmantenimiento.Mdatos["cusuarioasignado"].ToString();

            List<tacfkardexprodcodi> lkardexpc = new List<tacfkardexprodcodi>();

            
            List<tacfkardexprodcodi> lkardex = new List<tacfkardexprodcodi>();

            List<tacfproductocodificado> lprodcodifi = new List<tacfproductocodificado>();
            tacfproductocodificado prodcodif;

            foreach (tacfkardexprodcodi obj in lmantenimiento) {
                tacfkardexprodcodi kpc = new tacfkardexprodcodi();
                
                kpc = obj;
                lkardexpc = TacfKardexProdCodiDal.Find(obj.cproducto, obj.Mdatos["cbarras"].ToString(), obj.Mdatos["serial"].ToString());


                foreach (tacfkardexprodcodi l in lkardexpc)
                {


                    if ( l.cusuarioasignado == "CUSTODIOAF")
                    {
                        prodcodif = new tacfproductocodificado();

                        kpc.Esnuevo = false;
                        kpc.Actualizar = true;
                        kpc.ckardexprodcodi = l.ckardexprodcodi;
                        kpc.esingreso = l.esingreso;
                        kpc.tipomovimiento = l.tipomovimiento;
                        kpc.devuelto = l.devuelto;
                        kpc.cmovimiento = l.cmovimiento;
                        kpc.cantidad = l.cantidad;
                        kpc.vunitario = l.vunitario;
                        kpc.costopromedio = l.costopromedio;
                        kpc.cusuarioasignado = rqmantenimiento.Mdatos["cusuarioasignado"].ToString();
                        kpc.infoadicional = (kpc.Mdatos.ContainsKey("infoadicional")) ? kpc.Mdatos["infoadicional"].ToString() : "";
                        kpc.ubicacionccatalogo = int.Parse(rqmantenimiento.Mdatos["ubicacionccatalogo"].ToString());
                        kpc.ubicacioncdetalle = rqmantenimiento.Mdatos["ubicacioncdetalle"].ToString();
                        kpc.cusuarioing = l.cusuarioing;
                        kpc.fingreso = Convert.ToDateTime(rqmantenimiento.Mdatos["fecha"].ToString());
                        lkardex.Add(kpc);

                        prodcodif = TacfProductoCodificadoDal.Find(obj.cproducto, obj.Mdatos["cbarras"].ToString(), obj.Mdatos["serial"].ToString());
                        prodcodif.estado = 0;
                        prodcodif.cusuarioasignado = rqmantenimiento.Mdatos["cusuarioasignado"].ToString();
                        prodcodif.ubicacioncdetalle = rqmantenimiento.Mdatos["ubicacioncdetalle"].ToString();
                        lprodcodifi.Add(prodcodif);
                    }
                    

                   

                }

            }                 
            rqmantenimiento.AdicionarTabla("CUSTODIOACTIVOSFUNCIONARIO", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproductocodificado", lprodcodifi, false);

        }
    }
}
