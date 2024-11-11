using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.facturacionelectronica;
using dal.generales;
using dal.monetario;
using facturacionelectronica.comp.consulta.entidades;
using modelo;
using modelo.interfaces;
//using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporpagar {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class Contabilizar : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }

            tconcuentaporpagar cxp = new tconcuentaporpagar();
            if (rqmantenimiento.GetTabla("CABECERA").Lregistros.Count > 0) {
                cxp = (tconcuentaporpagar)rqmantenimiento.GetTabla("CABECERA").Lregistros[0];
            }
            ContabilizarCxP(rqmantenimiento, cxp);

        }


        /// <summary>
        /// contabilizar la cuenta por pagar
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        public static void ContabilizarCxP(RqMantenimiento rqmantenimiento, tconcuentaporpagar cxp) {
            if (cxp.cplantilla != null) {
                List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cxp.cplantilla.Value, cxp.ccompania.Value);
                tconcomprobante comprobante = CompletarComprobante(rqmantenimiento,cxp);
                List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, cxp, comprobante, plantillaDetalle);
                cxp.ccompcontable = comprobante.ccomprobante;
                rqmantenimiento.Response["cctaporpagar"] = cxp.cctaporpagar;
                rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
                rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
                rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
                rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            }
            cxp.Actualizar = true;
            cxp.cusuarioautorizacion = rqmantenimiento.Cusuario;
            cxp.fautorizacion = rqmantenimiento.Freal;
            cxp.estadocxpcdetalle = "CONTAB";
        }


        /// <summary>
        /// completar comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tconcuentaporpagar cxp) {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                cxp.ccompania.Value, 0, "PR", cxp.cpersona, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, cxp.comentario, true, true, false, false, false, cxp.ruteopresupuesto, false,
                cxp.cplantilla, 3, 1,1, 21, 10, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
                null, null, null, null, null, null, rqmantenimiento.Cusuario, rqmantenimiento.Freal, null, null);
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
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcuentaporpagar cxp,
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle) {
            decimal valorCampo = 0, sumatorioDebitos = 0, sumatorioCreditos = 0; 
            string centrocostoscdetalle = "";
            //int centrocostosccatalogo = 0;
            string cuentaproveedor = "";
            bool contribuyenteespecial = (bool)rqmantenimiento.Mdatos["contribuyenteespecial"];
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            //Detalle para base imponible
            tconplantilladetalle pd = plantillaDetalle.Find(x => x.campotablacdetalle.Equals("C2") && x.ccuenta.Equals(cxp.ccuentaafectacion));
            if (pd == null)
                throw new AtlasException("CONTA-012", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            else {
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd.ccuenta , pd.debito.Value, null,
                    "USD", "USD", 0, 0, null, null,cxp.centrocostosccatalogo,cxp.centrocostoscdetalle, null, pd.cpartida);
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                valorCampo = Math.Round(cxp.baseimponible.Value,2);
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }

            //Detalle para montoiva
            pd = plantillaDetalle.Find(x => x.campotablacdetalle.Equals("C3"));
            if (pd == null)
                throw new AtlasException("CONTA-012", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            else {
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd.ccuenta, pd.debito, null,
                    "USD", "USD", 0, 0, null, null, cxp.centrocostosccatalogo, cxp.centrocostoscdetalle, null, pd.cpartida);

                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                valorCampo =  Math.Round(cxp.montoiva.Value,2);
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                if(cd.montooficial>0)
                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }

            //Detalle para cuenta proveedor
            List<tconplantilladetalle> lpd = new List<tconplantilladetalle>();
            lpd = plantillaDetalle.Where(x => x.campotablacdetalle.Equals("C11")).ToList();
            if (lpd == null)
                throw new AtlasException("CONTA-012", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            else {
                foreach (tconplantilladetalle objpd in lpd) {
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, objpd.ccuenta, objpd.debito, null,
                        "USD", "USD", 0, 0, null, null, cxp.centrocostosccatalogo, cxp.centrocostoscdetalle, null, objpd.cpartida);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    valorCampo = Math.Round(cxp.valorpagar.Value,2);
                    cd.monto = valorCampo;
                    cd.montooficial = valorCampo;
                    comprobanteDetalle.Add(cd);
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                }
            }

            //Detalle para multas
            if (cxp.valormulta != 0) {
                pd = plantillaDetalle.Find(x => x.campotablacdetalle.Equals("C13"));
                if (pd == null)
                    throw new AtlasException("CONTA-012", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
                else {
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd.ccuenta, pd.debito, null,
                        "USD", "USD", 0, 0, null, null, cxp.centrocostosccatalogo, cxp.centrocostoscdetalle, null, pd.cpartida);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    valorCampo = Math.Round(cxp.valormulta.Value,2);
                    cd.monto = valorCampo;
                    cd.montooficial = valorCampo;
                    comprobanteDetalle.Add(cd);
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                }
            }
            //Nota de credito tame
            if (cxp.valornotascredito != 0) {
                pd = plantillaDetalle.Find(x => x.campotablacdetalle.Equals("C14"));
                if (pd == null)
                    throw new AtlasException("CONTA-012", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
                else {
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd.ccuenta, pd.debito, null,
                        "USD", "USD", 0, 0, null, null, cxp.centrocostosccatalogo, cxp.centrocostoscdetalle, null, pd.cpartida);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    valorCampo = Math.Round(cxp.valornotascredito.Value, 2);
                    cd.monto = valorCampo;
                    cd.montooficial = valorCampo;
                    comprobanteDetalle.Add(cd);
                    // afecta a la cuenta 1290901001 resta la sumatoria de debitos.
                    if (!cd.debito.Value) sumatorioDebitos -= cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                }
            }
            //Detalle para retenciones IVA

            if (!cxp.exentoretencion.Value)
            {
                if (!contribuyenteespecial)
                {
                    foreach (tconplantilladetalle pd2 in plantillaDetalle)
                    {
                        if (!pd2.campotablacdetalle.Equals("C10"))
                        {
                            continue;
                        }
                        tconcatalogo cuentacontable = TconCatalogoDal.Find(rqmantenimiento.Ccompania, pd2.ccuenta);
                        //Retenciones para IVA Bienes
                        if ( cxp.valorretbienes !=null && cxp.valorretbienes.Value != 0)
                        {
                            tgencatalogodetalle catdet = TgenCatalogoDetalleDal.Find(1006, cxp.porretbienescdetalle);
                            if (cuentacontable.nombre.Contains((catdet.nombre)))
                            {
                                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd2.ccuenta, pd2.debito, null,
                                    "USD", "USD", 0, 0, null, null, cxp.centrocostosccatalogo, cxp.centrocostoscdetalle, null, pd2.cpartida);
                                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                                valorCampo = Math.Round(cxp.valorretbienes.Value, 2);
                                cd.monto = valorCampo;
                                cd.montooficial = valorCampo;
                                comprobanteDetalle.Add(cd);
                                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                                else sumatorioCreditos += cd.monto.Value;
                            }
                        }
                        //Retenciones para IVA Servicios
                        if (cxp.valorretservicios!=null && cxp.valorretservicios.Value != 0)
                        {
                            tgencatalogodetalle catdet = TgenCatalogoDetalleDal.Find(1004, cxp.porretservicioscdetalle);
                            if (cuentacontable.nombre.Contains((catdet.nombre)))
                            {
                                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd2.ccuenta, pd2.debito, null,
                                    "USD", "USD", 0, 0, null, null, cxp.centrocostosccatalogo, cxp.centrocostoscdetalle, null, pd2.cpartida);
                                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                                valorCampo = Math.Round(cxp.valorretservicios.Value, 2);
                                cd.monto = valorCampo;
                                cd.montooficial = valorCampo;
                                comprobanteDetalle.Add(cd);
                                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                                else sumatorioCreditos += cd.monto.Value;
                            }
                        }
                    }
                }

                List<tconretencionfuente> listaRetencionesFuente = new List<tconretencionfuente>();
                listaRetencionesFuente = TconRetencionFuenteDal.Find(cxp.cctaporpagar);
                decimal totalretencion = 0;
                foreach (tconretencionfuente rf in listaRetencionesFuente)
                {
                    if (rf.tconretencionair.ccuenta == null)
                    {
                        continue;
                    }
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, rf.tconretencionair.ccuenta, false, null,
                        "USD", "USD", 0, 0, null, null, cxp.centrocostosccatalogo, cxp.centrocostoscdetalle, null, null);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    try
                    {
                        valorCampo = Math.Round(rf.valretair.Value, 2);
                    }
                    catch (Exception ex)
                    {
                        valorCampo = 0;
                    }
                    cd.monto += valorCampo;
                    cd.montooficial += valorCampo;
                    totalretencion = valorCampo;
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                    comprobanteDetalle.Add(cd);
                }
                List<tconplantilladetalle> pl = TconPlantillaDetalleDal.Find((int)cxp.cplantilla, rqmantenimiento.Ccompania).ToList();

                pl = pl.Where(x => x.campotablacdetalle.Equals("CORDEN")).ToList();
                if (pl != null && pl.Count>0)
                {
                    if (pl.Count % 2!= 0)
                        throw new AtlasException("CONTA-018", "ERROR: DEBEN EXISTIR CUENTAS DE ORDEN PAR");
                    else
                    {
                        foreach (tconplantilladetalle pdc in pl)
                        {
                            tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pdc.ccuenta, pdc.debito, null,
                                "USD", "USD", 0, 0, null, null, pdc.centrocostosccatalogo, pdc.centrocostoscdetalle, null, pdc.cpartida);
                            cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, pdc.ccuenta).cclase;
                            cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                            valorCampo = totalretencion;
                            cd.monto = valorCampo;
                            cd.montooficial = valorCampo;
                            if(cd.monto>0)
                            comprobanteDetalle.Add(cd);
                            // afecta a la cuenta 1290901001 resta la sumatoria de debitos.
                            if (!cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                            else sumatorioCreditos += cd.monto.Value;
                        }

                    }

                }
            }

            if ((sumatorioCreditos) != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            //string s = JsonConvert.SerializeObject(comprobanteDetalle);
            comprobante.montocomprobante = sumatorioCreditos + cxp.valornotascredito;
            return comprobanteDetalle;
        }

        

        
    }
}
