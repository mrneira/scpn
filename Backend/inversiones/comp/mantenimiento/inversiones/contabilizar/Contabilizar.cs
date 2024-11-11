using core.componente;
using core.servicios;
using dal.contabilidad;
using dal.inversiones.inversiones;
using dal.inversiones.contabilizacion;
using dal.monetario;
using modelo;
using System.Collections.Generic;
using System;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;
using contabilidad.comp.mantenimiento;
using dal.inversiones.tablaamortizaciontmp;
using dal.inversiones.inversionrentavariable;
using dal.inversiones.ventaacciones;
using dal.inversiones.precancelacion;

namespace inversiones.comp.mantenimiento.inversiones.contabilizar {

    /// <summary>
    /// Clase que se encarga de completar información del detalle de un comprobante contable.
    /// </summary>
    public class Contabilizar : ComponenteMantenimiento {

        /// <summary>
        /// Genera el comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento">Request del mantenimiento de la transacción.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            string lComentario = null;

            if (!rqmantenimiento.Mdatos.ContainsKey("contabilizar")) {
                return;
            }

            int lintMora = 0;

            try
            {
                if (rqmantenimiento.Mdatos.ContainsKey("mora")) {

                    lintMora = int.Parse(rqmantenimiento.Mdatos["mora"].ToString());
                }
            }
            catch
            { }


            if (!(bool)rqmantenimiento.Mdatos["contabilizar"]) {

                try
                {
                    tinvtablaamortizacion tInvTablaamortizacion = TinvInversionDal.FindTInvTablaAmortizacion(long.Parse(rqmantenimiento.Mdatos["cinvtablaamortizacion"].ToString()));

                    if (lintMora == 2)
                    {
                        tInvTablaamortizacion.mora = 2;
                        tInvTablaamortizacion.comentariomoraing = null;
                        tInvTablaamortizacion.comentariomoradev = rqmantenimiento.Mdatos["comentario"].ToString();
                    }
                    else
                    {
                        tInvTablaamortizacion.estadocdetalle = "DEV";
                        tInvTablaamortizacion.comentariosingreso = null;
                        tInvTablaamortizacion.comentariosdevolucion = rqmantenimiento.Mdatos["comentario"].ToString();
                    }

                    Sessionef.Actualizar(tInvTablaamortizacion);
                }
                catch
                { }

                return;
            }

            try
            {
                tinvtablaamortizacion tInvTablaamortizacion = TinvInversionDal.FindTInvTablaAmortizacion(long.Parse(rqmantenimiento.Mdatos["cinvtablaamortizacion"].ToString()));

                if (lintMora == 3)
                {
                    tInvTablaamortizacion.mora = null;
                    lComentario = tInvTablaamortizacion.comentariomoraing;

                    tInvTablaamortizacion.comentariomoraing = null;
                    tInvTablaamortizacion.comentariomoraapr = rqmantenimiento.Mdatos["comentario"].ToString();

                }
                else
                {
                    tInvTablaamortizacion.estadocdetalle = "PAG";

                    if ((string)rqmantenimiento.Mdatos["procesocdetalle"] == "RECUP") lComentario = tInvTablaamortizacion.comentariosingreso;

                    tInvTablaamortizacion.comentariosingreso = null;
                    tInvTablaamortizacion.comentariosaprobacion = rqmantenimiento.Mdatos["comentario"].ToString();

                }




                Sessionef.Actualizar(tInvTablaamortizacion);
            }
            catch
            { }

            try
            {
                if (rqmantenimiento.Mdatos.ContainsKey("cinvprecancelacion")){
                    tinvprecancelacion tInvPrecancelacion = TinvPrecancelacionDal.Find(long.Parse(rqmantenimiento.Mdatos["cinvprecancelacion"].ToString()));
                    tInvPrecancelacion.estadocdetalle = "APR";
                    Sessionef.Actualizar(tInvPrecancelacion);
                }
               
            }
            catch
            { }


            try
            {
                if (rqmantenimiento.Mdatos.ContainsKey("cinversionrentavariable"))
                {

                    tinvinversionrentavariable tInversionRentaVariable = TinvInversionRentaVariableDal.Find(long.Parse(rqmantenimiento.Mdatos["cinversionrentavariable"].ToString()));
                    tInversionRentaVariable.estadocdetalle = "PAG";
                    tInversionRentaVariable.comentariosingreso = null;
                    Sessionef.Actualizar(tInversionRentaVariable);
                }
            }
            catch
            { }


            try
            {
                if (rqmantenimiento.Mdatos.ContainsKey("cinvventaaccion"))
                {
                    
                tinvventaacciones tInvVentaAcciones = TinvVentaAccionesDal.Find(long.Parse(rqmantenimiento.Mdatos["cinvventaaccion"].ToString()));
                    tInvVentaAcciones.estadocdetalle = "PAG";
                    tInvVentaAcciones.comentariosingreso = null;
                    Sessionef.Actualizar(tInvVentaAcciones); }
            }
            catch
            { }


            long cinversion = long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString());

            tinvinversion inversion = null;

            if (cinversion != -1)
            {
                inversion = TinvInversionDal.Find(cinversion);
            }

            //tinvinversion 

            bool lblnCompra = (string)rqmantenimiento.Mdatos["procesocdetalle"] == "COMPRA";

            bool lblnReajuste = (string)rqmantenimiento.Mdatos["procesocdetalle"] == "REAJUS";

            if (cinversion != -1)
            {
                if (lblnCompra && inversion.ccomprobante != null && rqmantenimiento.Mdatos.ContainsKey("cinversionrentavariable") == false)
                {
                    validarContabilizacion(inversion.ccomprobante);
                }
            }


            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, inversion, (string)rqmantenimiento.Mdatos["procesocdetalle"], lComentario); // lblnCompra, lblnReajuste);

            decimal montoComprobante = 0;

            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, inversion, comprobante, ref montoComprobante, lintMora);

            if (inversion != null)
            {

                if (inversion.sectorcdetalle == "EXT")
                {
                    try
                    {
                        if (decimal.Parse(rqmantenimiento.Mdatos["efectivoExterior"].ToString()) != 0)
                        {
                            if (inversion.valornominal != null && inversion.valornominal != 0)
                            {
                                inversion.valornominal = inversion.valornominal.Value + decimal.Parse(rqmantenimiento.Mdatos["efectivoExterior"].ToString()); 

                            }
                            else
                            {
                                inversion.valornominal = decimal.Parse(rqmantenimiento.Mdatos["efectivoExterior"].ToString()); // this.rqMantenimiento.;
                            }
                        }
                    }
                    catch { }
                }


                if ((lblnCompra || lblnReajuste))
                {
                    if (lblnCompra) inversion.ccomprobante = comprobante.ccomprobante;

                    if (lblnReajuste)

                    {

                        inversion.cinversionhisultimo = null;
                        TinvTablaAmortizacionTmpDal.Delete(cinversion);

                    }

                    inversion.estadocdetalle = "APR";

                    inversion.comentariosingreso = null;

                    try
                    {
                        inversion.comentariosaprobacion = rqmantenimiento.Mdatos["comentario"].ToString().Trim();
                    }
                    catch
                    { }

                    inversion.comentariosdevolucion = null;
                    inversion.comentariosanulacion = null;

                }


            }
            else
            {
                //FindxEmisor


                try
                {
                    tinvinversion linversion = TinvInversionDal.FindxEmisor(1213, rqmantenimiento.Mdatos["emisorcdetalle"].ToString());

                    linversion.valornominal = decimal.Parse(rqmantenimiento.Mdatos["valornominal"].ToString());

                    Sessionef.Actualizar(linversion);

                }
                catch { }

            }


            comprobante.montocomprobante = montoComprobante;

            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.AdicionarTabla("tinviversion", inversion, false);

            rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
            SaldoEnLinea lSaldoLinea = new SaldoEnLinea();
            lSaldoLinea.Ejecutar(rqmantenimiento);

            if (lintMora == 3)
            {
                List<tinvcontabilizacion> tinvContabilizacion = TinvContabilizacionDal.Find(long.Parse(rqmantenimiento.Mdatos["cinvtablaamortizacion"].ToString()), 1);
                foreach (tinvcontabilizacion itemCont in tinvContabilizacion)
                {

                    tinvcontabilizacion tInvConta = TinvContabilizacionDal.FindPorId(itemCont.cinvcontabilizacion);
                    tInvConta.mora = 2;
                    Sessionef.Actualizar(tInvConta);

                }
            }
        }

        /// <summary>
        /// Completa la información del comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento">Request del mantenimiento de la transacción.</param>
        /// <param name="inversion">Definición de la inversión a contabilizar.</param>
        /// <param name="ioperacion">Identificador de la operación realizada.</param>
        /// <returns>tconcomprobante</returns>
        private static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tinvinversion inversion, string ioperacion, string iComentario = null)
        {

            string operacion = "";

            string ltipodocumentocdetalle = "DIAGEN";

            switch (ioperacion)
            {
                case "REAJUS":
                    operacion = "REAJUSTE";
                    break;
                case "VENACC":
                    operacion = "VENTA ACCIONES";
                    break;
                case "COMPRA":
                    operacion = "COMPRA";
                    break;
                default:
                    ltipodocumentocdetalle = "INGRES";
                    operacion = "PAGO";
                    break;
            }

            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.automatico = true;
            comprobante.cagencia = (int)(rqmantenimiento.Cagencia);
            comprobante.cagenciaingreso = comprobante.cagencia;
            comprobante.ccompania = (int)(rqmantenimiento.Ccompania);
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, ltipodocumentocdetalle);
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = 12;

            bool lValidaComentario = false;

            if (iComentario != null) if (iComentario.Trim().Length != 0) lValidaComentario = true;

            if (lValidaComentario)
            {
                comprobante.comentario = iComentario.Trim();
            }
            else if (ioperacion == "COMPRA" && inversion != null)
            {
                comprobante.comentario = inversion.observaciones;
            }
            else if (inversion != null)
            {
                comprobante.comentario = TinvInversionDal.FindConceptoContable(operacion, inversion.cinversion, rqmantenimiento.Fconatable); //"COMPROBANTE GENERADO DESDE SUBMODULO DE INVERSIONES"; //RNI20240829
            }
            else
            {
                comprobante.comentario = "REGISTRO DE LA PLATAFORMA DE INVERSIONES INTERNACIONALES, BASADOS EN LOS ESTADOS DE CUENTA DE LOS INSTRUMENTOS FINANCIEROS.";
            }

            comprobante.csucursal = comprobante.cagencia;
            comprobante.csucursalingreso = comprobante.cagencia;
            comprobante.cuadrado = true;
            comprobante.actualizosaldo = true;

            comprobante.ctransaccion = rqmantenimiento.Ctransaccion;

            comprobante.cusuarioing = rqmantenimiento.Cusuario;
            comprobante.eliminado = false;
            comprobante.fcontable = rqmantenimiento.Fconatable;
            comprobante.fingreso = rqmantenimiento.Freal;
            comprobante.optlock = 0;
            comprobante.particion = Constantes.GetParticion((int)rqmantenimiento.Fconatable);
            comprobante.tipodocumentoccatalogo = 1003;
            comprobante.tipodocumentocdetalle = ltipodocumentocdetalle;
            comprobante.Esnuevo = true;
            comprobante.cconcepto = 3;
            rqmantenimiento.Response["fcontable"] = rqmantenimiento.Fconatable;
            rqmantenimiento.Response["ccompania"] = comprobante.ccompania;

            return comprobante;
        }

        /// <summary>
        /// Completa la información del detalle del comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento">Request del mantenimiento de la transacción.</param>
        /// <param name="inversion">Definición de la inversión a contabilizar.</param>
        /// <param name="comprobante">Comprobante contable generado.</param>
        /// <param name="montoComprobante">Monto del comprobante contable.</param>
        /// <returns>List<tconcomprobantedetalle></returns>
        public static List<tconcomprobantedetalle> CompletarComprobanteDetalle(
            RqMantenimiento rqmantenimiento,
            tinvinversion inversion,
            tconcomprobante comprobante,
            ref decimal montoComprobante,
            int iMora = 0)
        {

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            long lcinvtablaamortizacion = 0;
            long lcinvprecancelacion = 0;
            long lcinvventaaccion = 0;
            long lcinversionrentavariable = 0;
            long lcinversionhisultimo = 0;

            bool lblnRentaVariable = false;

            string lstrCondicionAdicional = "";

            try
            {
            
            if (rqmantenimiento.Mdatos.ContainsKey("cinversionrentavariable"))
            {
                lstrCondicionAdicional = " and tinvcon.cinversionrentavariable = " + rqmantenimiento.Mdatos["cinversionrentavariable"] + " ";
                lblnRentaVariable = true;
                lcinversionrentavariable = long.Parse(rqmantenimiento.Mdatos["cinversionrentavariable"].ToString());
            }
            }
            catch
            { }

            if (lstrCondicionAdicional.Trim().Length == 0 && (string)rqmantenimiento.Mdatos["procesocdetalle"] != "COMPRA" && (string)rqmantenimiento.Mdatos["procesocdetalle"] != "REAJUS")
            {

                try
                {
                    lstrCondicionAdicional = " and tinvcon.cinvtablaamortizacion = " + rqmantenimiento.Mdatos["cinvtablaamortizacion"] + " ";

                    if (iMora == 3) lstrCondicionAdicional = lstrCondicionAdicional + " and tinvcon.mora = 1 ";

                    lcinvtablaamortizacion = long.Parse(rqmantenimiento.Mdatos["cinvtablaamortizacion"].ToString());
                }
                catch
                { }

                try
                {
                    if (rqmantenimiento.Mdatos.ContainsKey("cinvprecancelacion")){
                        lstrCondicionAdicional = " and tinvcon.cinvprecancelacion = " + rqmantenimiento.Mdatos["cinvprecancelacion"] + " ";
                        lcinvprecancelacion = long.Parse(rqmantenimiento.Mdatos["cinvprecancelacion"].ToString());

                    }

                }
                catch
                { }


                try
                {
                    if (rqmantenimiento.Mdatos.ContainsKey("cinvventaaccion"))
                    {
                        lstrCondicionAdicional = " and tinvcon.cinvventaaccion = " + rqmantenimiento.Mdatos["cinvventaaccion"] + " ";
                        lcinvventaaccion = long.Parse(rqmantenimiento.Mdatos["cinvventaaccion"].ToString());
                    }
                }
                catch
                { }

            }

            if (lstrCondicionAdicional.Trim().Length == 0 && (string)rqmantenimiento.Mdatos["procesocdetalle"] == "REAJUS")
            {

                try
                {
                    lstrCondicionAdicional = " and tinvcon.cinversionhis = " + rqmantenimiento.Mdatos["cinversionhisultimo"] + " ";
                    lcinversionhisultimo = long.Parse(rqmantenimiento.Mdatos["cinversionhisultimo"].ToString());
                }
                catch
                { }

            }


            lstrCondicionAdicional = lstrCondicionAdicional + " and (tconcom.ccomprobante is null or tconcom.eliminado = 1 or tconcom.anulado = 1) ";

            List<tContabilizacion> lDetalleContable = new List<tContabilizacion>();

            if (inversion == null)
            {
                lDetalleContable = TinvContabilizacionDal.GetContabilizacion(
                    -1,
                    iprocesocdetalle: (string)rqmantenimiento.Mdatos["procesocdetalle"],
                    istrCondicionAdicional: lstrCondicionAdicional);

            }
            else
            {
                lDetalleContable = TinvContabilizacionDal.GetContabilizacion(
                    (long)inversion.cinversion,
                    iprocesocdetalle: (string)rqmantenimiento.Mdatos["procesocdetalle"],
                    istrCondicionAdicional: lstrCondicionAdicional);
            }


            if (lDetalleContable == null)
            {
                throw new AtlasException("INV-0018", "PARAMETRIZACIÓN CONTABLE NO DEFINIDA");
            }

            decimal? lmonto = null;
            decimal? lmontooficial = null;
            bool? ldebito = null;

            int secuencia = 1;

            foreach (var item in lDetalleContable)
            {

                if (secuencia == 1 &&
                    (lblnRentaVariable == true || (string)rqmantenimiento.Mdatos["procesocdetalle"] != "COMPRA") &&
                    item.ccomprobante != null)
                {
                    validarContabilizacion(item.ccomprobante);
                }

                if (item.valordebe != 0)
                {
                    ldebito = true;
                    lmonto = Math.Round(item.valordebe, 2, MidpointRounding.AwayFromZero);

                    montoComprobante = montoComprobante + lmonto.Value;

                }
                else
                {
                    ldebito = false;
                    lmonto = Math.Round(item.valorhaber, 2, MidpointRounding.AwayFromZero);
                }

                if (inversion == null)
                {
                    lmontooficial = lmonto;
                }
                else if (inversion.monedacdetalle != "USD")
                {
                    lmontooficial = lmonto * inversion.cotizacion;
                }
                else
                {
                    lmontooficial = lmonto;
                }

                string lcpartidaingreso = null;
                try
                {
                    lcpartidaingreso = item.cpartidaingreso;
                }
                catch
                { }

                tconcomprobantedetalle detalleContable = new tconcomprobantedetalle();
                detalleContable.monto = lmonto;
                detalleContable.montooficial = lmontooficial;
                detalleContable.Esnuevo = true;
                detalleContable.ccomprobante = comprobante.ccomprobante;
                detalleContable.fcontable = comprobante.fcontable;
                detalleContable.particion = comprobante.particion;
                detalleContable.ccompania = comprobante.ccompania;
                detalleContable.optlock = 0;
                detalleContable.cagencia = comprobante.cagencia;
                detalleContable.csucursal = comprobante.csucursal;
                detalleContable.ccuenta = item.ccuenta;
                detalleContable.debito = ldebito;
                detalleContable.cclase = TconCatalogoDal.Find(comprobante.ccompania, detalleContable.ccuenta).cclase;

                if (inversion == null)
                {
                    detalleContable.cmoneda = "USD";
                }
                else
                {
                    detalleContable.cmoneda = inversion.monedacdetalle; // rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                }

                //detalleContable.cmonedaoficial = rqmantenimiento.Cmoneda == null ? "USD" : rqmantenimiento.Cmoneda;
                detalleContable.cmonedaoficial = "USD";
                detalleContable.cusuario = comprobante.cusuarioing;
                detalleContable.cmonedaoficial = rqmantenimiento.Cmoneda;
                detalleContable.suma = TmonClaseDal.Suma(detalleContable.cclase, detalleContable.debito);

                if (inversion == null)
                {
                    detalleContable.centrocostosccatalogo = 1002;
                    detalleContable.centrocostoscdetalle = "CCSCPN";
                }
                else
                {
                    detalleContable.centrocostosccatalogo = inversion.centrocostoccatalogo;
                    detalleContable.centrocostoscdetalle = inversion.centrocostocdetalle;
                }

                detalleContable.cpartida = lcpartidaingreso;
                comprobanteDetalle.Add(detalleContable);

                secuencia++;

            }


            // Actualizar ccomprobante inicio

            // and tinvcon.cinvtablaamortizacion = 1

            bool lblnExcluirContabilizados = false;

            try
            {
                if (rqmantenimiento.Mdatos.ContainsKey("excluirContabilizados"))
                {
                    lblnExcluirContabilizados = (bool)rqmantenimiento.Mdatos["excluirContabilizados"];
                }
            }
            catch
            { }

            if (inversion == null)
            {
                return comprobanteDetalle;
            }

            List<tContabilizacion> lDetalleContableActualizar = new List<tContabilizacion>();

            lDetalleContableActualizar = TinvContabilizacionDal.GetContabilizacion(
                (long)inversion.cinversion,
                orderby: "tinvcon.ccuenta,tinvcon.debito",
                iprocesocdetalle: (string)rqmantenimiento.Mdatos["procesocdetalle"],
                icinvtablaamortizacion: lcinvtablaamortizacion,
                icinversionrentavariable: lcinversionrentavariable,
                iblnExcluirContabilizados: lblnExcluirContabilizados,
                icinversionhisultimo: lcinversionhisultimo,
                icinvventaaccion: lcinvventaaccion,
                icinvprecancelacion: lcinvprecancelacion, imora: iMora == 3 ? 1 : 0);

            secuencia = 0;

            string lCuenta = "";
            bool? lDebito = null;

            foreach (var item in lDetalleContableActualizar)
            {

                if (lCuenta != item.ccuenta || lDebito != item.debito)
                {
                    secuencia++;
                    lCuenta = item.ccuenta;
                    lDebito = item.debito;
                }

                tinvcontabilizacion tInvContabilizacion = TinvContabilizacionDal.FindTInvContabilizacion(item.cinvcontabilizacion);
                tInvContabilizacion.ccomprobante = comprobante.ccomprobante;
                tInvContabilizacion.fcontable = comprobante.fcontable;
                tInvContabilizacion.particion = comprobante.particion;
                tInvContabilizacion.secuencia = secuencia;
                tInvContabilizacion.ccompania = comprobante.ccompania;
                Sessionef.Actualizar(tInvContabilizacion);

            }

            // Actualizar ccomprobante fin

            return comprobanteDetalle;
        }

        /// <summary>
        /// Valida si la contabilización ya ha sido efectuada.
        /// </summary>
        /// <param name="iccomprobante">Identificador del comprobante contable.</param>
        /// <returns></returns>
        private static void validarContabilizacion(string iccomprobante)
        {
            tconcomprobante tConComprobante = TinvContabilizacionDal.FindTConComprobante(iccomprobante);

            if (tConComprobante.ccomprobante != null && tConComprobante.anulado == false && tConComprobante.eliminado == false)
            {
                throw new AtlasException("INV-0011", "INVERSIÓN YA HA SIDO CONTABILIZADA CON EL COMPROBANTE {0}", tConComprobante.ccomprobante);
            }
        }

    }

}

