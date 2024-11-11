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
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento.cuentasporcobrar.notacreditoparqueaderocontrato
{

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class Contabilizar : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }


            int cplantilla = (int)TconParametrosDal.FindXCodigo("PLANTCONTABL_NOTACRED_PARQ_CONTRATO", rqmantenimiento.Ccompania).numero;
            if (cplantilla == 0) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "PLANTCONTABL_NOTACRED_PARQ_CONTRATO");
            }
            ContabilizarNotaCredito(rqmantenimiento, cplantilla);

        }


        public static void ContabilizarNotaCredito(RqMantenimiento rqmantenimiento, int cplantilla) {

            tconfacturaparqueadero facturaafectada = new tconfacturaparqueadero();
            facturaafectada = TconCargaMasivaFacturasParqueaderoDal.FindFactura(rqmantenimiento.Mdatos["cfacturaparqueadero"].ToString());
            tconfacturaparqueadero notacredito = (tconfacturaparqueadero)facturaafectada.Clone();            
            notacredito.Esnuevo = true;
            notacredito.Actualizar = false;
            notacredito.cfacturaparqueadero = DateTime.Now.Ticks.ToString();
            notacredito.cfpnotacredito = facturaafectada.cfacturaparqueadero;
            notacredito.tipofactura = "NC";
            notacredito.fingreso = rqmantenimiento.Freal;
            notacredito.fnotacredito = Convert.ToDateTime(rqmantenimiento.Mdatos["fnotacredito"].ToString());
            notacredito.secuencial = rqmantenimiento.Mdatos["numdocumentosustento"].ToString();
            notacredito.cusuarioing = rqmantenimiento.Cusuario;
            notacredito.fmodificacion = null;
            notacredito.cusuariomod = null;
            notacredito.ccomprobantepago = null;

            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, cplantilla);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, plantillaDetalle, facturaafectada);

            notacredito.ccomprobante = comprobante.ccomprobante;
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.AdicionarTabla("tconfacturaparqueadero", notacredito, false);
        }

        /// <summary>
        /// completar comprobante
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cplantilla"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, int cplantilla) {

            tconcomprobante comprobante = new tconcomprobante();
            tperproveedor proveedor = new tperproveedor();
            proveedor = TperProveedorDal.FindId(rqmantenimiento.Mdatos["identificacion"].ToString());
            comprobante.anulado = false;
            comprobante.automatico = true;
            comprobante.cagencia = 1;
            comprobante.tipopersona = "CL";
            comprobante.cpersonarecibido = proveedor.cpersona;
            comprobante.cagenciaingreso = 1;
            comprobante.ccompania = rqmantenimiento.Ccompania;
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerodocumentobancario = rqmantenimiento.Mdatos.ContainsKey("numerodocumentobancario") ? rqmantenimiento.Mdatos["numerodocumentobancario"].ToString() : "";
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "DIAGEN");
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = 10;
            comprobante.ctransaccion = rqmantenimiento.Ctransaccion;
            comprobante.ruteopresupuesto = false;
            comprobante.aprobadopresupuesto = false;
            comprobante.comentario = rqmantenimiento.Mdatos.ContainsKey("comentario") ? rqmantenimiento.Mdatos["comentario"].ToString() : "";
            comprobante.cplantilla = cplantilla;
            comprobante.csucursal = 1;
            comprobante.csucursalingreso = 1;
            comprobante.cuadrado = true;
            comprobante.actualizosaldo = true;
            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.eliminado = false;
            comprobante.fcontable = rqmantenimiento.Fconatable;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.optlock = 0;
            comprobante.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
            comprobante.tipodocumentoccatalogo = 1003;
            comprobante.tipodocumentocdetalle = "DIAGEN";
            comprobante.cusuariopresupuesto = TconParametrosDal.FindXCodigo("CUSUARIOPRESUPUESTO", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariocontador = TconParametrosDal.FindXCodigo("CUSUARIOCONTADOR", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariocaja = TconParametrosDal.FindXCodigo("CUSUARIOCAJA", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariotesoreria = TconParametrosDal.FindXCodigo("CUSUARIOTESORERIA", rqmantenimiento.Ccompania).texto;
            comprobante.Esnuevo = true;

            return comprobante;
        }

        /// <summary>
        /// completar comprobante detalle
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cxc"></param>
        /// <param name="comprobante"></param>
        /// <param name="plantillaDetalle"></param>
        /// <param name="ltotalporcaja"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, tconcomprobante comprobante,
            List<tconplantilladetalle> plantillaDetalle, tconfacturaparqueadero fp) {
            decimal valorCampo = 0;
            string cuentaproveedor = "";
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            string cctacajaparqueadero = rqmantenimiento.Mdatos.ContainsKey("cctacajaparqueadero") ? (string)rqmantenimiento.Mdatos["cctacajaparqueadero"] : "";

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();
            foreach (tconplantilladetalle pd in plantillaDetalle) {
                tconcomprobantedetalle cd = new tconcomprobantedetalle();
                cd.monto = 0;
                cd.montooficial = 0;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = 1;
                cd.csucursal = 1;
                cd.debito = !pd.debito;
                cd.cpartida = pd.cpartida;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.ccuenta = pd.ccuenta;
                cd.centrocostosccatalogo = pd.centrocostosccatalogo;
                cd.centrocostoscdetalle = pd.centrocostoscdetalle;
                cd.ccuenta = pd.ccuenta;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);

                //servicio mensual
                if (pd.campotablacdetalle.Equals("C2")) {//TOTAL
                    cd.monto = fp.total;
                    cd.montooficial = fp.total;
                } else if (pd.campotablacdetalle.Equals("C3")) { //BASE IMPONIBLE
                    cd.monto = fp.subtotal;
                    cd.montooficial = fp.subtotal;
                } else if (pd.campotablacdetalle.Equals("C4")) { // MONTO IVA
                    cd.monto = fp.montoiva;
                    cd.montooficial = fp.montoiva;
                } else continue;



                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;
                comprobanteDetalle.Add(cd);
            }
            comprobante.montocomprobante = sumatorioCreditos;
            if (sumatorioCreditos != sumatorioDebitos) {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            return comprobanteDetalle;
        }
    }
}
