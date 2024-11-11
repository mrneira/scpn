using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.contabilidad.cuentasporpagar;
using dal.generales;
using dal.monetario;
using dal.prestaciones;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace contabilidad.comp.mantenimiento.prestaciones {

    /// <summary>
    /// Clase que se encarga de completar información ded detalle de un comprobante contable.
    /// </summary>
    public class ContabilizarAportes : ComponenteMantenimiento {





        /// <summary>
        /// ejecuta la clase contabilizaraportes del comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (!rqmantenimiento.Mdatos.Keys.Contains("totalAporteIndividual")) {
                return;
            }

            CompletarContabilizacion(rqmantenimiento);
        }

        /// <summary>
        /// completar el comprobante contable
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public static void CompletarContabilizacion(RqMantenimiento rqmantenimiento) {

            int cplantilla = 0; //CCA prestaciones 20210325 Inicio
            if (rqmantenimiento.Cmodulo == 28 && rqmantenimiento.Ctranoriginal == 42)
            {
                cplantilla = (TpreParametrosDal.GetInteger("PLANTILLA-APORTE-ADICIONAL"));
            }
            else
            {
                if (rqmantenimiento.Cmodulo == 28 && rqmantenimiento.Ctranoriginal == 54)//CCA 20210722
                {
                    cplantilla = (TpreParametrosDal.GetInteger("PLANTILLA-AP-ADIC-MES-ANT"));//CCA 20210722
                }
                else
                {
                    cplantilla = (TpreParametrosDal.GetInteger("PLANTILLA_REGISTRO_APORTES"));
                }
            }
            //CCA prestaciones 20210325 Fin

            if (cplantilla == 0) {
                rqmantenimiento.Response["ccomprobante"] = "";
                return;
            }

            List<tconplantilladetalle> plantillaDetalle = TconPlantillaDetalleDal.Find(cplantilla, rqmantenimiento.Ccompania);
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, cplantilla);
            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, comprobante, plantillaDetalle);
            decimal montototal = decimal.Parse(rqmantenimiento.Mdatos["montototal"].ToString());
            comprobante.montocomprobante = montototal;
            rqmantenimiento.Mdatos.Add("ccomprobante", comprobante.ccomprobante);
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
        }


        /// <summary>
        /// completar el comprobante
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cplantilla"></param>
        /// <returns></returns>
        public static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, int cplantilla) {

            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.automatico = false;
            comprobante.cagencia = rqmantenimiento.Cagencia;//int.Parse(rqmantenimiento.Mdatos);
            comprobante.cagenciaingreso = rqmantenimiento.Cagencia;
            comprobante.ccompania = rqmantenimiento.Ccompania;
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            if (rqmantenimiento.Mdatos.ContainsKey("cargamanual")) {
                comprobante.tipopersona = "PE";
                comprobante.cpersonarecibido = rqmantenimiento.GetLong("cpersonarecibido");
            }
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, (TpreParametrosDal.GetValorTexto("PLANTILLA_REGISTRO_APORTES")));
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = 28;
            comprobante.comentario = "CARGA DE APORTES MENSUALES";
            comprobante.cplantilla = cplantilla;
            comprobante.csucursal = rqmantenimiento.Csucursal;
            comprobante.csucursalingreso = rqmantenimiento.Csucursal;
            comprobante.cuadrado = true;
            comprobante.actualizosaldo = true;
            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.eliminado = false;
            comprobante.fcontable = rqmantenimiento.Fconatable;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.optlock = 0;
            comprobante.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
            comprobante.tipodocumentoccatalogo = 1003;
            comprobante.tipodocumentocdetalle  = (TpreParametrosDal.GetValorTexto("PLANTILLA_REGISTRO_APORTES"));
            comprobante.ctransaccion = rqmantenimiento.Ctranoriginal;
            comprobante.cconcepto = 3;
            comprobante.automatico = true;
            comprobante.Esnuevo = true;
            return comprobante;
        }

        /// <summary>
        /// completar el comprobante detalle
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="comprobante"></param>
        /// <param name="plantillaDetalle"></param>
        /// <returns></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(RqMantenimiento rqmantenimiento,
            tconcomprobante comprobante, List<tconplantilladetalle> plantillaDetalle) {
            decimal totalAporteIndividual = 0, totalAportePatronal = 0, valorCampo = 0;
            string centrocostoscdetalle = "";
            int centrocostosccatalogo = 0, i = 1;
            string ccuentaAporteIndividual = TpreParametrosDal.GetValorTexto("CUENTAAPORTEINDIVIDUAL");
            string ccuentaAportePatronal = TpreParametrosDal.GetValorTexto("CUENTAAPORTEPATRONAL");
            totalAporteIndividual = decimal.Parse(rqmantenimiento.Mdatos["totalAporteIndividual"].ToString());
            totalAportePatronal = decimal.Parse(rqmantenimiento.Mdatos["totalAportePatronal"].ToString());
            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            decimal sumatorioDebitos = 0, sumatorioCreditos = 0;
            foreach (tconplantilladetalle pd in plantillaDetalle) {
                tconcomprobantedetalle cdaporte = new tconcomprobantedetalle();
                if (pd.debito.Value) continue;
                cdaporte.secuencia = i;
                cdaporte.monto = 0;
                cdaporte.montooficial = 0;
                cdaporte.Esnuevo = true;
                cdaporte.ccomprobante = comprobante.ccomprobante;
                cdaporte.fcontable = comprobante.fcontable;
                cdaporte.particion = comprobante.particion;
                cdaporte.ccompania = comprobante.ccompania;
                cdaporte.optlock = 0;
                cdaporte.cagencia = comprobante.cagencia;
                cdaporte.csucursal = comprobante.csucursal;
                cdaporte.ccuenta = pd.ccuenta;
                cdaporte.debito = pd.debito;
                cdaporte.cclase = TconCatalogoDal.Find(comprobante.ccompania, cdaporte.ccuenta).cclase;
                cdaporte.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cdaporte.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cdaporte.cusuario = comprobante.cusuarioing;
                cdaporte.cmonedaoficial = rqmantenimiento.Cmoneda;
                cdaporte.cpartida = pd.cpartida;
                cdaporte.suma = TmonClaseDal.Suma(cdaporte.cclase, cdaporte.debito);
                cdaporte.centrocostosccatalogo = pd.centrocostosccatalogo;
                centrocostosccatalogo = cdaporte.centrocostosccatalogo.Value;
                cdaporte.centrocostoscdetalle = pd.centrocostoscdetalle;
                centrocostoscdetalle = cdaporte.centrocostoscdetalle;
                if (pd.ccuenta.Equals(ccuentaAporteIndividual)) {
                    valorCampo = totalAporteIndividual;
                } else if (pd.ccuenta.Equals(ccuentaAportePatronal)) {
                    valorCampo = totalAportePatronal;
                } else {
                    valorCampo = totalAporteIndividual + totalAportePatronal;
                }
                cdaporte.monto += valorCampo;
                cdaporte.montooficial += valorCampo;
                comprobanteDetalle.Add(cdaporte);
                i++;
                if (cdaporte.debito.Value) sumatorioDebitos += cdaporte.monto.Value;
                else sumatorioCreditos += cdaporte.monto.Value;
            }


            string cuentabancocentralfondos = TconParametrosDal.FindXCodigo("CUENTABANCOCENTRAL_FA", rqmantenimiento.Ccompania).texto;
            if (rqmantenimiento.Cmodulo == 28 && rqmantenimiento.Ctranoriginal == 42) //CCA prestaciones 20210325
            {
                cuentabancocentralfondos = "711020101";
            }
            else
            {
                if (rqmantenimiento.Cmodulo == 28 && rqmantenimiento.Ctranoriginal == 54)//CCA 20210722
                {
                    cuentabancocentralfondos = "721909001";
                }
            }
            tconcomprobantedetalle cd = new tconcomprobantedetalle();
            cd.secuencia = i;
            cd.monto = 0;
            cd.montooficial = 0;
            cd.Esnuevo = true;
            cd.ccomprobante = comprobante.ccomprobante;
            cd.fcontable = comprobante.fcontable;
            cd.particion = comprobante.particion;
            cd.ccompania = comprobante.ccompania;
            cd.optlock = 0;
            cd.cagencia = comprobante.cagencia;
            cd.csucursal = comprobante.csucursal;
            cd.ccuenta = cuentabancocentralfondos;
            cd.debito = true;
            cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
            cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
            cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
            cd.cusuario = comprobante.cusuarioing;
            cd.cmonedaoficial = rqmantenimiento.Cmoneda;
            cd.cpartida = "";
            cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
            cd.centrocostosccatalogo = centrocostosccatalogo;
            cd.centrocostoscdetalle = centrocostoscdetalle;
            /*CCA 20210722 inicio*/
            if (rqmantenimiento.Cmodulo == 28 && rqmantenimiento.Ctranoriginal == 54)
            {
                valorCampo = totalAportePatronal + totalAporteIndividual;
            }
            else
            {
                valorCampo = totalAportePatronal;
            }
            /*CCA 20210722 fin */
            cd.monto = valorCampo;
            cd.montooficial = valorCampo;
            comprobanteDetalle.Add(cd);
            i++;
            if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
            else sumatorioCreditos += cd.monto.Value;

            if (rqmantenimiento.Cmodulo == 28 && (rqmantenimiento.Ctranoriginal != 42 && rqmantenimiento.Ctranoriginal != 54)) //CCA prestaciones 20210325 - 20210722
            {
                /*inicio cambios cca*/
                string comandanciaCuenta = TconParametrosDal.FindXCodigo("PLANILLA_COMANDANCIA", rqmantenimiento.Ccompania).texto;
                cd = new tconcomprobantedetalle();
                cd.secuencia = i;
                cd.monto = 0;
                cd.montooficial = 0;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = comprobante.cagencia;
                cd.csucursal = comprobante.csucursal;
                cd.ccuenta = comandanciaCuenta;
                cd.debito = true;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.cpartida = "";
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = centrocostosccatalogo;
                cd.centrocostoscdetalle = centrocostoscdetalle;
                valorCampo = totalAportePatronal;
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                comprobanteDetalle.Add(cd);
                i++;
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;

                cd = new tconcomprobantedetalle();
                cd.secuencia = i;
                cd.monto = 0;
                cd.montooficial = 0;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = comprobante.cagencia;
                cd.csucursal = comprobante.csucursal;
                cd.ccuenta = comandanciaCuenta;
                cd.debito = true;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.cpartida = "";
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = centrocostosccatalogo;
                cd.centrocostoscdetalle = centrocostoscdetalle;
                valorCampo = totalAporteIndividual;
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                comprobanteDetalle.Add(cd);
                i++;
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;

                /*fin cambios cca*/
            }

            if (rqmantenimiento.Cmodulo == 28 && rqmantenimiento.Ctranoriginal != 54) //CCA 20210722 
            {
                cd = new tconcomprobantedetalle();
                cd.secuencia = i;
                cd.monto = 0;
                cd.montooficial = 0;
                cd.Esnuevo = true;
                cd.ccomprobante = comprobante.ccomprobante;
                cd.fcontable = comprobante.fcontable;
                cd.particion = comprobante.particion;
                cd.ccompania = comprobante.ccompania;
                cd.optlock = 0;
                cd.cagencia = comprobante.cagencia;
                cd.csucursal = comprobante.csucursal;
                cd.ccuenta = cuentabancocentralfondos;
                cd.debito = true;
                cd.cclase = TconCatalogoDal.Find(comprobante.ccompania, cd.ccuenta).cclase;
                cd.cmoneda = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                cd.cusuario = comprobante.cusuarioing;
                cd.cmonedaoficial = rqmantenimiento.Cmoneda;
                cd.cpartida = "";
                cd.suma = TmonClaseDal.Suma(cd.cclase, cd.debito);
                cd.centrocostosccatalogo = centrocostosccatalogo;
                cd.centrocostoscdetalle = centrocostoscdetalle;
                valorCampo = totalAporteIndividual;
                cd.monto = valorCampo;
                cd.montooficial = valorCampo;
                comprobanteDetalle.Add(cd);
                i++;
                if (cd.debito.Value) sumatorioDebitos += cd.monto.Value;
                else sumatorioCreditos += cd.monto.Value;

            }

            rqmantenimiento.AddDatos("montototal", sumatorioCreditos);
            return comprobanteDetalle;
        }

    }
}
