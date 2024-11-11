using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.contabilidad.cuentasporpagar.liquidacionviaticos;
using dal.facturacionelectronica;
using dal.generales;
using dal.monetario;
using dal.prestaciones;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar.liquidacionviaticos {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class Contabilizar : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }

            tconliquidaciongastos liq = new tconliquidaciongastos();
            if (rqmantenimiento.GetTabla("CABECERA").Lregistros.Count > 0) {
                liq = (tconliquidaciongastos)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            }
            ContabilizarLiquidacion(rqmantenimiento, liq);

        }


        /// <summary>
        /// contabilizar la cuenta por pagar
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        public static void ContabilizarLiquidacion(RqMantenimiento rqmantenimiento, tconliquidaciongastos liq) {
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, liq);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, liq, comprobante);
            liq.ccomprobante = comprobante.ccomprobante;
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            //rqmantenimiento.Mdatos["actualizarsaldosenlinea"] = true;
        }


        /// <summary>
        /// completar comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tconliquidaciongastos liq) {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                rqmantenimiento.Ccompania, 0, "PE", liq.cpersona, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, liq.comentario, true, true, false, false, false,true, false,
                null, 3, 1,1, 34, 10, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);

            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.Esnuevo = true;
            return comprobante;
        }


        /// <summary>
        /// completar comprobante contable detalle
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        /// <param name="comprobante"></param>
        /// <param name="plantillaDetalle"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconliquidaciongastos liq,
            tconcomprobante comprobante) {
            decimal valorCampo = 0, sumatorioDebitos = 0;
            List<IBean> lmantenimiento = new List<IBean>(); ;
            List<tconliqgastosdetalle> ldetalle = new List<tconliqgastosdetalle>();
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();
            tconliqgastosdetalle detalle = new tconliqgastosdetalle();

            ldetalle = TconLiqGastosDetalleDal.Find(liq.cliquidaciongastos, rqmantenimiento.Ccompania);

            var result = from s in ldetalle
            group s by new {s.tipo, s.ccuenta, s.cpartida} into g
            select new { g.Key.tipo, g.Key.ccuenta, g.Key.cpartida, valor = g.Sum(s => s.valorvalido)};


            foreach (var item in result) {
                if (item.tipo == "VIATICOS") {
                    if (liq.valorpagar != 0) {
                        tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, "", item.ccuenta, true, null,
                            "USD", "USD", 0, 0, null, null, liq.centrocostosccatalogo, liq.centrocostoscdetalle, null, item.cpartida);
                        cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                        cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                        valorCampo = liq.valorpagar;
                        cd.monto = valorCampo;
                        cd.montooficial = valorCampo;
                        comprobanteDetalle.Add(cd);
                        sumatorioDebitos += cd.monto.Value;
                    }
                } else {
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, "", item.ccuenta, true, null,
                        "USD", "USD", 0, 0, null, null, liq.centrocostosccatalogo, liq.centrocostoscdetalle, null, item.cpartida);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    valorCampo = item.valor;
                    cd.monto = valorCampo;
                    cd.montooficial = valorCampo;
                    comprobanteDetalle.Add(cd);
                    sumatorioDebitos += cd.monto.Value;
                }

            }

            //if (liq.valortransporte != 0) {
            //    detalle = ldetalle.Where(x => x.tipo == "TRANSPORTE").FirstOrDefault();
            //    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, liq.ccompromiso, detalle.ccuenta, true, null,
            //        "USD", "USD", 0, 0, null, null, liq.centrocostosccatalogo, liq.centrocostoscdetalle, null, detalle.cpartida);
            //    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
            //    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
            //    valorCampo = liq.valortransporte;
            //    cd.monto = valorCampo;
            //    cd.montooficial = valorCampo;
            //    comprobanteDetalle.Add(cd);
            //    sumatorioDebitos += cd.monto.Value;

            //}

            //if (liq.valorpagar != 0) {
            //    detalle = ldetalle.Where(x => x.tipo == "VIATICOS").FirstOrDefault();
            //    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, liq.ccompromiso, detalle.ccuenta, true, null,
            //        "USD", "USD", 0, 0, null, null, liq.centrocostosccatalogo, liq.centrocostoscdetalle, null, detalle.cpartida);
            //    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
            //    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
            //    valorCampo = liq.valorpagar;
            //    cd.monto = valorCampo;
            //    cd.montooficial = valorCampo;
            //    comprobanteDetalle.Add(cd);
            //    sumatorioDebitos += cd.monto.Value;
            //}

            string cuenta_spi = (TconParametrosDal.FindXCodigo("CUENTA_ADF_SPI", rqmantenimiento.Ccompania)).texto;
            tconcomprobantedetalle cdh = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, cuenta_spi, false, null,
                "USD", "USD", 0, 0, null, null, liq.centrocostosccatalogo, liq.centrocostoscdetalle, null, "");
            cdh.cclase = TconCatalogoDal.Find(comprobante.ccompania, cdh.ccuenta).cclase;
            cdh.suma = TmonClaseDal.Suma(cdh.cclase, cdh.debito);
            valorCampo = sumatorioDebitos;
            cdh.monto = valorCampo;
            cdh.montooficial = valorCampo;
            comprobanteDetalle.Add(cdh);
            comprobante.montocomprobante = sumatorioDebitos;
            return comprobanteDetalle;
        }

        

        
    }
}
