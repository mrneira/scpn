
using System;
using System.Collections.Generic;
using modelo;
using util.dto.mantenimiento;
using Newtonsoft.Json;
using util.servicios.ef;
using dal.inversiones.contabilizacion;
using inversiones.comp.mantenimiento.inversiones;
using util;
using inversiones.comp.mantenimiento.cargaacciones.vectorprecios;
using dal.inversiones.inversiones;
using dal.presupuesto;
using dal.generales;
using dal.inversiones.emisorvalornominal;

namespace inversiones.comp.mantenimiento.contabilizacion
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para contabilizar las operaciones realizadas en el módulo de inversiones.
    /// </summary>
    public class clsGuardar
    {
        /// <summary>
        /// Genera la contabilización de la transacción, obteniendo las afectaciones predeterminadas de la plantilla contable.
        /// </summary>
        /// <param name="rqmantenimiento">Request del mantenimiento de la transacción.</param>
        /// <param name="icinversion">Identificador de la inversión a contabilizar.</param>
        /// <returns></returns>
        public void DetalleSql(RqMantenimiento rqmantenimiento, long icinversion, int iMora = 0)
        {

            if (icinversion == -1)
            {
                TinvInversionDal.DeleteContabiliza(-1);
            }

            long? lcinversionhisultimo = null;

            if (rqmantenimiento.Mdatos.ContainsKey("cinversionhisultimo"))
            {
                if (rqmantenimiento.Mdatos["cinversionhisultimo"] != null)
                {

                    try
                    {
                        if ((long)rqmantenimiento.Mdatos["cinversionhisultimo"] > 0) lcinversionhisultimo = (long)rqmantenimiento.Mdatos["cinversionhisultimo"];
                    }
                    catch
                    { }

                }

            }

            long lcinvprecancelacionDat = 0;

            if (rqmantenimiento.Mdatos.ContainsKey("cinvprecancelacion"))
            {
                if (rqmantenimiento.Mdatos["cinvprecancelacion"] != null)
                {
                    try
                    {
                        if ((long)rqmantenimiento.Mdatos["cinvprecancelacion"] > 0) lcinvprecancelacionDat = (long)rqmantenimiento.Mdatos["cinvprecancelacion"];
                    }
                    catch
                    { }
                }
            }

            long lcinvtablaamortizacionDat = 0;

            if (rqmantenimiento.Mdatos.ContainsKey("cinvtablaamortizacion"))
            {
                if (rqmantenimiento.Mdatos["cinvtablaamortizacion"] != null)
                {
                    try
                    {
                        if ((long)rqmantenimiento.Mdatos["cinvtablaamortizacion"] > 0) lcinvtablaamortizacionDat = (long)rqmantenimiento.Mdatos["cinvtablaamortizacion"];
                    }
                    catch
                    { }
                }
            }

            long lcinversionrentavariableDat = 0;

            if (rqmantenimiento.Mdatos.ContainsKey("cinversionrentavariable"))
            {
                if (rqmantenimiento.Mdatos["cinversionrentavariable"] != null)
                {
                    try
                    {
                        if ((long)rqmantenimiento.Mdatos["cinversionrentavariable"] > 0) lcinversionrentavariableDat = (long)rqmantenimiento.Mdatos["cinversionrentavariable"];
                    }
                    catch
                    { }
                }
            }


            long lcinvventaaccionDat = 0;

            if (rqmantenimiento.Mdatos.ContainsKey("cinvventaaccion"))
            {
                if (rqmantenimiento.Mdatos["cinvventaaccion"] != null)
                {
                    try
                    {
                        if ((long)rqmantenimiento.Mdatos["cinvventaaccion"] > 0) lcinvventaaccionDat = (long)rqmantenimiento.Mdatos["cinvventaaccion"];
                    }
                    catch
                    { }
                }
            }

            string lprocesocdetalleDat = "";

            if (rqmantenimiento.Mdatos.ContainsKey("procesocdetalle"))
            {
                if (rqmantenimiento.Mdatos["procesocdetalle"] != null)
                {
                    try
                    {
                        lprocesocdetalleDat = rqmantenimiento.Mdatos["procesocdetalle"].ToString();
                    }
                    catch
                    { }
                }
            }

            List< tContabilizacion> lTablaOriginal = new List<tContabilizacion>();
            lTablaOriginal = TinvContabilizacionDal.GetContabilizacion(
                icinversion, 
                "tinvcon.cinvcontabilizacion", 
                iprocesocdetalle: lprocesocdetalleDat,
                icinvtablaamortizacion: lcinvtablaamortizacionDat,
                icinversionhisultimo: lcinversionhisultimo,
                icinversionrentavariable: lcinversionrentavariableDat, 
                icinvventaaccion: lcinvventaaccionDat,
                icinvprecancelacion: lcinvprecancelacionDat,
                imora: iMora);

            long cInvContabilizacion = TinvContabilizacionDal.GetcInvContabilizacion();

            clsValidar lclsValidar = new clsValidar();

            clsConvert lclsConvert = new clsConvert();

            int lIndice = 0;
            int lFinal;

            bool lblnControl = true;

            dynamic lTablaInterfazA = null;
            dynamic lTablaInterfaz = null;

            try
            {
                lTablaInterfazA = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistroContabilidad"].ToString());

            }
            catch
            {
                lblnControl = false;
            }

            if (lblnControl)
            {



                long? lcinvtablaamortizacion = null;

                try
                {
                    lcinvtablaamortizacion = long.Parse(rqmantenimiento.Mdatos["cinvtablaamortizacion"].ToString());
                }
                catch
                { }


                long? lcinvprecancelacion = null;

                try
                {
                    lcinvprecancelacion = long.Parse(rqmantenimiento.Mdatos["cinvprecancelacion"].ToString());
                }
                catch
                { }


                long? lcinversionrentavariable = null;

                try
                {
                    lcinversionrentavariable = long.Parse(rqmantenimiento.Mdatos["cinversionrentavariable"].ToString());
                }
                catch
                { }

                long? lcinvventaaccion = null;

                try
                {
                    lcinvventaaccion = long.Parse(rqmantenimiento.Mdatos["cinvventaaccion"].ToString());
                }
                catch
                { }



                string lprocesocdetalle = rqmantenimiento.Mdatos["procesocdetalle"].ToString();

                decimal lTotalDebe = 0;
                decimal lTotalHaber = 0;

                int lentidadccatalogobancos = 1224;
                string lentidadcdetallebancos = "";
                int lentidadccatalogocomisionbolsa = 1215;
                string lentidadcdetallecomisionbolsa = "";
                int lentidadccatalogoretencion = 0;
                string lentidadcdetalleretencion = "";
                int lentidadccatalogogeneral = 1213;
                string lentidadcdetallegeneral = "";

                string linstrumentocdetalle = "";
                string lcentrocostocdetalle = "";
                try
                {
                    dynamic linstrumento = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosgrabar"].ToString());

                    foreach (var item in linstrumento)
                    {

                        lentidadcdetallebancos = item.bancocdetalle;
                        lentidadcdetallecomisionbolsa = item.bolsavalorescdetalle;
                        lentidadcdetallegeneral = item.emisorcdetalle;

                        break;

                    }

                }
                catch
                {

                    if (icinversion != -1)
                    {
                        tinvinversion inversion = TinvInversionDal.Find(icinversion);
                        lentidadcdetallebancos = inversion.bancocdetalle;
                        lentidadcdetallecomisionbolsa = inversion.bolsavalorescdetalle;
                        lentidadcdetallegeneral = inversion.emisorcdetalle;
                        linstrumentocdetalle = inversion.instrumentocdetalle;
                        lcentrocostocdetalle = inversion.centrocostocdetalle;
                    }

                }

                string lbancoforzar = "";

                try
                {
                    lbancoforzar = rqmantenimiento.Mdatos["bancoforzar"].ToString();
                }
                catch
                { }

                if (lbancoforzar != "") lentidadcdetallebancos = lbancoforzar;

                if (icinversion != -1)
                {
                    if (linstrumentocdetalle == "")
                    {
                        tinvinversion inversion = TinvInversionDal.Find(icinversion);
                        linstrumentocdetalle = inversion.instrumentocdetalle;
                        if (lcentrocostocdetalle == "") lcentrocostocdetalle = inversion.centrocostocdetalle;
                    }

                    if (lcentrocostocdetalle == "")
                    {
                        tinvinversion inversion = TinvInversionDal.Find(icinversion);
                        lcentrocostocdetalle = inversion.centrocostocdetalle;
                    }
                }



                lFinal = lTablaInterfazA.Count - 1;

                List<tinvplantillacontable> tInvPlantilla = null;

                List<tContabiliza> lContabiliza = new List<tContabiliza>();

                for (int i = lIndice; i <= lFinal; i++)
                {

                    int lentidadccatalogo = 0;

                    string lentidadcdetalle = "";


                    if (lTablaInterfazA[i].rubrocdetalle == "BANCOS")
                    {
                        lentidadccatalogo = lentidadccatalogobancos;
                        lentidadcdetalle = lentidadcdetallebancos;
                    }
                    else if (lTablaInterfazA[i].rubrocdetalle == "COMBOL")
                    {
                        lentidadccatalogo = lentidadccatalogocomisionbolsa;
                        lentidadcdetalle = lentidadcdetallecomisionbolsa;
                    }
                    else if (lTablaInterfazA[i].rubrocdetalle == "RET" ||
                        lTablaInterfazA[i].rubrocdetalle == "RETFNA" ||
                        lTablaInterfazA[i].rubrocdetalle == "CXC" ||
                        lTablaInterfazA[i].rubrocdetalle == "CXP" ||
                        lTablaInterfazA[i].rubrocdetalle == "CXPFNA" ||
                        lTablaInterfazA[i].rubrocdetalle == "FONORD")
                    {
                        lentidadccatalogo = lentidadccatalogoretencion;
                        lentidadcdetalle = lentidadcdetalleretencion;
                    }
                    else
                    {

                        if (icinversion == -1)
                        {

                            lentidadccatalogo = lTablaInterfazA[i].emisorccatalogo;
                            lentidadcdetalle = lTablaInterfazA[i].emisorcdetalle;

                        }
                        else
                        {
                            lentidadccatalogo = lentidadccatalogogeneral;
                            lentidadcdetalle = lentidadcdetallegeneral;
                        }
                    }


                    decimal lvalor = 0;

                    try
                    {

                        string lMensaje = "";
                        lvalor = lclsValidar.clsValidarDecimal((string)lTablaInterfazA[i].valor, ref lMensaje, iblnValidaPositivo: false);

                    }
                    catch
                    { }


                    if (lvalor != 0)
                    {


                        if (i == lIndice && lbancoforzar != "")
                        {

                            tgencatalogodetalle tgenCatDet = TgenCatalogoDetalleDal.Find(1224, lbancoforzar);

                            if (tgenCatDet != null)
                            {
                                if (tgenCatDet.clegal != null && tgenCatDet.clegal.Trim().Length != 0)
                                {
                                    tinvinversion tinvSaldo = TinvInversionDal.FindxEmisor(1213, tgenCatDet.clegal.Trim());
                                    if (tinvSaldo != null)
                                    {
                                        DateTime fecha = DateTime.Now;

                                        decimal lValorNominal = 0;
                                        if (tinvSaldo.valornominal != null) lValorNominal = tinvSaldo.valornominal.Value;
                                        tinvSaldo.valornominal = lValorNominal + lvalor;
                                        Sessionef.Actualizar(tinvSaldo);

                                        long lcinvEmiValNom = TinvEmisorValorNominalDal.GetcinvEmisorValorNominal();



                                        //tinvemisorvalornominal tinvValNom = TinvEmisorValorNominalDal

                                        // INI

                                        tinvemisorvalornominal tTablaHis = new tinvemisorvalornominal();

                                        tTablaHis.cinvemisorvalornominal = lcinvEmiValNom;
                                        tTablaHis.optlock = 0;
                                        tTablaHis.emisorccatalogo = 1213;
                                        tTablaHis.emisorcdetalle = tgenCatDet.clegal.Trim();
                                        tTablaHis.ftransaccion = (fecha.Year * 10000) + (fecha.Month * 100) + fecha.Day;
                                        tTablaHis.valornominal = lvalor;
                                        //tTablaHis.precio
                                        tTablaHis.fingreso = DateTime.Now;
                                        tTablaHis.cusuarioing = rqmantenimiento.Cusuario;
                                        //tTablaHis.debito
                                        //tTablaHis.saldo

                                        tTablaHis.transaccionccatalogo = 1219;
                                        tTablaHis.transaccioncdetalle = "CAP";
                                        tTablaHis.estadoccatalogo = 1204;
                                        tTablaHis.estadocdetalle = "APR";
                                        tTablaHis.motivo = "PAGO DIVIDENDO";
                                        Sessionef.Grabar(tTablaHis);


                                        // FIN


                                    }
                                }
                            }
                        }

                        string lprocesocdetalleAux = lprocesocdetalle;

                        try
                        {
                            if (lTablaInterfazA[i].procesocdetalle != null) lprocesocdetalleAux = (string)lTablaInterfazA[i].procesocdetalle;
                        }
                        catch
                        { }

                        tInvPlantilla = TinvContabilizacionDal.obtenerContabilizacion(
                            lprocesocdetalleAux, 
                            (string)lTablaInterfazA[i].rubrocdetalle, 
                            lentidadccatalogo, 
                            lentidadcdetalle,
                            linstrumentocdetalle, 
                            lcentrocostocdetalle,
                            icinversion);

                        if (tInvPlantilla.Count == 0)
                        {
                            rqmantenimiento.Response.Add("Error", 1);
                            throw new AtlasException("INV-0017", "NO ESTÁ DEFINIDA LA CUENTA CONTABLE PARA {0} PARA EL RUBRO {1} ", lprocesocdetalleAux, (string)lTablaInterfazA[i].rubrocdetalle);
                        }

                        bool lblndebito = false;

                        if (lTablaInterfazA[i].debito == null)
                        {
                            lblndebito = (bool)tInvPlantilla[0].debito;

                        }
                        else
                        {
                            lblndebito = (bool)lTablaInterfazA[i].debito;
                        }

                        if (lblndebito)
                        {
                            lTotalDebe = lTotalDebe + lvalor;
                        }
                        else
                        {
                            lTotalHaber = lTotalHaber + lvalor;
                        }

                        string lcpartidaingreso = null;

                        tpptcuentaclasificador lcuentaclasificador = TpptCuentaClasificadorDal.Find(1, (string)tInvPlantilla[0].ccuenta, 12);

                        if (lcuentaclasificador != null)
                        {
                            lcpartidaingreso = lcuentaclasificador.cclasificador;
                        }


                        lContabiliza.Add(
                            new tContabiliza
                            {

                                rubroccatalogo = 1219
                                ,
                                rubrocdetalle = (string)lTablaInterfazA[i].rubrocdetalle
                                ,
                                debito = lblndebito
                                ,
                                valordebe = lblndebito ? lvalor : 0
                                ,
                                valorhaber = lblndebito ? 0 : lvalor
                                ,
                                valor = lvalor
                                ,
                                ccuenta = (string)tInvPlantilla[0].ccuenta
                                ,
                                cinvtablaamortizacion = lcinvtablaamortizacion
                                ,
                                cinvprecancelacion = lcinvprecancelacion
                                ,
                                cinversionrentavariable = lcinversionrentavariable
                                ,procesoccatalogo = 1220
                                ,
                                procesocdetalle = lprocesocdetalle
                                ,
                                ccomprobante = null
                                ,
                                fcontable = null
                                ,
                                particion = null
                                ,
                                secuencia = null
                                ,
                                ccompania = null
                                , cpartidaingreso = lcpartidaingreso
                                , cinversionhis = lcinversionhisultimo
                                ,
                                cinvventaaccion = lcinvventaaccion


                            }
                            );

                    }

                }

                if (lTotalDebe != lTotalHaber)
                {

                    throw new AtlasException("BMON-012", "ECUACION CONTABLE BASICA NO CUADRA DEUDOR: {0} ACCREDOR: {1} ", lTotalDebe, lTotalHaber);

                }
                else if (lTotalDebe == 0)
                {
                    throw new AtlasException("INV-0018", "PARAMETRIZACIÓN CONTABLE NO DEFINIDA");
                }

                lTablaInterfaz = lContabiliza;
            }
            else
            {
                try
                {
                    if (rqmantenimiento.Mdatos["lregistroscontabilizacion"] == null)
                    {
                        return;
                    }
                }
                catch
                {
                    return;
                }

                lTablaInterfaz = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistroscontabilizacion"].ToString());
            }


            tinvcontabilizacion tInvContabilizacion = null;

            lIndice = 0;

            lFinal = lTablaInterfaz.Count - 1;

            tInvContabilizacion = null;

            if (lTablaOriginal != null)
            {

                foreach (var item in lTablaOriginal)
                {

                    if (lIndice <= lFinal)
                    {

                        tInvContabilizacion = TinvContabilizacionDal.FindContabilizacion(item.cinvcontabilizacion);
                        tInvContabilizacion.cinversion = icinversion;
                        tInvContabilizacion.cinvtablaamortizacion = lTablaInterfaz[lIndice].cinvtablaamortizacion;

                        tInvContabilizacion.cinvprecancelacion = lTablaInterfaz[lIndice].cinvprecancelacion;

                        tInvContabilizacion.cinversionrentavariable = lTablaInterfaz[lIndice].cinversionrentavariable;
                        tInvContabilizacion.procesoccatalogo = lTablaInterfaz[lIndice].procesoccatalogo;
                        tInvContabilizacion.procesocdetalle = lTablaInterfaz[lIndice].procesocdetalle;
                        tInvContabilizacion.rubroccatalogo = lTablaInterfaz[lIndice].rubroccatalogo;
                        tInvContabilizacion.rubrocdetalle = lTablaInterfaz[lIndice].rubrocdetalle;
                        tInvContabilizacion.ccomprobante = lTablaInterfaz[lIndice].ccomprobante;
                        tInvContabilizacion.cinvventaaccion = lTablaInterfaz[lIndice].cinvventaaccion;

                        string lcpartidaingreso = null;

                        try
                        {
                            lcpartidaingreso = lTablaInterfaz[lIndice].cpartidaingreso.Value;
                        }
                        catch
                        {

                            try
                            {
                                lcpartidaingreso = lTablaInterfaz[lIndice].cpartidaingreso;

                            }
                            catch
                            { }

                        }

                        tInvContabilizacion.cpartidaingreso = lcpartidaingreso;

                        tInvContabilizacion.fcontable = null;
                        try
                        {
                            tInvContabilizacion.fcontable = (int)lTablaInterfaz[lIndice].fcontable.Value;
                        }
                        catch
                        { }

                        tInvContabilizacion.particion = lTablaInterfaz[lIndice].particion;
                        tInvContabilizacion.secuencia = lTablaInterfaz[lIndice].secuencia;
                        tInvContabilizacion.ccompania = lTablaInterfaz[lIndice].ccompania;

                        tInvContabilizacion.valor = lTablaInterfaz[lIndice].valor;
                        tInvContabilizacion.ccuenta = lTablaInterfaz[lIndice].ccuenta;
                        tInvContabilizacion.debito = lTablaInterfaz[lIndice].debito;
                        tInvContabilizacion.fmodificacion = DateTime.Now;
                        tInvContabilizacion.cusuariomod = rqmantenimiento.Cusuario;

                        //tInvContabilizacion.mora = (byte)iMora;

                        Sessionef.Actualizar(tInvContabilizacion);
                    }
                    else
                    {
                        tInvContabilizacion = TinvContabilizacionDal.FindContabilizacion(item.cinvcontabilizacion);
                        Sessionef.Eliminar(tInvContabilizacion);
                    }
                    lIndice++;

                }


            }


            int? lfcontable;


            for (int i = lIndice; i <= lFinal; i++)
            {

                int? lprocesoccatalogo = null;

                lprocesoccatalogo = lTablaInterfaz[i].procesoccatalogo;

                string lprocesocdetalle = null;

                lprocesocdetalle = lTablaInterfaz[i].procesocdetalle;

                string lccomprobante = lTablaInterfaz[i].ccomprobante == null ? "" : lTablaInterfaz[i].ccomprobante.value;

                int? lparticion = lTablaInterfaz[i].particion == null ? null : lTablaInterfaz[i].particion.value;
                int? lsecuencia = lTablaInterfaz[i].secuencia == null ? null : lTablaInterfaz[i].secuencia.value;
                int? lccompania = lTablaInterfaz[i].ccompania == null ? null : lTablaInterfaz[i].ccompania.value;

                

                long? lcinvtablaamortizacion = null;

                try
                {
                    lcinvtablaamortizacion = (long)lTablaInterfaz[i].cinvtablaamortizacion;
                }
                catch
                { }

                if (lcinvtablaamortizacion == null)
                {
                    try
                    {
                        lcinvtablaamortizacion = (long)lTablaInterfaz[i].cinvtablaamortizacion.Value;
                    }
                    catch
                    { }
                }

                long? lcinvprecancelacion = null;

                try
                {
                    lcinvprecancelacion = (long)lTablaInterfaz[i].cinvprecancelacion;
                }
                catch
                { }

                if (lcinvprecancelacion == null)
                {
                    try
                    {
                        lcinvprecancelacion = (long)lTablaInterfaz[i].cinvprecancelacion.Value;
                    }
                    catch
                    { }
                }

                long? lcinvventaaccion = null;

                try
                {
                    lcinvventaaccion = (long)lTablaInterfaz[i].cinvventaaccion;
                }
                catch
                { }

                if (lcinvventaaccion == null)
                {
                    try
                    {
                        lcinvventaaccion = (long)lTablaInterfaz[i].cinvventaaccion.Value;
                    }
                    catch
                    { }
                }



                long? lcinversionrentavariable = null;

                try
                {
                    lcinversionrentavariable = (long)lTablaInterfaz[i].cinversionrentavariable;
                }
                catch
                { }

                if (lcinversionrentavariable == null)
                {
                    try
                    {
                        lcinversionrentavariable = (long)lTablaInterfaz[i].cinversionrentavariable.Value;
                    }
                    catch
                    { }
                }

                lfcontable = null;
                try
                {
                    lfcontable = lclsConvert.intFecha(lTablaInterfaz[i].fcontable);
                }
                catch
                { }

                if (lfcontable == null)
                {
                    try
                    {
                        lfcontable = lclsConvert.intFecha(lTablaInterfaz[i].fcontable.Value);
                    }
                    catch
                    { }

                }

                int lrubroccatalogo;
                string lrubrocdetalle;
                decimal lvalor;
                string lccuenta;
                bool ldebito;
                string lcpartidaingreso = null;

                try
                {
                    lcpartidaingreso = lTablaInterfaz[i].cpartidaingreso.Value;
                }
                catch
                {
                    lcpartidaingreso = lTablaInterfaz[i].cpartidaingreso;
                }

                try
                {
                    lrubroccatalogo = (int)lTablaInterfaz[i].rubroccatalogo.Value;
                    lrubrocdetalle = lTablaInterfaz[i].rubrocdetalle.Value;
                    lvalor = Math.Abs((decimal)lTablaInterfaz[i].valor.Value);
                    lccuenta = lTablaInterfaz[i].ccuenta.Value;
                    ldebito = (bool)lTablaInterfaz[i].debito.Value;
                }
                catch
                {
                    lrubroccatalogo = lTablaInterfaz[i].rubroccatalogo;
                    lrubrocdetalle = lTablaInterfaz[i].rubrocdetalle;
                    lvalor = lTablaInterfaz[i].valor;
                    lccuenta = lTablaInterfaz[i].ccuenta;
                    ldebito = lTablaInterfaz[i].debito;
                }

                TinvContabilizacionDal.Insertar(
                    cInvContabilizacion,
                    icinversion,
                    lcinvtablaamortizacion,
                    lcinversionrentavariable,
                    lprocesoccatalogo,
                    lprocesocdetalle,
                    lrubroccatalogo,
                    lrubrocdetalle,
                    lccomprobante,
                    lfcontable,
                    lparticion,
                    lsecuencia,
                    lccompania,
                    Math.Abs( lvalor),
                    lccuenta,
                    ldebito,
                    rqmantenimiento.Cusuario, 
                    lcpartidaingreso, 
                    lcinversionhisultimo,
                    lcinvventaaccion,
                    lcinvprecancelacion,
                    iMora);

                cInvContabilizacion++;

            }


        }


    }

    public class tContabiliza
    {


        public int rubroccatalogo;
        public string rubrocdetalle;
        public bool debito;
        public decimal valordebe;
        public decimal valorhaber;
        public string ccuenta;
        public decimal valor;
        public long? cinvtablaamortizacion;
        public long? cinvprecancelacion;
        public int procesoccatalogo;
        public string procesocdetalle;
        public string ccomprobante;
        public int? fcontable;
        public int? particion;
        public int? secuencia;
        public int? ccompania;
        public long? cinversionrentavariable;
        public long? cinversionhis;
        public string cpartidaingreso;
        public long? cinvventaaccion;

    }

}
