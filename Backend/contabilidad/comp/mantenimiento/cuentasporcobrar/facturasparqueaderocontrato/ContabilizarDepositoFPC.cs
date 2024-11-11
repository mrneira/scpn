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
    public class ContabilizarDepositoFPC : ComponenteMantenimiento {

        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!(bool)rqmantenimiento.Mdatos["generarcomprobante"]) {
                return;
            }


            int cplantilla = (int) TconParametrosDal.FindXCodigo("PLANTILLA_CONTABLE_DEP_PARQ_CONTRATO", rqmantenimiento.Ccompania).numero;
            if (cplantilla == 0) {
                throw new AtlasException("CONTA-010", "ERROR: PARAMETROS CONTABLE [{0}] NO DEFINIDO PARA MODULO CONTABILIDAD", "PLANTILLA_CONTABLE_DEP_PARQ_CONTRATO");
            }
            ContabilizarDepositoServicioMensual(rqmantenimiento, cplantilla);

        }

        /// <summary>
        /// contabiliza los depositos de parqueadero mensuales
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cplantilla"></param>
        public static void ContabilizarDepositoServicioMensual(RqMantenimiento rqmantenimiento, int cplantilla) {
            List<IBean> lmantenimiento = new List<IBean>();
            lmantenimiento = rqmantenimiento.GetTabla("FACTURASPARQUEADERO").Lregistros;
            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento,cplantilla);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, plantillaDetalle);
            foreach(tconfacturaparqueadero fp in lmantenimiento) {
                fp.ccomprobantepago = comprobante.ccomprobante;
                fp.estadocdetalle = "PAGADO";
            }
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
        }

        /// <summary>
        /// completa el comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cplantilla"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, int cplantilla) {
            int cpersonarecibido = int.Parse(rqmantenimiento.Mdatos["cpersonarecibido"].ToString());
            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.cpersonarecibido = cpersonarecibido;
            comprobante.tipopersona = "CL";
            comprobante.automatico = true;
            comprobante.cagencia = 1;
            comprobante.cagenciaingreso = 1;
            comprobante.ccompania = rqmantenimiento.Ccompania;
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerodocumentobancario = rqmantenimiento.Mdatos.ContainsKey("numerodocumentobancario") ? rqmantenimiento.Mdatos["numerodocumentobancario"].ToString() : "";
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, "INGRES");
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.ruteopresupuesto = false;
            comprobante.aprobadopresupuesto = false;
            comprobante.comentario = rqmantenimiento.Mdatos.ContainsKey("comentario")? rqmantenimiento.Mdatos["comentario"].ToString():"";
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
            comprobante.cmodulo = rqmantenimiento.Cmodulo;
            comprobante.ctransaccion = rqmantenimiento.Ctransaccion;
            comprobante.cusuariopresupuesto = TconParametrosDal.FindXCodigo("CUSUARIOPRESUPUESTO", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariocontador = TconParametrosDal.FindXCodigo("CUSUARIOCONTADOR", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariocaja = TconParametrosDal.FindXCodigo("CUSUARIOCAJA", rqmantenimiento.Ccompania).texto;
            comprobante.cusuariotesoreria = TconParametrosDal.FindXCodigo("CUSUARIOTESORERIA", rqmantenimiento.Ccompania).texto;

            return comprobante;
        }


        /// <summary>
        /// completa el detalle del comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="comprobante"></param>
        /// <param name="plantillaDetalle"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento, 
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle) {
            decimal valor = decimal.Parse(rqmantenimiento.Mdatos["valor"].ToString());
            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            foreach (tconplantilladetalle pd2 in plantillaDetalle) {
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
                cd.numerodocumentobancario = rqmantenimiento.Mdatos.ContainsKey("numerodocumentobancario") ? rqmantenimiento.Mdatos["numerodocumentobancario"].ToString() : "";
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

            if (sumatorioCreditos != sumatorioDebitos)
            {
                throw new AtlasException("CONTA-011", "ERROR: NO ES POSIBLE GENERAR COMPROBANTE CONTABLE, VALORES INGRESADOS NO CUADRAN DEBITOS Y CREDITOS");
            }
            comprobante.montocomprobante = valor;
            return comprobanteDetalle;
        }
    }
}
