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

namespace contabilidad.comp.mantenimiento.cuentasporcobrar.facturasparqueaderocontrato {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class RegistrarGarantiaFPC : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }
            ContabilizarGarantiaParqueadero(rqmantenimiento);
        }

        /// <summary>
        /// contabilizar garantias de parqueadero
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public static void ContabilizarGarantiaParqueadero(RqMantenimiento rqmantenimiento) {
            tcongarantiaparqueadero garantiaparqueadero;
            garantiaparqueadero = (tcongarantiaparqueadero)rqmantenimiento.GetTabla("GARANTIAPARQUEADERO").Lregistros[0];
            int cplantilla = int.Parse(rqmantenimiento.Mdatos["cplantilla"].ToString());
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, cplantilla, garantiaparqueadero);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, garantiaparqueadero, cplantilla);
            garantiaparqueadero.ccomprobanteregistro = comprobante.ccomprobante;
            garantiaparqueadero.cusuarioing = rqmantenimiento.Cusuario;
            garantiaparqueadero.fingreso = rqmantenimiento.Freal;
            rqmantenimiento.Response["ccomprobanteregistro"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
        }


        /// <summary>
        /// completar comprobante
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cplantilla"></param>
        /// <param name="garantiaparqueadero"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, int cplantilla, tcongarantiaparqueadero garantiaparqueadero) {

            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.cpersonarecibido = garantiaparqueadero.cpersona;
            comprobante.tipopersona = "CL";
            comprobante.automatico = true;
            comprobante.cagencia = 1;
            comprobante.cagenciaingreso = 1;
            comprobante.ccompania = rqmantenimiento.Ccompania;
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerodocumentobancario = garantiaparqueadero.documentoreferencia;
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "INGRES");
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = 10;
            comprobante.ctransaccion = rqmantenimiento.Ctransaccion;
            comprobante.ruteopresupuesto = false;
            comprobante.aprobadopresupuesto = false;
            comprobante.comentario = garantiaparqueadero.comentario;
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
            comprobante.tipodocumentocdetalle = "INGRES";
            comprobante.Esnuevo = true;
            comprobante.cusuariopresupuesto = TconParametrosDal.FindXCodigo("CUSUARIOPRESUPUESTO", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariocontador = TconParametrosDal.FindXCodigo("CUSUARIOCONTADOR", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariocaja = TconParametrosDal.FindXCodigo("CUSUARIOCAJA", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariotesoreria = TconParametrosDal.FindXCodigo("CUSUARIOTESORERIA", rqmantenimiento.Ccompania).texto;
            return comprobante;
        }


        /// <summary>
        /// completar comprobante detalle
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="comprobante"></param>
        /// <param name="garantiaparqueadero"></param>
        /// <param name="cplantilla"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, 
            tconcomprobante comprobante, tcongarantiaparqueadero garantiaparqueadero, int cplantilla) {
            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            decimal valor = garantiaparqueadero.valor;
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();
            foreach (tconplantilladetalle pd2 in plantillaDetalle) {
                if (pd2.ccuenta.StartsWith("7110202")) { 
                    if (pd2.ccuenta.Equals(garantiaparqueadero.ccuenta)) {
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
                        cd.ccuenta = pd2.ccuenta;
                        cd.debito = pd2.debito;
                        cd.cpartida = pd2.cpartida;
                        cd.numerodocumentobancario = garantiaparqueadero.documentoreferencia;
                        cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                        cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                        cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                        cd.cusuario = comprobante.cusuarioing;
                        cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                        cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                        cd.centrocostosccatalogo = pd2.centrocostosccatalogo;
                        cd.centrocostoscdetalle = pd2.centrocostoscdetalle;
                        cd.monto = valor;
                        cd.montooficial = valor;
                        comprobanteDetalle.Add(cd);
                        if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                        else sumatorioCreditos += cd.monto.Value;
                    }
                } else {
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
                    cd.ccuenta = pd2.ccuenta;
                    cd.debito = pd2.debito;
                    cd.cpartida = pd2.cpartida;
                    cd.numerodocumentobancario = garantiaparqueadero.documentoreferencia;
                    cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                    cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                    cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                    cd.cusuario = comprobante.cusuarioing;
                    cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                    cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                    cd.centrocostosccatalogo = pd2.centrocostosccatalogo;
                    cd.centrocostoscdetalle = pd2.centrocostoscdetalle;
                    cd.monto = valor;
                    cd.montooficial = valor;
                    comprobanteDetalle.Add(cd);
                    if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                    else sumatorioCreditos += cd.monto.Value;
                }
            }

            if (sumatorioCreditos != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = valor;
            return comprobanteDetalle;
        }
    }
}
