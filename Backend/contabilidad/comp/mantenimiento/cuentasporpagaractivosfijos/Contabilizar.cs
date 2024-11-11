using contabilidad.datos;
using core.componente;
using core.servicios;
using dal.contabilidad;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.activosfijos;
using dal.contabilidad.cuentasporpagar;
using util;
using dal.monetario;
using dal.generales;

namespace contabilidad.comp.mantenimiento.cuentasporpagaractivosfijos
{
    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class Contabilizar : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rm)
        {

            if (!(bool)rm.Mdatos["generarcomprobante"])
            {
                return;
            }

            string cctaporpagar = rm.Mdatos["cctaporpagar"].ToString();

            tconcuentaporpagar cxp = TconCuentaporpagarDal.Find(cctaporpagar);

            tconparametros parametro_centrocostos_default = TconParametrosDal.FindXCodigo("CENTROCOSTOS_DEFAULT", rm.Ccompania);
            if (parametro_centrocostos_default == null) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "CENTROCOSTOS_DEFAULT");
            }


            tconparametros param = TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_CXP_ACF_DIARIO", rm.Ccompania);
            if (param == null)
            {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "PLANTILLA_CONTABLE_CXP_ACF_DIARIO");
            }
            cxp.cplantilla =(int) param.numero;
            tacfingreso ing = TacfIngresoDal.FindCuentaxPagar(cxp.cctaporpagar);
            List<tacfingresodetalle> lingdet = TacfIngresoDetalleDal.FindXCingreso(ing.cingreso);

            var ltotalporcuenta = lingdet       
            .Where(x=> x.vunitario > 0)
            .GroupBy(x => x.tacfproducto.ccuenta)                       
            .ToDictionary(g => g.Key, g => g.Sum(v => (v.vunitario * v.cantidad)));
            cxp.centrocostosccatalogo = 1002;
            cxp.centrocostoscdetalle = parametro_centrocostos_default.texto;
            ContabilizarCxP(rm, cxp, ltotalporcuenta, parametro_centrocostos_default.texto);
            rm.Response["OK"] = true;

        }


        public static void ContabilizarCxP(RqMantenimiento rqmantenimiento, tconcuentaporpagar cxp, Dictionary<string, decimal?> ltotalporcuenta,string centroscostos_default )
        {
            if (cxp.cplantilla != null)
            {
                List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cxp.cplantilla.Value, cxp.ccompania.Value);
                tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, cxp, ltotalporcuenta, centroscostos_default);
                List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, cxp, comprobante, plantillaDetalle, ltotalporcuenta, centroscostos_default);
                cxp.ccompcontable = comprobante.ccomprobante;
                rqmantenimiento.Response["cctaporpagar"] = cxp.cctaporpagar;
                rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
                rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
                rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
                rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            }
            rqmantenimiento.Mtablas["CABECERA"] = null;
            cxp.Actualizar = true;
            cxp.cusuarioautorizacion = rqmantenimiento.Cusuario;
            cxp.fautorizacion = rqmantenimiento.Freal;
            cxp.estadocxpcdetalle = "CONTAB";
            rqmantenimiento.AdicionarTabla("tconcuentaporpagar", cxp, false);
        }


        /// <summary>
        /// completar comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxp"></param>
        /// <param name="ltotalporcuenta"></param>
        /// <param name="centroscostos_default"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tconcuentaporpagar cxp, Dictionary<string, decimal?> ltotalporcuenta, string centroscostos_default)
        {
            string ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            string numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            tconcomprobante comprobante = TconComprobanteDal.CrearComprobante(ccomprobante, rqmantenimiento.Fconatable, Constantes.GetParticion((int)rqmantenimiento.Fconatable),
                cxp.ccompania.Value, 0, "PR", cxp.cpersona, null, rqmantenimiento.Freal, rqmantenimiento.Fproceso, cxp.comentario, true, true, false, false, false, cxp.ruteopresupuesto, false,
                cxp.cplantilla, null, 1, 1, rqmantenimiento.Ctransaccion , rqmantenimiento.Cmodulo, 1003, "DIAGEN", 1, 1, 0, numerocomprobantecesantia,
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
        /// <param name="ltotalporcuenta"></param>
        /// <param name="centroscostos_default"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcuentaporpagar cxp,
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle, Dictionary<string, decimal?> ltotalporcuenta, string centroscostos_default)
        {
            decimal valorCampo = 0, sumatorioDebitos = 0, sumatorioCreditos = 0;
            tconplantilladetalle pdCuenta = new tconplantilladetalle();
            tconplantilladetalle pd = new tconplantilladetalle();
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (KeyValuePair<string, decimal?> entry in ltotalporcuenta)
            {
                pdCuenta = plantillaDetalle.Find(x => x.ccuenta.Equals(entry.Key));
                if (pdCuenta == null)
                {
                    throw new AtlasException("CONTA-012", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
                }
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pdCuenta.ccuenta, pdCuenta.debito.Value, null,
                "USD", "USD", 0, 0, null, null,1002, centroscostos_default, null, pdCuenta.cpartida);
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                valorCampo = Decimal.Parse(entry.Value.ToString());
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
            else
            {
                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd.ccuenta, pd.debito, null,
                    "USD", "USD", 0, 0, null, null, 1002, centroscostos_default, null, pd.cpartida);

                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                valorCampo = cxp.montoiva.Value;
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }

            //Detalle para cuenta proveedor
            List<tconplantilladetalle> lpd = new List<tconplantilladetalle>();
            lpd = plantillaDetalle.Where(x => x.campotablacdetalle.Equals("C11")).ToList();
            if (lpd == null)
                throw new AtlasException("CONTA-012", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");

            foreach (tconplantilladetalle item in lpd) {

                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, item.ccuenta, item.debito, null,
                    "USD", "USD", 0, 0, null, null, 1002, centroscostos_default, null, item.cpartida);
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                valorCampo = cxp.valorpagar.Value;
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                comprobanteDetalle.Add(cd);
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
            }


            //Detalle para multas
            if (cxp.valormulta != 0)
            {
                pd = plantillaDetalle.Find(x => x.campotablacdetalle.Equals("C13"));
                if (pd == null)
                    throw new AtlasException("CONTA-012", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
                else
                {
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd.ccuenta, pd.debito, null,
                        "USD", "USD", 0, 0, null, null, 1002, centroscostos_default, null, pd.cpartida);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    valorCampo = cxp.valormulta.Value;
                    cd.monto = valorCampo;
                    cd.montooficial = valorCampo;
                    comprobanteDetalle.Add(cd);
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                }
            }
            //Detalle para retenciones IVA

            if (!cxp.exentoretencion.Value)
            {

                if (!(bool)rqmantenimiento.Mdatos["contribuyenteespecial"]) {



                    foreach (tconplantilladetalle pd2 in plantillaDetalle) {
                        if (!pd2.campotablacdetalle.Equals("C10")) {
                            continue;
                        }
                        tconcatalogo cuentacontable = TconCatalogoDal.Find(rqmantenimiento.Ccompania, pd2.ccuenta);

                        //Retenciones para IVA Bienes
                        if (cxp.valorretbienes.Value != 0) {
                            tgencatalogodetalle catdet = TgenCatalogoDetalleDal.Find(1006, cxp.porretbienescdetalle);
                            if (cuentacontable.nombre.Contains((catdet.nombre))) {
                                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd2.ccuenta, pd2.debito, null,
                                    "USD", "USD", 0, 0, null, null,1002 , centroscostos_default, null, pd2.cpartida);
                                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                                valorCampo = cxp.valorretbienes.Value;
                                cd.monto = valorCampo;
                                cd.montooficial = valorCampo;
                                comprobanteDetalle.Add(cd);
                                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                                else sumatorioCreditos += cd.monto.Value;
                            }
                        }
                        //Retenciones para IVA Servicios
                        if (cxp.valorretservicios.Value != 0) {
                            tgencatalogodetalle catdet = TgenCatalogoDetalleDal.Find(1004, cxp.porretservicioscdetalle);
                            if (cuentacontable.nombre.Contains((catdet.nombre))) {
                                tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, pd2.ccuenta, pd2.debito, null,
                                    "USD", "USD", 0, 0, null, null, 1002, centroscostos_default, null, pd2.cpartida);
                                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                                valorCampo = cxp.valorretservicios.Value;
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
                foreach (tconretencionfuente rf in listaRetencionesFuente)
                {
                    if (rf.tconretencionair.ccuenta == null)
                    {
                        continue;
                    }
                    tconcomprobantedetalle cd = TconComprobanteDetalleDal.CrearComprobanteDetalle(true, comprobante, 0, null, rf.tconretencionair.ccuenta, false, null,
                        "USD", "USD", 0, 0, null, null, 1002, centroscostos_default, null, null);
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    try
                    {
                        valorCampo = rf.valretair.Value;
                    }
                    catch (Exception ex)
                    {
                        valorCampo = 0;
                    }
                    cd.monto += valorCampo;
                    cd.montooficial += valorCampo;
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                    comprobanteDetalle.Add(cd);
                }
            }

            if ( Decimal.Round((sumatorioCreditos + cxp.valornotascredito.Value),2) != Decimal.Round(sumatorioDebitos,2))
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = sumatorioCreditos + cxp.valornotascredito;
            return comprobanteDetalle;
        }
    }
}
