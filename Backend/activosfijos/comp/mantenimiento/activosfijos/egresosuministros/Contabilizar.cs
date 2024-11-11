using core.componente;
using core.servicios;
using dal.activosfijos;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.generales;
using dal.monetario;
using dal.talentohumano;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.egresosuministros {

  
    public class Contabilizar : ComponenteMantenimiento {
        /// <summary>
        /// Clase que se encarga de completar información de un comprobante contable al realizar un egreso de suministros.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.ContainsKey("generarcomprobante")){
                return;
            }
            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }

            tacfegreso egreso = (tacfegreso)rqmantenimiento.Mtablas["CABECERA"].Lregistros[0];
            List<tacfegresodetalle> lista = TacfEgresoDetalleDal.FindXCegreso(egreso.cegreso);
            List<IBean> lbase = lista.ToList<IBean>();
            List<IBean> lmantenimiento = new List<IBean>();
            List<IBean> leliminar = new List<IBean>();

            if (rqmantenimiento.GetTabla("DETALLE") != null) {
                if (rqmantenimiento.GetTabla("DETALLE").Lregistros.Count > 0) {
                    lmantenimiento = rqmantenimiento.GetTabla("DETALLE").Lregistros;
                }
                if (rqmantenimiento.GetTabla("DETALLE").Lregeliminar.Count > 0) {
                    leliminar = rqmantenimiento.GetTabla("DETALLE").Lregeliminar;
                }
            }

            List<IBean> ldetalle = DtoUtil.GetMergedList(lbase, lmantenimiento, leliminar);
            List<tacfegresodetalle> legresodetalle = new List<tacfegresodetalle>();

            string centrocostos_recibe = TthFuncionarioDal.FindXCpersona(long.Parse(egreso.cusuariorecibe)).centrocostocdetalle;
            foreach(tacfegresodetalle obj in ldetalle) {
                obj.tacfproducto = TacfProductoDal.Find(obj.cproducto);
                legresodetalle.Add(obj);
            }
            ContabilizarEgresoSuministros(rqmantenimiento, egreso, legresodetalle, centrocostos_recibe);

        }

        public static void ContabilizarEgresoSuministros(RqMantenimiento rqmantenimiento, tacfegreso egreso, List<tacfegresodetalle> legresodetalle, string centrocostos_recibe) {

            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, egreso, legresodetalle);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, legresodetalle, centrocostos_recibe);
            egreso.ccomprobante = comprobante.ccomprobante;
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.Mdatos["actualizarsaldosenlinea"] = true;
        }

        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tacfegreso egreso, List<tacfegresodetalle> lmantenimiento) {
            string ccomprobante =  Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            decimal valortotal = lmantenimiento.Sum(x => (x.cantidad * x.vunitario)).Value;
            int? cpersonarecibe =null;

            try {
                if(egreso.cusuariorecibe.Length>0)
                cpersonarecibe = int.Parse(egreso.cusuariorecibe);
            } catch (Exception ex) {
                cpersonarecibe = null;
            }

            if (egreso.comentario == null || egreso.comentario.Trim().Length == 0) {
                throw new AtlasException("ACTFIJ-006", "ERROR: EL EGRESO NO TIENE COMENTARIO ASIGNADO PARA EL COMPROBANTE CONTABLE");

            }

            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante,rqmantenimiento.Fconatable,Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                rqmantenimiento.Ccompania, 0, "PE", cpersonarecibe, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, egreso.comentario, true, true, true, false, false, false, false,
                null, 3, rqmantenimiento.Cagencia,rqmantenimiento.Csucursal, rqmantenimiento.Ctransaccion,rqmantenimiento.Cmodulo, 1003, "DIAGEN", rqmantenimiento.Cagencia, rqmantenimiento.Csucursal, valortotal, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcomprobante comprobante, 
            List<tacfegresodetalle> legresodetalle, string centrocostos_recibe) {
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;


            //Crédito a cuenta de producto y Centro costo receptor
            try {
                var ltotalporcuentacontable = legresodetalle.GroupBy(x => x.tacfproducto.ccuenta)
                                .ToDictionary(g => g.Key, g => g.Sum(v => v.cantidad * v.vunitario));
                foreach (KeyValuePair<string, decimal?> obj in ltotalporcuentacontable) {
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
            }catch(Exception ex) {
                throw new AtlasException("ACTFIJ-003", "ERROR: CUENTA CONTABLE NO DEFINIDA PARA SUMINISTROS A ENTREGAR");
            }



            //Débito al gasto centro de costo receptor
            try {
                var ltotalporcuentagasto = legresodetalle.GroupBy(x => x.tacfproducto.ccuentagasto)
                                .ToDictionary(g => g.Key, g => g.Sum(v => v.cantidad * v.vunitario));
                foreach (KeyValuePair<string, decimal?> obj in ltotalporcuentagasto) {
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
            }catch(Exception ex) {
                throw new AtlasException("ACTFIJ-004", "ERROR: CUENTA CONTABLE DE GASTO NO DEFINIDA PARA SUMINISTROS A ENTREGAR'");
            }
            
            return lcomprobantedetalle;
        }
    }
}
