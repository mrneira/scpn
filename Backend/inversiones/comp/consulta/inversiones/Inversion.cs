using System;
using System.Collections.Generic;
using core.componente;
using dal.inversiones.inversiones;
using dal.inversiones.contabilizacion;
using dal.inversiones.tablaamortizaciontmp;
using util.dto.consulta;
using Microsoft.VisualBasic;
using Newtonsoft.Json;
using util;
using inversiones.comp.mantenimiento.inversiones;
using util.dto.mantenimiento;
using modelo;
using dal.inversiones.bancodetalle;
using dal.generales;

using System.Linq;
using util.servicios.ef;

using dal.inversiones.precioscierre;
/// <summary>
/// </summary>

//using modelo;
//using System;


namespace inversiones.comp.consulta.inversiones
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para las inversiones de renta fija y variables.
    /// </summary>
    class GetInversion : ComponenteConsulta
    {
        /// <summary>
        /// Ejecuta las clases de consultas de inversiones.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            // CCA 20240318
            if (rqconsulta.Mdatos.ContainsKey("emisorcdetalle"))
            {
                string lSector = "";

                lSector = TinvInversionDal.FindTSector(rqconsulta.Mdatos["emisorcdetalle"].ToString());

                rqconsulta.Response["idSector"] = lSector;
            }

            switch (int.Parse(rqconsulta.Mdatos["inversion"].ToString()))
            {
                case 0:

                    List<tTablaAmortizacion> lresp = new List<tTablaAmortizacion>();

                    lresp = TinvInversionDal.GetTablaAmortiza(rqconsulta);

                    rqconsulta.Response["TABLAAMORTIZA"] = lresp;

                    break;

                case 1:

                    this.obtenerInversion(rqconsulta);

                    break;

                case 2:

                    List<tTablaAmortizacion> lrespTab1 = new List<tTablaAmortizacion>();
                    
                    lrespTab1 = TinvInversionDal.GetTablaAmortizacion((long)rqconsulta.Mdatos["cinversion"]);

                    rqconsulta.Response["TABAMO"] = lrespTab1;

                    break;

                case 3:

                    DateTime lfcolocacion = DateTime.Parse(rqconsulta.Mdatos["fcolocacion"].ToString());
                    DateTime lfvencimiento = lfcolocacion.AddDays(long.Parse(rqconsulta.Mdatos["plazo"].ToString()));
                    DateTime lDateNow = DateTime.Now;

                    rqconsulta.Response["FECHAVENCIMIENTO"] = lfvencimiento;
                    break;

                case 4:

                    IList<Dictionary<string, object>> lrespRubro = null;
                    lrespRubro = TinvInversionDal.GetRubrosContablesAll();
                    rqconsulta.Response["RUBROSCONTABLES"] = lrespRubro;
                    break;

                case 5:

                    List<tContabilizacion> lrespRubros = new List<tContabilizacion>();

                    string lprocesocdetalle = "";

                    try
                    {
                        lprocesocdetalle = rqconsulta.Mdatos["procesocdetalle"].ToString();
                    }
                    catch
                    { }

                    lrespRubros = TinvContabilizacionDal.GetContabilizacion((long)rqconsulta.Mdatos["cinversion"], iprocesocdetalle: lprocesocdetalle);

                    rqconsulta.Response["RUBROSCONTABILIZA"] = lrespRubros;

                    break;

                case 6:



                    dynamic array = JsonConvert.DeserializeObject(rqconsulta.Mdatos["pTIR"].ToString());

                    bool lblnProcesa = false;

                    double[] tmpCashflows = new double[0];


                    int lLength = 0;

                    foreach (var item in array)
                    {
                        if (item.total < 0)
                        {
                            lblnProcesa = true;
                        }

                        if (lblnProcesa)
                        {

                            lLength = tmpCashflows.Length + 1;

                            Array.Resize(ref tmpCashflows, lLength);

                            try
                            {
                                tmpCashflows[lLength - 1] = item.total;
                            }
                            catch
                            { }


                        }


                    }


                    double tmpIrr = 0;

                    try
                    {
                        tmpIrr = Financial.IRR(ref tmpCashflows, 0.000001) * 100;

                        // MIRR


                    }
                    catch (Exception ex)
                    {
                        tmpIrr = 0;
                    }

                    rqconsulta.Response["TIR"] = tmpIrr;

                    break;

                case 7:

                    this.inicio(rqconsulta);

                    break;

                case 8:

                    long dias = 0;

                    long lfinicio = long.Parse(rqconsulta.Mdatos["finicio"].ToString());
                    long lffin = long.Parse(rqconsulta.Mdatos["ffinal"].ToString());

                    string lbasecalculo = rqconsulta.Mdatos["calendarizacioncdetalle"].ToString().Trim();

                    if (lffin > lfinicio)
                    {
                        if (lbasecalculo.Equals("360"))
                        {
                            dias = Fecha.Resta360((int)lffin, (int)lfinicio);
                        }
                        else
                        {
                            Alta lAlta = new Alta();
                            DateTime fec = new DateTime();
                            fec = lAlta.convertToDateNotNull(lffin);
                            dias = (long)fec.Subtract(lAlta.convertToDateNotNull(lfinicio)).TotalDays;
                        }
                    }

                    rqconsulta.Response["DIAS"] = dias;

                    break;

                case 9:

                    this.construyeTablaPrevio(rqconsulta);

                    break;

                case 10:
                    this.calculoSinTabla(rqconsulta);
                    break;
                case 11:

                    IList<Dictionary<string, object>> lrespVar = new List<Dictionary<string, object>>();
                    lrespVar = TinvInversionDal.GetCuotas(rqconsulta);
                    rqconsulta.Response["REGISTROCUOTAS"] = lrespVar;
                    break;
                case 12:
                    this.obtenerIdBancoOficios(rqconsulta);
                    break;
                case 13:
                    this.calculaPorcentajeParticipacion(rqconsulta);
                    decimal itasaBolsa = 0;

                    if (rqconsulta.Mdatos.ContainsKey("pBolsavalorescdetalle"))
                    {

                        string bolsa = (rqconsulta.Mdatos["pBolsavalorescdetalle"] == null) ? "" : rqconsulta.Mdatos["pBolsavalorescdetalle"].ToString();

                        if (bolsa.Equals("GYE"))
                        {
                            itasaBolsa = TinvInversionDal.GetParametroNumero("TASA_BOLSA_VALORES_GYE");
                        }
                        else
                            if (bolsa.Equals("UIO"))
                        {

                            itasaBolsa = TinvInversionDal.GetParametroNumero("TASA_BOLSA_VALORES");
                        }
                        else {
                            itasaBolsa = 0;
                        }
                    }
                    rqconsulta.Response["tasaComision"] = itasaBolsa;

                    break;
                case 14:

                    obtieneValorNominal(rqconsulta);
                    break;
            }

        }

        private void obtieneValorNominal(RqConsulta rqconsulta)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            string lEmisorcdetalle = rqconsulta.Mdatos["emisorcdetalle"].ToString();

            List<tinvinversion> obj = contexto.tinvinversion.AsNoTracking().Where(x => x.emisorccatalogo == 1213 && x.emisorcdetalle.Equals(lEmisorcdetalle)).ToList();

            decimal lSaldo = 0;

            if (obj[0].valornominal != null) lSaldo = (decimal)obj[0].valornominal;

            /*

            List<tinvemisorvalornominal> objValNom = contexto.tinvemisorvalornominal.AsNoTracking().Where(x => x.emisorccatalogo == 1213 && 
                x.emisorcdetalle.Equals(lEmisorcdetalle) && 
                x.transaccioncdetalle.Equals("INT")).ToList();

            foreach (var item in objValNom)
            {

                if (item.valornominal != null)
                {
                    if (item.debito == null)
                    {
                        lSaldo = lSaldo - (decimal)item.valornominal;
                    }
                    else if (item.debito != true)
                    {
                        lSaldo = lSaldo - (decimal)item.valornominal;
                    }
                    else
                    {
                        lSaldo = lSaldo + (decimal)item.valornominal;
                    }

                }


            }
            */

            rqconsulta.Response["VALORNOMINAL"] = lSaldo;

        }

        /// <summary>
        /// Genera la alerta en el caso de que la inversión exceda al porcentaje límite asignado al emisor.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        private void calculaPorcentajeParticipacion(RqConsulta rqconsulta)
        {
            try
            {
                string[] lRetorna = TinvInversionDal.alertaPorcentajeInversion(
                    long.Parse(rqconsulta.Mdatos["cinversion"].ToString()),
                    rqconsulta.Mdatos["emisorcdetalle"].ToString(),
                    decimal.Parse(rqconsulta.Mdatos["valor"].ToString()),
                    rqconsulta.Mdatos["instrumentocdetalle"].ToString());

                rqconsulta.Response["ALERTA"] = lRetorna[0];
                rqconsulta.Response["NUMEROERROR"] = lRetorna[1];

            }
            catch
            {
                rqconsulta.Response["ALERTA"] = "";
                rqconsulta.Response["NUMEROERROR"] = 0;
            }


        }

        /// <summary>
        /// Construye la tabla de amortización previa a los cálculos del costo amortizado.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        private void construyeTablaPrevio(RqConsulta rqconsulta)
        {
            RqMantenimiento rqmantenimiento = new RqMantenimiento();

            Alta lAltaTabla = new Alta();

            dynamic arrayTabla = JsonConvert.DeserializeObject(rqconsulta.Mdatos["tablaamortiza"].ToString());

            List<tTablaAmortizacion> ltablaamortizacion = new List<tTablaAmortizacion>();


            bool lblnReajuste = false;

            if (rqconsulta.Mdatos.ContainsKey("reajuste"))
            {

                if (rqconsulta.Mdatos["reajuste"] != null)
                {
                    if (int.Parse(rqconsulta.Mdatos["reajuste"].ToString()) == 1)
                    {
                        lblnReajuste = true;
                    }

                }

            }

            if (lblnReajuste)
            {
                int lnumerolinea = 1;

                decimal lporcentajecalculoprecio = 0;

                if (rqconsulta.Mdatos.ContainsKey("porcentajecalculoprecio"))
                {

                    if (rqconsulta.Mdatos["porcentajecalculoprecio"] != null)
                    {
                        lporcentajecalculoprecio = decimal.Parse(rqconsulta.Mdatos["porcentajecalculoprecio"].ToString());

                    }

                }



                foreach (var item in arrayTabla)
                {
                    ltablaamortizacion.Add(
                    new tTablaAmortizacion()
                    {

                        cinvtablaamortizacion = item.cinvtablaamortizacion
                        ,
                            optlock = item.optlock
                        ,
                            cinversion = item.cinversion
                        ,
                            finicio = item.finicio
                        ,
                            fvencimiento = item.fvencimiento
                        ,
                            plazo = item.plazo
                        ,
                        proyeccioncapital = item.proyeccioncapital
                        ,
                        proyecciontasa = item.proyecciontasa
                        ,
                        proyeccioninteres = item.proyeccioninteres
                        ,
                        valormora = item.valormora
                        ,
                        estadoccatalogo = item.estadoccatalogo
                        ,
                        estadocdetalle = item.estadocdetalle
                        ,
                        fingreso = item.fingreso
                        ,
                        cusuarioing = item.cusuarioing
                        ,
                        fmodificacion = item.fmodificacion
                        ,
                        cusuariomod = item.cusuariomod
                        ,
                        nfinicio = item.mdatos.nfinicio
                        ,
                            nfvencimiento = item.mdatos.nfvencimiento
                        ,
                            total = item.mdatos.total
                        ,
                        saldo = item.capitalxamortizar
                        ,
                        numerolinea = lnumerolinea
                        ,
                        mensaje = ""
                        ,
                        nestado = item.mdatos.nestado
                        ,
                        porcentajecalculoprecio = lporcentajecalculoprecio
                        ,
                        ppv = item.ppv
                        ,
                        vpresente = item.vpresente
                        ,acumuladoaccrual = item.acumuladoaccrual


                    });

                    lnumerolinea++;

                }

            }

            else

            {


                long lperiodo = 0;

                foreach (var item in arrayTabla)
                {

                    lperiodo++;

                    ltablaamortizacion.Add(
                    new tTablaAmortizacion()
                    {

                        cinvtablaamortizacion = item.cinvtablaamortizacion
                    ,
                        optlock = item.optlock
                    ,
                        cinversion = item.cinversion
                    ,
                        finicio = item.finicio
                    ,
                        fvencimiento = item.fvencimiento
                    ,
                        plazo = item.plazo
                    ,
                        proyeccioncapital = item.proyeccioncapital
                    ,
                        proyecciontasa = item.proyecciontasa
                    ,
                        proyeccioninteres = item.proyeccioninteres
                    ,
                        valormora = item.valormora
                    ,
                        estadoccatalogo = item.estadoccatalogo
                    ,
                        estadocdetalle = item.estadocdetalle
                    ,
                        fingreso = item.fingreso
                    ,
                        cusuarioing = item.cusuarioing
                    ,
                        fmodificacion = item.fmodificacion
                    ,
                        cusuariomod = item.cusuariomod
                    ,
                        nfinicio = item.nfinicio
                    ,
                        nfvencimiento = item.nfvencimiento
                    ,
                        total = item.total
                    ,
                        saldo = item.saldo
                    ,
                        numerolinea = item.numerolinea
                    ,
                        mensaje = item.mensaje
                    ,
                        nestado = item.nestado
                    ,
                        porcentajecalculoprecio = item.porcentajecalculoprecio
                    ,
                        ppv = item.ppv
                    ,
                        vpresente = item.vpresente
                    ,
                    acumuladoaccrual = item.acumuladoaccrual
                    ,periodo = lperiodo

                    });

                }
            }

            DateTime lfUltimoPago = DateTime.Parse(rqconsulta.Mdatos["fultimopago"].ToString());


            if (rqconsulta.Mdatos.ContainsKey("pTransaccion"))
            {

                if (rqconsulta.Mdatos["pTransaccion"] != null)
                {
                    if (long.Parse(rqconsulta.Mdatos["pTransaccion"].ToString()) >= 4000)
                    {
                        lfUltimoPago = DateTime.Now;
                    }

                }

            }


            lAltaTabla.ConstruyeTabla(
                rqmantenimiento
                , ltablaamortizacion
                , DateTime.Parse(rqconsulta.Mdatos["fcompra"].ToString())
                , rqconsulta.Mdatos["calendarizacioncdetalle"].ToString()
                , decimal.Parse(rqconsulta.Mdatos["yield"].ToString())
                , DateTime.Parse(rqconsulta.Mdatos["femision"].ToString())
                , decimal.Parse(rqconsulta.Mdatos["tasa"].ToString())
                , lfUltimoPago
                , rqconsulta);

        }


        /// <summary>
        /// Obtener el identificador de la institución financiera para generar los oficios de compra y/o pago de inversiones.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        private void obtenerIdBancoOficios(RqConsulta rqconsulta)
        {
            rqconsulta.Response["ID_BANCO_OFICIO"] = TinvInversionDal.GetParametro("CDETALLE_BANCO_OFICIOS_COMPRA_ACCIONES");
        }

        /// <summary>
        /// Proyecta los intereses de las inversiones que no tienen tabla de amortización.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        private void calculoSinTabla(RqConsulta rqconsulta)
        {

            decimal ltasaBolsa = 0;
            decimal ltasaOperador = 0;
            decimal ltasaRetecion = 0;

            try
            {
                if(rqconsulta.Mdatos.ContainsKey("tasaBolsa"))
                ltasaBolsa = decimal.Parse(rqconsulta.Mdatos["tasaBolsa"].ToString());
            }
            catch { }

            try
            {
                if (rqconsulta.Mdatos.ContainsKey("tasaOperador"))
                    ltasaOperador = decimal.Parse(rqconsulta.Mdatos["tasaOperador"].ToString());
            }
            catch { }

            try
            {
                if (rqconsulta.Mdatos.ContainsKey("tasaRetencion"))
                    ltasaRetecion = decimal.Parse(rqconsulta.Mdatos["tasaRetencion"].ToString());
            }
            catch { }

            long lPlazo = 0;

            try
            {
                if (rqconsulta.Mdatos.ContainsKey("pPlazoxvencer"))
                    lPlazo = long.Parse(rqconsulta.Mdatos["pPlazoxvencer"].ToString());
            }
            catch
            { }

            DateTime lfvencimiento = DateTime.Parse(rqconsulta.Mdatos["pFemision"].ToString()).AddDays(lPlazo);

            Alta lAlta = new Alta();

            decimal? ldecyield = null;

            try
            {
                ldecyield = decimal.Parse(rqconsulta.Mdatos["yield"].ToString());
            }
            catch
            { }

            DateTime? lfcompra = null;

            try
            {
                lfcompra = lAlta.pfObtenerFecha(int.Parse(rqconsulta.Mdatos["fcompra"].ToString()));
            }
            catch
            { }

            lAlta.pGeneraValores(
                decimal.Parse(rqconsulta.Mdatos["pTasa"].ToString())
                , DateTime.Parse(rqconsulta.Mdatos["pFemision"].ToString())
                , DateTime.Parse(rqconsulta.Mdatos["pFultimopago"].ToString())
                , rqconsulta.Mdatos["ptCalendarizacion"].ToString()
                , decimal.Parse(rqconsulta.Mdatos["pCapital"].ToString())
                , decimal.Parse(rqconsulta.Mdatos["pCapital"].ToString())
                , lfvencimiento
                , rqconsulta: rqconsulta
                , iblnUnaSolaCuota: true
                , iporcentajecalculoprecio: decimal.Parse(rqconsulta.Mdatos["pPorcentajecalculoprecio"].ToString())
                , iPlazo: lPlazo
                , itasaBolsa: ltasaBolsa
                , itasaOperador: ltasaOperador
                , itasaRetencion: ltasaRetecion
                , idecyield: ldecyield
                , lncompra: lfcompra);

        }

        /// <summary>
        /// Procedimiento inicial al ejecutar la compra de inversiones.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        private void inicio(RqConsulta rqconsulta)
        {

            string lnstrumentocLegal = "";

            if (rqconsulta.Mdatos.ContainsKey("instrumentocdetalle"))
            {
                try
                {
                    tgencatalogodetalle tCatDetalle = TgenCatalogoDetalleDal.Find(1202, (string)rqconsulta.Mdatos["instrumentocdetalle"]);

                    lnstrumentocLegal = tCatDetalle.clegal;

                }
                catch
                { }

            }


            bool lNoGenerarPlantillasContables = false;

            if (rqconsulta.Mdatos.ContainsKey("noGenerarPlantillasContables"))
            {
                try
                {
                    lNoGenerarPlantillasContables = (bool)rqconsulta.Mdatos["noGenerarPlantillasContables"];
                }
                catch
                { }

            }

            List<tinvContabilidadPlantilla> lrespPlantillaContable = new List<tinvContabilidadPlantilla>();

            List<tinvContabilidadPlantillaAgente> lrespPlantillaContableAgente = new List<tinvContabilidadPlantillaAgente>();

            if (!lNoGenerarPlantillasContables)
            {
                lrespPlantillaContable = TinvInversionDal.obtenerPlantillaContable(rqconsulta);
                lrespPlantillaContableAgente = TinvInversionDal.obtenerPlantillaContableAgente(rqconsulta);
            }

            rqconsulta.Response["PLANTILLACONTABLE"] = lrespPlantillaContable;

            rqconsulta.Response["PLANTILLACONTABLEAGENTE"] = lrespPlantillaContableAgente;

            rqconsulta.Response["AMBIENTE"] = TinvInversionDal.GetParametro().ToString().ToUpper().Trim().Substring(0, 1);
            rqconsulta.Response["ID_AGENTE"] = TinvInversionDal.GetParametro("ID_DEFAULT_AGENTE");
            rqconsulta.Response["RAZON_SOCIAL_AGENTE"] = TinvInversionDal.FindAgenteRazonSocial(long.Parse(rqconsulta.Response["ID_AGENTE"].ToString()));
            rqconsulta.Response["TASA_BOLSA_VALORES"] = TinvInversionDal.GetParametroNumero("TASA_BOLSA_VALORES");
            rqconsulta.Response["TASA_OPERADOR_BOLSA"] = TinvInversionDal.GetParametroNumero("TASA_OPERADOR_BOLSA");
            rqconsulta.Response["TASA_RETENCION"] = TinvInversionDal.GetParametroNumero("TASA_RETENCION");
            rqconsulta.Response["ID_CENTRO_COSTO"] = TinvInversionDal.GetParametro("ID_DEFAULT_CENTRO_COSTO");
            rqconsulta.Response["ID_BANCO_CONTABILIDAD"] = TinvInversionDal.GetParametro("ID_DEFAULT_BANCO_TRANSFER");
            rqconsulta.Response["ID_INSTRUMENTO_CLEGAL"] = lnstrumentocLegal; 
            // TinvInversionDal.GetParametro("ID_DEFAULT_BANCO_TRANSFER");

            string lTasa = "";

            try
            {
                lTasa = rqconsulta.Mdatos["tasa"].ToString();
            }
            catch
            {
                return;
            }

            lTasa = rqconsulta.Mdatos["tasa"].ToString();

            string lSector = "";

            try
            {
                if(rqconsulta.Mdatos.ContainsKey("sector")&& rqconsulta.GetString("sector")!=null)
                lSector =  rqconsulta.Mdatos["sector"].ToString();
            }
            catch
            { }

            //char[] seps = { '^' };

            int[] lcdetalle = { 1002, 1201, 1202, 1203, 1204, 1205, 1206, 1207, 1208, 1209, 1211, 1212, 1213, 1214, 1215, 1216, 1217, 1222, 1224, 305, 12061 };

            int lcount = lcdetalle.Length;

            List<tgencatalogodetalle> lgenCatDetalle = new List<tgencatalogodetalle>();

            for (int i = 0; i < lcount; i++)
            {


                string lcond1 = "";
                string lcond2 = "";
                bool lCondicion = false;

                if (lcdetalle[i] == 1202)
                {

                    lCondicion = !(lTasa == "FIJA");
                    lcond1 = "ACCION";
                    lcond2 = "ACCOPP";

                }
                else if (lcdetalle[i] == 1205)
                {
                    lCondicion = (lSector == "EXT");
                    lcond1 = "EXT";

                }

                if (lcdetalle[i] == 12061)
                {
                    lgenCatDetalle = TinvInversionDal.obtenerTgenDetalle(1206, "VENC",inCondicion: false);
                }
                else if (lcdetalle[i] == 305)
                {
                    lgenCatDetalle = TinvBancoDetalleDal.Find();
                }
                else
                {
                    lgenCatDetalle = TinvInversionDal.obtenerTgenDetalle(lcdetalle[i], lcond1, lcond2, lCondicion);
                }

                List<tinvTgenDetalle> lrespTabla = new List<tinvTgenDetalle>();

                lrespTabla.Add(
                    new tinvTgenDetalle()
                    {
                        label = "..."
                        ,
                        value = null
                    });

                foreach (var item in lgenCatDetalle)
                {


                    lrespTabla.Add(
                        new tinvTgenDetalle()
                        {
                            label = item.nombre
                            ,
                            value = item.cdetalle
                        });


                }


                rqconsulta.Response["Tabla" + lcdetalle[i].ToString().Trim()] = lrespTabla;

            }


        }

        /// <summary>
        /// Obtener la definición de una inversión existente.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        private void obtenerInversion(RqConsulta rqconsulta)
        {


            bool lblnNoGenerarCalculo = false;

            if (rqconsulta.Mdatos.ContainsKey("noGenerarCalculo"))
            {
                try
                {
                    lblnNoGenerarCalculo = (bool)rqconsulta.Mdatos["noGenerarCalculo"];
                }
                catch
                { }

            }

            List<tInversion> lrespInv = new List<tInversion>();

            lrespInv = TinvInversionDal.GetInversion(rqconsulta);

            rqconsulta.Response["INVERSION"] = lrespInv;

            List<tTablaAmortizacion> lrespTab = new List<tTablaAmortizacion>();

            lrespTab = TinvInversionDal.GetTablaAmortizacion((long)rqconsulta.Mdatos["cinversion"],itransaccion: this.obtenerTransaccion(rqconsulta));

            if (rqconsulta.Mdatos.ContainsKey("reajuste"))
            {
                if ((bool)rqconsulta.Mdatos["reajuste"])
                {
                    IList<Dictionary<string, object>> tablatmp = new List<Dictionary<string, object>>();

                    tablatmp = TinvTablaAmortizacionTmpDal.GetTablaPagos((long)rqconsulta.Mdatos["cinversion"]);

                    rqconsulta.Response["TABAMOORIGINAL"] = lrespTab;

                    rqconsulta.Response["TABAMOTMP"] = tablatmp;

                }

            }


            if (lrespTab != null)
            {
                RqMantenimiento rqmantenimiento1 = new RqMantenimiento();

                Alta lAltaTabla1 = new Alta();

                DateTime? lnfcompra = null;
                if (lrespInv[0].fcompra != null) lnfcompra = lAltaTabla1.pfObtenerFecha(int.Parse(lrespInv[0].fcompra.ToString()));

                DateTime? lnultimopago = null;
                if (lrespInv[0].fultimopago != null) lnultimopago = lAltaTabla1.pfObtenerFecha(int.Parse(lrespInv[0].fultimopago.ToString()));

                lAltaTabla1.ConstruyeTabla(
                    rqmantenimiento1
                    , lrespTab
                    , lnfcompra
                    , lrespInv[0].calendarizacioncdetalle
                    , lrespInv[0].yield
                    , lAltaTabla1.pfObtenerFecha(int.Parse(lrespInv[0].femision.ToString()))
                    , lrespInv[0].tasa
                    , lnultimopago
                    , rqconsulta);

                rqconsulta.Response["TABAMO"] = rqconsulta.Response["lregistros"];
            }
            else
            {

                if (lrespTab == null)
                {

                    long lPlazo = 0;
                    try
                    {
                        lPlazo = (long)lrespInv[0].plazo;
                    }
                    catch
                    { }

                    if (lPlazo > 0)
                    {
                        rqconsulta.Mdatos.Add("pTasa", lrespInv[0].tasa);
                        rqconsulta.Mdatos.Add("pPlazoxvencer", lPlazo);
                        rqconsulta.Mdatos.Add("pFemision", lrespInv[0].nfemision);
                        rqconsulta.Mdatos.Add("pFultimopago", lrespInv[0].nfultimopago);
                        rqconsulta.Mdatos.Add("ptCalendarizacion", lrespInv[0].calendarizacioncdetalle);
                        rqconsulta.Mdatos.Add("pCapital", lrespInv[0].valornominal);
                        rqconsulta.Mdatos.Add("pPorcentajecalculoprecio", lrespInv[0].porcentajecalculoprecio);


                        try
                        {
                            rqconsulta.Mdatos.Add("fcompra", lrespInv[0].fcompra);
                        }
                        catch
                        { }


                        try
                        {
                            rqconsulta.Mdatos.Add("yield", lrespInv[0].@yield);
                        }
                        catch
                        { }


                        this.calculoSinTabla(rqconsulta);

                    }

                }
                else
                {
                    rqconsulta.Response["TABAMO"] = lrespTab;
                }



            }

        }

        /// <summary>
        /// Convertir el identificador de una transacción, de string a long.
        /// </summary>
        /// <param name="rqconsulta">Request de consulta.</param>
        /// <returns></returns>
        private long obtenerTransaccion(RqConsulta rqconsulta)
        {

            long ltransaccion = 0;

            if (rqconsulta.Mdatos.ContainsKey("transaccion"))
            {
                if (rqconsulta.Mdatos["transaccion"] != null)
                {

                    ltransaccion = (long)rqconsulta.Mdatos["transaccion"];

                }

            }

            return ltransaccion;
        }

    }

    public class tinvTgenDetalle
    {
        public string label;
        public string value;

    }

}
