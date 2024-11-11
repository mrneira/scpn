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

namespace activosfijos.comp.mantenimiento.activosfijos.devolucionesuministro {

   
    public class Contabilizar : ComponenteMantenimiento {
        /// <summary>
        /// Clase que se encarga de un comprobante contable al realizar una devolucion de suministros.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.ContainsKey("generarcomprobante")) {
                return;
            }
            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }
            tacfingreso ingreso = null;      
            if (rqmantenimiento.Mtablas.ContainsKey("TACFINGRESO"))
            {
                ingreso = (tacfingreso)rqmantenimiento.Mtablas["TACFINGRESO"].Registro;
            }

            List<IBean> lmantenimiento = rqmantenimiento.GetTabla("TACFINGRESODETALLE").Lregistros;
            List<tacfingresodetalle> lingresodetalle = new List<tacfingresodetalle>();
            
            string centrocostos_recibe = rqmantenimiento.Mdatos["centrocostos_recibe"].ToString();
            foreach(tacfingresodetalle obj in lmantenimiento) {
                obj.tacfproducto = TacfProductoDal.Find(obj.cproducto);
                lingresodetalle.Add(obj);
            }
            ContabilizarEgresoSuministros(rqmantenimiento, ingreso, lingresodetalle, centrocostos_recibe);

        }

        public static void ContabilizarEgresoSuministros(RqMantenimiento rqmantenimiento, tacfingreso ingreso, List<tacfingresodetalle> lingresodetalle, string centrocostos_recibe) {
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, ingreso, lingresodetalle);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, lingresodetalle, centrocostos_recibe);

            ingreso.ccomprobante = comprobante.ccomprobante;
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.Mdatos["actualizarsaldosenlinea"] = true;
        }

        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tacfingreso ingreso, List<tacfingresodetalle> lmantenimiento) {
            string ccomprobante =  Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            decimal valortotal = lmantenimiento.Sum(x => (x.cantidad * x.vunitario)).Value;
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante,rqmantenimiento.Fconatable,Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                rqmantenimiento.Ccompania, 0, null, null, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, ingreso.comentario, true, true,true, false, false, false, false,
                null, 3, rqmantenimiento.Cagencia,rqmantenimiento.Csucursal, rqmantenimiento.Ctransaccion,rqmantenimiento.Cmodulo, 1003, "DIAGEN", rqmantenimiento.Cagencia, rqmantenimiento.Csucursal, valortotal, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
            comprobante.Esnuevo = true;
            return comprobante;
        }

        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcomprobante comprobante, 
            List<tacfingresodetalle> lingresodetalle, string centrocostos_recibe) {
            List<tconcomprobantedetalle> lcomprobantedetalle = new List<tconcomprobantedetalle>();
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
  

            //Debito a cuenta de producto y centro_costos_recibe 
            try {
                var ltotalporcuentacontable = lingresodetalle.GroupBy(x => x.tacfproducto.ccuenta)
                                .ToDictionary(g => g.Key, g => g.Sum(v => v.cantidad * v.vunitario));
                foreach (KeyValuePair<string, decimal?> obj in ltotalporcuentacontable) {
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
                throw new AtlasException("ACTFIJ-003", "ERROR: CUENTA CONTABLE NO DEFINIDA PARA SUMINISTROS A DEVOLVER");
            }



            //Crédito al gasto centro_costos_recibe
            try {
                var ltotalporcuentagasto = lingresodetalle.GroupBy(x => x.tacfproducto.ccuentagasto)
                                .ToDictionary(g => g.Key, g => g.Sum(v => v.cantidad * v.vunitario));
                foreach (KeyValuePair<string, decimal?> obj in ltotalporcuentagasto) {
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
                throw new AtlasException("ACTFIJ-004", "ERROR: CUENTA CONTABLE DE GASTO NO DEFINIDA PARA SUMINISTROS A DEVOLVER'");
            }
           
            return lcomprobantedetalle;
        }
    }
}
