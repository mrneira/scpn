using core.componente;
using core.servicios;
using dal.activosfijos;
using dal.contabilidad;
using dal.monetario;
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
    /// Clase que registra los movimientos de activos entregados a al usuario encargado de activos fijos.
    /// </summary>
    public class KardexProductoCustodioAF : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            if (!rqmantenimiento.Mdatos.ContainsKey("kardexproductocodificado")) {
                return;
            }

            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0)
            {
                return;
            }

            tacfparametros p = TacfParametrosDal.FindXCodigo("USUARIO_CUSTODIO_AF", rqmantenimiento.Ccompania);
            int cegreso = int.Parse(Secuencia.GetProximovalor("AFEGRESO").ToString());
            tacfegreso egreso = (tacfegreso)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            egreso.cegreso = cegreso;
            egreso.cusuarioing = rqmantenimiento.Cusuario;
            egreso.fingreso = rqmantenimiento.Freal;
            egreso.cusuariorecibe = p.texto;
            List<IBean> lmantenimiento = new List<IBean>();
            List<tacfegresodetalle> legresodetalle = new List<tacfegresodetalle>();
            lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
            string tipomovimiento = rqmantenimiento.Mdatos["tipomovimiento"].ToString();
            List<tacfkardexprodcodi> lkardexpc = new List<tacfkardexprodcodi>();
            List<tacfproductocodificado> lprodcodifi = new List<tacfproductocodificado>();
            List<tacfproducto> lproducto = new List<tacfproducto>();
            List<tacfkardex> lkardex = new List<tacfkardex>();
            tacfkardex kardex;
            tacfproducto producto;
            tacfkardexprodcodi kpc = new tacfkardexprodcodi();
            tacfproductocodificado prodcodif;
            tacfegresodetalle egresodetalle;
            decimal costopromedio = 0;
            decimal vtotal = 0;
            foreach (tacfegresodetalle obj in lmantenimiento) {
                kpc = new tacfkardexprodcodi();
                prodcodif = TacfProductoCodificadoDal.Find(obj.cproducto, obj.Mdatos["cbarras"].ToString(), obj.Mdatos["serial"].ToString());
                prodcodif.cusuarioasignado = p.texto;
                kardex = new tacfkardex();
                producto = TacfProductoDal.Find(obj.cproducto);

                vtotal = (producto.vunitario.Value * lmantenimiento.Count);
                costopromedio = TacfProductoDal.CalcularCostoPromedio(obj.cproducto, lmantenimiento.Count, vtotal);
                egresodetalle = new tacfegresodetalle();

                egresodetalle = legresodetalle.Find(x => x.cproducto == obj.cproducto) ;
                if (egresodetalle != null)
                {
                    legresodetalle.Find(x => x.cproducto == obj.cproducto).cantidad += 1;
                    legresodetalle.Find(x => x.cproducto == obj.cproducto).stock -= 1;
                    lkardex.Find(x => x.cproducto == obj.cproducto).cantidad += 1;
                    lkardex.Find(x => x.cproducto == obj.cproducto).stock -= 1;
                    lproducto.Find(x => x.cproducto == obj.cproducto).stock -= 1;
                }
                else
                {
                    egresodetalle = new tacfegresodetalle();
                    egresodetalle.cegreso = cegreso;
                    egresodetalle.cproducto = obj.cproducto;
                    egresodetalle.cusuarioing = rqmantenimiento.Cusuario;
                    egresodetalle.fingreso = rqmantenimiento.Freal;
                    egresodetalle.optlock = 0;
                    egresodetalle.vunitario = producto.vunitario.Value;
                    egresodetalle.stock = producto.stock-1;
                    egresodetalle.cantidad = 1;
                    producto.stock -= 1;

                    kardex = TacfKardexDal.Crear(rqmantenimiento, cegreso, obj.cproducto, false, "ENTREG", 1, producto.vunitario.Value, costopromedio, producto.stock.Value, Convert.ToDateTime(rqmantenimiento.Mdatos["fecha"].ToString()));

                    lkardex.Add(kardex);
                    legresodetalle.Add(egresodetalle);
                    lproducto.Add(producto);
                }
               
                kpc = TacfKardexProdCodiDal.Crear(rqmantenimiento, cegreso, obj.cproducto, false, obj.Mdatos["cbarras"].ToString(),
                    obj.Mdatos["serial"].ToString(), p.texto,tipomovimiento, 1, obj.vunitario.Value, producto.vunitario.Value, "", 1309, "UIO");
                lkardexpc.Add(kpc);
                lprodcodifi.Add(prodcodif);
            }
            
            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tacfegresodetalle", legresodetalle, false);
            rqmantenimiento.AdicionarTabla("tacfkardex", lkardex, false);
            rqmantenimiento.AdicionarTabla("tacfkardexprodcodi", lkardexpc, false);
            rqmantenimiento.AdicionarTabla("tacfproductocodificado", lprodcodifi, false);
            rqmantenimiento.AdicionarTabla("tacfproducto", lproducto, false);
            rqmantenimiento.Response["cegreso"] = cegreso;

            List<tacfegresodetalle> ldetalle = new List<tacfegresodetalle>();

            string centrocostos_recibe = TconParametrosDal.FindXCodigo("CENTROCOSTOS_DEFAULT",1).texto;


            foreach (tacfegresodetalle obj in lmantenimiento)
            {
                obj.tacfproducto = TacfProductoDal.Find(obj.cproducto);
                if(obj.tacfproducto.ctipoproducto == 2 && obj.tacfproducto.vunitario > 0)
                {
                    ldetalle.Add(obj);
                }               
            }
            if(ldetalle.Count == 0)
            {
                return;
            }
            else
            {
                ContabilizarEgresoSuministros(rqmantenimiento, egreso, ldetalle, centrocostos_recibe);

            }

        }

        public static void ContabilizarEgresoSuministros(RqMantenimiento rqmantenimiento, tacfegreso egreso, List<tacfegresodetalle> ldetalle, string centrocostos_recibe)
        {

            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, egreso, ldetalle);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, ldetalle, centrocostos_recibe);
            egreso.ccomprobante = comprobante.ccomprobante;
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.Mdatos["actualizarsaldosenlinea"] = true;
        }

        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tacfegreso egreso, List<tacfegresodetalle> lmantenimiento)
        {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            decimal valortotal = lmantenimiento.Sum(x => (1 * x.vunitario)).Value;
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                rqmantenimiento.Ccompania, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, egreso.comentario, true, true, true, false, false, false, false,
                null, 3, rqmantenimiento.Cagencia, rqmantenimiento.Csucursal, rqmantenimiento.Ctransaccion, rqmantenimiento.Cmodulo, 1003, "DIAGEN", rqmantenimiento.Cagencia, rqmantenimiento.Csucursal, valortotal, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcomprobante comprobante,
            List<tacfegresodetalle> ldetalle, string centrocostos_recibe)
        {
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;


            //Crédito a cuenta de producto y Centro costo receptor
            try
            {
                var ltotalporcuentacontable = ldetalle.GroupBy(x => x.tacfproducto.ccuenta)
                                .ToDictionary(g => g.Key, g => g.Sum(v => 1 * v.vunitario));
                foreach (KeyValuePair<string, decimal?> obj in ltotalporcuentacontable)
                {
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, obj.Key, false, null,
                        "USD", "USD", 0, 0, null, null, 1002, centrocostos_recibe, null, null);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    cd.monto = obj.Value;
                    cd.montooficial = cd.monto;
                    lcomprobantedetalle.Add(cd);
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                }
            }
            catch (Exception ex)
            {
                throw new AtlasException("ACTFIJ-003", "ERROR: CUENTA CONTABLE NO DEFINIDA PARA SUMINISTROS A ENTREGAR");
            }



            //Débito al gasto centro de costo receptor
            try
            {
                var ltotalporcuentagasto = ldetalle.GroupBy(x => x.tacfproducto.ccuentagasto)
                                .ToDictionary(g => g.Key, g => g.Sum(v => 1 * v.vunitario));
                foreach (KeyValuePair<string, decimal?> obj in ltotalporcuentagasto)
                {
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, obj.Key, true, null,
                        "USD", "USD", 0, 0, null, null, 1002, centrocostos_recibe, null, null);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    cd.monto = obj.Value;
                    cd.montooficial = cd.monto;
                    lcomprobantedetalle.Add(cd);
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                }
            }
            catch (Exception ex)
            {
                throw new AtlasException("ACTFIJ-004", "ERROR: CUENTA CONTABLE DE GASTO NO DEFINIDA PARA SUMINISTROS A ENTREGAR'");
            }

            return lcomprobantedetalle;
        }

    }

    
}
