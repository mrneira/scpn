using core.componente;
using dal.activosfijos;
using modelo;
using modelo.interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.egreso
{

    public class KardexProductoCodificadoFuncionarios : ComponenteMantenimiento {
        /// <summary>
        /// Clase que registra los movimientos de activos entregados a varios funcionarios.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardexproductocodificado")) {
                return;
            }
     
            var lmantenimiento = JsonConvert.DeserializeObject<List<tacfkardexprodcodi>>(rqmantenimiento.Mdatos["lregistros"].ToString());

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
                    if (l.cusuarioasignado == "CUSTODIOAF")
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
                        kpc.cusuarioasignado = kpc.Mdatos["cusuariorecibe"].ToString();
                        kpc.infoadicional = (kpc.Mdatos.ContainsKey("infoadicional")) ? kpc.Mdatos["infoadicional"].ToString() : "";
                        kpc.ubicacionccatalogo = 1309;                      
                        kpc.cusuarioing = l.cusuarioing;
                        kpc.fingreso = Convert.ToDateTime(rqmantenimiento.Mdatos["fecha"].ToString());
                        lkardex.Add(kpc);

                        prodcodif = TacfProductoCodificadoDal.Find(obj.cproducto, obj.Mdatos["cbarras"].ToString(), obj.Mdatos["serial"].ToString());
                        prodcodif.estado = 0;
                        prodcodif.cusuarioasignado = kpc.Mdatos["cusuariorecibe"].ToString();
                        prodcodif.ubicacioncdetalle = lmantenimiento.Find(x => x.cproducto == prodcodif.cproducto
                                                                        && x.cbarras == prodcodif.cbarras && x.serial == prodcodif.serial).ubicacioncdetalle;
                        prodcodif.ubicacionccatalogo = lmantenimiento.Find(x => x.cproducto == prodcodif.cproducto
                                                                        && x.cbarras == prodcodif.cbarras && x.serial == prodcodif.serial).ubicacionccatalogo;
                        lprodcodifi.Add(prodcodif);
                    }                   
                }
                 
            }                 
            rqmantenimiento.AdicionarTabla("CUSTODIOACTIVOSFUNCIONARIOS", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfproductocodificado", lprodcodifi, false);
        }
    }
}
