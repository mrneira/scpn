
using Newtonsoft.Json.Linq;
using core.componente;
using dal.generales;
using modelo;
using System;
using System.IO;
using util;
using util.dto.mantenimiento;
using System.Collections.Generic;
using util.servicios.ef;
using Newtonsoft.Json;
using System.Linq;
using LinqToExcel;

using dal.inversiones.emisordetalle;
using dal.inversiones.juntaaccionistas;
using dal.inversiones.contabilizacion;
using dal.inversiones.inversionrentavariable;
using dal.inversiones.precioscierre;
using dal.inversiones.tablaamortizacion;
using dal.inversiones.vectorprecios;
using dal.inversiones.tablaamortizacionhis;
using dal.inversiones.inversioneshis;
using dal.inversiones.tablaamortizaciontmp;
using dal.inversiones.inversiones;
using dal.inversiones.catalogos;
using dal.inversiones.plantillacontable;
using dal.inversiones.ventaacciones;
using dal.inversiones.agentebolsa;
using dal.inversiones.bancodetalle;
using dal.inversiones.operadorinstitucional;
using dal.inversiones.precancelacion;

using dal.inversiones.registrodividendo;

using inversiones.comp.mantenimiento.inversiones;
using Microsoft.VisualBasic;
using dal.inversiones.accrualcontrolfechas;

using inversiones.comp.mantenimiento.cargaacciones.vectorprecios;

namespace inversiones.comp.mantenimiento.migracion
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para importar los precios de cierre y el vector de precios históricos, generados por la bolsa de valores.
    /// </summary>
    public class RentaFija : ComponenteMantenimiento
    {

        /// <summary>
        /// Importa el portafolio de inversiones vigente y las tablas de amortización de los instrumentos financieros.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "upload")
            {

                string path = "";
                string narchivo = "";
                string archivo = "";
                tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
                path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
                narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                archivo = (string)rqmantenimiento.Mdatos["archivo"];
                archivo = archivo.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "");
                path = path + "/" + narchivo;


                try
                {
                    File.WriteAllBytes(path, Convert.FromBase64String(archivo));

                }
                catch
                {
                    throw new AtlasException("INV-0003", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA 'C:\CESANTIA_APP_HOME\SUBIRARCHIVOS' EN EL DISCO 'C:\', PARA POSIBILITAR LA CARGA DEL EXTRACTO BANCARIO.");
                }

                List<tinvinversionRentaFija> lLista = new List<tinvinversionRentaFija>();

                var excelFile = new ExcelQueryFactory(path);
                var cargaRentaFija = from a in excelFile.Worksheet("SCPN") select a;

                string lstrMensaje = "Ok";

                clsValidarMigracion lclsValidar = new clsValidarMigracion();

                int lintIndice = 1;


                foreach (var registro in cargaRentaFija)
                {

                    if (registro[54].Value.ToString() != "" && lintIndice > 2)
                    {


                        int lFinicio = convertDateToInt(registro[17].Value.ToString().Trim());

                        int? lplazo = null;


                        decimal? linteresValorNominal = null;


                        if (registro[13].Value.ToString().Length != 0 && registro[13].Value.ToString() != "-")
                        {

                            string lstrAux = registro[13].Value.ToString().Replace(",", "");

                            lstrAux = lstrAux.Replace(".", ",");

                            linteresValorNominal = decimal.Parse(lstrAux);

                        }


                        if (registro[4].Value.ToString() != "CASH -EQUIVALENTS"
                            && registro[4].Value.ToString() != "CASH-EQUIVALENTS"
                            && registro[4].Value.ToString() != "CASH FP")
                        {

                            decimal ldecPlazo = convertDateDecimal(registro[8]);
                            lplazo = int.Parse(ldecPlazo.ToString());

                        }

                        //if (long.Parse(registro[54].Value.ToString()) == 114)
                        //{
                        //    String A = registro[35].Value.ToString().Replace("%", "");

                        //    --String b = "";
                        //}


                        lLista.Add(
                            new tinvinversionRentaFija()
                            {

                                fultimacompra = convertDateToInt(registro[36].Value.ToString()),

                                porcentajeprecioultimacompra = decimal.Parse(registro[35].Value.ToString().Replace("%", "").Replace(".", ",")),

                                fpagoultimocupon = convertDateToInt(registro[25].Value.ToString())
                                , numerolinea = (int)lintIndice + 1
                                ,
                                cinversion = long.Parse(registro[54].Value.ToString())
                                ,
                                mensaje = lstrMensaje
                                ,
                                tasaclasificacionccatalogo = 1210
                                ,
                                tasaclasificacioncdetalle = "FIJA"
                                ,
                                nombreinstrumento = registro[4].Value.ToString()
                                ,
                                tipoinversion = registro[5].Value.ToString()
                                ,
                                codigotitulo = registro[6].Value.ToString()
                                ,
                                tasa = decimal.Parse(registro[7].Value.ToString().Trim()) * 100
                                ,
                                fvencimiento = convertDateToInt(registro[9].Value.ToString().Trim())
                                ,
                                nombreemisor = depuraEmisor(registro[10].Value.ToString())
                                ,
                                valornominal = obtenerValorNominal(registro[53].Value.ToString())
                                ,
                                valornegociacion = obtenerValorNominal(registro[53].Value.ToString())
                                ,
                                valorefectivo = obtenerValorNominal(registro[53].Value.ToString()) * decimal.Parse(registro[20].Value.ToString().Trim())
                                ,
                                comentariosanulacion = registro[53].Value.ToString()
                                ,
                                fcompra = lFinicio
                                ,
                                femision = lFinicio
                                ,
                                yield = convertirPorcentaje(registro[19].Value.ToString().Trim())
                                ,
                                calificacionriesgoinicialccatalogo = 1207
                                ,
                                calificacionriesgoinicialcdetalle = registro[23].Value.ToString()
                                ,
                                calificacionriesgoactualccatalogo = 1207
                                ,
                                calificacionriesgoactualcdetalle = registro[24].Value.ToString()
                                ,
                                fultimopago = convertDateToInt(registro[17].Value.ToString().Trim())
                                ,
                                basediasinteresccatalogo = 1222
                                ,
                                basediasinterescdetalle = registro[37].Value.ToString().Trim()
                                ,
                                calendarizacionccatalogo = 1209
                                ,
                                calendarizacioncdetalle = registro[38].Value.ToString().Trim()
                                ,
                                porcentajecalculoprecio = decimal.Parse(registro[20].Value.ToString().Trim()) * 100
                                ,
                                cotizacion = 1
                                ,
                                sector = registro[21].Value.ToString().Trim()
                                ,
                                plazo = lplazo
                                ,
                                plazorealxvencer = lplazo

                                ,
                                casavalores = registro[55].Value.ToString().Trim()
                                ,
                                contactocasaid = registro[56].Value.ToString().Trim()
                                ,
                                contactocasanombres = registro[57].Value.ToString().Trim()
                                ,
                                contactocasadireccion = registro[58].Value.ToString().Trim()
                                ,
                                contactocasatelefono = registro[59].Value.ToString().Trim()
                                ,
                                contactocasacorreo = registro[60].Value.ToString().Trim()
                                ,
                                nombrebancopago = registro[61].Value.ToString().Trim()
                                ,
                                nombrebolsavalores = registro[62].Value.ToString().Trim()
                                ,
                                nombrebancoSCPN = registro[63].Value.ToString().Trim()
                                ,
                                opeinstidentificacion = registro[64].Value.ToString().Trim()
                                ,
                                opeinstnombrescontacto = registro[65].Value.ToString().Trim()
                                ,
                                opeinstdireccion = registro[66].Value.ToString().Trim()
                                ,
                                opeinstcelular = registro[67].Value.ToString().Trim()
                                ,
                                opeinsttelefono = registro[68].Value.ToString().Trim()
                                ,
                                opeinstdireccionelectronica = registro[69].Value.ToString().Trim()
                                ,
                                interesvalornominal = linteresValorNominal


                            });



                    }

                    lintIndice++;

                }


                lintIndice = 1;

                var cargaRentaVariable = from a in excelFile.Worksheet("R.VARIABLE") select a;

                foreach (var registro in cargaRentaVariable)
                {

                    if (registro[21].Value.ToString() != "" && registro[21].Value.ToString() != "Id. Inversión")
                    {

                        lLista.Add(
                            new tinvinversionRentaFija()
                            {
                                numerolinea = (int)lintIndice + 1
                                ,
                                cinversion = long.Parse(registro[21].Value.ToString().Replace(".00", ""))
                                ,
                                mensaje = lstrMensaje
                                ,
                                tasaclasificacionccatalogo = 1210
                                ,
                                tasaclasificacioncdetalle = "VAR"
                                ,
                                nombreinstrumento = registro[3].Value.ToString()
                                ,
                                tipoinversion = registro[4].Value.ToString()
                                ,
                                nombreemisor = depuraEmisor(registro[5].Value.ToString())
                                ,
                                codigotitulo = registro[6].Value.ToString()
                                ,
                                valornominal = convertirMonedaToDecimal(registro[7].Value.ToString())
                                ,
                                numeroacciones = convertirMonedaToDecimal(registro[8].Value.ToString())
                                ,
                                dividendosenacciones = convertirMonedaToDecimal(registro[9].Value.ToString())
                                ,
                                fcompra = convertDateToInt(registro[12].Value.ToString().Trim())
                                ,
                                valorefectivo = convertirMonedaToDecimal(registro[13].Value.ToString())
                                ,
                                preciounitarioaccion = convertirMonedaToDecimal(registro[14].Value.ToString())
                                ,
                                cotizacion = 1
                                ,
                                sector = registro[15].Value.ToString().Trim()
                                ,
                                casavalores = registro[22].Value.ToString().Trim()
                                ,
                                contactocasaid = registro[23].Value.ToString().Trim()
                                ,
                                contactocasanombres = registro[24].Value.ToString().Trim()
                                ,
                                contactocasadireccion = registro[25].Value.ToString().Trim()
                                ,
                                contactocasatelefono = registro[26].Value.ToString().Trim()
                                ,
                                contactocasacorreo = registro[27].Value.ToString().Trim()
                                ,
                                nombrebancopago = registro[28].Value.ToString().Trim()
                                ,
                                nombrebolsavalores = registro[29].Value.ToString().Trim()
                                ,
                                nombrebancoSCPN = registro[30].Value.ToString().Trim()
                                ,
                                opeinstidentificacion = registro[31].Value.ToString().Trim()
                                ,
                                opeinstnombrescontacto = registro[32].Value.ToString().Trim()
                                ,
                                opeinstdireccion = registro[33].Value.ToString().Trim()
                                ,
                                opeinstcelular = registro[34].Value.ToString().Trim()
                                ,
                                opeinsttelefono = registro[35].Value.ToString().Trim()
                                ,
                                opeinstdireccionelectronica = registro[36].Value.ToString().Trim()


                            });


                    }

                    lintIndice++;



                }


                List<tbancodetalle> lListaBanco = new List<tbancodetalle>();

                lintIndice = 1;

                var cargaBancos = from a in excelFile.Worksheet("InstitucionFinanciera") select a;

                foreach (var registro in cargaBancos)
                {

                    if (registro[0].Value.ToString() == "") break;

                    if ((registro[15].Value.ToString() == ""))
                    {
                        throw new AtlasException("INV-0010",
                            "ERROR: {0}", "DEBE INGRESAR LA CUENTA BANCARIA DEL BCE EN LA HOJA 'InstitucionesFinancieras' (" +
                            registro[0].Value.ToString() +
                            "), LINEA: " +
                            (lintIndice + 1).ToString() +
                            ".  PROCESO CANCELADO!");
                    }

                    long llngNumeroCuenta = 0;

                    try
                    {
                        llngNumeroCuenta = long.Parse(registro[15].Value.ToString());
                    }
                    catch
                    {
                        throw new AtlasException("INV-0010",
                            "ERROR: {0}", "DEBE INGRESAR UN VALOR NUMÉRICO EN LA CUENTA BANCARIA DEL BCE EN LA HOJA 'InstitucionesFinancieras' (" +
                            registro[0].Value.ToString() +
                            "), LINEA: " +
                            (lintIndice + 1).ToString() +
                            ".  PROCESO CANCELADO!");

                    }

                    lListaBanco.Add(
                        new tbancodetalle()
                        {
                            nombrebanco = registro[0].Value.ToString()
                            ,
                            nombrescontacto1 = registro[1].Value.ToString()
                            ,
                            cargocontacto1 = registro[2].Value.ToString()
                            ,
                            direccioncontacto1 = registro[3].Value.ToString()
                            ,
                            telefonocontacto1 = registro[4].Value.ToString()
                            ,
                            celularcontacto1 = registro[5].Value.ToString()
                            ,
                            correocontacto1 = registro[6].Value.ToString()
                            ,
                            faxcontacto1 = registro[7].Value.ToString()
                            ,
                            nombrescontacto2 = registro[8].Value.ToString()
                            ,
                            cargocontacto2 = registro[9].Value.ToString()
                            ,
                            direccioncontacto2 = registro[10].Value.ToString()
                            ,
                            telefonocontacto2 = registro[11].Value.ToString()
                            ,
                            celularcontacto2 = registro[12].Value.ToString()
                            ,
                            correocontacto2 = registro[13].Value.ToString()
                            ,
                            faxcontacto2 = registro[14].Value.ToString()
                            ,
                            cuentabancariabce = registro[15].Value.ToString().Trim()


                        }
                        );


                    lintIndice++;



                }

                // FIN 2


                rqmantenimiento.Response["lregistros"] = lLista;
                rqmantenimiento.Response["lregistrosBancos"] = lListaBanco;

            }
            else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {

                TinvRegistroDividendoDal.DeleteAll();
                TinvEmisorDetalleDal.DeleteAll();
                TinvJuntaAccionistasDal.DeleteAll();
                TinvContabilizacionDal.DeletePorTipoInversion("FIJA");
                TinvContabilizacionDal.DeletePorTipoInversion("VAR");
                TinvVentaAccionesDal.DeleteAll();
                TinvInversionRentaVariableDal.DeleteAll();
                TinvPrecioCierreDal.DeleteAll();
                TinvTablaAmortizacionDal.DeleteAll();
                TinvInvVectorPreciosDal.DeleteAll();
                TinvTablaAmortizacionHisDal.DeleteAll();
                TinvInversionHisDal.DeleteAll();
                TinvTablaAmortizacionTmpDal.DeleteAll();

                TinvPrecancelacionDal.DeleteAll();

                TinvInversionDal.Delete("FIJA");
                TinvInversionDal.Delete("VAR");
                TinvPlantillaContableDal.Delete(1213);


                TinvBancoDetalleDal.DeleteAll();

                TinvAgenteBolsaDal.DeleteAll();

                List<tgencatalogodetalle> tGenCatDetalle = TinvCatalogoDetalleDal.Find(1213);

                foreach (var item in tGenCatDetalle)
                {
                    TinvCatalogoDetalleDal.DeletePorCDetalle(item.cdetalle, item.ccatalogo);

                }

                List<tgencatalogodetalle> tGenCatDetalleCasVal = TinvCatalogoDetalleDal.Find(1217);

                foreach (var item in tGenCatDetalleCasVal)
                {
                    TinvCatalogoDetalleDal.DeletePorCDetalle(item.cdetalle, item.ccatalogo);
                }

                TinvOperadorInstitucionalDal.DeleteAll();

                dynamic arrayBanco = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistrosBancos"].ToString());

                long lcbancodetalle = 1;

                foreach (var item in arrayBanco)
                {

                    TinvBancoDetalleDal.FindInsertPorNombreBDD(
                        (string)item.nombrebanco,
                        ref lcbancodetalle,
                        rqmantenimiento.Cusuario,
                        (string)item.nombrescontacto1,
                        (string)item.cargocontacto1,
                        (string)item.direccioncontacto1,
                        (string)item.telefonocontacto1,
                        (string)item.celularcontacto1,
                        (string)item.correocontacto1,
                        (string)item.faxcontacto1,
                        (string)item.nombrescontacto2,
                        (string)item.cargocontacto2,
                        (string)item.direccioncontacto2,
                        (string)item.telefonocontacto2,
                        (string)item.celularcontacto2,
                        (string)item.correocontacto2,
                        (string)item.faxcontacto2,
                        (string)item.cuentabancariabce
                        );

                }

                dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistros"].ToString());

                long llngCdetalle = 1;
                long llngCdetalleCasaVal = 1;
                long llngcinvagentebolsa = 1;
                long llngcinvagentebolsaAux = 0;

                long llngcinvoperadorinstitucional = 1;
                long llngcinvoperadorinstitucionalAux = 0;


                string lstrCdetalle = "";

                long icemisordetalle = 0;

                Alta lAlta = new Alta();

                foreach (var item in array)
                {

                    tgencatalogodetalle tgenEmisor = new tgencatalogodetalle();

                    string[] lEmisorPorNombre = TinvCatalogoDetalleDal.FindInsertaEmisorPorNombre(
                        (string)item.nombreemisor
                        , ref llngCdetalle
                        , ref icemisordetalle, 1213
                        , (string)item.calificacionriesgoactualcdetalle
                        , rqmantenimiento.Cusuario
                        , (string)item.sector);

                    lstrCdetalle = lEmisorPorNombre[0];

                    string lstrCdetalleCasaVal = TinvCatalogoDetalleDal.FindInsertaPorNombre(
                        (string)item.casavalores
                        , ref llngCdetalleCasaVal
                        , 1217
                        , rqmantenimiento.Cusuario);

                    string lstrCdetalleBolsaVal = TinvCatalogoDetalleDal.FindPorNombre(1215, (string)item.nombrebolsavalores);

                    string lstrCdetalleBancoSCPN = TinvCatalogoDetalleDal.FindPorNombre(1224, (string)item.nombrebancoSCPN);

                    llngcinvagentebolsaAux = TinvAgenteBolsaDal.FindInsertaAgenteBolsaPornombres(
                        (string)item.contactocasanombres
                        , (string)item.contactocasaid
                        , (string)item.contactocasadireccion
                        , (string)item.contactocasatelefono
                        , (string)item.contactocasacorreo
                        , lstrCdetalleCasaVal
                        , ref llngcinvagentebolsa
                        , 1217
                        , rqmantenimiento.Cusuario);

                    llngcinvoperadorinstitucionalAux = TinvOperadorInstitucionalDal.FindInsertaPornombre(
                        (string)item.opeinstnombrescontacto
                        , (string)item.opeinstidentificacion
                        , (string)item.opeinstdireccion
                        , (string)item.opeinsttelefono
                        , (string)item.opeinstcelular
                        , (string)item.opeinstdireccionelectronica
                        , lstrCdetalleBancoSCPN
                        , ref llngcinvoperadorinstitucional
                        , 1224
                        , rqmantenimiento.Cusuario);


                    string lbancopagocdetalle = TinvBancoDetalleDal.ObtenerCDetallePorNombresBDD((string)item.nombrebancopago);

                    tinvinversion tInversion = new tinvinversion();

                    if (llngcinvoperadorinstitucionalAux > 0) tInversion.cinvoperadorinstitucional = llngcinvoperadorinstitucionalAux;

                    if (llngcinvagentebolsaAux > 0) tInversion.cinvagentebolsa = llngcinvagentebolsaAux;
                    tInversion.cinversion = item.cinversion;
                    tInversion.tasaclasificacionccatalogo = item.tasaclasificacionccatalogo;
                    tInversion.tasaclasificacioncdetalle = item.tasaclasificacioncdetalle;
                    tInversion.optlock = 0;
                    tInversion.codigotitulo = item.codigotitulo;
                    tInversion.numerocontrato = null;
                    tInversion.ccomprobante = null;
                    tInversion.fcolocacion = item.fcompra;
                    tInversion.fcompra = item.fcompra;
                    tInversion.fpago = item.fpago;
                    tInversion.fregistro = null;
                    tInversion.femision = item.femision;
                    tInversion.fvencimiento = item.fvencimiento;
                    tInversion.fultimopago = item.fultimopago;
                    tInversion.fpagoultimocupon = item.fpagoultimocupon;
                    //tInversion.fultimacompra = null;
                    tInversion.fultimacompra = item.fultimacompra;
                    tInversion.valornominal = item.valornominal;
                    tInversion.valornegociacion = item.valornegociacion;
                    tInversion.valorefectivo = item.valorefectivo;
                    tInversion.tasa = item.tasa;
                    tInversion.diasgraciacapital = null;
                    tInversion.diasgraciainteres = null;
                    tInversion.diasporvencerafechacompra = null;
                    tInversion.boletin = null;
                    tInversion.cotizacion = item.cotizacion;
                    tInversion.yield = item.yield;
                    tInversion.comisionbolsavalores = null;
                    tInversion.comisionoperador = null;
                    tInversion.comisionretencion = null;
                    tInversion.porcentajecalculoprecio = item.porcentajecalculoprecio;
                    tInversion.porcentajecalculodescuento = null;
                    tInversion.porcentajecalculorendimiento = null;

                    tInversion.porcentajeprecioultimacompra = item.porcentajeprecioultimacompra;

                    tInversion.porcentajepreciocompra = null;
                    tInversion.preciounitarioaccion = item.preciounitarioaccion;
                    tInversion.numeroacciones = item.numeroacciones;
                    tInversion.valoracciones = null;
                    tInversion.preciocompra = null;
                    tInversion.valordividendospagados = null;
                    tInversion.porcentajeparticipacioncupon = null;
                    tInversion.tasainterescupon = null;
                    tInversion.tir = null;
                    tInversion.observaciones = null;


                    if (lstrCdetalleBancoSCPN != "")
                    {
                        tInversion.bancoccatalogo = 1224;
                        tInversion.bancocdetalle = lstrCdetalleBancoSCPN;
                    }

                    tInversion.plazo = item.plazo;
                    tInversion.plazorealxvencer = item.plazorealxvencer;

                    if (item.basediasinterescdetalle != null && item.basediasinterescdetalle.ToString().Trim().Length > 0)
                    {
                        string lstrNombre = (string)item.basediasinterescdetalle;
                        lstrNombre = lstrNombre.ToUpper();
                        tInversion.basediasinteresccatalogo = 1222;
                        tInversion.basediasinterescdetalle = TinvCatalogoDetalleDal.FindPorNombre(1222, lstrNombre);
                    }


                    if (lstrCdetalleBolsaVal != "")
                    {
                        tInversion.bolsavaloresccatalogo = 1215;
                        tInversion.bolsavalorescdetalle = lstrCdetalleBolsaVal;
                    }

                    tInversion.calendarizacionccatalogo = item.calendarizacionccatalogo;
                    tInversion.calendarizacioncdetalle = item.calendarizacioncdetalle;

                    if (item.calificacionriesgoinicialcdetalle != null && item.calificacionriesgoinicialcdetalle.ToString().Trim().Length > 0)
                    {
                        tInversion.calificacionriesgoinicialccatalogo = 1207;
                        tInversion.calificacionriesgoinicialcdetalle = TinvCatalogoDetalleDal.FindPorNombre(1207, (string)item.calificacionriesgoinicialcdetalle);
                    }

                    if (lEmisorPorNombre[1] != null && lEmisorPorNombre[1].ToString().Trim().Length > 0)
                    {
                        tInversion.calificacionriesgoactualccatalogo = 1207;
                        tInversion.calificacionriesgoactualcdetalle = lEmisorPorNombre[1];
                    }
                    else if (item.calificacionriesgoactualcdetalle != null && item.calificacionriesgoactualcdetalle.ToString().Trim().Length > 0)
                    {
                        string lcalificacionriesgoactualcdetalle = TinvCatalogoDetalleDal.FindPorNombre(1207, (string)item.calificacionriesgoactualcdetalle);

                        if (lcalificacionriesgoactualcdetalle != null && lcalificacionriesgoactualcdetalle.Trim().Length > 0)
                        {
                            tInversion.calificacionriesgoactualccatalogo = 1207;
                            tInversion.calificacionriesgoactualcdetalle = lcalificacionriesgoactualcdetalle;
                        }
                    }

                    if (lstrCdetalleCasaVal != "")
                    {
                        tInversion.casavaloresccatalogo = 1217;
                        tInversion.casavalorescdetalle = lstrCdetalleCasaVal;
                    }


                    if (item.tipoinversion != null && item.tipoinversion.ToString().Trim().Length > 0)
                    {
                        string lstrNombre = (string)item.tipoinversion;
                        if (lstrNombre == "Fisico") lstrNombre = "Físico";
                        tInversion.clasificacioninversionccatalogo = 1203;
                        tInversion.clasificacioninversioncdetalle = TinvCatalogoDetalleDal.FindPorNombre(1203, lstrNombre);
                    }


                    tInversion.compracuponccatalogo = null;
                    tInversion.compracuponcdetalle = null;

                    tInversion.emisorccatalogo = 1213;
                    tInversion.emisorcdetalle = lstrCdetalle;

                    tInversion.formaajusteinteresccatalogo = null;
                    tInversion.formaajusteinterescdetalle = null;

                    string lstrInstrumento = (string)item.nombreinstrumento;

                    string lstrMercado = "BURSAT";

                    decimal? lporcentajebolsa = 9;
                    decimal? lporcentajeoperador = 9;
                    decimal? lporcentajeretencion = 2;

                    if (lstrInstrumento == "CDP-GARANTIA HIPOTECARIA MYR. ARGOTI" || lstrInstrumento == "CDP-GARANTIA HIPOTECARIA MYR. MUÑOZ") lstrInstrumento = "CDP";

                    switch (lstrInstrumento)
                    {
                        case "CDP":
                            lstrInstrumento = "CDP";
                            lstrMercado = "EXTBUR";
                            break;
                        case "PA":
                            lstrInstrumento = "PA";
                            lstrMercado = "EXTBUR";
                            break;
                        case "CASH -EQUIVALENTS":
                            lstrInstrumento = "CASHEQ";
                            break;
                        case "CASH-EQUIVALENTS":
                            lstrInstrumento = "CASHEQ";
                            break;
                        case "CASH FP":
                            lstrInstrumento = "CASHFP";
                            break;
                        case "OBLIGACIÓN":
                            lstrInstrumento = "OBLIGA";
                            break;
                        case "VALORES TITULARIZACION CREDITICIA":
                            lstrInstrumento = "VALTIT";
                            break;
                        case "VALORES TITULARIZACIÓN CREDITICIA":
                            lstrInstrumento = "VALTIT";
                            break;
                        case "TITULARIZACIÓN":
                            lstrInstrumento = "TITULA";
                            break;
                        case "INVERSION GARANTIA HIPOTECARIA":
                            lstrInstrumento = "INVHIP";
                            break;
                        case "BONO":
                            lstrInstrumento = "BONO";
                            break;
                        case "BONOS DEL ESTADO":
                            lstrInstrumento = "BONEST";
                            break;
                        case "Acciones":
                            lstrInstrumento = "ACCION";
                            break;
                        case "ACC. OPP.":
                            lstrInstrumento = "ACCOPP";
                            break;
                        default:


                            break;

                    }

                    if (lstrMercado == "EXTBUR")
                    {
                        lporcentajebolsa = null;
                        lporcentajeoperador = null;
                        lporcentajeretencion = null;
                    }


                    tInversion.instrumentoccatalogo = 1202;
                    tInversion.instrumentocdetalle = lstrInstrumento;

                    tInversion.mercadotipoccatalogo = 1211;
                    tInversion.mercadotipocdetalle = lstrMercado;

                    tInversion.monedaccatalogo = 1214;
                    tInversion.monedacdetalle = "USD";

                    tInversion.periodicidadpagoscapitalccatalogo = null;
                    tInversion.periodicidadpagoscapitalcdetalle = null;
                    tInversion.periodicidadpagosinteresccatalogo = null;
                    tInversion.periodicidadpagosinterescdetalle = null;

                    tInversion.portafolioccatalogo = 1201;
                    tInversion.portafoliocdetalle = "INV";

                    tInversion.sectorccatalogo = 1205;
                    if (lEmisorPorNombre[2] != null && lEmisorPorNombre[2].ToString().Trim().Length > 0)
                    {
                        tInversion.sectorcdetalle = lEmisorPorNombre[2];
                    }
                    else
                    {
                        tInversion.sectorcdetalle = TinvCatalogoDetalleDal.FindPorNombre(1205, (string)item.sector);
                    }

                    tInversion.sistemacolocacionccatalogo = 1212;
                    tInversion.sistemacolocacioncdetalle = "PRIM";

                    tInversion.estadoccatalogo = 1204;
                    tInversion.estadocdetalle = "APR";

                    tInversion.centrocostoccatalogo = 1002;
                    tInversion.centrocostocdetalle = "CCSCPN";

                    tInversion.porcentajebolsa = lporcentajebolsa;
                    tInversion.porcentajeoperador = lporcentajeoperador;
                    tInversion.porcentajeretencion = lporcentajeretencion;

                    tInversion.retencionfuentevalor = null;

                    tInversion.comentariosingreso = null;
                    tInversion.comentariosaprobacion = null;
                    tInversion.comentariosanulacion = null;
                    tInversion.comentariosdevolucion = null;
                    tInversion.comentariospago = null;
                    tInversion.numerooficiocompra = null;
                    tInversion.fresolucioncompra = null;

                    if (lbancopagocdetalle != "")
                    {
                        tInversion.bancopagoccatalogo = 305;
                        tInversion.bancopagocdetalle = lbancopagocdetalle;
                    }

                    tInversion.cinversionhisultimo = null;
                    tInversion.interesvalornominal = item.interesvalornominal;
                    tInversion.interesporvencer = null;
                    tInversion.saldocapital = null;
                    tInversion.saldointeres = null;
                    tInversion.diasvalornominal = null;
                    //tInversion.plazorealxvencer = null;
                    tInversion.diastranscurridosinteres = null;

                    if (item.dividendosenacciones != null && (decimal)item.dividendosenacciones != 0)
                    {
                        tInversion.dividendosenacciones = item.dividendosenacciones;
                    }

                    tInversion.fingreso = DateTime.Now;
                    tInversion.cusuarioing = rqmantenimiento.Cusuario;
                    Sessionef.Grabar(tInversion);


                }

            }



        }

        /// <summary>
        /// Depura y obtiene el nombre del emisor, reasignándolo con el nombre real.
        /// </summary>
        /// <param name="iEmisor">Nombre del emisor original.</param>
        /// <returns>string</returns>
        private static string depuraEmisor(string iEmisor)
        {
            if (iEmisor == "BANCO PICHINCHA")
            {
                return "BANCO DEL PICHINCHA";
            }
            else if (iEmisor == "BANCO PRODUBANCO")
            {
                return "PRODUBANCO";
            }
            else if (iEmisor == "BANCO GUAYAQUIL")
            {
                return "BANCO DE GUAYAQUIL";
            }
            else if (iEmisor == "SBH DIV PREF INC USD FGN   RJ" || iEmisor == "SBH DIV PREF INC USD FGN  ( RJ)")
            {
                return "SBH DIV PREF INC USD FGN(RJ)";
            }

            return iEmisor;
        }

        /// <summary>
        /// Convierte un objeto string a decimal.
        /// </summary>
        /// <param name="iValor">Valor a convertir.</param>
        /// <returns>decimal</returns>
        private static decimal convertirPorcentaje(string iValor)
        {
            return decimal.Parse(iValor.Substring(0, iValor.Trim().Length - 1).Replace(".", ","));
        }

        /// <summary>
        /// Convierte un objeto string del tipo moneda a decimal.
        /// </summary>
        /// <param name="iValor">Valor a convertir.</param>
        /// <returns>decimal</returns>
        private static decimal convertirMonedaToDecimal(string iValor)
        {
            if (iValor.Trim().Length == 0)
            {
                return 0;

            }
            else
            {
                return decimal.Parse(iValor.Replace(",", "").Replace(".", ",").Replace("$", "").Trim());
            }

        }

        /// <summary>
        /// Convierte un objeto string a decimal.
        /// </summary>
        /// <param name="iValor">Valor a convertir.</param>
        /// <returns>decimal</returns>
        private static decimal obtenerValorNominal(string iValor)
        {

            String[] lSeparador = { "-" };

            string lvalor = "";

            try
            {
                lvalor = iValor.Substring(0, iValor.IndexOf(lSeparador[0])).Replace(".", ",");
            }
            catch
            {
                lvalor = iValor.Replace(",", "").Replace(".", ",");
            }

            return decimal.Parse(lvalor);
        }


        public static int convertDateToInt(string lFecha)
        {

            String[] lSeparador = { "-" };

            string lintDia = lFecha.Substring(0, lFecha.IndexOf(lSeparador[0]));

            String[] lmes = { "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic" };

            int mes = 0;

            for (int i = 0; i < 12; i++)
            {
                if (lFecha.IndexOf(lmes[i]) > 0)
                {
                    mes = i + 1;
                    break;
                }
            }

            int anio = 2000 + int.Parse(lFecha.Substring(lFecha.Trim().Length - 2, 2));

            return (anio * 10000) + (mes * 100) + int.Parse(lintDia);
        }

        private static decimal convertDateDecimal(string istrDate)
        {

            DateTime ldte = DateTime.Parse(istrDate);

            int lMinuendo = 0;

            if (ldte.Year == 1900)
            {

                long lvalor = (ldte.Month * 100000000) +
                    (ldte.Day * 1000000) +
                    (ldte.Hour * 10000) +
                    (ldte.Minute * 100) +
                    ldte.Second;

                if (lvalor >= 101000000 && lvalor <= 228234536)
                {
                    lMinuendo = 1;

                }

            }

            return Math.Round(Convert.ToDecimal(Convert.ToSingle(ldte.ToOADate())), 2, MidpointRounding.AwayFromZero) - lMinuendo;

        }
    }

    public class clsValidarMigracion
    {


        public long clsDescomponerFecha(ref string mensaje, string istrFecha)
        {
            const string lcmensaje = "La fecha en la celda [C6] no cumple con el formato correspondiente";

            int anio = 0;
            int mes = 0;
            int dia = 0;

            try
            {

                dia = int.Parse(istrFecha.Substring(6, 2).Trim());

                string lstrFECHA = istrFecha.ToUpper().Trim();

                String[] lmes = { "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE" };

                for (int i = 0; i < 12; i++)
                {
                    if (lstrFECHA.IndexOf(lmes[i]) > 0)
                    {
                        mes = i + 1;
                        break;
                    }
                }

                anio = int.Parse(lstrFECHA.Substring(lstrFECHA.Length - 4, 4));

                DateTime fec = new DateTime(anio, mes, dia);

                return (anio * 10000) + (mes * 100) + dia;


            }
            catch
            {
                mensajeAsignar(ref mensaje, lcmensaje);
                return 0;
            }

        }


        public long clsValidarFecha(ref string mensaje, string istrFecha)
        {

            const string lcmensaje = "La fecha no cumple con el formato correspondiente";

            int anio = 0;
            int mes = 0;
            int dia = 0;

            try
            {

                DateTime fec = new DateTime(1900, 1, 1);
                fec = fec.AddDays(double.Parse(istrFecha) - 2);

                anio = fec.Year;
                mes = fec.Month;
                dia = fec.Day;

            }
            catch
            {
                mensajeAsignar(ref mensaje, lcmensaje);
                return 0;
            }

            if (anio == 0 || mes == 0 || dia == 0)
            {
                mensajeAsignar(ref mensaje, "Fecha obligatoria");
                return 0;
            }
            else
            {
                return (anio * 10000) + (mes * 100) + dia;
            }

        }

        /// <summary>
        /// Validar números decimales
        /// </summary>
        /// <param name="mensaje"></param>
        /// <param name="contenido"></param>

        public decimal clsValidarDecimal(string istrDecimal, ref string mensaje, string nombreCampo = "", int numerodecimales = 2)
        {

            if (istrDecimal.Trim().Length > 0)
            {

                string separadorDecimal = "";

                if (istrDecimal.IndexOf(",") > -1)
                {
                    separadorDecimal = ",";
                }
                else
                {
                    if (istrDecimal.IndexOf(".") > -1)
                    {
                        separadorDecimal = ".";
                    }
                }

                if (separadorDecimal.Trim().Length > 0)
                {
                    if (istrDecimal.IndexOf(separadorDecimal) == 0)
                    {
                        istrDecimal = "0" + istrDecimal;
                    }
                }
                else
                {
                    separadorDecimal = ".";
                    istrDecimal = istrDecimal + separadorDecimal + "0";
                }

                String[] lvalor = istrDecimal.Split(Convert.ToChar(separadorDecimal));

                try
                {

                    Int64 lenteroaux = 0;

                    decimal ldecimalaux = 0;

                    if (lvalor[0].Trim().Length > 0)
                    {
                        lenteroaux = Int64.Parse(lvalor[0].Trim());
                    }

                    if (lvalor[1].Trim().Length > 0)
                    {

                        if (Int64.Parse(lvalor[1].Trim()) != 0)
                        {
                            ldecimalaux = decimal.Parse("1" + separadorDecimal + lvalor[1].Trim());

                            ldecimalaux = ldecimalaux - 1;

                            if (ldecimalaux.ToString().Trim().Length - 2 > numerodecimales)
                            {
                                mensajeAsignarConNombreCampo(ref mensaje, "debe tener máximo " + numerodecimales.ToString().Trim() + " dígitos decimales", nombreCampo);
                            }

                        }

                    }

                    decimal ldecimalResultado = lenteroaux + ldecimalaux;

                    if (ldecimalResultado < 0)
                    {
                        mensajeAsignarConNombreCampo(ref mensaje, "debe ser un valor mayor que cero", nombreCampo);
                    }

                    return ldecimalResultado;

                }
                catch
                {
                    mensajeAsignarConNombreCampo(ref mensaje, "debe tener formato numérico de máximo " + numerodecimales.ToString().Trim() + " dígitos decimales", nombreCampo);

                    return 0;
                }
            }
            else
            {
                return 0;
            }

        }

        public void validarDosDecimales(decimal idecimal, ref string mensaje, string nombreCampo = "")
        {
            decimal ldecimal = idecimal * 100;

            if (Convert.ToInt64(ldecimal) - ldecimal != 0)
            {
                mensajeAsignarConNombreCampo(ref mensaje, "debe tener máximo 2 dígitos decimales", nombreCampo);
            }

        }

        public void mensajeAsignar(ref string mensaje, string contenido)
        {
            if (mensaje.Trim().Length != 0)
            {
                mensaje = mensaje + ".  ";
            }
            mensaje = mensaje + contenido;
        }

        private void mensajeAsignarConNombreCampo(ref string mensaje, string contenido, string nombreCampo = "")
        {

            string lmensaje = nombreCampo.Trim().Length == 0 ? "" : nombreCampo.Trim() + " ";
            lmensaje = lmensaje + contenido;
            mensajeAsignar(ref mensaje, lmensaje);
        }

        public string asignarObjeto(object iobj)
        {

            return iobj == null ? "" : iobj.ToString();

        }


        public string clsValidarEmisor(string contenido, int lenghtMaxima, ref string mensaje, string nombreCampo = "")
        {

            string lContenido = contenido.Trim();

            int llenght;

            while (true)
            {

                llenght = lContenido.Length;

                if (llenght == 0)
                {
                    break;
                }

                if (lContenido.Substring(llenght - 1, 1) == "*")
                {
                    lContenido = lContenido.Substring(0, llenght - 1);
                }
                else
                {
                    break;
                }

            }

            if (llenght > lenghtMaxima)
            {
                mensajeAsignar(ref mensaje, "La longitud de máxima de" + nombreCampo + " debe ser [" + lenghtMaxima + "] y es de [" + llenght + "]");
            }


            return lContenido;

        }

    }

    public class tinvinversionRentaFija : tinvinversion
    {
        public int numerolinea;
        public string mensaje;
        public string nombreemisor;
        public string nombreinstrumento;
        public string tipoinversion;
        public string sector;

        public string casavalores;
        public string contactocasaid;
        public string contactocasanombres;
        public string contactocasadireccion;
        public string contactocasatelefono;
        public string contactocasacorreo;
        public string nombrebancopago;
        public string nombrebolsavalores;
        public string nombrebancoSCPN;

        public string opeinstidentificacion;
        public string opeinstnombrescontacto;
        public string opeinstdireccion;
        public string opeinstcelular;
        public string opeinsttelefono;
        public string opeinstdireccionelectronica;


    }

    public class tbancodetalle : tinvbancodetalle
    {

        public string nombrebanco;

    }


    public class TablaPagos : ComponenteMantenimiento
    {
        // <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            bool mblnGeneraNIIFS = bool.Parse(rqmantenimiento.Mdatos["GeneraNIIFS"].ToString());

            bool mblnTablasInd = bool.Parse(rqmantenimiento.Mdatos["mblnTablasInd"].ToString());

            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "upload")
            {

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
                    throw new AtlasException("INV-0003", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA 'C:\CESANTIA_APP_HOME\SUBIRARCHIVOS' EN EL DISCO 'C:\', PARA POSIBILITAR LA CARGA DEL EXTRACTO BANCARIO.");
                }

                List<ptTablaAmortizacion> lLista = new List<ptTablaAmortizacion>();


                var excelFile = new ExcelQueryFactory(path);

                if (mblnTablasInd)
                {
                    this.generaTablaInd(excelFile
                        , ref lLista
                        , int.Parse(rqmantenimiento.Mdatos["fmigracion"].ToString()), mblnGeneraNIIFS);
                }
                else

                {
                    var cargaRentaFija = from a in excelFile.Worksheet("TablaPagos") select a;

                    string lstrMensaje = "Ok";

                    clsValidarMigracion lclsValidar = new clsValidarMigracion();

                    int lintIndice = 1;

                    foreach (var registro in cargaRentaFija)
                    {

                        if (registro[0].Value.ToString().Trim().Length == 0)
                        {
                            break;
                        }
                        else
                        {

                            DateTime lfinicio = DateTime.Parse(registro[1].Value.ToString());
                            DateTime lffin = DateTime.Parse(registro[2].Value.ToString());

                            int lplazo = (int)lffin.Subtract(DateTime.Parse(lfinicio.ToString())).TotalDays;

                            string lEstadocdetalle = (lffin.Year * 10000) + (lffin.Month * 100) + lffin.Day <= int.Parse(rqmantenimiento.Mdatos["fmigracion"].ToString()) ? "PAG" : "PEN";

                            decimal? lproyeccioncapital = null;
                            decimal? mora = null;

                            if (registro[4].Value.ToString().Length != 0) lproyeccioncapital = decimal.Parse(registro[4].Value.ToString());

                            if (registro[6].Value.ToString().Length != 0) mora = decimal.Parse(registro[6].Value.ToString());

                            decimal? linteresimplicito = null;
                            decimal? lcostoamortizado = null;
                            decimal? ldiferenciainteresimplicito = null;

                            if (!mblnGeneraNIIFS)
                            {
                                if (registro[7].Value.ToString().Length != 0) linteresimplicito = decimal.Parse(registro[7].Value.ToString());
                                if (registro[8].Value.ToString().Length != 0) lcostoamortizado = decimal.Parse(registro[8].Value.ToString());
                                if (registro[9].Value.ToString().Length != 0) ldiferenciainteresimplicito = decimal.Parse(registro[9].Value.ToString());

                            }

                            lLista.Add(
                                new ptTablaAmortizacion()
                                {
                                    numerolinea = (int)lintIndice + 1
                                    ,
                                    cinversion = long.Parse(registro[0].Value.ToString())
                                    ,
                                    mensaje = lstrMensaje
                                    ,
                                    nfinicio = lfinicio
                                    ,
                                    nfvencimiento = lffin
                                    ,
                                    proyecciontasa = decimal.Parse(registro[3].Value.ToString())
                                    ,
                                    proyeccioncapital = lproyeccioncapital
                                    ,
                                    proyeccioninteres = decimal.Parse(registro[5].Value.ToString())
                                    ,
                                    plazo = lplazo
                                    ,
                                    estadocdetalle = lEstadocdetalle
                                    ,
                                    valormora = mora
                                    ,
                                    interesimplicito = linteresimplicito
                                    ,
                                    costoamortizado = lcostoamortizado
                                    ,
                                    diferenciainteresimplicito = ldiferenciainteresimplicito


                                });


                        }

                        lintIndice++;
                    }

                }

                rqmantenimiento.Response["lregistros"] = lLista;

            }
            else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {

                TinvContabilizacionDal.DeletePorTipoInversion("FIJA");
                TinvContabilizacionDal.DeletePorTipoInversion("VAR");
                TinvTablaAmortizacionDal.DeleteAll();
                TinvControlAccrualFechasDal.DeleteAll();

                dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistros"].ToString());

                long lcinvtablaamortizacion = 912;

                int lfmigracion = int.Parse(rqmantenimiento.Mdatos["fmigracion"].ToString());

                DateTime lnfmigracion = DateTime.Parse(rqmantenimiento.Mdatos["nfmigracion"].ToString());

                long lcinversion = 0;
                decimal lcapitalporamortizar = 0;

                string linstrumentocdetalle = "";

                decimal lproyecciontasa = 0;

                List<tTablaAmortizacion> ltablaamortizacion = new List<tTablaAmortizacion>();

                foreach (var item in array)
                {


                    if (item.cinversion != lcinversion)
                    {

                        if (lcinversion != 0)
                        {

                            generaTabla(
                                lcinversion
                                , rqmantenimiento
                                , lproyecciontasa
                                , ref ltablaamortizacion
                                , ref lcinvtablaamortizacion
                                , lfmigracion
                                , mblnGeneraNIIFS
                                , iblnValidaContraVNominal: bool.Parse(rqmantenimiento.Mdatos["mblnDebeCuadrarConPortafolio"].ToString()));

                        }

                        lcinversion = item.cinversion;
                        tinvinversion inversion = TinvInversionDal.Find(lcinversion);
                        linstrumentocdetalle = inversion.instrumentocdetalle;
                        lcapitalporamortizar = (decimal)inversion.valornominal;
                    }

                    if (item.proyeccioncapital.ToString() != "") lcapitalporamortizar = lcapitalporamortizar - (decimal)item.proyeccioncapital;

                    DateTime lfinicio = DateTime.Parse(item.nfinicio.ToString());
                    DateTime lfvencimiento = DateTime.Parse(item.nfvencimiento.ToString());

                    int lfecini = (lfinicio.Year * 10000) + (lfinicio.Month * 100) + lfinicio.Day;
                    int lfecven = (lfvencimiento.Year * 10000) + (lfvencimiento.Month * 100) + lfvencimiento.Day;

                    ltablaamortizacion.Add(
                    new tTablaAmortizacion()
                    {
                        cinversion = item.cinversion,
                        fvencimiento = lfecven,
                        finicio = lfecini,
                        plazo = item.plazo,
                        proyeccioninteres = item.proyeccioninteres,
                        proyecciontasa = item.proyecciontasa * 0.01,
                        proyeccioncapital = item.proyeccioncapital,
                        estadoccatalogo = 1223,
                        estadocdetalle = item.estadocdetalle,
                        nfvencimiento = item.nfvencimiento,
                        nfinicio = item.nfinicio,
                        capitalxamortizar = lcapitalporamortizar,
                        total = item.total,
                        valormora = item.valormora
                        ,
                        interesimplicito = item.interesimplicito
                        ,
                        costoamortizado = item.costoamortizado
                        ,
                        diferenciainteresimplicito = item.diferenciainteresimplicito
                    });

                    lproyecciontasa = item.proyecciontasa * 0.01;

                }

                if (lcinversion != 0)
                {
                    generaTabla(
                        lcinversion
                        , rqmantenimiento
                        , lproyecciontasa
                        , ref ltablaamortizacion
                        , ref lcinvtablaamortizacion
                        , lfmigracion
                        , mblnGeneraNIIFS
                        , iblnValidaContraVNominal: bool.Parse(rqmantenimiento.Mdatos["mblnDebeCuadrarConPortafolio"].ToString()));
                }

                TinvPlantillaContableDal.generaPlantilla(rqmantenimiento.Cusuario);

                List<tinvinversion> lInversion = TinvInversionDal.GetRentaFijaSinTabla();

                foreach (var item in lInversion)
                {

                    tinvtablaamortizacion tTablaPagos = new tinvtablaamortizacion();

                    tTablaPagos.cinvtablaamortizacion = lcinvtablaamortizacion;
                    tTablaPagos.optlock = 0;
                    tTablaPagos.cinversion = item.cinversion;

                    tTablaPagos.finicio = int.Parse(item.femision.ToString());
                    tTablaPagos.fvencimiento = int.Parse(item.fvencimiento.ToString());

                    tTablaPagos.plazo = item.plazo;
                    tTablaPagos.proyeccioncapital = item.valornominal;
                    tTablaPagos.proyecciontasa = item.tasa;

                    tTablaPagos.proyeccioninteres = item.interesvalornominal;

                    tTablaPagos.estadoccatalogo = 1218;

                    tTablaPagos.estadocdetalle = int.Parse(item.fvencimiento.ToString()) <= lfmigracion ? "PAG" : "PEN";

                    tTablaPagos.fingreso = DateTime.Now;
                    tTablaPagos.cusuarioing = rqmantenimiento.Cusuario;

                    decimal laccrualDiario = 0;
                    if (tTablaPagos.estadocdetalle == "PAG")
                    {
                        tTablaPagos.acumuladoaccrual = item.interesvalornominal;
                        tTablaPagos.diastranscurridosaccrual = item.plazo;
                        tTablaPagos.fultimoaccrual = item.fvencimiento;
                    }
                    else if (item.interesvalornominal != 0)
                    {
                        laccrualDiario = Math.Round((decimal)(item.interesvalornominal / item.plazo), 2, MidpointRounding.AwayFromZero);

                        DateTime nfemision = new DateTime(int.Parse(item.femision.ToString().Trim().Substring(0, 4)),
                            int.Parse(item.femision.ToString().Trim().Substring(4, 2)),
                            int.Parse(item.femision.ToString().Trim().Substring(6, 2)));

                        int ldiastranscurridosaccrual = (int)lnfmigracion.Subtract(nfemision).TotalDays;
                        decimal lacumuladoaccrual = laccrualDiario * ldiastranscurridosaccrual;
                        int lfultimoaccrual = lfmigracion;

                        if (lacumuladoaccrual != 0)
                        {
                            tTablaPagos.acumuladoaccrual = lacumuladoaccrual;
                            tTablaPagos.diastranscurridosaccrual = ldiastranscurridosaccrual;
                            tTablaPagos.fultimoaccrual = lfultimoaccrual;
                        }
                    }

                    lcinvtablaamortizacion++;
                    Sessionef.Grabar(tTablaPagos);
                }
            }
        }

        private void generaTablaInd(ExcelQueryFactory iExcelFac
            , ref List<ptTablaAmortizacion> iLista
            , int ifmigracion
            , bool iblnGeneraNIIFS)
        {
            clsValidar lclsValidar = new clsValidar();

            //string[] lHoja = {
            //    "DEXICORP",
            //    "ECUAGRAM",
            //    "INTEROCLAST" };


            //--115.BonoDeudaInterna(2)

            string[] lHoja = {
                "115.BonoDeudaInterna(2)"};

            //string[] lHoja = {
            //    "99.arahuana",
            //    "87.OBLIG.SENEFELDER",
            //    "100.OBLIG.ATU",
            //    "94.AUDIOLEC",
            //    "110.Boyacá",
            //    "79.COMPUBUSSINES",
            //    "92.DUPOCSA",
            //    "108.ECOGAL",
            //    "109.ECOGALSERIEB",
            //    "101.EnvasesDelLitoral",
            //    "106.EnvasesDelLitoral(2)",
            //    "103.ESEICO",
            //    "82.FISA",
            //    "84.ILE",
            //    "83.INTEROC",
            //    "80.PICA",
            //    "85.PlásticosDelLitoral",
            //    "111.OBLIG.PREDUCA",
            //    "102.OBLIG.REPAPER",
            //    "89.Superdeporte",
            //    "88.Superdeporte2",
            //    "97.TELCONET",
            //    "98.TIA",
            //    "91.TUPASA",
            //    "115.BonoDeudaInterna(1)",
            //    "116.BonoDeudaInterna(3)",
            //    "117.BonoDeudaInterna(4)",
            //    //"77.TITUZ.AutoAmazonas",
            //    "90.TitDECAMERON",
            //    "104.TitFORESCAN ",
            //    "105.TitMunGuayaquil",
            //    "86.TitPROADSER",
            //    "81.TitQUIFATEX",
            //    "96.VOLANN",
            //    "133.NovaCredit"
            //    ,"ICESA",
            //    "EDESA1",
            //    "EDESA2",
            //    "EDESA3",
            //    "DEXICORP",
            //    "ECUAGRAM",
            //    "INTEROCLAST"};

            int lLimite = lHoja.Count();

            for (int i = 0; i < lLimite; i++)
            //for (int i = 0; i < 1; i++)
            {


                var carga = from a in iExcelFac.Worksheet(lHoja[i]) select a;

                // INI

                int lintlinea = 2;

                int lintnumerolinea = 1;

                long lcinversion = 0;


                decimal lproyecciontasa = 0;

                //if (i == 1)
                //{
                //    string a = "";
                //}

                DateTime? lfinicio = null;

                foreach (var registro in carga)
                {
                    string lMensaje = "";


                    if (lintlinea == 2)
                    {
                        lcinversion = long.Parse(registro[10].ToString());
                    }
                    else if (lintlinea > 10 && registro[0].Value.ToString().Trim().Length == 0)
                    {
                        break;
                    }
                    else if (lintlinea == 4)
                    {
                        try
                        {
                            lfinicio = DateTime.Parse(registro[2].Value.ToString());
                        }
                        catch
                        { }
                    }
                    else if (lintlinea == 6)
                    {
                        lproyecciontasa = lclsValidar.clsValidarDecimal(registro[2].Value.ToString(), ref lMensaje, numerodecimales: 19, iblnValidaPositivo: false) * 100;
                    }

                    if (lfinicio == null && lintlinea == 9)
                    {
                        lfinicio = DateTime.Parse(registro[0].Value.ToString());
                    }

                    if (lintlinea > 9)
                    {

                        decimal? lproyeccioncapital = null;

                        decimal? linteresimplicito = null;
                        decimal? lcostoamortizado = null;
                        decimal? ldiferenciainteresimplicito = null;

                        if (!iblnGeneraNIIFS)
                        {
                            if (registro[7].Value.ToString().Length != 0) linteresimplicito = lclsValidar.clsValidarDecimal(registro[7].Value.ToString(), ref lMensaje, numerodecimales: 19, iblnValidaPositivo: false);
                            if (registro[8].Value.ToString().Length != 0) lcostoamortizado = lclsValidar.clsValidarDecimal(registro[8].Value.ToString(), ref lMensaje, numerodecimales: 19, iblnValidaPositivo: false);

                            ldiferenciainteresimplicito = (lclsValidar.clsValidarDecimal(registro[3].Value.ToString(), ref lMensaje, numerodecimales: 19) - lclsValidar.clsValidarDecimal(registro[7].Value.ToString(), ref lMensaje, numerodecimales: 19, iblnValidaPositivo: false)) * -1;

                            //if (registro[10].Value.ToString().Length != 0) ldiferenciainteresimplicito = lclsValidar.clsValidarDecimal(registro[10].Value.ToString(), ref lMensaje, numerodecimales: 19, iblnValidaPositivo: false);

                        }

                        if (registro[2].Value.ToString().Length != 0) lproyeccioncapital = lclsValidar.clsValidarDecimal(registro[2].Value.ToString(), ref lMensaje, numerodecimales: 19, iblnValidaPositivo: false);
                        DateTime lffin = DateTime.Parse(registro[0].Value.ToString());
                        int lplazo = (int)lffin.Subtract(DateTime.Parse(lfinicio.ToString())).TotalDays;
                        iLista.Add(
                            new ptTablaAmortizacion()
                            {
                                numerolinea = (int)lintnumerolinea
                                ,
                                cinversion = lcinversion
                                ,
                                nfinicio = lfinicio
                                ,
                                nfvencimiento = lffin
                                ,
                                proyecciontasa = lproyecciontasa
                                ,
                                proyeccioncapital = lproyeccioncapital
                                ,
                                proyeccioninteres = lclsValidar.clsValidarDecimal(registro[3].Value.ToString(), ref lMensaje, numerodecimales: 19)
                                ,
                                plazo = lplazo
                                ,
                                mensaje = lMensaje
                                ,
                                estadocdetalle = (lffin.Year * 10000) + (lffin.Month * 100) + lffin.Day <= ifmigracion ? "PAG" : "PEN"
                                //,
                                //valormora = mora
                                ,
                                interesimplicito = linteresimplicito
                                ,
                                costoamortizado = lcostoamortizado
                                ,
                                diferenciainteresimplicito = ldiferenciainteresimplicito


                            });

                        lfinicio = lffin.AddDays(1);

                        lintnumerolinea++;



                    }

                    lintlinea++;

                }

                // FIN


            }

        }

        public void generaTabla(
            long icinversion,
            RqMantenimiento rqmantenimiento,
            decimal iproyecciontasa,
            ref List<tTablaAmortizacion> itablaamortizacion,
            ref long icinvtablaamortizacion,
            int ifmigracion,
            bool iblnGeneraNIIFS,
            bool iblnReajuste = false, 
            bool iblnValidaContraVNominal = true)
        {
            Alta lAlta = new Alta();

            List<tTablaAmortizacion> tTablaAmortizaClone = new List<tTablaAmortizacion>();

            tinvinversion inversion = TinvInversionDal.Find(icinversion);

            DateTime? lfcompra = null;
            DateTime? lfultimopago = null;
            DateTime? lfemision = null;

            if (inversion.fcompra != null) lfcompra = lAlta.pfObtenerFecha((int)inversion.fcompra);
            if (inversion.fultimopago != null) lfultimopago = lAlta.pfObtenerFecha((int)inversion.fultimopago);
            if (inversion.femision != null) lfemision = lAlta.pfObtenerFecha((int)inversion.femision);

            lAlta.ConstruyeTabla(
                rqmantenimiento,
                itablaamortizacion,
                lfcompra,
                inversion.calendarizacioncdetalle,
                inversion.yield,
                lfemision,
                iproyecciontasa * 100,
                lfultimopago,
                idecForzarCalculoPorcentaje: (decimal)inversion.porcentajecalculoprecio);

            if (iblnValidaContraVNominal && inversion.valornominal != (decimal)rqmantenimiento.Response["Capital"])
            {
                throw new AtlasException("INV-0010",
                    "ERROR: {0}", "El Capital de la inversión No. " + icinversion.ToString() + " (" +
                    inversion.valornominal.ToString() +
                    "), es diferente al total de las tablas de amortización (" +
                    rqmantenimiento.Response["Capital"] +
                    ").  PROCESO CANCELADO!");
            }

            DateTime lFechaAux = (DateTime)rqmantenimiento.Response["FEmision"];
            inversion.femision = (lFechaAux.Year * 10000) + (lFechaAux.Month * 100) + lFechaAux.Day;
            lFechaAux = (DateTime)rqmantenimiento.Response["FVencimiento"];
            inversion.fvencimiento = (lFechaAux.Year * 10000) + (lFechaAux.Month * 100) + lFechaAux.Day;
            inversion.valorefectivo = (decimal)rqmantenimiento.Response["ValorEfectivo"];
            inversion.valornegociacion = (decimal)rqmantenimiento.Response["ValorNegociacion"];
            inversion.diastranscurridosinteres = (long)rqmantenimiento.Response["InteresTranscurridoDias"];
            inversion.plazorealxvencer = (long)rqmantenimiento.Response["PlazoRealxVencer"];
            inversion.diasporvencerafechacompra = (long)rqmantenimiento.Response["DiasxVencer"];
            inversion.diasvalornominal = (long)rqmantenimiento.Response["Interesnominaldias"];
            inversion.comisionbolsavalores = (decimal)rqmantenimiento.Response["ComisionBolsa"];
            inversion.comisionoperador = (decimal)rqmantenimiento.Response["ComisionOperador"];
            inversion.interestranscurrido = (decimal)rqmantenimiento.Response["InteresTranscurrido"];
            inversion.interesvalornominal = (decimal)rqmantenimiento.Response["Interes"];
            inversion.interesporvencer = (decimal)rqmantenimiento.Response["InteresPorVencer"];
            inversion.comisionretencion = (decimal)rqmantenimiento.Response["Retencion"];
            inversion.retencionfuentevalor = inversion.comisionretencion;
            decimal lBaseCalculo = 0;

            try
            {
                lBaseCalculo = (decimal)rqmantenimiento.Response["ValorEfectivo"];
            }
            catch
            { }

            try
            {
                lBaseCalculo = lBaseCalculo + (decimal)inversion.interestranscurrido;
            }
            catch
            { }

            try
            {
                lBaseCalculo = lBaseCalculo + (decimal)inversion.comisionbolsavalores;
            }
            catch
            { }

            try
            {
                lBaseCalculo = lBaseCalculo + (decimal)inversion.comisionoperador;
            }
            catch
            { }

            // Calcula TIR

            List<tTablaAmortizacion> ltablatmp = new List<tTablaAmortizacion>();

            ltablatmp = (List<tTablaAmortizacion>)rqmantenimiento.Response["lregistros"];

            long lLimite = ltablatmp.Count - 1;


            double[] tmpCashflows = new double[lLimite + 2];


            tmpCashflows[0] = (double)lBaseCalculo * -1;

            int lIndice = 0;

            while (lIndice <= lLimite)
            {
                tmpCashflows[lIndice + 1] = ltablatmp[lIndice].total == null ? 0 : (double)ltablatmp[lIndice].total;

                lIndice++;
            }

            double tmpIrr = 0;

            tmpIrr = Financial.IRR(ref tmpCashflows, 0.000001) * 100;

            inversion.tir = (decimal)tmpIrr;

            Sessionef.Actualizar(inversion);

            lIndice = 0;

            decimal linteresimplicito = Math.Round(lBaseCalculo * (decimal)tmpIrr * 0.01m, 2, MidpointRounding.AwayFromZero);
            decimal lcostoamortizado = 0;

            while (lIndice <= lLimite)
            {

                if (lIndice == 0)
                {
                    lcostoamortizado = Math.Round(lBaseCalculo - (ltablatmp[lIndice].total == null ? 0 : (decimal)ltablatmp[lIndice].total) + linteresimplicito, 2, MidpointRounding.AwayFromZero);
                }
                else
                {
                    lcostoamortizado = Math.Round(lcostoamortizado - (ltablatmp[lIndice].total == null ? 0 : (decimal)ltablatmp[lIndice].total) + linteresimplicito, 2, MidpointRounding.AwayFromZero);
                }

                decimal lvalorajustaractivo = linteresimplicito - (ltablatmp[lIndice].total == null ? 0 : (decimal)ltablatmp[lIndice].total);
                decimal ldiferenciaxinteresimplicito = lvalorajustaractivo + (ltablatmp[lIndice].proyeccioncapital == null ? 0 : (decimal)ltablatmp[lIndice].proyeccioncapital);

                int lfultimoaccrual = 0;
                decimal lacumuladoaccrual = 0;
                int ldiastranscurridosaccrual = 0;
                long lplazoAccrual = 0;

                if (ltablatmp[lIndice].estadocdetalle == "PAG")
                {
                    ldiastranscurridosaccrual = (int)ltablatmp[lIndice].plazo;
                    lacumuladoaccrual = (decimal)ltablatmp[lIndice].proyeccioninteres;
                    lfultimoaccrual = ltablatmp[lIndice].fvencimiento;
                }
                else if (ltablatmp[lIndice].finicio < ifmigracion)
                {

                    if (inversion.instrumentocdetalle != "TITULA" && inversion.instrumentocdetalle != "OBLIGA" && inversion.instrumentocdetalle != "VALTIT" && inversion.instrumentocdetalle != "INVHIP")
                    {
                        lplazoAccrual = (int)ltablatmp[lIndice].plazo;
                    }
                    else
                    {
                        if ((int)ltablatmp[lIndice].plazo > 75 && (int)ltablatmp[lIndice].plazo < 105)
                        {
                            lplazoAccrual = 90;
                        }
                        else if ((int)ltablatmp[lIndice].plazo >= 105 && (int)ltablatmp[lIndice].plazo < 135)
                        {
                            lplazoAccrual = 120;
                        }
                        else if ((int)ltablatmp[lIndice].plazo >= 165 && (int)ltablatmp[lIndice].plazo < 195)
                        {
                            lplazoAccrual = 180;
                        }
                        else
                        {
                            lplazoAccrual = 360;
                        }
                    }

                    decimal laccrualDiario = 0;

                    try
                    {
                        laccrualDiario = Math.Round((decimal)(linteresimplicito / lplazoAccrual), 2, MidpointRounding.AwayFromZero);
                    }
                    catch
                    { }

                    ldiastranscurridosaccrual = (int)lAlta.pfObtenerFecha(ifmigracion).Subtract(DateTime.Parse(ltablatmp[lIndice].nfinicio.ToString())).TotalDays;

                    lacumuladoaccrual = laccrualDiario * ldiastranscurridosaccrual;

                    lfultimoaccrual = ifmigracion;
                }

                decimal? lacumumadoaccrualAux = null;
                long? ldiastranscurridosaccrualAux = null;
                int? fultimoaccrualAux = null;

                if (lacumuladoaccrual != 0)
                {
                    lacumumadoaccrualAux = lacumuladoaccrual;
                    ldiastranscurridosaccrualAux = ldiastranscurridosaccrual;
                    fultimoaccrualAux = lfultimoaccrual;
                }


                if (iblnReajuste)
                {

                    decimal? lcostoamortizadoAux = lcostoamortizado;

                    decimal? linteresimplicitoAux = linteresimplicito;

                    if (lIndice == lLimite)
                    {

                        decimal? lDiferencia = 0 - lcostoamortizado;

                        if (lDiferencia != null && lDiferencia != 0)
                        {

                            lcostoamortizadoAux = lcostoamortizadoAux + lDiferencia;

                            if (lDiferencia < 0)
                            {
                                linteresimplicitoAux = linteresimplicitoAux + lDiferencia;
                            }
                            else if (lDiferencia > 0)
                            {
                                linteresimplicitoAux = linteresimplicitoAux - lDiferencia;
                            }

                        }

                    }

                    tTablaAmortizaClone.Add(
                        new tTablaAmortizacion()
                        {
                            cinvtablaamortizacion = ltablatmp[lIndice].cinvtablaamortizacion
                            ,
                            vpresente = ltablatmp[lIndice].vpresente
                            ,
                            ppv = ltablatmp[lIndice].ppv
                            ,
                            capitalxamortizar = ltablatmp[lIndice].ppv
                            ,
                            interesimplicito = linteresimplicitoAux
                            ,
                            costoamortizado = lcostoamortizadoAux
                            ,
                            diferenciainteresimplicito = ldiferenciaxinteresimplicito
                        });

                    linteresimplicito = Math.Round(lcostoamortizado * (decimal)tmpIrr * 0.01m, 2);

                }
                else
                {

                    tinvtablaamortizacion tTablaPagos = new tinvtablaamortizacion();

                    tTablaPagos.cinvtablaamortizacion = icinvtablaamortizacion;
                    tTablaPagos.cinversion = ltablatmp[lIndice].cinversion;
                    tTablaPagos.optlock = 0;
                    tTablaPagos.acumuladoaccrual = lacumumadoaccrualAux;
                    tTablaPagos.diastranscurridosaccrual = ldiastranscurridosaccrualAux;
                    tTablaPagos.fultimoaccrual = fultimoaccrualAux;
                    tTablaPagos.finicio = ltablatmp[lIndice].finicio;
                    tTablaPagos.fvencimiento = ltablatmp[lIndice].fvencimiento;
                    tTablaPagos.plazo = ltablatmp[lIndice].plazo;
                    tTablaPagos.proyeccioncapital = ltablatmp[lIndice].proyeccioncapital;
                    tTablaPagos.proyecciontasa = ltablatmp[lIndice].proyecciontasa;
                    tTablaPagos.proyeccioninteres = ltablatmp[lIndice].proyeccioninteres;
                    tTablaPagos.estadoccatalogo = 1218;
                    tTablaPagos.estadocdetalle = ltablatmp[lIndice].estadocdetalle;
                    tTablaPagos.vpresente = (decimal)ltablatmp[lIndice].vpresente;
                    tTablaPagos.ppv = ltablatmp[lIndice].ppv;
                    tTablaPagos.capitalxamortizar = (decimal)ltablatmp[lIndice].capitalxamortizar;

                    if (!iblnGeneraNIIFS)
                    {
                        tTablaPagos.interesimplicito = ltablatmp[lIndice].interesimplicito;
                        tTablaPagos.costoamortizado = ltablatmp[lIndice].costoamortizado;
                        tTablaPagos.diferenciainteresimplicito = ltablatmp[lIndice].diferenciainteresimplicito;
                    }
                    else
                    {
                        tTablaPagos.interesimplicito = linteresimplicito;
                        tTablaPagos.costoamortizado = lcostoamortizado;
                        tTablaPagos.diferenciainteresimplicito = ldiferenciaxinteresimplicito;
                    }

                    tTablaPagos.fingreso = DateTime.Now;
                    tTablaPagos.cusuarioing = rqmantenimiento.Cusuario;

                    tTablaPagos.valormora = ltablatmp[lIndice].valormora;

                    if (lIndice == lLimite)
                    {

                        decimal? lDiferencia = 0 - lcostoamortizado;

                        if (lDiferencia != null && lDiferencia != 0)
                        {

                            tTablaPagos.costoamortizado = tTablaPagos.costoamortizado + lDiferencia;

                            if (lDiferencia < 0)
                            {
                                tTablaPagos.interesimplicito = tTablaPagos.interesimplicito + lDiferencia;
                            }
                            else if (lDiferencia > 0)
                            {
                                tTablaPagos.interesimplicito = tTablaPagos.interesimplicito - lDiferencia;
                            }

                        }

                    }

                    linteresimplicito = Math.Round(lcostoamortizado * (decimal)tmpIrr * 0.01m, 2);

                    Sessionef.Grabar(tTablaPagos);

                    icinvtablaamortizacion++;

                }

                lIndice++;
            }
            itablaamortizacion = new List<tTablaAmortizacion>();

            if (iblnReajuste) rqmantenimiento.Response.Add("tTablaAmortiza", tTablaAmortizaClone);
        }

        private void asignaComisiones(string iregistro, ref long iid, long cinv, ref decimal? idec)
        {

            if (iregistro.Length != 0 && decimal.Parse(iregistro) != 0 && iid != cinv)
            {
                iid = cinv;
                idec = decimal.Parse(iregistro);
            }


        }

        private class ptTablaAmortizacion : tinvtablaamortizacion
        {

            public DateTime? nfinicio;
            public DateTime? nfvencimiento;
            public decimal? total;
            public decimal? saldo;
            public int numerolinea;
            public string mensaje;
            public string nestado;
            public decimal? porcentajecalculoprecio;

            public long? periodo;


            public decimal? comisionbolsavalores;
            public decimal? comisionoperador;
            public decimal? comisionretencion;
            public decimal? retencionfuentevalor;
            public decimal? tir;
            public decimal? interestranscurrido;


        }


        private static decimal convertirPorcentaje(string iValor)
        {
            return decimal.Parse(iValor.Substring(0, iValor.Trim().Length - 1).Replace(".", ","));
        }

        private static decimal convertirMonedaToDecimal(string iValor)
        {
            if (iValor.Trim().Length == 0)
            {
                return 0;

            }
            else
            {
                return decimal.Parse(iValor.Replace(",", "").Replace(".", ",").Replace("$", "").Trim());
            }

        }


        private static decimal obtenerValorNominal(string iValor)
        {

            String[] lSeparador = { "-" };

            string lvalor = "";

            try
            {
                lvalor = iValor.Substring(0, iValor.IndexOf(lSeparador[0])).Replace(".", ",");
            }
            catch
            {
                lvalor = iValor.Replace(",", "").Replace(".", ",");
            }

            return decimal.Parse(lvalor);
        }

        /// <summary>
        /// Convierte un objeto string a entero con formato de fecha aaaanndd.
        /// </summary>
        /// <param name="lFecha">Valor a convertir.</param>
        /// <returns>int</returns>
        private static int convertDateToInt(string lFecha)
        {

            String[] lSeparador = { "-" };

            string lintDia = lFecha.Substring(0, lFecha.IndexOf(lSeparador[0]));

            String[] lmes = { "ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic" };

            int mes = 0;

            for (int i = 0; i < 12; i++)
            {
                if (lFecha.IndexOf(lmes[i]) > 0)
                {
                    mes = i + 1;
                    break;
                }
            }

            int anio = 2000 + int.Parse(lFecha.Substring(lFecha.Trim().Length - 2, 2));

            return (anio * 10000) + (mes * 100) + int.Parse(lintDia);
        }

        /// <summary>
        /// Convertir un string a decimal.
        /// </summary>
        /// <param name="istrDate">String a convertir.</param>
        /// <returns>decimal</returns>
        private static decimal convertDateDecimal(string istrDate)
        {

            DateTime ldte = DateTime.Parse(istrDate);

            int lMinuendo = 0;

            if (ldte.Year == 1900)
            {

                long lvalor = (ldte.Month * 100000000) +
                    (ldte.Day * 1000000) +
                    (ldte.Hour * 10000) +
                    (ldte.Minute * 100) +
                    ldte.Second;

                if (lvalor >= 101000000 && lvalor <= 228234536)
                {
                    lMinuendo = 1;

                }

            }

            return Math.Round(Convert.ToDecimal(Convert.ToSingle(ldte.ToOADate())), 2, MidpointRounding.AwayFromZero) - lMinuendo;

        }
    }

}
