
using System;
using System.Collections.Generic;
using System.IO;
using core.componente;
using modelo;
using util.dto.mantenimiento;
using util.dto.consulta;
using Newtonsoft.Json;
using util.servicios.ef;
using dal.generales;
using util;
using System.Linq;
using dal.inversiones.inversiones;
using dal.inversiones.inversioneshis;
using dal.inversiones.tablaamortizacion;
using inversiones.comp.mantenimiento.cargaacciones.vectorprecios;
using LinqToExcel;
using Microsoft.VisualBasic;
using inversiones.comp.mantenimiento.inversiones.contabilizar;

using contabilidad.comp.mantenimiento.comprobante;
using inversiones.comp.mantenimiento.reversar;
using dal.inversiones.tablaamortizaciontmp;
using dal.inversiones.tablaamortizacionhis;
using inversiones.comp.mantenimiento.tesoreria;

using dal.inversiones.contabilizacion;
using dal.inversiones.inversionrentavariable;
using dal.inversiones.vectorprecios;

using dal.inversiones.reajustes;
using dal.inversiones.catalogos;
using inversiones.comp.mantenimiento.migracion;

using core.servicios;
using dal.contabilidad;
using dal.monetario;
using dal.inversiones.plantillacontable;
using contabilidad.comp.mantenimiento;
using dal.talentohumano;

namespace inversiones.comp.mantenimiento.inversiones
{

    /// <summary>
    /// Clase que encapsula los procedimientos funcionales del módulo de inversiones.
    /// </summary>
    public class Alta : ComponenteMantenimiento
    {

        /// <summary>
        /// Mantenimiento de Inversiones.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta el proceso.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {


            switch (rqmantenimiento.Mdatos["cargaarchivo"].ToString())
            {

                case "reajuste":
                    this.rejuste(rqmantenimiento);
                    break;

                case "save":

                    bool lblnApruebaReajuste = false;

                    if (rqmantenimiento.Mdatos.ContainsKey("procesocdetalle"))
                        if (rqmantenimiento.Mdatos["procesocdetalle"] != null && (string)rqmantenimiento.Mdatos["procesocdetalle"] == "REAJUS") lblnApruebaReajuste = true;

                    clsGuardar ClsGuardar = new clsGuardar();
                    long cinversion = ClsGuardar.Cabecera(rqmantenimiento);
                    ClsGuardar.Detalle(rqmantenimiento, cinversion);

                    if (rqmantenimiento.Mdatos.ContainsKey("contabilizar"))
                    {
                        if (rqmantenimiento.Mdatos["contabilizar"] != null)
                        {
                            if ((bool)rqmantenimiento.Mdatos["contabilizar"])
                            {
                                if (lblnApruebaReajuste) this.generaCalculosTablaAmortizacion(rqmantenimiento);

                                contabilizaEjecuta(rqmantenimiento);

                            }
                        }

                    }

                    if (rqmantenimiento.Mdatos.ContainsKey("estadocdetalleAux"))
                    {
                        if (rqmantenimiento.Mdatos["estadocdetalleAux"] != null)
                        {

                            if ((string)rqmantenimiento.Mdatos["estadocdetalleAux"] == "PAG")
                                TinvInversionDal.obtenerImagen(cinversion, rqmantenimiento.Cusuario);
                        }
                    }

                    if (lblnApruebaReajuste) generaNIIFS(rqmantenimiento);

                    rqmantenimiento.Response.Add("cinversion", cinversion);

                    break;

                case "upload":

                    ////// INICIO

                    string path = "";
                    string narchivo = "";
                    string archivo = "";
                    tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
                    path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
                    narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                    archivo = (string)rqmantenimiento.Mdatos["archivo"];
                    //archivo = archivo.Replace("data:text/plain;base64,", "");
                    archivo = archivo.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "");
                    path = path + "/" + narchivo;


                    try
                    {
                        File.WriteAllBytes(path, Convert.FromBase64String(archivo));

                    }
                    catch
                    {
                        throw new AtlasException("INV-0013", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA 'C:\CESANTIA_APP_HOME\SUBIRARCHIVOS' EN EL DISCO 'C:\', PARA POSIBILITAR LA CARGA DE LA TABLA DE AMORTIZACIÓN.");
                    }

                    // INI


                    //var cargatabla = from a in excelFile.WorksheetNoHeader("Precios") select a;

                    var excelFile = new ExcelQueryFactory(path);
                    //var cargatabla = from a in excelFile.Worksheet(0) select a;
                    var cargatabla = from a in excelFile.WorksheetNoHeader(0) select a;
                    List<tTablaAmortizacion> ltablaamortizacion = new List<tTablaAmortizacion>();
                    long lindice = 0;
                    bool controlError = true;

                    long lfinicio = 0;

                    clsValidar lclsValidar = new clsValidar();

                    DateTime? lnfinicio = null;

                    DateTime? lfemision = null;

                    DateTime? lncompra = null;

                    DateTime? lnvalor = null;

                    int? lplazo = null;

                    decimal? ldecTasaCupon = null;
                    decimal? ldecyield = null;

                    string lcalendarización = null;

                    string lstrMensajeCabecera = "";

                    //decimal? ldecSaldo = 0;

                    foreach (var registro in cargatabla)
                    {

                        string lstrFecha;
                        string lstrMensaje = "";
                        if (lindice < 6)
                        {

                            switch (lindice)
                            {
                                case 0:
                                    lstrFecha = lclsValidar.asignarObjeto(registro[1]);
                                    lncompra = DateTime.Parse(lstrFecha);
                                    break;
                                case 1:
                                    lstrFecha = lclsValidar.asignarObjeto(registro[1]);
                                    lnvalor = DateTime.Parse(lstrFecha);
                                    break;
                                case 2:
                                    ldecTasaCupon = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(registro[1]), ref lstrMensajeCabecera, "Tasa de Cupón", 7);
                                    break;
                                case 3:
                                    lcalendarización = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[1]), 3, ref lstrMensajeCabecera, " la Base de Cálculo del Interés"); //lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(registro[1]), ref lstrMensaje, "Tasa de Cupón", 7);
                                    break;
                                case 4:
                                    ldecyield = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(registro[1]), ref lstrMensajeCabecera, "Yield", 7);
                                    break;
                            }

                            lindice++;
                            continue;
                        }

                        lstrFecha = lclsValidar.asignarObjeto(registro[0]);
                        if (lstrFecha.Trim() == "")
                        {
                            break;
                        }

                        if (lindice == 6)
                        {
                            lnfinicio = DateTime.Parse(lstrFecha);
                            lfemision = lnfinicio;
                        }
                        else
                        {

                            long lfecha = 0;

                            decimal lproyeccioninteres = 0;
                            decimal lproyecciontasa = 0;
                            decimal lproyeccioncapital = 0;

                            try
                            {
                                lfecha = (long)lclsValidar.clsValidarFechaFormato(ref lstrMensaje, registro[0]);
                            }
                            catch
                            {
                                lclsValidar.mensajeAsignar(ref lstrMensaje, lclsValidar.pfErrorFecha());
                            }


                            DateTime? lnfvencimiento = null;
                            lnfvencimiento = this.convertToDate(lfecha);

                            lproyeccioninteres = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(registro[1]), ref lstrMensaje, "Proyección Interés", 11);

                            lproyecciontasa = ldecTasaCupon.Value * 0.01m;

                            lproyeccioncapital = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(registro[3]), ref lstrMensaje, "Proyección Capital", 10);

                            lplazo = null;
                            if (lnfinicio != null)
                            {
                                DateTime fec = new DateTime();
                                fec = this.convertToDateNotNull(lfecha);
                                int lplazoaux = 0;
                                //long cinversionn=long.Parse( rqmantenimiento.Mdatos["cinversion"].ToString());
                                if (lcalendarización.Equals("360"))
                                {
                                    lplazoaux = Fecha.Resta360((int)lfecha, int.Parse(lnfinicio.Value.ToString("yyyyMMdd")));
                                }
                                else
                                {

                                    lplazoaux = (int)fec.Subtract(DateTime.Parse(lnfinicio.ToString())).TotalDays;
                                }
                                lplazo = (int)lplazoaux;

                                if (lplazo.Value<=0)
                                {
                                    lclsValidar.mensajeAsignar(ref lstrMensaje, "El plazo debe ser un valor mayor a cero, revice la FECHA de EMISIÓN de la inversión.");
                                }
                            }

                            if (lstrMensaje.Trim().Length == 0)
                            {
                                lstrMensaje = "Ok";
                            }
                            else
                            {
                                if (controlError)
                                {
                                    controlError = false;
                                }
                            }
                            tTablaAmortizacion obj = new tTablaAmortizacion();

                            obj.numerolinea = (int)lindice - 1;
                            obj.nfvencimiento = lnfvencimiento;
                            obj.nfinicio = lnfinicio;
                            obj.fvencimiento = (int)lfecha;
                            obj.finicio = int.Parse(lnfinicio.Value.ToString("yyyyMMdd"));
                            obj.plazo = lplazo;
                            obj.mensaje = lstrMensaje;
                            obj.proyeccioninteres = lproyeccioninteres;
                            obj.proyecciontasa = lproyecciontasa;
                            obj.proyeccioncapital = lproyeccioncapital;
                            obj.estadoccatalogo = 1223;
                            obj.estadocdetalle = "PEN";
                            obj.nestado = "PENDIENTE";
                            obj.fultimoaccrual = obj.finicio;
                            obj.vinteresesperado = lproyeccioninteres / lplazo.Value;
                            ltablaamortizacion.Add(obj);



                            try
                            {

                                lfinicio = int.Parse(lnfinicio.Value.ToString("yyyyMMdd"));
                                lnfinicio = null;

                                DateTime lnfinicioAux = new DateTime();

                                if (lnfvencimiento != null)
                                {
                                    DateTime fec = new DateTime();
                                    fec = this.convertToDateNotNull(lfecha);
                                    lnfinicioAux = fec;
                                    lfinicio = (lnfinicioAux.Year * 10000) + (lnfinicioAux.Month * 100) + lnfinicioAux.Day;

                                    //long lplazoaux = 0;
                                    //lplazoaux = (long)fec.Subtract(lnfinicioAux).TotalDays;
                                    //lplazo = (int)lplazoaux;
                                    lnfinicio = lnfinicioAux;
                                }

                            }
                            catch
                            {
                                lnfinicio = null;
                            }

                        }


                        lindice++;
                    }

                   

                    if (lstrMensajeCabecera != "")
                    {
                        rqmantenimiento.Response.SetCod("000");
                        rqmantenimiento.Response.SetMsgusu("EXISTEN ERRORES EN LA CARGA: " + lstrMensajeCabecera);
                    }
                    else
                    {

                        if (!controlError)
                        {
                            rqmantenimiento.Response.SetCod("000");
                            rqmantenimiento.Response.SetMsgusu("EXISTEN ERRORES EN LA CARGA. REVISE LOS MENSAJES EN LA COLUMNA MENSAJE");
                        }
                        else
                        { 
                            int lsubirInversion = 0;

                            try
                            {
                                lsubirInversion = int.Parse(rqmantenimiento.Mdatos["subirInversion"].ToString());
                            }
                            catch
                            { }

                            if (lsubirInversion == 1)
                            {

                                tinvinversion tinv = TinvInversionDal.Find(long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()));

                                this.ConstruyeTabla(rqmantenimiento, ltablaamortizacion, lncompra, lcalendarización, ldecyield, lfemision, ldecTasaCupon, lnvalor
                                    ,idecForzarCalculoPorcentaje: tinv.porcentajecalculoprecio);
                            }
                            else
                            {
                                this.ConstruyeTabla(rqmantenimiento, ltablaamortizacion, lncompra, lcalendarización, ldecyield, lfemision, ldecTasaCupon, lnvalor);
                            }

                        }
                    }

                    break;

                case "contabiliza":

                    contabilizaEjecuta(rqmantenimiento);

                    tinvinversion tInv = TinvInversionDal.Find(long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()) * -1);
                    if (tInv != null) Sessionef.Eliminar(tInv);
                    break;

                case "anula":
                    this.Anular(rqmantenimiento);
                    break;

                case "comentario":
                    this.registrarComentario(rqmantenimiento);

                    break;

                case "eliminarReajuste":
                    this.eliminarReajuste(rqmantenimiento);
                    break;

                case "eliminar":
                    this.eliminar(rqmantenimiento);
                    break;
            }

        }

        private void generaNIIFS(RqMantenimiento rqmantenimiento)
        {

            List<tTablaAmortizacion> tTablaAmortizaClone = new List<tTablaAmortizacion>();
            tTablaAmortizaClone = (List<tTablaAmortizacion>)rqmantenimiento.Response["tTablaAmortiza"];
            foreach (var item in tTablaAmortizaClone)
            {
                tinvtablaamortizacion tTablaAmortiza = TinvTablaAmortizacionDal.FindCuotaPrimeraPendiente(item.cinvtablaamortizacion);
                decimal? lvpresente = null;
                try
                {
                    lvpresente = (decimal)item.vpresente;
                }
                catch
                { }

                tTablaAmortiza.vpresente = lvpresente;
                tTablaAmortiza.ppv = item.ppv;
                tTablaAmortiza.capitalxamortizar = item.capitalxamortizar;
                tTablaAmortiza.interesimplicito = item.interesimplicito;
                tTablaAmortiza.costoamortizado = item.costoamortizado;
                tTablaAmortiza.diferenciainteresimplicito = item.diferenciainteresimplicito;
                Sessionef.Actualizar(tTablaAmortiza);
            }
        }

        /// <summary>
        /// Regenera cálculos para tabla de amortización.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la generación de las tablas de amortización.</param>
        /// <returns></returns>
        private void generaCalculosTablaAmortizacion(RqMantenimiento rqmantenimiento)
        {
            // Determina si tiene tabla de amortización.

            long lcinversion = long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString());
            tinvinversion tInv = TinvInversionDal.Find(lcinversion);
            if (tInv != null)
            {
                string lstrCodigoLegal = TinvCatalogoDetalleDal.obtenerCodigoLegal(1202, tInv.instrumentocdetalle);

                if (lstrCodigoLegal == "OBLIGA" || lstrCodigoLegal == "INVHIP")
                {
                    // Regenera tabla.

                    List<tTablaAmortizacion> ltablaamortizacion = new List<tTablaAmortizacion>();

                    IList<Dictionary<string, object>> tablatmp = new List<Dictionary<string, object>>();

                    tablatmp = TinvTablaAmortizacionTmpDal.GetTablaPagos(lcinversion);

                    int lLimite = tablatmp.Count;

                    int lIndice = 0;

                    decimal? lTasa = null;

                    while (lIndice < lLimite)
                    {

                        long? loptlock = null;
                        if (tablatmp[lIndice]["optlock"].ToString() != "") loptlock = long.Parse(tablatmp[lIndice]["optlock"].ToString());

                        decimal? lproyeccioncapital = null;
                        if (tablatmp[lIndice]["proyeccioncapital"].ToString() != "") lproyeccioncapital = decimal.Parse(tablatmp[lIndice]["proyeccioncapital"].ToString());

                        decimal? lproyecciontasa = null;
                        if (tablatmp[lIndice]["proyecciontasa"].ToString() != "")
                        {
                            lproyecciontasa = decimal.Parse(tablatmp[lIndice]["proyecciontasa"].ToString());
                            lTasa = lproyecciontasa;
                        }

                        decimal? lproyeccioninteres = null;
                        if (tablatmp[lIndice]["proyeccioninteres"].ToString() != "") lproyeccioninteres = decimal.Parse(tablatmp[lIndice]["proyeccioninteres"].ToString());

                        decimal? lvalormora = null;
                        if (tablatmp[lIndice]["valormora"].ToString() != "") lvalormora = decimal.Parse(tablatmp[lIndice]["valormora"].ToString());

                        decimal? linteresimplicito = null;
                        if (tablatmp[lIndice]["interesimplicito"].ToString() != "") linteresimplicito = decimal.Parse(tablatmp[lIndice]["interesimplicito"].ToString());

                        decimal? lcostoamortizado = null;
                        if (tablatmp[lIndice]["costoamortizado"].ToString() != "") lcostoamortizado = decimal.Parse(tablatmp[lIndice]["costoamortizado"].ToString());

                        decimal? ldiferenciainteresimplicito = null;
                        if (tablatmp[lIndice]["diferenciainteresimplicito"].ToString() != "") ldiferenciainteresimplicito = decimal.Parse(tablatmp[lIndice]["diferenciainteresimplicito"].ToString());

                        decimal? lcapitalxamortizar = null;
                        if (tablatmp[lIndice]["capitalxamortizar"].ToString() != "") lcapitalxamortizar = decimal.Parse(tablatmp[lIndice]["capitalxamortizar"].ToString());

                        long? lppv = null;
                        if (tablatmp[lIndice]["ppv"].ToString() != "") lppv = long.Parse(tablatmp[lIndice]["ppv"].ToString());

                        double? lvpresente = null;
                        if (tablatmp[lIndice]["vpresente"].ToString() != "") lvpresente = double.Parse(tablatmp[lIndice]["vpresente"].ToString());

                        ltablaamortizacion.Add(
                        new tTablaAmortizacion()
                        {

                            cinvtablaamortizacion = long.Parse(tablatmp[lIndice]["cinvtablaamortizacion"].ToString())
                            ,
                            nfinicio = DateTime.Parse(tablatmp[lIndice]["nfinicio"].ToString())
                            ,
                            nfvencimiento = DateTime.Parse(tablatmp[lIndice]["nfvencimiento"].ToString())
                            ,
                            optlock = loptlock
                            ,
                            cinversion = long.Parse(tablatmp[lIndice]["cinversion"].ToString())
                            ,
                            finicio = int.Parse(tablatmp[lIndice]["finicio"].ToString())
                            ,
                            fvencimiento = int.Parse(tablatmp[lIndice]["fvencimiento"].ToString())
                            ,
                            plazo = int.Parse(tablatmp[lIndice]["plazo"].ToString())
                            ,
                            proyeccioncapital = lproyeccioncapital
                            ,
                            proyecciontasa = lproyecciontasa
                            ,
                            proyeccioninteres = lproyeccioninteres
                            ,
                            valormora = lvalormora
                            ,
                            estadoccatalogo = int.Parse(tablatmp[lIndice]["estadoccatalogo"].ToString())
                            ,
                            estadocdetalle = tablatmp[lIndice]["estadocdetalle"].ToString()
                            ,
                            interesimplicito = linteresimplicito
                            ,
                            costoamortizado = lcostoamortizado
                            ,
                            fultimoaccrual= int.Parse(tablatmp[lIndice]["finicio"].ToString()),
                            diferenciainteresimplicito = ldiferenciainteresimplicito
                            ,
                            capitalxamortizar = lcapitalxamortizar
                            ,
                            ppv = lppv
                            ,
                            vpresente = lvpresente

                        });

                        lIndice++;
                    }

                    DateTime lFechaSistema = DateTime.Now;

                    TablaPagos lTablaPAgos = new TablaPagos();

                    long lcinvTablaamortizacion = 0;

                    lTablaPAgos.generaTabla(
                        lcinversion
                        , rqmantenimiento
                        , lTasa.Value
                        , ref ltablaamortizacion
                        , ref lcinvTablaamortizacion
                        , (lFechaSistema.Year * 10000) + (lFechaSistema.Month * 100) + lFechaSistema.Day
                        , true
                        , true);

                }

            }

        }


        /// <summary>
        /// Eliminar un reajuste a una inversión de renta fija.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <returns></returns>
        private void eliminarReajuste(RqMantenimiento rqmantenimiento)
        {
            long cinversion = long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString());

            tinvinversion inversion = TinvInversionDal.Find(cinversion);

            TinvTablaAmortizacionHisDal.DeleteHis((long)inversion.cinversionhisultimo);

            TinvInversionHisDal.DeleteHis((long)inversion.cinversionhisultimo);

            TinvTablaAmortizacionTmpDal.Delete(cinversion);

            inversion.cinversionhisultimo = null;

            inversion.comentariosdevolucion = null;

        }

        /// <summary>
        /// Eliminar una transacción.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <returns></returns>
        private void eliminar(RqMantenimiento rqmantenimiento)
        {
            long cinversion = long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString());

            tinvinversion inversion = TinvInversionDal.Find(cinversion);

            TinvContabilizacionDal.Delete((long)inversion.cinversion);

            TinvInversionRentaVariableDal.Delete((long)inversion.cinversion);

            TinvTablaAmortizacionHisDal.Delete(cinversion);

            TinvInversionHisDal.Delete(cinversion);

            TinvTablaAmortizacionTmpDal.Delete(cinversion);

            TinvTablaAmortizacionDal.Delete(cinversion);

            TinvInvVectorPreciosDal.Delete(cinversion);

            Sessionef.Eliminar(inversion);

        }


        /// <summary>
        /// Ejecutar la contabilización de una operación de la inversión.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <returns></returns>
        public static void contabilizaEjecuta(RqMantenimiento rqmantenimiento)
        {

            long lcinversion = long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString());
            contabilizacion.clsGuardar ClsGuardarContabilizacion = new contabilizacion.clsGuardar();
            ClsGuardarContabilizacion.DetalleSql(rqmantenimiento, lcinversion);

            Contabilizar lContabilizar = new Contabilizar();

            lContabilizar.Ejecutar(rqmantenimiento);




        }

        /// <summary>
        /// Reajuste de una inversión de renbta fija.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <returns></returns>
        private void rejuste(RqMantenimiento rqmantenimiento)
        {

            dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosgrabar"].ToString());

            clsConvert lclsConvert = new clsConvert();

            foreach (var item in array)
            {

                tinvinversion inversion = TinvInversionDal.Find((long)item.cinversion);

                bool lblnNuevo = false;

                tinvinversionhis inversionhis = null;

                decimal linteresAnterior = 0;
                decimal lcapitalAnterior = 0;

                if (inversion.cinversionhisultimo == null)
                {
                    long lcinversionhis = TinvInversionDal.GetcInversionHis();
                    lblnNuevo = true;
                    inversionhis = new tinvinversionhis();
                    inversionhis.cinversionhis = lcinversionhis;
                    inversion.cinversionhisultimo = lcinversionhis;
                    inversionhis.tasaanterior = inversion.tasa;
                    inversionhis.tir = inversion.tir;
                    inversionhis.cinversion = inversion.cinversion;

                    List<tinvtablaamortizacion> tTablaAmortiza = new List<tinvtablaamortizacion>();

                    tTablaAmortiza = TinvTablaAmortizacionDal.Find((long)item.cinversion);

                    long lcinvtablaamortizacionhis = TinvInversionDal.GetcInversionTabHis();

                    foreach (tinvtablaamortizacion itemTabla in tTablaAmortiza)
                    {

                        tinvtablaamortizacionhis tTablaHis = new tinvtablaamortizacionhis();
                        tTablaHis.cinvtablaamortizacionhis = lcinvtablaamortizacionhis;
                        tTablaHis.cinversionhis = lcinversionhis;
                        tTablaHis.finicio = itemTabla.finicio;
                        tTablaHis.cinvtablaamortizacion = itemTabla.cinvtablaamortizacion;
                        tTablaHis.fvencimiento = itemTabla.fvencimiento;
                        tTablaHis.plazo = itemTabla.plazo;
                        tTablaHis.proyeccioncapital = itemTabla.proyeccioncapital;
                        tTablaHis.proyecciontasa = itemTabla.proyecciontasa;
                        tTablaHis.proyeccioninteres = itemTabla.proyeccioninteres;
                        tTablaHis.valormora = itemTabla.valormora;
                        tTablaHis.capitalxamortizar = itemTabla.capitalxamortizar;
                        tTablaHis.interesimplicito = itemTabla.interesimplicito;
                        tTablaHis.costoamortizado = itemTabla.costoamortizado;
                        tTablaHis.diferenciainteresimplicito = itemTabla.diferenciainteresimplicito;
                        tTablaHis.ppv = itemTabla.ppv;
                        tTablaHis.vpresente = itemTabla.vpresente;
                        tTablaHis.acumuladoaccrual = itemTabla.acumuladoaccrual;
                        tTablaHis.estadoccatalogo = itemTabla.estadoccatalogo;
                        tTablaHis.estadocdetalle = itemTabla.estadocdetalle;
                        tTablaHis.comentariosingreso = itemTabla.comentariosingreso;
                        tTablaHis.comentariosaprobacion = itemTabla.comentariosaprobacion;
                        tTablaHis.comentariosdevolucion = itemTabla.comentariosdevolucion;
                        tTablaHis.comentariosanulacion = itemTabla.comentariosanulacion;
                        tTablaHis.numerooficiopago = itemTabla.numerooficiopago;
                        tTablaHis.fingreso = itemTabla.fingreso;
                        tTablaHis.cusuarioing = itemTabla.cusuarioing;
                        tTablaHis.fmodificacion = itemTabla.fmodificacion;
                        tTablaHis.cusuariomod = itemTabla.cusuariomod;
                        Sessionef.Grabar(tTablaHis);
                        lcinvtablaamortizacionhis++;

                        if (itemTabla.proyeccioninteres != null) linteresAnterior = linteresAnterior + (decimal)itemTabla.proyeccioninteres;

                        if (itemTabla.proyeccioncapital != null) lcapitalAnterior = lcapitalAnterior + (decimal)itemTabla.proyeccioncapital;

                    }

                    inversionhis.capitalanterior = lcapitalAnterior;
                    inversionhis.interesanterior = linteresAnterior;
                    Sessionef.Actualizar(inversion);

                }
                else
                {
                    inversionhis = TinvInversionHisDal.Find((long)inversion.cinversionhisultimo);

                    if (inversionhis.interesanterior != null) linteresAnterior = (decimal)inversionhis.interesanterior;
                    if (inversionhis.capitalanterior != null) lcapitalAnterior = (decimal)inversionhis.capitalanterior;

                }

                inversionhis.tasanueva = item.tasanueva;

                decimal? linteresnuevo = null;
                decimal? lcapitalnuevo = null;

                if (rqmantenimiento.Mdatos.ContainsKey("interesnuevo"))
                {
                    if (rqmantenimiento.Mdatos["interesnuevo"] != null)
                    {

                        try
                        {
                            linteresnuevo = decimal.Parse(rqmantenimiento.Mdatos["interesnuevo"].ToString());
                        }
                        catch
                        { }
                    }
                }


                if (rqmantenimiento.Mdatos.ContainsKey("capitalnuevo"))
                {
                    if (rqmantenimiento.Mdatos["capitalnuevo"] != null)
                    {

                        try
                        {
                            lcapitalnuevo = decimal.Parse(rqmantenimiento.Mdatos["capitalnuevo"].ToString());
                        }
                        catch
                        { }
                    }
                }


                inversionhis.interesnuevo = linteresnuevo;
                inversionhis.capitalnuevo = lcapitalnuevo;

                if (linteresnuevo == null) linteresnuevo = 0;
                if (lcapitalnuevo == null) lcapitalnuevo = 0;

                inversionhis.interesdiferencia = linteresAnterior - linteresnuevo;
                inversionhis.capitaldiferencia = lcapitalAnterior - lcapitalnuevo;

                int? lfsistema = null;

                try
                {
                    lfsistema = (int)item.fsistema;
                }
                catch
                { }

                inversionhis.fsistema = lfsistema;

                if (lblnNuevo)
                {
                    inversionhis.cusuarioing = item.cusuarioing;
                    inversionhis.fingreso = item.fingreso;
                    Sessionef.Grabar(inversionhis);

                }
                else
                {
                    inversionhis.cusuariomod = item.cusuarioing;
                    inversionhis.fmodificacion = item.fingreso;
                    Sessionef.Actualizar(inversionhis);
                }

                break;
            }


        }


        /// <summary>
        /// Convertir un string a un entero con formato de fecha.
        /// </summary>
        /// <param name="iFecha">Cadena a convertir.</param>
        /// <returns></returns>
        private int? DateTimeToInt(string iFecha)
        {

            if (iFecha == null || iFecha.Trim().Length == 0)
            {
                return null;
            }
            else
            {
                DateTime ldFecha = DateTime.Parse(iFecha);
                return (ldFecha.Year * 10000) + (ldFecha.Month * 100) + ldFecha.Day;

            }

        }

        /// <summary>
        /// Registrar el comentario de una transacción.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <returns></returns>
        private void registrarComentario(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.Mdatos.ContainsKey("estadocdetalleAux") && rqmantenimiento.Mdatos["estadocdetalleAux"] != null && (string)rqmantenimiento.Mdatos["estadocdetalleAux"] == "FINAPR")
            {
                TinvInversionDal.devolucionInversion(long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()), rqmantenimiento.Cusuario, rqmantenimiento.Mdatos["comentario"].ToString().Trim());
            }
            else
            {

                tinvinversion inversion = TinvInversionDal.Find(long.Parse(rqmantenimiento.Mdatos["cinversion"].ToString()));

                int ltransaccion = int.Parse(rqmantenimiento.Mdatos["transaccion"].ToString());

                string lEstado = "";

                inversion.comentariosingreso = null;
                inversion.comentariosaprobacion = null;
                inversion.comentariosdevolucion = null;
                inversion.comentariosanulacion = null;
                inversion.comentariospago = null;

                try
                {
                    lEstado = rqmantenimiento.Mdatos["estadocdetalle"].ToString();
                }
                catch
                { }


                bool lblnPagoEnTesoreria = false;




                if (ltransaccion > 2000 && ltransaccion < 3000)
                {
                    lEstado = "FINAPR";
                    inversion.ccomprobante = null;
                    inversion.comentariosingreso = rqmantenimiento.Mdatos["comentario"].ToString().Trim();

                }
                else if (ltransaccion < 1000)
                {
                    if (lEstado == "") lEstado = "ENVAPR";
                    inversion.comentariosingreso = rqmantenimiento.Mdatos["comentario"].ToString().Trim();
                }
                else if (ltransaccion >= 1000)
                {

                    if (lEstado == "") lEstado = "ING";

                    if (lEstado == "ING")
                    {

                        if (rqmantenimiento.Mdatos.ContainsKey("reajuste"))
                        {
                            if (rqmantenimiento.Mdatos["reajuste"] != null)
                            {
                                if ((bool)rqmantenimiento.Mdatos["reajuste"])
                                {
                                    lEstado = "APR";
                                }
                            }

                        }

                        inversion.comentariosdevolucion = rqmantenimiento.Mdatos["comentario"].ToString().Trim();

                        //if (rqmantenimiento.Mdatos.ContainsKey("estadocdetalleAux") && rqmantenimiento.Mdatos["estadocdetalleAux"] != null && (string)rqmantenimiento.Mdatos["estadocdetalleAux"] == "FINAPR")
                        //    lEstado = "PAG";

                    }
                    else
                    {
                        if (lEstado == "ENVPAG")
                        {
                            lblnPagoEnTesoreria = true;
                        }
                        inversion.comentariospago = rqmantenimiento.Mdatos["comentario"].ToString().Trim();
                    }
                }
                inversion.estadocdetalle = lEstado;
                Sessionef.Actualizar(inversion);

                // INI 1

                if (lblnPagoEnTesoreria)
                {
                    Envio lEnvio = new Envio();

                    rqmantenimiento.Mdatos["estadocdetalle"] = "PAG";

                    lEnvio.Ejecutar(rqmantenimiento);

                    tgencatalogodetalle tInstrumento = TinvCatalogoDetalleDal.FindPorCDetalle(inversion.instrumentocdetalle, (int)inversion.instrumentoccatalogo);

                    bool lblnGeneraContabilidad = true;

                    if (tInstrumento.clegal != null) if (tInstrumento.clegal == "CDP") lblnGeneraContabilidad = false;

                    if (lblnGeneraContabilidad && inversion.tasaclasificacioncdetalle == "VAR") lblnGeneraContabilidad = false;

                    if (lblnGeneraContabilidad)
                    {
                        // PREGUNTAR SI ES CASH
                        contabilizar(rqmantenimiento, inversion, "DIAGEN");
                    }

                    // ESPERO CONTABILIZAR
                    // DETERMINAR SI ES OBLIGACIÓN


                }
            }



            // INI 2


        }

        /// <summary>
        /// Valida si la contabilización ya ha sido efectuada.
        /// </summary>
        /// <param name="iccomprobante">Identificador del comprobante contable.</param>
        /// <returns></returns>
        private static void validarContabilizacion(string iccomprobante)
        {
            tconcomprobante tConComprobante = TinvContabilizacionDal.FindTConComprobante(iccomprobante);

            if (tConComprobante == null) return;

            if (tConComprobante.ccomprobante != null && tConComprobante.anulado == false && tConComprobante.eliminado == false)
            {
                throw new AtlasException("INV-0011", "INVERSIÓN YA HA SIDO CONTABILIZADA CON EL COMPROBANTE {0}", tConComprobante.ccomprobante);
            }
        }


        private void contabilizar(RqMantenimiento rqmantenimiento, tinvinversion inversion, string itipodocumentocdetalle)
        {
            tconcomprobante comprobante = CompletarComprobante(rqmantenimiento, inversion, itipodocumentocdetalle); // lblnCompra, lblnReajuste);

            decimal montoComprobante = 0;

            List<tconcomprobantedetalle> comprobanteDetalle = CompletarComprobanteDetalle(rqmantenimiento, inversion, comprobante, ref montoComprobante);

            comprobante.montocomprobante = montoComprobante;

            rqmantenimiento.Response["ccomprobante"] = comprobante.ccomprobante;
            rqmantenimiento.Response["numerocomprobantecesantia"] = comprobante.numerocomprobantecesantia;
            rqmantenimiento.AdicionarTabla("tconcomprobante", comprobante, false);
            rqmantenimiento.AdicionarTabla("tconcomprobantedetalle", comprobanteDetalle, false);
            rqmantenimiento.AdicionarTabla("tinviversion", inversion, false);

            rqmantenimiento.Mdatos.Add("actualizarsaldosenlinea", true);
            SaldoEnLinea lSaldoLinea = new SaldoEnLinea();
            lSaldoLinea.Ejecutar(rqmantenimiento);


        }

        /// <summary>
        /// Completa la información del comprobante contable.
        /// </summary>
        /// <param name="rqmantenimiento">Request del mantenimiento de la transacción.</param>
        /// <param name="inversion">Definición de la inversión a contabilizar.</param>
        /// <param name="ioperacion">Identificador de la operación realizada.</param>
        /// <returns>tconcomprobante</returns>
        private static tconcomprobante CompletarComprobante(RqMantenimiento rqmantenimiento, tinvinversion inversion, string itipodocumentocdetalle)
        {

            string operacion = itipodocumentocdetalle;

            tconcomprobante comprobante = new tconcomprobante();
            comprobante.anulado = false;
            comprobante.automatico = true;
            comprobante.cagencia = (int)(rqmantenimiento.Cagencia);
            comprobante.cagenciaingreso = comprobante.cagencia;
            comprobante.ccompania = (int)(rqmantenimiento.Ccompania);
            comprobante.ccomprobante = Secuencia.GetProximovalor("COMPROBANTE").ToString();
            comprobante.numerocomprobantecesantia = SecuenciaComprobanteContable.GetProximoValor(rqmantenimiento, operacion);
            comprobante.freal = rqmantenimiento.Freal;
            comprobante.fproceso = rqmantenimiento.Fproceso;
            comprobante.cmodulo = 12;

            comprobante.comentario = inversion.observaciones;

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
            comprobante.tipodocumentocdetalle = operacion;
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
            ref decimal montoComprobante)
        {

            List<tconcomprobantedetalle> comprobanteDetalle = new List<tconcomprobantedetalle>();

            List<tinvplantillacontable> tinvPlaConCXC = TinvPlantillaContableDal.FindPorCDetalle("INVCXC", (int)1219);

            //List<tacfhistorialdepreciacion> lista = TacfDepreciacionDetalleDal.FindXCdepreciacion(depreciacion.cdepreciacion);

            List <tinvplantillacontable> tinvPlaConCXP = TinvPlantillaContableDal.FindPorCDetalle("BCFSPI", (int)1219);

            decimal lmonto = 0;

            if (inversion.valorefectivo != null) lmonto = Math.Round((decimal)inversion.valorefectivo, 2, MidpointRounding.AwayFromZero);
            if (inversion.interestranscurrido != null) lmonto = lmonto + Math.Round((decimal)inversion.interestranscurrido, 2, MidpointRounding.AwayFromZero);
            if (inversion.comisionbolsavalores != null) lmonto = lmonto + Math.Round((decimal)inversion.comisionbolsavalores, 2, MidpointRounding.AwayFromZero);
            if (inversion.comisionoperador != null) lmonto = lmonto + Math.Round((decimal)inversion.comisionoperador, 2, MidpointRounding.AwayFromZero);
            if (inversion.comisionretencion != null) lmonto = lmonto - Math.Round((decimal)inversion.comisionretencion, 2, MidpointRounding.AwayFromZero);

            montoComprobante = lmonto;

            int secuencia = 1;

            validarContabilizacion(comprobante.ccomprobante);

            tconcomprobantedetalle detalleContable = new tconcomprobantedetalle();
            detalleContable.monto = lmonto;
            detalleContable.montooficial = lmonto;
            detalleContable.Esnuevo = true;
            detalleContable.ccomprobante = comprobante.ccomprobante;
            detalleContable.fcontable = comprobante.fcontable;
            detalleContable.particion = comprobante.particion;
            detalleContable.ccompania = comprobante.ccompania;
            detalleContable.optlock = 0;
            detalleContable.cagencia = comprobante.cagencia;
            detalleContable.csucursal = comprobante.csucursal;
            detalleContable.ccuenta = tinvPlaConCXC[0].ccuenta;
            detalleContable.debito = true;
            detalleContable.cclase = TconCatalogoDal.Find(comprobante.ccompania, detalleContable.ccuenta).cclase;
            detalleContable.cmoneda = inversion.monedacdetalle;
            detalleContable.cmonedaoficial = "USD";
            detalleContable.cusuario = comprobante.cusuarioing;
            detalleContable.cmonedaoficial = rqmantenimiento.Cmoneda;
            detalleContable.suma = TmonClaseDal.Suma(detalleContable.cclase, detalleContable.debito);
            detalleContable.centrocostosccatalogo = inversion.centrocostoccatalogo;
            detalleContable.centrocostoscdetalle = inversion.centrocostocdetalle;
            comprobanteDetalle.Add(detalleContable);

            secuencia++;

            tconcomprobantedetalle detalleContable1 = new tconcomprobantedetalle();
            detalleContable1.monto = lmonto;
            detalleContable1.montooficial = lmonto;
            detalleContable1.Esnuevo = true;
            detalleContable1.ccomprobante = comprobante.ccomprobante;
            detalleContable1.fcontable = comprobante.fcontable;
            detalleContable1.particion = comprobante.particion;
            detalleContable1.ccompania = comprobante.ccompania;
            detalleContable1.optlock = 0;
            detalleContable1.cagencia = comprobante.cagencia;
            detalleContable1.csucursal = comprobante.csucursal;
            detalleContable1.ccuenta = tinvPlaConCXP[0].ccuenta;
            detalleContable1.debito = false;
            detalleContable1.cclase = TconCatalogoDal.Find(comprobante.ccompania, detalleContable1.ccuenta).cclase;
            detalleContable1.cmoneda = inversion.monedacdetalle;
            detalleContable1.cmonedaoficial = "USD";
            detalleContable1.cusuario = comprobante.cusuarioing;
            detalleContable1.cmonedaoficial = rqmantenimiento.Cmoneda;
            detalleContable1.suma = TmonClaseDal.Suma(detalleContable1.cclase, detalleContable1.debito);
            detalleContable1.centrocostosccatalogo = inversion.centrocostoccatalogo;
            detalleContable1.centrocostoscdetalle = inversion.centrocostocdetalle;
            comprobanteDetalle.Add(detalleContable1);

            return comprobanteDetalle;
        }


        /// <summary>
        /// Anula y reversa la contabilización de una transacción.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <returns></returns>
        private void Anular(RqMantenimiento rqmantenimiento)
        {

            Anular lAnular = new Anular();
            ReversoContable lReversoContable = new ReversoContable();

            lAnular.Ejecutar(rqmantenimiento);
            lReversoContable.Ejecutar(rqmantenimiento);

            rqmantenimiento.Response.Add("Anulado", true);

        }

        /// <summary>
        /// Construye la tabla de dividendos.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <param name="ltablaamortizacion">Tabla de amortización de la inversión.</param>
        /// <param name="lncompra">Fecha de compra de la inversión.</param>
        /// <param name="lcalendarización">Identificador del método para la calendarización de pagos.</param>
        /// <param name="ldecyield">Yield (rendimiento) de la inversión.</param>
        /// <param name="lfemision">Fecha de emisión de la inversión.</param>
        /// <param name="ldecTasaCupon">Porcentaje de la tasa del cupón de la inversión.</param>
        /// <param name="lfultimopago">Fecha del último pago.</param>
        /// <param name="rqconsulta">Request de consulta de la transacción.</param>
        /// <param name="idecForzarCalculoPorcentaje">Bandera que fuerza el cálculo del pago del porcentaje del precio sucio.</param>
        /// <returns></returns>
        public void ConstruyeTabla(
            RqMantenimiento rqmantenimiento
            , List<tTablaAmortizacion> ltablaamortizacion
            , DateTime? lncompra
            , string lcalendarización
            , decimal? ldecyield
            , DateTime? lfemision
            , decimal? ldecTasaCupon
            , DateTime? lfultimopago
            , RqConsulta rqconsulta = null
            , decimal? idecForzarCalculoPorcentaje = null)
        {

            decimal? ldecSaldo = 0;

            double lvpresente = 0;

            decimal lvalorNominal = 0;

            decimal ltotalInteres = 0;

            DateTime? lFEmision = null;
            DateTime? lFVencimiento = null;

            for (int i = 0; i < ltablaamortizacion.Count; i++)
            {
                decimal lproyeccioncapital = 0;

                decimal lproyeccioninteres = 0;

                if (ltablaamortizacion[i].proyeccioncapital != null) lproyeccioncapital = (decimal)ltablaamortizacion[i].proyeccioncapital;

                ldecSaldo = ldecSaldo + lproyeccioncapital;

                if (ltablaamortizacion[i].proyeccioninteres != null) lproyeccioninteres = (decimal)ltablaamortizacion[i].proyeccioninteres;

                ltablaamortizacion[i].total = lproyeccioninteres + lproyeccioncapital;

            }

            decimal? ldecValorNegociacion = ldecSaldo;

            for (int i = 0; i < ltablaamortizacion.Count; i++)
            {

                if (lFEmision == null || ltablaamortizacion[i].nfinicio < lFEmision)
                {
                    lFEmision = ltablaamortizacion[i].nfinicio;
                }

                if (lFVencimiento == null || ltablaamortizacion[i].nfvencimiento > lFVencimiento)
                {
                    lFVencimiento = ltablaamortizacion[i].nfvencimiento;
                }


                if (ltablaamortizacion[i].proyeccioncapital != null)
                {
                    ldecSaldo = ldecSaldo - ltablaamortizacion[i].proyeccioncapital;
                    ltablaamortizacion[i].saldo = ldecSaldo;
                }

                if (lfultimopago > ltablaamortizacion[i].nfvencimiento)
                {
                    ltablaamortizacion[i].ppv = pfDateDiffDias(ltablaamortizacion[i].nfvencimiento, lfultimopago, lcalendarización);
                    ltablaamortizacion[i].ppv = ltablaamortizacion[i].ppv * -1;
                }
                else
                {
                    ltablaamortizacion[i].ppv = pfDateDiffDias(lfultimopago, ltablaamortizacion[i].nfvencimiento, lcalendarización);
                }

                int lDividendo;
                double lDías;
                if (ltablaamortizacion[i].plazo > 75 && ltablaamortizacion[i].plazo < 105)
                {
                    lDividendo = 4;
                    lDías = 90;
                }
                else if (ltablaamortizacion[i].plazo >= 105 && ltablaamortizacion[i].plazo < 135)
                {
                    lDividendo = 3;
                    lDías = 120;
                }
                else if (ltablaamortizacion[i].plazo >= 165 && ltablaamortizacion[i].plazo < 195)
                {
                    lDividendo = 2;
                    lDías = 180;
                }
                else
                {
                    lDividendo = 1;
                    lDías = 360;
                }

                if (ltablaamortizacion[i].total != null)
                {
                    ltablaamortizacion[i].vpresente = Financial.PV(
                        (double)((ldecyield / lDividendo) * 0.01m),
                        (double)(ltablaamortizacion[i].ppv / lDías),
                        0,
                        (double)(ltablaamortizacion[i].total * -1m));

                }
                else
                {
                    ltablaamortizacion[i].vpresente = 0;
                }


                lvpresente = lvpresente + (double)ltablaamortizacion[i].vpresente;

                if (ltablaamortizacion[i].proyeccioncapital.HasValue)
                {
                    lvalorNominal = lvalorNominal + ltablaamortizacion[i].proyeccioncapital.Value;
                }

                if (ltablaamortizacion[i].proyeccioninteres.HasValue)
                {
                    ltotalInteres = ltotalInteres + ltablaamortizacion[i].proyeccioninteres.Value;
                }


            }

            this.pGeneraValores(
                ldecTasaCupon
                , lFEmision
                , lfultimopago
                , lcalendarización
                , lvalorNominal
                , ldecValorNegociacion
                , lFVencimiento
                , ltotalInteres
                , lvpresente
                , ldecyield
                , lncompra
                , ltablaamortizacion
                , rqconsulta
                , rqmantenimiento
                , idecForzarCalculoPorcentaje: idecForzarCalculoPorcentaje);


        }


        /// <summary>
        /// Calcula el interés transcurrido, porcentajes de comisiones y retención de la inversión.
        /// </summary>
        /// <param name="ldecTasaCupon">Tasa del cupón de la inversión.</param>
        /// <param name="lFEmision">Fecha de emisipon de la inversión.</param>
        /// <param name="lfultimopago">Fecha del último pago del instrumento financiero.</param>
        /// <param name="lcalendarización">Identificador del método utilizado para la celendarización de pagos.</param>
        /// <param name="lvalorNominal">Valor nominal de la inversión.</param>
        /// <param name="ldecValorNegociacion">Valor efectivo de la inversión.</param>
        /// <param name="lFVencimiento">Fecha de vencimiento de la inversión.</param>
        /// <param name="ltotalInteres">Valor del interés de la inversión.</param>
        /// <param name="lvpresente">Valor presente de la inversión.</param>
        /// <param name="idecyield">Yield (rendimiento) de la inversión.</param>
        /// <param name="lncompra">Fecha de compra de la inversión.</param>
        /// <param name="ltablaamortizacion">Tabla de dividendos de la inversión.</param>
        /// <param name="rqconsulta">Request de consulta de la transacción.</param>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <param name="iblnUnaSolaCuota">Define si la inversión corresponde a una sola cuota.</param>
        /// <param name="iporcentajecalculoprecio">Porcentaje para el cálculo del precio sucio de la inversión.</param>
        /// <param name="iPlazo">Plazo en días de la inversión.</param>
        /// <param name="itasaBolsa">Tasa de comisión de la bolsa de valores de la inversión.</param>
        /// <param name="itasaOperador">Tasa de comisión del operador de la inversión.</param>
        /// <param name="itasaRetencion">Tasa de retención en la fuente de la inversión.</param>
        /// <param name="idecForzarCalculoPorcentaje">Bandera que fuerza el cálculo del pago del porcentaje del precio sucio.</param>
        /// <returns></returns>
        public void pGeneraValores(
            decimal? ldecTasaCupon
            , DateTime? lFEmision
            , DateTime? lfultimopago
            , string lcalendarización
            , decimal lvalorNominal
            , decimal? ldecValorNegociacion
            , DateTime? lFVencimiento
            , decimal ltotalInteres = 0
            , double lvpresente = 0
            , decimal? idecyield = null
            , DateTime? lncompra = null
            , List<tTablaAmortizacion> ltablaamortizacion = null
            , RqConsulta rqconsulta = null
            , RqMantenimiento rqmantenimiento = null
            , bool iblnUnaSolaCuota = false
            , decimal? iporcentajecalculoprecio = null
            , long? iPlazo = null
            , decimal itasaBolsa = 0
            , decimal itasaOperador = 0
            , decimal itasaRetencion = 0
            , decimal? idecForzarCalculoPorcentaje = null)
        {

            long lcinversion = 0;
            decimal ldecTasaReajuste = 0;

            DateTime lFechaSistema = DateTime.Now;

            if (rqconsulta == null)
            {


                if (rqmantenimiento.Mdatos.ContainsKey("fsistema"))
                {
                    if (rqmantenimiento.Mdatos["fsistema"] != null)
                    {
                        try
                        {

                            lFechaSistema = pfObtenerFecha(int.Parse(rqmantenimiento.Mdatos["fsistema"].ToString()));

                        }
                        catch
                        { }
                    }

                }


                if (rqmantenimiento.Mdatos.ContainsKey("cinversion"))
                {

                    if (rqmantenimiento.Mdatos["cinversion"] != null)
                    {
                        lcinversion = (long)rqmantenimiento.Mdatos["cinversion"];
                    }

                }

                if (rqmantenimiento.Mdatos.ContainsKey("tasaReajuste"))
                {
                    if (rqmantenimiento.Mdatos["tasaReajuste"] != null)
                    {
                        try
                        {
                            ldecTasaReajuste = (decimal)rqmantenimiento.Mdatos["tasaReajuste"];
                        }
                        catch
                        { }
                    }

                }


            }

            else
            {


                if (rqconsulta.Mdatos.ContainsKey("fsistema"))
                {
                    if (rqconsulta.Mdatos["fsistema"] != null)
                    {
                        try
                        {

                            lFechaSistema = pfObtenerFecha(int.Parse(rqconsulta.Mdatos["fsistema"].ToString()));

                        }
                        catch
                        { }
                    }

                }

                if (rqconsulta.Mdatos.ContainsKey("tasaReajuste"))
                {
                    if (rqconsulta.Mdatos["tasaReajuste"] != null)
                    {
                        try
                        {
                            ldecTasaReajuste = decimal.Parse(rqconsulta.Mdatos["tasaReajuste"].ToString());
                        }
                        catch
                        { }
                    }

                }


                if (rqconsulta.Mdatos.ContainsKey("cinversion"))
                {
                    if (rqconsulta.Mdatos["cinversion"] != null)
                    {
                        lcinversion = (long)rqconsulta.Mdatos["cinversion"];
                    }

                }


            }

            if (lcinversion == 0)
            {

                if (ldecTasaReajuste == 0)

                {
                    
                    if (itasaBolsa == 0)
                    {
                        itasaBolsa = TinvInversionDal.GetParametroNumero("TASA_BOLSA_VALORES");
                    }
                    if (rqconsulta.Mdatos.ContainsKey("pBolsavalorescdetalle")) {

                        string bolsa = (rqconsulta.Mdatos["pBolsavalorescdetalle"]==null)?"": rqconsulta.Mdatos["pBolsavalorescdetalle"].ToString();

                        if (bolsa.Equals("GYE"))
                        {
                            itasaBolsa = TinvInversionDal.GetParametroNumero("TASA_BOLSA_VALORES_GYE");
                        }
                        else {
                            itasaBolsa = TinvInversionDal.GetParametroNumero("TASA_BOLSA_VALORES");
                        }
                    }

                    if (itasaOperador == 0)
                    {
                        itasaOperador = TinvInversionDal.GetParametroNumero("TASA_OPERADOR_BOLSA");
                    }

                    if (itasaRetencion == 0)
                    {
                        itasaRetencion = TinvInversionDal.GetParametroNumero("TASA_RETENCION");
                    }

                }


            }
            else
            {
                tinvinversion tInversion = new tinvinversion();
                tInversion = TinvInversionDal.Find(lcinversion);

                itasaBolsa = 0;
                itasaOperador = 0;
                itasaRetencion = 0;

                try
                {
                    if (tInversion.bolsavalorescdetalle != null)
                    {

                        if (tInversion.bolsavalorescdetalle.Equals("GYE"))
                        {
                            itasaBolsa = TinvInversionDal.GetParametroNumero("TASA_BOLSA_VALORES_GYE");
                            tInversion.porcentajebolsa=itasaBolsa;
                        }
                        else
                        {
                            itasaBolsa = TinvInversionDal.GetParametroNumero("TASA_BOLSA_VALORES");
                            tInversion.porcentajebolsa = itasaBolsa;
                        }
                    }
                    else {
                        itasaBolsa = (decimal)tInversion.porcentajebolsa;
                    }
                
                }
                catch
                { }

                try
                {
                    itasaOperador = (decimal)tInversion.porcentajeoperador;
                }
                catch
                { }

                try
                {
                    itasaRetencion = (decimal)tInversion.porcentajeretencion;
                }
                catch
                { }
            }

            decimal? lPorcentajecalculoprecio = 0;

            long lInteresTranscurridoDias = 0;

            long lInteresTranscurridoDiasReajuste = 0;

            if (iblnUnaSolaCuota)
            {

               // lInteresTranscurridoDias = this.obtenerInteresTranscurridoDias(lFEmision.Value, lfultimopago.Value);
                lInteresTranscurridoDias = this.pfDateDiffDias(lFEmision, lfultimopago, lcalendarización);

                if (lInteresTranscurridoDias < 1) lInteresTranscurridoDias = lInteresTranscurridoDias * -1;

                if (ldecTasaReajuste != 0)

                {

                    lInteresTranscurridoDiasReajuste = this.obtenerInteresTranscurridoDias(lFVencimiento.Value, lFechaSistema);

                    if (lInteresTranscurridoDiasReajuste < 1) lInteresTranscurridoDiasReajuste = lInteresTranscurridoDiasReajuste * -1;

                }

                lPorcentajecalculoprecio = iporcentajecalculoprecio;

            }
            else
            {
                lInteresTranscurridoDias = this.pfDateDiffDias(lFEmision, lfultimopago, lcalendarización);
            }

            decimal linteresTranscurrido = 0;

            decimal linteresTranscurridoReajuste = 0;

            decimal lvalorEfectivo = 0;

            if (ldecTasaCupon.HasValue)
            {

                int lintBaseCalculo = lcalendarización == "360" ? 360 : 365;

                linteresTranscurrido = this.obtenerInteresTranscurrido(lInteresTranscurridoDias, lvalorNominal, ldecTasaCupon.Value, lintBaseCalculo);

                if (ldecTasaReajuste != 0) linteresTranscurridoReajuste = this.obtenerInteresReajuste(
                    lcinversion,
                    ldecTasaReajuste,
                    (lFechaSistema.Year * 10000) + (lFechaSistema.Month * 100) + lFechaSistema.Day,
                    lvalorNominal,
                    lintBaseCalculo,
                    ldecTasaReajuste);

                if (idecForzarCalculoPorcentaje != null && idecForzarCalculoPorcentaje.Value != 0 && !iblnUnaSolaCuota)
                {
                    lvalorEfectivo = lvalorNominal * idecForzarCalculoPorcentaje.Value * 0.01m;
                }
                else
                {

                    //long lcinversion = 0;


                    if (iblnUnaSolaCuota)
                    {
                        lvalorEfectivo = lvalorNominal * lPorcentajecalculoprecio.Value * 0.01m;
                    }
                    else
                    {

                        if (lcinversion > 0)
                        {
                            tinvinversion tInversion = new tinvinversion();
                            tInversion = TinvInversionDal.Find(lcinversion);

                            lvalorEfectivo = (decimal)tInversion.valorefectivo;

                        }
                        else
                        {
                            lvalorEfectivo = (decimal)lvpresente - linteresTranscurrido;
                        }

                    }

                }

                lvalorEfectivo = Math.Truncate(lvalorEfectivo * 100) / 100;

            }

            if (!iblnUnaSolaCuota && ldecValorNegociacion != 0)
            {
                lPorcentajecalculoprecio = lvalorEfectivo / ldecValorNegociacion;
            }

            long lPlazoRealxVencer = iblnUnaSolaCuota ? this.pfDateDiffDias(lfultimopago, lFVencimiento, lcalendarización, iblnUnaSolaCuota) : this.pfDateDiffDias(lfultimopago, lFVencimiento, "");

            long lDiasxVencer = 0;

            if (!iblnUnaSolaCuota)
            {
                lDiasxVencer = this.pfDateDiffDias(lfultimopago, lFVencimiento, lcalendarización);
            }

            decimal lComisionBolsa = lvalorEfectivo * itasaBolsa * 0.0001m;
            decimal lComisionOperador = lvalorEfectivo * itasaOperador * 0.0001m;
            decimal lRetencion = lComisionBolsa * itasaRetencion * 0.01m;

            decimal lComisionTotal = Math.Round(lComisionBolsa, 2, MidpointRounding.AwayFromZero) + Math.Round(lComisionOperador, 2, MidpointRounding.AwayFromZero);

            decimal lSubtotal = Math.Round(lvalorEfectivo, 2, MidpointRounding.AwayFromZero) +
                Math.Round(linteresTranscurrido, 2, MidpointRounding.AwayFromZero) +
                Math.Round(lComisionBolsa, 2, MidpointRounding.AwayFromZero) +
                Math.Round(lComisionOperador, 2, MidpointRounding.AwayFromZero) -
                Math.Round(lRetencion, 2, MidpointRounding.AwayFromZero);

            decimal lValorACompensar = Math.Round(lvalorEfectivo, 2, MidpointRounding.AwayFromZero) +
                Math.Round(linteresTranscurrido, 2, MidpointRounding.AwayFromZero) +
                Math.Round(lComisionBolsa, 2, MidpointRounding.AwayFromZero) -
                Math.Round(lRetencion, 2, MidpointRounding.AwayFromZero);

            decimal lPrecioNeto = Math.Round(lSubtotal * 0.0001m, 4, MidpointRounding.AwayFromZero);

            decimal lCapital = 0;
            if (ldecValorNegociacion.HasValue)
            {
                lCapital = Math.Round(ldecValorNegociacion.Value, 2, MidpointRounding.AwayFromZero);
            }

            long lInteresnominaldias = iblnUnaSolaCuota ? lInteresTranscurridoDias + iPlazo.Value : lDiasxVencer + lInteresTranscurridoDias;

            decimal lInteresPorVencer = 0;

            if (iblnUnaSolaCuota)
            {
                lDiasxVencer = lInteresnominaldias - lInteresTranscurridoDias;

                int lintBaseCalculo = lcalendarización == "360" ? 360 : 365;

                lInteresPorVencer = (iPlazo.Value * lvalorNominal * ldecTasaCupon.Value / lintBaseCalculo) * 0.01m;

                ltotalInteres = lInteresPorVencer + linteresTranscurrido;

            }
            else
            {
                lInteresPorVencer = ltotalInteres - linteresTranscurrido;
            }

            lvalorEfectivo = Math.Round(lvalorEfectivo, 2);
            linteresTranscurrido = Math.Round(linteresTranscurrido, 2);

            int lintFechaSistema = (lFechaSistema.Year * 10000) + (lFechaSistema.Month * 100) + lFechaSistema.Day;

            if (rqconsulta == null)
            {
                if (rqmantenimiento.Response.ContainsKey("SubirTablaAmortiza"))
                {
                    rqmantenimiento.Response["SubirTablaAmortiza"] = 1;
                    rqmantenimiento.Response["FechaCompra"] = lncompra;
                    rqmantenimiento.Response["TasaCupon"] = ldecTasaCupon;
                    rqmantenimiento.Response["BaseCalculoInteres"] = lcalendarización;
                    rqmantenimiento.Response["Yield"] = idecyield;
                    rqmantenimiento.Response["ValorEfectivo"] = lvalorEfectivo;
                    rqmantenimiento.Response["ValorNegociacion"] = ldecValorNegociacion;
                    rqmantenimiento.Response["Porcentajecalculoprecio"] = iporcentajecalculoprecio == null ? lPorcentajecalculoprecio * 100 : iporcentajecalculoprecio;
                    rqmantenimiento.Response["FEmision"] = lFEmision;
                    rqmantenimiento.Response["FVencimiento"] = lFVencimiento;
                    rqmantenimiento.Response["FUltimoPago"] = lfultimopago;
                    rqmantenimiento.Response["InteresTranscurridoDias"] = lInteresTranscurridoDias;
                    rqmantenimiento.Response["PlazoRealxVencer"] = lPlazoRealxVencer;
                    rqmantenimiento.Response["DiasxVencer"] = lDiasxVencer;
                    rqmantenimiento.Response["Interesnominaldias"] = lInteresnominaldias;
                    rqmantenimiento.Response["ValorDescuento"] = ldecValorNegociacion - lvalorEfectivo;
                    rqmantenimiento.Response["ComisionBolsa"] = lComisionBolsa;
                    rqmantenimiento.Response["ComisionOperador"] = lComisionOperador;
                    rqmantenimiento.Response["Retencion"] = lRetencion;
                    rqmantenimiento.Response["ComisionTotal"] = lComisionTotal;
                    rqmantenimiento.Response["InteresTranscurrido"] = linteresTranscurrido;
                    rqmantenimiento.Response["InteresNegociacion"] = linteresTranscurrido;
                    rqmantenimiento.Response["Subtotal"] = lSubtotal;
                    rqmantenimiento.Response["PrecioNeto"] = lPrecioNeto;
                    rqmantenimiento.Response["Interes"] = ltotalInteres;
                    rqmantenimiento.Response["InteresPorVencer"] = lInteresPorVencer;
                    rqmantenimiento.Response["ValorACompensar"] = lValorACompensar;
                    rqmantenimiento.Response["Capital"] = Math.Round(lCapital, 2, MidpointRounding.AwayFromZero);
                    rqmantenimiento.Response["lregistros"] = ltablaamortizacion;
                    rqmantenimiento.Response["InteresTranscurridoDiasReajuste"] = lInteresTranscurridoDiasReajuste;
                    rqmantenimiento.Response["InteresTranscurridoReajuste"] = linteresTranscurridoReajuste;
                    rqmantenimiento.Response["FechaSistema"] = lintFechaSistema;

                }
                else
                {
                    rqmantenimiento.Response.Add("SubirTablaAmortiza", 1);
                    rqmantenimiento.Response.Add("FechaCompra", lncompra);
                    rqmantenimiento.Response.Add("TasaCupon", ldecTasaCupon);
                    rqmantenimiento.Response.Add("BaseCalculoInteres", lcalendarización);
                    rqmantenimiento.Response.Add("Yield", idecyield);
                    rqmantenimiento.Response.Add("ValorEfectivo", lvalorEfectivo);
                    rqmantenimiento.Response.Add("ValorNegociacion", ldecValorNegociacion);
                    rqmantenimiento.Response.Add("Porcentajecalculoprecio", iporcentajecalculoprecio == null ? lPorcentajecalculoprecio * 100 : iporcentajecalculoprecio);
                    rqmantenimiento.Response.Add("FEmision", lFEmision);
                    rqmantenimiento.Response.Add("FVencimiento", lFVencimiento);
                    rqmantenimiento.Response.Add("FUltimoPago", lfultimopago);
                    rqmantenimiento.Response.Add("InteresTranscurridoDias", lInteresTranscurridoDias);
                    rqmantenimiento.Response.Add("PlazoRealxVencer", lPlazoRealxVencer);
                    rqmantenimiento.Response.Add("DiasxVencer", lDiasxVencer);
                    rqmantenimiento.Response.Add("Interesnominaldias", lInteresnominaldias);
                    rqmantenimiento.Response.Add("ValorDescuento", ldecValorNegociacion - lvalorEfectivo);
                    rqmantenimiento.Response.Add("ComisionBolsa", lComisionBolsa);
                    rqmantenimiento.Response.Add("ComisionOperador", lComisionOperador);
                    rqmantenimiento.Response.Add("Retencion", lRetencion);
                    rqmantenimiento.Response.Add("ComisionTotal", lComisionTotal);
                    rqmantenimiento.Response.Add("InteresTranscurrido", linteresTranscurrido);
                    rqmantenimiento.Response.Add("InteresNegociacion", linteresTranscurrido);
                    rqmantenimiento.Response.Add("Subtotal", lSubtotal);
                    rqmantenimiento.Response.Add("PrecioNeto", lPrecioNeto);
                    rqmantenimiento.Response.Add("Interes", ltotalInteres);
                    rqmantenimiento.Response.Add("InteresPorVencer", lInteresPorVencer);
                    rqmantenimiento.Response.Add("ValorACompensar", lValorACompensar);
                    rqmantenimiento.Response.Add("Capital", Math.Round(lCapital, 2, MidpointRounding.AwayFromZero));
                    rqmantenimiento.Response["lregistros"] = ltablaamortizacion;
                    rqmantenimiento.Response.Add("InteresTranscurridoDiasReajuste", lInteresTranscurridoDiasReajuste);
                    rqmantenimiento.Response.Add("InteresTranscurridoReajuste", linteresTranscurridoReajuste);
                    rqmantenimiento.Response.Add("FechaSistema", lintFechaSistema);
                }
            }
            else
            {
                rqconsulta.Response.Add("SubirTablaAmortiza", 1);
                rqconsulta.Response.Add("FechaCompra", lncompra);
                rqconsulta.Response.Add("TasaCupon", ldecTasaCupon);
                rqconsulta.Response.Add("BaseCalculoInteres", lcalendarización);
                rqconsulta.Response.Add("Yield", idecyield);
                rqconsulta.Response.Add("tasaComision", itasaBolsa);
                rqconsulta.Response.Add("ValorEfectivo", lvalorEfectivo);
                rqconsulta.Response.Add("ValorNegociacion", ldecValorNegociacion);
                rqconsulta.Response.Add("Porcentajecalculoprecio", iporcentajecalculoprecio == null ? lPorcentajecalculoprecio * 100 : iporcentajecalculoprecio);
                rqconsulta.Response.Add("FEmision", lFEmision);
                rqconsulta.Response.Add("FVencimiento", lFVencimiento);
                rqconsulta.Response.Add("FUltimoPago", lfultimopago);
                rqconsulta.Response.Add("InteresTranscurridoDias", lInteresTranscurridoDias);
                rqconsulta.Response.Add("PlazoRealxVencer", lPlazoRealxVencer);
                rqconsulta.Response.Add("DiasxVencer", lDiasxVencer);
                rqconsulta.Response.Add("Interesnominaldias", lInteresnominaldias);
                rqconsulta.Response.Add("ValorDescuento", ldecValorNegociacion - lvalorEfectivo);
                rqconsulta.Response.Add("ComisionBolsa", lComisionBolsa);
                rqconsulta.Response.Add("ComisionOperador", lComisionOperador);
                rqconsulta.Response.Add("Retencion", lRetencion);
                rqconsulta.Response.Add("ComisionTotal", lComisionTotal);
                rqconsulta.Response.Add("InteresTranscurrido", linteresTranscurrido);
                rqconsulta.Response.Add("InteresNegociacion", linteresTranscurrido);
                rqconsulta.Response.Add("Subtotal", lSubtotal);
                rqconsulta.Response.Add("PrecioNeto", lPrecioNeto);
                rqconsulta.Response.Add("Interes", ltotalInteres);
                rqconsulta.Response.Add("InteresPorVencer", lInteresPorVencer);
                rqconsulta.Response.Add("ValorACompensar", lValorACompensar);
                rqconsulta.Response.Add("Capital", Math.Round(lCapital, 2, MidpointRounding.AwayFromZero));
                rqconsulta.Response["lregistros"] = ltablaamortizacion;
                rqconsulta.Response.Add("InteresTranscurridoDiasReajuste", lInteresTranscurridoDiasReajuste);
                rqconsulta.Response.Add("InteresTranscurridoReajuste", linteresTranscurridoReajuste);
                rqconsulta.Response.Add("FechaSistema", lintFechaSistema);

            }


        }

        /// <summary>
        /// Obtiene la tasa reajustada de la inversión.
        /// </summary>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <param name="itasaNueva">Tasa nueva.</param>
        /// <param name="ifsistema">Fecha del sistema.</param>
        /// <param name="ivalorNominal">Valor nominal de la inversión.</param>
        /// <param name="intBaseCalculo">Base de cálculo.</param>
        /// <param name="idecTasaReajuste">Tasa de reajuste.</param>
        /// <returns>decimal</returns>
        private decimal obtenerInteresReajuste(long icinversion, decimal itasaNueva, int ifsistema, decimal ivalorNominal, int intBaseCalculo, decimal idecTasaReajuste)
        {

            decimal linteresTotal = 0;

            IList<Dictionary<string, object>> tabla = new List<Dictionary<string, object>>();

            tabla = TinvReajustesDal.GetPeriodosTasas(icinversion, itasaNueva, ifsistema);

            long lInteresTranscurridoDiasReajuste = 0;

            DateTime lfinicial = new DateTime();
            DateTime lffinal = new DateTime();

            if (tabla == null || tabla.Count == 0)
            {
                throw new AtlasException("INV-0024", "ID. DE LA INVERSIÓN TRANSFERIDO ES NULO, REVERSO CANCELADO");
            }

            bool lblnFirst = true;

            foreach (var item in tabla)
            {

                if (lblnFirst)
                {
                    switch (int.Parse(item["finicial"].ToString()))
                    {
                        case -1:
                            throw new AtlasException("INV-0022", "LA FECHA DEL SISTEMA ES MENOR A LA FECHA DE EMISIÓN, REVERSO CANCELADO");
                            break;
                        case -2:
                            throw new AtlasException("INV-0023", "LA FECHA DEL SISTEMA ES MAYOR A LA FECHA DE VENCIMIENTO, REVERSO CANCELADO");
                            break;
                    }
                    lblnFirst = false;
                }

                lfinicial = pfObtenerFecha(int.Parse(item["finicial"].ToString()));

                lffinal = pfObtenerFecha(int.Parse(item["ffinal"].ToString()));
                lInteresTranscurridoDiasReajuste = this.obtenerInteresTranscurridoDias(lffinal, lfinicial);
                if (lInteresTranscurridoDiasReajuste < 1) lInteresTranscurridoDiasReajuste = lInteresTranscurridoDiasReajuste * -1;

                linteresTotal = linteresTotal + this.obtenerInteresTranscurrido(lInteresTranscurridoDiasReajuste, ivalorNominal, idecTasaReajuste, intBaseCalculo);

            }

            return linteresTotal;

        }

        /// <summary>
        /// Obtiene el interés transcurrido de la inversión.
        /// </summary>
        /// <param name="iInteresTranscurridoDias">Dias transcurridos para el interés.</param>
        /// <param name="ivalorNominal">Valor nominal.</param>
        /// <param name="itasa">Tasa de interés.</param>
        /// <param name="intBaseCalculo">Base de cálculo.</param>
        /// <returns>decimal</returns>
        private decimal obtenerInteresTranscurrido(long iInteresTranscurridoDias, decimal ivalorNominal, decimal itasa, int intBaseCalculo)
        {

            return (iInteresTranscurridoDias * ivalorNominal * itasa / intBaseCalculo) * 0.01m;

        }

        /// <summary>
        /// Convierte a fecha un valor entero.
        /// </summary>
        /// <param name="iFecha">Valor entero a convertir en fecha.</param>
        /// <returns>DateTime</returns>
        public DateTime pfObtenerFecha(int iFecha)
        {
            string lstrFecha = iFecha.ToString();

            int anio = int.Parse(lstrFecha.Substring(0, 4));
            int mes = int.Parse(lstrFecha.Substring(4, 2));
            int dia = int.Parse(lstrFecha.Substring(6, 2));

            return new DateTime(anio, mes, dia);
        }

        /// <summary>
        /// Obtener los días de interés transcurrido.
        /// </summary>
        /// <param name="iFechaInicial">Fercha inicial.</param>
        /// <param name="iFechaFinal">Fercha final.</param>
        /// <returns>int</returns>
        private int obtenerInteresTranscurridoDias(DateTime iFechaInicial, DateTime iFechaFinal)
        {
            int lFEmi = (iFechaInicial.Year * 10000) + (iFechaInicial.Month * 100) + iFechaInicial.Day;
            int lFUlt = (iFechaFinal.Year * 10000) + (iFechaFinal.Month * 100) + iFechaFinal.Day;
            if (lFEmi > lFUlt)
            {
                return Fecha.Resta360(lFEmi, lFUlt);
            }
            else
            {
                return Fecha.Resta360(lFUlt, lFEmi) * -1;
            }
        }


        /// <summary>
        /// Obtener la diferencia en días, dadas dos fecha.
        /// </summary>
        /// <param name="ifinicio">Fercha inicial.</param>
        /// <param name="iffin">Fercha final.</param>
        /// <param name="icalendarizacioncdetalle">Base de cálculo.</param>
        /// <param name="icalculaNegativos">Bandera que determina si puede devolver valores en negativo.</param>
        /// <returns>long</returns>
        public long pfDateDiffDias(DateTime? ifinicio, DateTime? iffin, string icalendarizacioncdetalle, bool icalculaNegativos = false)
        {

            long dias = 0;

            long lfinicio = 0;
            long lffin = 0;

            if (ifinicio.HasValue)
            {
                DateTime dtinicio;
                dtinicio = ifinicio.Value;
                lfinicio = (dtinicio.Year * 10000) + (dtinicio.Month * 100) + dtinicio.Day;
            }

            if (iffin.HasValue)
            {
                DateTime dtfin;
                dtfin = iffin.Value;
                lffin = (dtfin.Year * 10000) + (dtfin.Month * 100) + dtfin.Day;
            }

            if (lfinicio != 0 && lffin != 0 && (lffin > lfinicio || icalculaNegativos))
            {
                if (icalendarizacioncdetalle.Equals("360"))
                {
                    dias = Fecha.Resta360Inv((int)lffin, (int)lfinicio);
                }
                else
                {

                    dias = ( iffin.Value- ifinicio.Value ).Days;
                    dias = Math.Abs(dias);
                    //Alta lAlta = new Alta();
                    //DateTime fec = new DateTime();
                    //fec = lAlta.convertToDateNotNull(lffin);
                    //dias = (long)fec.Subtract(lAlta.convertToDateNotNull(lfinicio)).TotalDays;
                }
            }

            return dias;
        }

        /// <summary>
        /// Convertir a fecha un valor long.
        /// </summary>
        /// <param name="ifecha">Valor long a convertir.</param>
        /// <returns>DateTime</returns>
        private DateTime? convertToDate(long ifecha)
        {
            try
            {
                string lfecha = ifecha.ToString().Trim();
                if (lfecha.Length == 8)
                {
                    return new DateTime(int.Parse(lfecha.Substring(0, 4)), int.Parse(lfecha.Substring(4, 2)), int.Parse(lfecha.Substring(6, 2)));
                }
                else
                {
                    return null;
                }
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Convertir a fecha un valor long.  Si es nulo retirna la fecha del sistema.
        /// </summary>
        /// <param name="ifecha">valor long a convertir.</param>
        /// <returns>DateTime</returns>
        public DateTime convertToDateNotNull(long ifecha)
        {
            try
            {
                string lfecha = ifecha.ToString().Trim();
                if (lfecha.Length == 8)
                {
                    return new DateTime(int.Parse(lfecha.Substring(0, 4)), int.Parse(lfecha.Substring(4, 2)), int.Parse(lfecha.Substring(6, 2)));
                }
                else
                {
                    return DateTime.Now;
                }
            }
            catch
            {
                return DateTime.Now;
            }
        }
    }

    public class clsConvert
    {
        /// <summary>
        /// Convertir una fecha a su equivalente en long.
        /// </summary>
        /// <param name="ifecha">Objeto a convertir.</param>
        /// <returns>object</returns>
        public object intFecha(object ifecha)
        {

            if (ifecha == null)
            {
                return null;
            }
            else
            {

                try
                {
                    DateTime? lfcolocacion = null;
                    lfcolocacion = DateTime.Parse(ifecha.ToString());
                    return (lfcolocacion.Value.Year * 10000) + (lfcolocacion.Value.Month * 100) + lfcolocacion.Value.Day;
                }
                catch
                {
                    return null;
                }
            }

        }
    }

    public class clsGuardar
    {

        /// <summary>
        /// Guardar tabla de amortización.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <returns></returns>
        public void Detalle(RqMantenimiento rqmantenimiento, long icinversion)
        {

            try
            {
                if (rqmantenimiento.Mdatos["lregistrostablaamortizacion"] == null)
                {
                    return;
                }
            }
            catch
            {
                return;
            }

            List<tTablaAmortizacion> lTablaOriginal = new List<tTablaAmortizacion>();
            lTablaOriginal = TinvInversionDal.GetTablaAmortizacion(icinversion, "t.cinvtablaamortizacion");
            dynamic lTablaInterfaz = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrostablaamortizacion"].ToString());
            long cInvTablaAmortizacion = TinvInversionDal.GetcInvTablaAmortizacion();

            clsConvert lclsConvert = new clsConvert();

            int lIndice = 0;

            int lFinal = lTablaInterfaz.Count - 1;

            tinvtablaamortizacion tInvTablaAmortiza = null;

            if (lTablaOriginal != null)
            {

                foreach (var item in lTablaOriginal)
                {

                    if (lIndice <= lFinal)
                    {
                        tInvTablaAmortiza = TinvInversionDal.FindTablaAmortiza(item.cinvtablaamortizacion);
                        tInvTablaAmortiza.optlock = 0;
                        tInvTablaAmortiza.cinversion = icinversion;
                        tInvTablaAmortiza.finicio = lclsConvert.intFecha(lTablaInterfaz[lIndice].nfinicio.Value);

                        tInvTablaAmortiza.fvencimiento = lclsConvert.intFecha(lTablaInterfaz[lIndice].nfvencimiento.Value);

                        tInvTablaAmortiza.plazo = lTablaInterfaz[lIndice].plazo;
                        tInvTablaAmortiza.proyeccioncapital = lTablaInterfaz[lIndice].proyeccioncapital;
                        tInvTablaAmortiza.proyecciontasa = lTablaInterfaz[lIndice].proyecciontasa;
                        tInvTablaAmortiza.proyeccioninteres = lTablaInterfaz[lIndice].proyeccioninteres;
                        tInvTablaAmortiza.valormora = lTablaInterfaz[lIndice].valormora;
                        tInvTablaAmortiza.estadoccatalogo = 1218;
                        tInvTablaAmortiza.estadocdetalle = lTablaInterfaz[lIndice].estadocdetalle;
                        tInvTablaAmortiza.fmodificacion = DateTime.Now;
                        tInvTablaAmortiza.cusuariomod = rqmantenimiento.Cusuario;

                        try
                        {
                            tInvTablaAmortiza.interesimplicito = lTablaInterfaz[lIndice].interesimplicito;
                        }
                        catch
                        { }

                        try
                        {
                            tInvTablaAmortiza.costoamortizado = lTablaInterfaz[lIndice].costoamortizado;
                        }
                        catch
                        { }

                        try
                        {
                            tInvTablaAmortiza.diferenciainteresimplicito = lTablaInterfaz[lIndice].diferenciainteresimplicito;
                        }
                        catch
                        { }

                        try
                        {
                            tInvTablaAmortiza.ppv = lTablaInterfaz[lIndice].ppv;
                        }
                        catch
                        { }

                        try
                        {
                            tInvTablaAmortiza.vpresente = lTablaInterfaz[lIndice].vpresente;
                        }
                        catch
                        { }

                        try
                        {
                            tInvTablaAmortiza.capitalxamortizar = lTablaInterfaz[lIndice].capitalxamortizar;
                        }
                        catch
                        { }

                        Sessionef.Actualizar(tInvTablaAmortiza);
                    }
                    else
                    {
                        tInvTablaAmortiza = TinvInversionDal.FindTablaAmortiza(item.cinvtablaamortizacion);
                        Sessionef.Eliminar(tInvTablaAmortiza);
                    }
                    lIndice++;

                }


            }

            for (int i = lIndice; i <= lFinal; i++)
            {
                tInvTablaAmortiza = new tinvtablaamortizacion();
                tInvTablaAmortiza.cinvtablaamortizacion = cInvTablaAmortizacion;
                tInvTablaAmortiza.optlock = 0;
                tInvTablaAmortiza.cinversion = icinversion;
                tInvTablaAmortiza.finicio = lclsConvert.intFecha(lTablaInterfaz[i].nfinicio);


                tInvTablaAmortiza.fvencimiento = lclsConvert.intFecha(lTablaInterfaz[i].nfvencimiento);


                tInvTablaAmortiza.plazo = lTablaInterfaz[i].plazo;
                tInvTablaAmortiza.proyeccioncapital = lTablaInterfaz[i].proyeccioncapital;
                tInvTablaAmortiza.proyecciontasa = lTablaInterfaz[i].proyecciontasa;
                tInvTablaAmortiza.proyeccioninteres = lTablaInterfaz[i].proyeccioninteres;
                tInvTablaAmortiza.valormora = lTablaInterfaz[i].valormora;
                tInvTablaAmortiza.estadoccatalogo = 1218;
                tInvTablaAmortiza.estadocdetalle = lTablaInterfaz[i].estadocdetalle;
                tInvTablaAmortiza.fingreso = DateTime.Now;
                tInvTablaAmortiza.cusuarioing = rqmantenimiento.Cusuario;

                try
                {
                    tInvTablaAmortiza.interesimplicito = lTablaInterfaz[i].interesimplicito;
                }
                catch
                { }

                try
                {
                    tInvTablaAmortiza.costoamortizado = lTablaInterfaz[i].costoamortizado;
                }
                catch
                { }

                try
                {
                    tInvTablaAmortiza.diferenciainteresimplicito = lTablaInterfaz[i].diferenciainteresimplicito;
                }
                catch
                { }

                try
                {
                    tInvTablaAmortiza.ppv = lTablaInterfaz[i].ppv;
                }
                catch
                { }

                try
                {
                    tInvTablaAmortiza.vpresente = lTablaInterfaz[i].vpresente;
                }
                catch
                { }



                try
                {
                    tInvTablaAmortiza.capitalxamortizar = lTablaInterfaz[i].capitalxamortizar;
                }
                catch
                { }



                Sessionef.Grabar(tInvTablaAmortiza);

                cInvTablaAmortizacion++;

            }


        }

        /// <summary>
        /// Guardar la inversión.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
        /// <returns></returns>
        public long Cabecera(RqMantenimiento rqmantenimiento)
        {


            dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosgrabar"].ToString());

            clsConvert lclsConvert = new clsConvert();

            long cinversion = 0;

            foreach (var item in array)
            {


                tinvinversion tinvInversion = null;

                bool lblnNuevo = false;

                if (item.cinversion == 0)
                {
                    cinversion = TinvInversionDal.GetcInversion();
                    item.cinversion = cinversion;
                    tinvInversion = new tinvinversion();
                    tinvInversion.cinversion = cinversion;
                    tinvInversion.cusuarioing = rqmantenimiento.Cusuario;
                    tinvInversion.fingreso = DateTime.Now;
                    tinvInversion.aceptanteccatalogo = 1213;


                    tinvInversion.fcolocacion = lclsConvert.intFecha(item.fcolocacion);
                    tinvInversion.femision = lclsConvert.intFecha(item.femision);
                    tinvInversion.fregistro = lclsConvert.intFecha(item.fregistro);

                    try
                    {
                        tinvInversion.fcompra = lclsConvert.intFecha(item.fcompra);
                    }
                    catch
                    { }


                    try
                    {
                        tinvInversion.fpago = lclsConvert.intFecha(item.fpago);
                    }
                    catch
                    { }

                    try
                    {
                        tinvInversion.fpagoultimocupon = lclsConvert.intFecha(item.fpagoultimocupon);
                    }
                    catch
                    { }

                    try
                    {
                        tinvInversion.fultimacompra = lclsConvert.intFecha(item.fultimacompra);
                    }
                    catch
                    { }


                    try
                    {
                        tinvInversion.fultimopago = lclsConvert.intFecha(item.fultimopago);
                    }
                    catch
                    { }

                    try
                    {
                        tinvInversion.fvencimiento = lclsConvert.intFecha(item.fvencimiento);
                        DateTime f = Fecha.GetFecha(tinvInversion.fvencimiento.Value);

                        string mes = tinvInversion.fvencimiento.ToString().Substring(4, 2);
                        IList<tnomferiados> feriados = TnomFeriadoDal.Find(f.Year, mes, f.Day);
                        if (feriados != null && feriados.Count > 0 && tinvInversion.tasaclasificacioncdetalle.Equals("FIJA"))
                        {
                            throw new AtlasException("INV-022", "LA FECHA DE VENCIMIENTO ES UN FERIADO");
                        }
                    }
                    catch
                    { }

                    lblnNuevo = true;
                }
                else
                {
                    cinversion = (long)item.cinversion;
                    tinvInversion = TinvInversionDal.Find(cinversion);
                    tinvInversion.cusuariomod = rqmantenimiento.Cusuario;
                    tinvInversion.aceptantecdetalle = item.aceptantecdetalle.Value;
                    tinvInversion.aceptanteccatalogo = 1213;
                    tinvInversion.fcolocacion = lclsConvert.intFecha(item.fcolocacion.Value);
                    tinvInversion.femision = lclsConvert.intFecha(item.femision.Value);
                    tinvInversion.fregistro = lclsConvert.intFecha(item.fregistro.Value);

                    tinvInversion.fcompra = null;

                    try
                    {
                        tinvInversion.fcompra = lclsConvert.intFecha(item.fcompra.Value);
                    }
                    catch
                    { }

                    tinvInversion.fpago = null;

                    try
                    {
                        tinvInversion.fpago = lclsConvert.intFecha(item.fpago.Value);
                    }
                    catch
                    { }


                    try
                    {
                        tinvInversion.fpagoultimocupon = lclsConvert.intFecha(item.fpagoultimocupon);
                    }
                    catch
                    { }

                    if (tinvInversion.fpagoultimocupon == null)
                    {
                        try
                        {
                            tinvInversion.fpagoultimocupon = lclsConvert.intFecha(item.fpagoultimocupon.value);
                        }
                        catch
                        { }
                    }

                    tinvInversion.fultimacompra = null;

                    try
                    {
                        tinvInversion.fultimacompra = lclsConvert.intFecha(item.fultimacompra);
                    }
                    catch
                    { }

                    if (tinvInversion.fultimacompra == null)
                    {
                        try
                        {
                            tinvInversion.fultimacompra = lclsConvert.intFecha(item.fultimacompra.value);
                        }
                        catch
                        { }
                    }


                    try
                    {
                        tinvInversion.fultimopago = lclsConvert.intFecha(item.fultimopago.Value);
                    }
                    catch
                    {

                    }


                    tinvInversion.fvencimiento = lclsConvert.intFecha(item.fvencimiento.Value);

                 
                    tinvInversion.fmodificacion = DateTime.Now;
                }

                string lcodigotitulo = null;
                if (item.codigotitulo != null)
                {

                    lcodigotitulo = (string)item.codigotitulo;

                    if (lcodigotitulo.Trim().Length == 0)
                    {
                        lcodigotitulo = null;
                    }

                }

                if (lcodigotitulo != null)
                {

                    string lstrMnesaje = "";

                    if (item.instrumentocdetalle == "OBLIGA" || item.instrumentocdetalle == "VALTIT" || item.instrumentocdetalle == "TITULA" || item.instrumentocdetalle == "INVHIP")
                    {
                        lcodigotitulo = TinvInversionDal.FindCodigoTitulo((string)item.codigotitulo, cinversion);
                        lstrMnesaje = " UNA INVERSIÓN CON EL CÓDIGO DE TÍTULO " + lcodigotitulo;
                    }
                    else if (item.instrumentocdetalle == "CDP" || item.instrumentocdetalle == "PA")
                    {
                        lcodigotitulo = TinvInversionDal.FindCodigoTituloPorInst((string)item.codigotitulo, cinversion, (string)item.instrumentocdetalle);
                        if (item.instrumentocdetalle == "CDP")
                        {
                            lstrMnesaje = " EL CERTIFICADO DE DEPÓSITO";
                        }
                        else
                        {
                            lstrMnesaje = " LA PÓLIZA DE ACUMULACIÓN";
                        }
                        lstrMnesaje = lstrMnesaje + " CON EL ID. " + lcodigotitulo;

                    }
                    else
                    {
                        lcodigotitulo = "";
                    }

                    if (lcodigotitulo != "")
                    {
                        //INVERSIONES PUEDEN TENER EL MISMO TÍTULO
                        //throw new AtlasException("INV-0002", "YA EXISTE {0} ", lstrMnesaje);
                    }

                }

                if (item.bolsavalorescdetalle != null)
                {
                    tinvInversion.bolsavaloresccatalogo = 1215;
                }
                else
                {
                    tinvInversion.bolsavaloresccatalogo = null;
                }

                tinvInversion.bolsavalorescdetalle = item.bolsavalorescdetalle;

                if (item.calendarizacioncdetalle != null)
                {
                    tinvInversion.calendarizacionccatalogo = 1209;
                }
                else
                {
                    tinvInversion.calendarizacionccatalogo = null;
                }

                tinvInversion.calendarizacioncdetalle = item.calendarizacioncdetalle;

                if (item.basediasinterescdetalle != null)
                {
                    tinvInversion.basediasinteresccatalogo = 1222;
                }
                else
                {
                    tinvInversion.basediasinteresccatalogo = null;
                }

                //tinvInversion.basediasinteresccatalogo = item.basediasinterescdetalle != null ? item.basediasinteresccatalogo : null;
                tinvInversion.basediasinterescdetalle = item.basediasinterescdetalle;

                if (item.calificacionriesgoinicialcdetalle != null)
                {
                    tinvInversion.calificacionriesgoinicialccatalogo = 1207;
                }
                else
                {
                    tinvInversion.calificacionriesgoinicialccatalogo = null;
                }

                tinvInversion.calificacionriesgoinicialcdetalle = item.calificacionriesgoinicialcdetalle;

                if (item.calificacionriesgoactualcdetalle != null)
                {
                    tinvInversion.calificacionriesgoactualccatalogo = 1207;
                }
                else
                {
                    tinvInversion.calificacionriesgoactualccatalogo = null;
                }

                tinvInversion.calificacionriesgoactualcdetalle = item.calificacionriesgoactualcdetalle;

                //tinvInversion.casavaloresccatalogo = item.casavalorescdetalle != null ? item.casavaloresccatalogo : null;

                if (item.casavalorescdetalle != null)
                {
                    tinvInversion.casavaloresccatalogo = 1217;
                }
                else
                {
                    tinvInversion.casavaloresccatalogo = null;
                }

                tinvInversion.retencionfuentevalor = item.retencionfuentevalor;

                tinvInversion.porcentajebolsa = item.porcentajebolsa;
                tinvInversion.porcentajeoperador = item.porcentajeoperador;
                tinvInversion.porcentajeretencion = item.porcentajeretencion;

                tinvInversion.casavalorescdetalle = item.casavalorescdetalle;

                tinvInversion.cinvagentebolsa = item.cinvagentebolsa;

                tinvInversion.cinvoperadorinstitucional = item.cinvoperadorinstitucional;

                tinvInversion.clasificacioninversionccatalogo = item.clasificacioninversioncdetalle != null ? item.clasificacioninversionccatalogo : null;
                tinvInversion.clasificacioninversioncdetalle = item.clasificacioninversioncdetalle;

                tinvInversion.codigotitulo = item.codigotitulo;
                tinvInversion.numerocontrato = item.numerocontrato;

                tinvInversion.comisionbolsavalores = item.comisionbolsavalores;
                tinvInversion.comisionoperador = item.comisionoperador;
                tinvInversion.comisionretencion = item.comisionretencion;

                if (item.compracuponcdetalle != null)
                {
                    tinvInversion.compracuponccatalogo = 1216;
                }
                else
                {
                    tinvInversion.compracuponccatalogo = null;
                }


                tinvInversion.compracuponcdetalle = item.compracuponcdetalle;

                if (item.monedacdetalle == "USD" && item.cotizacion == 0)
                {
                    tinvInversion.cotizacion = 1;
                }
                else
                {
                    tinvInversion.cotizacion = item.cotizacion;
                }

                try
                {
                    tinvInversion.diasgraciacapital = item.diasgraciacapital;
                }
                catch
                {
                    tinvInversion.diasgraciacapital = null;
                }

                try
                {
                    tinvInversion.diasgraciainteres = item.diasgraciainteres;
                }
                catch
                {
                    tinvInversion.diasgraciainteres = null;
                }

                try
                {
                    tinvInversion.diasporvencerafechacompra = item.diasporvencerafechacompra;
                }
                catch
                {
                    tinvInversion.diasporvencerafechacompra = null;
                }


                tinvInversion.emisorccatalogo = item.emisorcdetalle != null ? item.emisorccatalogo : null;
                tinvInversion.emisorcdetalle = item.emisorcdetalle;

                tinvInversion.estadoccatalogo = item.estadocdetalle != null ? item.estadoccatalogo : null;
                tinvInversion.estadocdetalle = item.estadocdetalle;

                //tinvInversion.formaajusteinteresccatalogo = item.formaajusteinterescdetalle != null ? item.formaajusteinteresccatalogo : null;

                if (item.formaajusteinterescdetalle != null)
                {
                    tinvInversion.formaajusteinteresccatalogo = 1208;
                }
                else
                {
                    tinvInversion.formaajusteinteresccatalogo = null;
                }

                tinvInversion.formaajusteinterescdetalle = item.formaajusteinterescdetalle;

                tinvInversion.instrumentoccatalogo = item.instrumentoccatalogo;
                tinvInversion.instrumentocdetalle = item.instrumentocdetalle;

                tinvInversion.mercadotipoccatalogo = item.mercadotipocdetalle != null ? item.mercadotipoccatalogo : null;
                tinvInversion.mercadotipocdetalle = item.mercadotipocdetalle;

                tinvInversion.monedaccatalogo = item.monedacdetalle != null ? item.monedaccatalogo : null;
                tinvInversion.monedacdetalle = item.monedacdetalle;

                tinvInversion.numeroacciones = item.numeroacciones;
                tinvInversion.observaciones = item.observaciones;

                tinvInversion.observacionespagos = item.observacionespagos;

                //tinvInversion.periodicidadpagoscapitalccatalogo = item.periodicidadpagoscapitalcdetalle != null ? item.periodicidadpagoscapitalccatalogo : null;

                if (item.periodicidadpagoscapitalcdetalle != null)
                {
                    tinvInversion.periodicidadpagoscapitalccatalogo = 1206;
                }
                else
                {
                    tinvInversion.periodicidadpagoscapitalccatalogo = null;
                }

                tinvInversion.periodicidadpagoscapitalcdetalle = item.periodicidadpagoscapitalcdetalle;

                //tinvInversion.periodicidadpagosinteresccatalogo = item.periodicidadpagosinterescdetalle != null ? item.periodicidadpagosinteresccatalogo : null;

                if (item.periodicidadpagosinterescdetalle != null)
                {
                    tinvInversion.periodicidadpagosinteresccatalogo = 1206;
                }
                else
                {
                    tinvInversion.periodicidadpagosinteresccatalogo = null;
                }

                if (item.bancopagocdetalle != null)
                {
                    tinvInversion.bancopagoccatalogo = 305;
                }
                else
                {
                    tinvInversion.bancopagoccatalogo = null;
                }

                tinvInversion.bancopagocdetalle = item.bancopagocdetalle;

                tinvInversion.periodicidadpagosinterescdetalle = item.periodicidadpagosinterescdetalle;

                tinvInversion.plazo = null;

                try
                {
                    tinvInversion.plazo = item.plazo;
                }
                catch
                { }

                try
                {
                    tinvInversion.tir = item.tir;
                }
                catch
                { }

                tinvInversion.porcentajecalculodescuento = item.porcentajecalculodescuento;
                tinvInversion.porcentajecalculoprecio = item.porcentajecalculoprecio;
                tinvInversion.porcentajecalculorendimiento = item.porcentajecalculorendimiento;
                tinvInversion.interestranscurrido = item.interestranscurrido;
                tinvInversion.porcentajeparticipacioncupon = item.porcentajeparticipacioncupon;
                tinvInversion.porcentajepreciocompra = item.porcentajepreciocompra;
                tinvInversion.porcentajeprecioultimacompra = item.porcentajeprecioultimacompra;

                tinvInversion.portafolioccatalogo = item.portafoliocdetalle != null ? item.portafolioccatalogo : null;
                tinvInversion.portafoliocdetalle = item.portafoliocdetalle;

                tinvInversion.preciocompra = item.preciocompra;
                tinvInversion.preciounitarioaccion = item.preciounitarioaccion;

                tinvInversion.sectorccatalogo = item.sectorcdetalle != null ? item.sectorccatalogo : null;
                tinvInversion.sectorcdetalle = item.sectorcdetalle;

                tinvInversion.sistemacolocacionccatalogo = item.sistemacolocacioncdetalle != null ? item.sistemacolocacionccatalogo : null;
                tinvInversion.sistemacolocacioncdetalle = item.sistemacolocacioncdetalle;

                tinvInversion.bancoccatalogo = item.bancocdetalle != null ? item.bancoccatalogo : null;
                tinvInversion.bancocdetalle = item.bancocdetalle;

                tinvInversion.tasa = item.tasa;

                tinvInversion.tasaclasificacionccatalogo = item.tasaclasificacionccatalogo;
                tinvInversion.tasaclasificacioncdetalle = item.tasaclasificacioncdetalle;

                tinvInversion.tasainterescupon = item.tasainterescupon;
                tinvInversion.valoracciones = item.valoracciones;
                tinvInversion.valordividendospagados = item.valordividendospagados;
                tinvInversion.valorefectivo = item.valorefectivo;
                tinvInversion.valornegociacion = item.valornegociacion;
                tinvInversion.valornominal = item.valornominal;
                tinvInversion.yield = item.yield;

                tinvInversion.centrocostoccatalogo = item.centrocostoccatalogo;
                tinvInversion.centrocostocdetalle = item.centrocostocdetalle;

                tinvInversion.interesvalornominal = null;
                tinvInversion.interesporvencer = null;
                tinvInversion.diasvalornominal = null;
                tinvInversion.plazorealxvencer = null;
                tinvInversion.diastranscurridosinteres = null;

                try
                {
                    tinvInversion.interesvalornominal = item.interesvalornominal;
                }
                catch
                { }

                try
                {
                    tinvInversion.interesporvencer = item.interesporvencer;
                }
                catch
                { }

                try
                {
                    tinvInversion.diasvalornominal = item.diasvalornominal;
                }
                catch
                { }

                try
                {
                    tinvInversion.plazorealxvencer = item.plazorealxvencer;
                }
                catch
                { }

                try
                {
                    tinvInversion.diastranscurridosinteres = item.diastranscurridosinteres;
                }
                catch
                { }

                if (lblnNuevo)
                {
                    //validarInversion(tinvInversion);//VALIDAR AQUI
                    Sessionef.Grabar(tinvInversion);
                }
                else
                {
                    Sessionef.Actualizar(tinvInversion);
                }


            }

            return cinversion;


        }
        

    }
   


}
