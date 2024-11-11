using dal.generales;
using modelo;
using core.componente;
using util;
using util.dto.mantenimiento;
using System;
using System.IO;
using LinqToExcel;
using System.Linq;
using System.Collections.Generic;
using dal.inversiones.catalogos;
using dal.inversiones.precioscierre;
using util.servicios.ef;
using dal.inversiones.vectorprecios;
using dal.inversiones.inversiones;
using dal.inversiones.cargaacciones;

//using dal.inversiones.cargaacciones;


namespace inversiones.comp.mantenimiento.migracion
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para importar los precios de cierre y el vector de precios históricos, generados por la bolsa de valores.
    /// </summary>
    public class Historico : ComponenteMantenimiento
    {
        /// <summary>
        /// Importa el histórico del vector de precios y de los precios de cierre de la Bolsa de Valores de Quito.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento de la transacción.</param>
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

                var excelFile = new ExcelQueryFactory(path);
                var cargaEmisor = from a in excelFile.Worksheet("Emisores") select a;

                //TinvPrecioCierreDal.DeleteAll();
                //TinvInvVectorPreciosDal.DeleteAll();

                List<tEmisor> lEmisor = new List<tEmisor>();

                foreach (var registro in cargaEmisor)
                {
                    lEmisor.Add(new tEmisor()
                    {
                        emisorAtlas = registro[0].ToString()
                        ,
                        emisorAtlasBV = registro[1].ToString()
                        ,
                        emisorAtlasBV1 = registro[2].ToString()
                        ,
                        emisorAtlasBV2 = registro[3].ToString()
                    });

                }

                bool lblnImportarDesde2013 = bool.Parse(rqmantenimiento.Mdatos["lblnImportarDesde2013"].ToString());

                if (lblnImportarDesde2013)
                {
                    procesaHistorico2013(excelFile, lEmisor, rqmantenimiento);
                }
                else
                {
                    procesaHistorico(excelFile, lEmisor, rqmantenimiento);
                }

            }
        }

        /// <summary>
        /// Importa el histórico del vector de precios y de los precios de cierre de la Bolsa de Valores de Quito a partir del año 2013.
        /// </summary>
        /// <param name="iExcelFac">Hola EXCEL.</param>
        /// <param name="iEmisor">Lista de emisores.</param>
        /// <param name="rqmantenimiento">Request dek mantenimiento de la transacción.</param>
        /// <returns></returns>
        private void procesaHistorico2013(ExcelQueryFactory iExcelFac, List<tEmisor> iEmisor, RqMantenimiento rqmantenimiento)
        {


            bool lblnImportarVectorPrecios = bool.Parse(rqmantenimiento.Mdatos["lblnImportarVectorPrecios"].ToString());
            bool lblnImportarPreciosCierre = bool.Parse(rqmantenimiento.Mdatos["lblnImportarPreciosCierre"].ToString());
            int lanio = int.Parse(rqmantenimiento.Mdatos["anio"].ToString());

            long lcinvvectorprecios = 0;
            long lcinvprecioscierre = 0;

            if (lblnImportarVectorPrecios)
            {
                TinvInvVectorPreciosDal.DeleteAnio(lanio);
                lcinvvectorprecios = TinvVectorPreciosDal.GetccInvVectorPrecios();
            }
            else
            {
                TinvPrecioCierreDal.DeleteAnio(lanio);
                lcinvprecioscierre = TinvPreciosCierreDal.GetcInvPreciosCierreMax();
            }


            string[] lHoja = { "VI2013-VI2018", "ACCIONES" };

            int lindice = lblnImportarVectorPrecios ? 0 : 1;


            //long llngControl = 1;

            for (int i = lindice; i < lindice+1; i++)
            {
                var carga = from a in iExcelFac.Worksheet(lHoja[i]) select a;
                foreach (var registro in carga)
                {


                    if (registro[0].ToString().Trim().Length == 0) break;

                    DateTime lfvaloracion = DateTime.Parse(registro[0]);

                    if (lfvaloracion.Year > lanio) break;

                    if (lfvaloracion.Year < lanio) continue;

                    switch (i)
                    {
                        case 0:

                            long lcinvinversion = TinvVectorPreciosDal.GetcInvInversionPorCodigoTitulo(registro[1]);

                            if (lcinvinversion != 0)
                            {
                                tinvvectorprecios tInvVectorPrecios = new tinvvectorprecios();

                                tInvVectorPrecios.cinvvectorprecios = lcinvvectorprecios;
                                tInvVectorPrecios.optlock = 0;
                                tInvVectorPrecios.fvaloracion = (lfvaloracion.Year * 10000) + (lfvaloracion.Month * 100) + lfvaloracion.Day;
                                tInvVectorPrecios.cinversion = lcinvinversion;
                                tInvVectorPrecios.codigotitulo = registro[1];
                                tInvVectorPrecios.tasainterescuponvigente = decimal.Parse(registro[6]) * 100;
                                tInvVectorPrecios.tasareferencia = convetirDecimal(registro[7]) * 100;
                                tInvVectorPrecios.margen = convetirDecimal(registro[8]);
                                tInvVectorPrecios.tasadescuento = convetirDecimal(registro[9]) * 100;

                                
                                tInvVectorPrecios.porcentajeprecio = convetirDecimal(registro[10]) * 100;
                                

                                tInvVectorPrecios.fingreso = DateTime.Now;
                                tInvVectorPrecios.cusuarioing = rqmantenimiento.Cusuario;

                                lcinvvectorprecios++;
                                Sessionef.Grabar(tInvVectorPrecios);


                            }

                            break;
                        default:

                            try
                            {
                                if (registro[2].ToString().Trim() != ".")
                                {
                                    string lEmisorcDetalle = FindPorEmisorBV(registro[1].ToString(), iEmisor, true);
                                    if (lEmisorcDetalle != "")
                                    {
                                        tinvprecioscierre tInvPreciosCierre = new tinvprecioscierre();
                                        tInvPreciosCierre.cinvprecioscierre = lcinvprecioscierre;
                                        tInvPreciosCierre.optlock = 0;
                                        tInvPreciosCierre.fvaloracion = (lfvaloracion.Year * 10000) + (lfvaloracion.Month * 100) + lfvaloracion.Day;
                                        tInvPreciosCierre.fultimocierre = (lfvaloracion.Year * 10000) + (lfvaloracion.Month * 100) + lfvaloracion.Day;
                                        tInvPreciosCierre.emisorccatalogo = 1213;
                                        tInvPreciosCierre.emisorcdetalle = lEmisorcDetalle;
                                        tInvPreciosCierre.valornominal = 1;
                                        tInvPreciosCierre.preciocierre = decimal.Parse(registro[2].ToString().Replace(".", ","));
                                        tInvPreciosCierre.fingreso = DateTime.Now;
                                        tInvPreciosCierre.cusuarioing = rqmantenimiento.Cusuario;
                                        Sessionef.Grabar(tInvPreciosCierre);
                                        lcinvprecioscierre++;

                                    }

                                }


                            }
                            catch
                            {
                                decimal x = 0;
                                decimal a = 100 / x;
                            }

                            break;
                    }

                }
            }
        }

        /// <summary>
        /// Convierte a decimal un objeto.
        /// </summary>
        /// <param name="iobjValor">Objeto a convertir.</param>
        /// <returns>decimal</returns>
        private decimal? convetirDecimal(object iobjValor)
        {
            if (iobjValor.ToString() == ".")
            {
                return null;
            }
            else
            {
                return decimal.Parse(iobjValor.ToString().Replace(".", ","));
            }
        }

        /// <summary>
        /// Importa la información a partir del año 2015.
        /// </summary>
        /// <param name="iExcelFac">Hola EXCEL.</param>
        /// <param name="iEmisor">Lista de emisores.</param>
        /// <param name="rqmantenimiento">Request dek mantenimiento de la transacción.</param>
        /// <returns></returns>
        private void procesaHistorico(ExcelQueryFactory iExcelFac, List<tEmisor> iEmisor, RqMantenimiento rqmantenimiento)
        {
            string[] lHoja = { "ACCIONES", "OBLIGACION", "TITULARIZACION" };

            long lcinvprecioscierre = 1;
            long lcinvvectorprecios = 1;

            string lEmisorDetalleAux = "";
            int lFechaAux = 0;
            string lInstrumentoAux = "";
            decimal lValorNominalAux = 0;
            decimal lPecioCierreAux = 0;
            long lcinversionaux = 0;

            decimal ltasainterescuponvigente = 0;
            decimal lrendimientoequivalente = 0;
            decimal lporcentajeprecio = 0;
            string ltituloaux = "";
            decimal ltasa = 0;

            int lFemisionAux = 0;
            int lFvencimientoAux = 0;

            DateTime ldfvaloracion = DateTime.Now;

            int lfvaloracion = (ldfvaloracion.Year * 10000) + (ldfvaloracion.Month * 100) + ldfvaloracion.Day;

            for (int i = 0; i<3; i++)
            {

                for (int j = 2015; j<2019; j++)
                {
                    var carga = from a in iExcelFac.Worksheet(lHoja[i] + "-" + j.ToString().Trim()) select a;

                    foreach (var registro in carga)
                    {

                        if (registro[0].ToString().Trim().Length == 0) break;

                        string lEmisorcDetalle = FindPorEmisorBV(registro[1].ToString(), iEmisor);

                        if (lEmisorcDetalle != "")
                        {
                            switch (i)
                            {
                                case 0:
                                    procesaAcciones(registro, lEmisorcDetalle, ref lEmisorDetalleAux, ref lFechaAux, ref lInstrumentoAux, ref lValorNominalAux, ref lPecioCierreAux, lfvaloracion, ref lcinvprecioscierre, (string)rqmantenimiento.Cusuario);
                                    break;
                                case 1:
                                    procesaResto(
                                        registro, 
                                        lEmisorcDetalle, 
                                        ref lEmisorDetalleAux, 
                                        ref lFechaAux, 
                                        ref lInstrumentoAux, 
                                        lfvaloracion,
                                        ref lcinversionaux, 
                                        ref lcinvvectorprecios, 
                                        (string)rqmantenimiento.Cusuario, 
                                        "OBLIGA",
                                        ref ltasainterescuponvigente, 
                                        ref lrendimientoequivalente, 
                                        ref lporcentajeprecio, 
                                        ref ltituloaux, 
                                        ref lFemisionAux, 
                                        ref lFvencimientoAux, 
                                        ref ltasa);
                                    break;
                                case 2:
                                    //DIFERENCIA EN ORDEN DE COLUMNAS

                                    procesaResto(
                                        registro,
                                        lEmisorcDetalle,
                                        ref lEmisorDetalleAux,
                                        ref lFechaAux,
                                        ref lInstrumentoAux,
                                        lfvaloracion,
                                        ref lcinversionaux,
                                        ref lcinvvectorprecios,
                                        (string)rqmantenimiento.Cusuario,
                                        "TITULA",
                                        ref ltasainterescuponvigente,
                                        ref lrendimientoequivalente,
                                        ref lporcentajeprecio,
                                        ref ltituloaux,
                                        ref lFemisionAux,
                                        ref lFvencimientoAux,
                                        ref ltasa);

                                    break;
                            }
                        }
                    }
                }

                switch (i)
                {
                    case 0:
                        guardar(lEmisorDetalleAux, lFechaAux, lInstrumentoAux, lValorNominalAux, lPecioCierreAux, lfvaloracion, ref lcinvprecioscierre, (string)rqmantenimiento.Cusuario);
                        break;
                    case 1:
                        if (lInstrumentoAux == "OBLIGA") guardarResto(lFechaAux, ref lcinvvectorprecios, (string)rqmantenimiento.Cusuario, lcinversionaux, ltituloaux, ltasainterescuponvigente, lrendimientoequivalente, lporcentajeprecio);
                        break;
                    case 2:
                        if (lInstrumentoAux == "TITULA") guardarResto(lFechaAux, ref lcinvvectorprecios, (string)rqmantenimiento.Cusuario, lcinversionaux, ltituloaux, ltasainterescuponvigente, lrendimientoequivalente, lporcentajeprecio);
                        break;
                }
                lEmisorDetalleAux = "";
            }
        }

        /// <summary>
        /// Importa las acciones.
        /// </summary>
        /// <param name="iRegistro">Registro activo.</param>
        /// <param name="iEmisorDetalle">Identificador del enisor.</param>
        /// <param name="iEmisorDetalleAux">Auxiliar del identificador del Emisor.</param>
        /// <param name="iFechaAux">Fecha de referencia.</param>
        /// <param name="iInstrumentoAux">Identificador del instrumento.</param>
        /// <param name="iValorNominalAux">Valor nominal de la inversión.</param>
        /// <param name="iPecioCierreAux">Precio de cierre.</param>
        /// <param name="ifvaloracion">Fecha de valoración.</param>
        /// <param name="icinvprecioscierre">Identificador de la tabla de precios de cierre.</param>
        /// <param name="icusuario">Identificador del usuario que ejecuta el proceso.</param>
        /// <returns></returns>
        private void procesaAcciones(
            LinqToExcel.Row iRegistro
            , string iEmisorDetalle
            , ref string iEmisorDetalleAux
            , ref int iFechaAux
            , ref string iInstrumentoAux
            , ref decimal iValorNominalAux
            , ref decimal iPecioCierreAux
            , int ifvaloracion
            , ref long icinvprecioscierre
            , string icusuario)


        {

            if (iEmisorDetalleAux == "")
            {
                asignaVariables(iRegistro, iEmisorDetalle, ref iEmisorDetalleAux, ref iFechaAux, ref iInstrumentoAux, ref iValorNominalAux, ref iPecioCierreAux);
            }
            else if (iFechaAux != ((DateTime.Parse(iRegistro[0]).Year * 10000) + (DateTime.Parse(iRegistro[0]).Month * 100) + DateTime.Parse(iRegistro[0]).Day) || 
                iEmisorDetalleAux != iEmisorDetalle || 
                iEmisorDetalle != iEmisorDetalleAux || 
                iInstrumentoAux != (string)iRegistro[2])
            {
                guardar(iEmisorDetalleAux, iFechaAux, iInstrumentoAux, iValorNominalAux, iPecioCierreAux, ifvaloracion, ref icinvprecioscierre, icusuario);
                asignaVariables(iRegistro, iEmisorDetalle, ref iEmisorDetalleAux, ref iFechaAux, ref iInstrumentoAux, ref iValorNominalAux, ref iPecioCierreAux);
            }
            else
            {
                asignaVariables(iRegistro, iEmisorDetalle, ref iEmisorDetalleAux, ref iFechaAux, ref iInstrumentoAux, ref iValorNominalAux, ref iPecioCierreAux);
            }
        }

        /// <summary>
        /// Guarda los precios de cierre.
        /// </summary>
        /// <param name="iEmisorDetalleAux">Auxiliar del identificador del Emisor.</param>
        /// <param name="iFechaAux">Fecha de referencia.</param>
        /// <param name="iInstrumentoAux">Identificador del instrumento.</param>
        /// <param name="iValorNominalAux">Valor nominal de la inversión.</param>
        /// <param name="iPecioCierreAux">Precio de cierre.</param>
        /// <param name="ifvaloracion">Fecha de valoración.</param>
        /// <param name="icinvprecioscierre">Identificador de la tabla de precios de cierre.</param>
        /// <param name="icusuario">Identificador del usuario que ejecuta el proceso.</param>
        /// <returns></returns>
        private void guardar(
            string iEmisorDetalleAux
            , int iFechaAux
            , string iInstrumentoAux
            , decimal iValorNominalAux
            , decimal iPecioCierreAux
            , int ifvaloracion
            , ref long icinvprecioscierre
            , string icusuario)

        {
            tinvprecioscierre tInvPreciosCierre = new tinvprecioscierre();
            tInvPreciosCierre.cinvprecioscierre = icinvprecioscierre;
            tInvPreciosCierre.optlock = 0;
            tInvPreciosCierre.fvaloracion = ifvaloracion;
            tInvPreciosCierre.fultimocierre = iFechaAux;
            tInvPreciosCierre.emisorccatalogo = 1213;
            tInvPreciosCierre.emisorcdetalle = iEmisorDetalleAux;
            tInvPreciosCierre.valornominal = iValorNominalAux;
            tInvPreciosCierre.preciocierre = iPecioCierreAux;
            tInvPreciosCierre.fingreso = DateTime.Now;
            tInvPreciosCierre.cusuarioing = icusuario;
            Sessionef.Grabar(tInvPreciosCierre);
            icinvprecioscierre++;

        }

        /// <summary>
        /// Guarda las inversiones que no sean del tipo acción.
        /// </summary>
        /// <param name="ifvaloracion">Fecha de valoración.</param>
        /// <param name="icinvvectorprecios">Identificador del vector de precios.</param>
        /// <param name="icusuario">Identificador del usuario que ejecuta el proceso.</param>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <param name="titulo">Título de la inversión.</param>
        /// <param name="itasainterescuponvigente">Tasa de interés del cupón de la inversión.</param>
        /// <param name="irendimientoequivalente">Valor del rendimiento equivalente.</param>
        /// <param name="iporcentajeprecio">POrcentaje del precio.</param>
        /// <returns></returns>
        private void guardarResto(
            int ifvaloracion
            , ref long icinvvectorprecios
            , string icusuario
            , long icinversion
            , string titulo
            , decimal itasainterescuponvigente
            , decimal irendimientoequivalente
            , decimal iporcentajeprecio)

        {

            tinvvectorprecios tInvVectorPrecios = new tinvvectorprecios();

            tInvVectorPrecios.cinvvectorprecios = icinvvectorprecios;
            tInvVectorPrecios.optlock = 0;
            tInvVectorPrecios.fvaloracion = ifvaloracion;

            tInvVectorPrecios.cinversion = icinversion;
            tInvVectorPrecios.codigotitulo = titulo;

            tInvVectorPrecios.tasainterescuponvigente = itasainterescuponvigente;
            tInvVectorPrecios.rendimientoequivalente = irendimientoequivalente;
            tInvVectorPrecios.porcentajeprecio = iporcentajeprecio;
            tInvVectorPrecios.fingreso = DateTime.Now;
            tInvVectorPrecios.cusuarioing = icusuario;

            Sessionef.Grabar(tInvVectorPrecios);

            icinvvectorprecios++;

        }

        /// <summary>
        /// Asigna las variables.
        /// </summary>
        /// <param name="iRegistro">Regitro activo.</param>
        /// <param name="lEmisorDetalle">Identificador del emisor.</param>
        /// <param name="iEmisorDetalleAux">Auxiliar del emisor.</param>
        /// <param name="iFechaAux">Fecha auxiliar.</param>
        /// <param name="iInstrumentoAux">Identificador del instrumento.</param>
        /// <param name="iValorNominalAux">Valor nominal.</param>
        /// <param name="iPecioCierreAux">Valor del precio de cierre.</param>
        /// <returns></returns>
        private void asignaVariables(
            LinqToExcel.Row iRegistro
            , string lEmisorDetalle
            , ref string iEmisorDetalleAux
            , ref int iFechaAux
            , ref string iInstrumentoAux
            , ref decimal iValorNominalAux
            , ref decimal iPecioCierreAux)
        {
            DateTime ldteFechaCierre = DateTime.Parse(iRegistro[0]);
            iFechaAux = (ldteFechaCierre.Year * 10000) + (ldteFechaCierre.Month * 100) + ldteFechaCierre.Day;
            iEmisorDetalleAux = lEmisorDetalle;
            iInstrumentoAux = (string)iRegistro[2];
            iValorNominalAux = decimal.Parse(iRegistro[3].ToString());
            iPecioCierreAux = decimal.Parse(iRegistro[4].ToString());
        }

        /// <summary>
        /// Asigna el resto de variables de las inversiones que no sean del tipo Acción.
        /// </summary>
        /// <param name="iRegistro">Regitro activo.</param>
        /// <param name="lEmisorDetalle">Identificador del emisor.</param>
        /// <param name="iEmisorDetalleAux">Auxiliar del emisor.</param>
        /// <param name="iFechaAux">Fecha auxiliar.</param>
        /// <param name="iInstrumentoAux">Identificador del instrumento.</param>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <param name="ititulo">Título del instrumento financiero.</param>
        /// <param name="icinversionAux">Identificador auxiliar de la inversión.</param>
        /// <param name="itituloAux">Título auxiliar del instrumento financiero..</param>
        /// <param name="itasainterescuponvigente">Tasa de interés.</param>
        /// <param name="irendimientoequivalente">Tasa de rendimiento.</param>
        /// <param name="iporcentajeprecio">POrcentaje del precio.</param>
        /// <param name="iFemisionAux">Fecha auxiliar de emisión.</param>
        /// <param name="iFvencimientoAuxFecha auxiliar de vencimiento">.</param>
        /// <param name="itasa">Tasa de interés.</param>
        /// <param name="iinstrumento">Identificador del instrumento.</param>
        /// <returns></returns>
        private void asignaVariablesResto(
            LinqToExcel.Row iRegistro
            , string lEmisorDetalle
            , ref string iEmisorDetalleAux
            , ref int iFechaAux
            , ref string iInstrumentoAux
            , long icinversion
            , string ititulo
            , ref long icinversionAux
            , ref string itituloAux
            , ref decimal itasainterescuponvigente
            , ref decimal irendimientoequivalente
            , ref decimal iporcentajeprecio
            , ref int iFemisionAux
            , ref int iFvencimientoAux
            , ref decimal itasa
            , string iinstrumento)

        {
            DateTime ldteFechaCierre = DateTime.Parse(iRegistro[0]);
            iFechaAux = (ldteFechaCierre.Year * 10000) + (ldteFechaCierre.Month * 100) + ldteFechaCierre.Day;
            iEmisorDetalleAux = lEmisorDetalle;
            iInstrumentoAux = iinstrumento;
            icinversionAux = icinversion;
            itituloAux = ititulo;
            itasainterescuponvigente = decimal.Parse(iRegistro[5].ToString());
            irendimientoequivalente = decimal.Parse(iRegistro[3].ToString());
            iporcentajeprecio = decimal.Parse(iRegistro[2].ToString());

            DateTime ldteFemision = DateTime.Parse(iRegistro[8]);
            iFemisionAux = (ldteFemision.Year * 10000) + (ldteFemision.Month * 100) + ldteFemision.Day;

            DateTime ldteFvencimiento = DateTime.Parse(iRegistro[9]);
            iFvencimientoAux = (ldteFvencimiento.Year * 10000) + (ldteFvencimiento.Month * 100) + ldteFvencimiento.Day;

            itasa = decimal.Parse(iRegistro[5]);

        }

        /// <summary>
        /// Procesa las inversiones que no sean del tipo Acción.
        /// </summary>
        /// <param name="iRegistro">Regitro activo.</param>
        /// <param name="lEmisorDetalle">Identificador del emisor.</param>
        /// <param name="iEmisorDetalleAux">Auxiliar del emisor.</param>
        /// <param name="iFechaAux">Fecha auxiliar.</param>
        /// <param name="iInstrumentoAux">Identificador del instrumento.</param>
        /// <param name="ifvaloracion">Fecha de valoración.</param>
        /// <param name="icinversionaux">Identificador auxiliar de la inversión.</param>
        /// <param name="icinvvectorprecios">Identificador del vector de precion.</param>
        /// <param name="icusuario">Identificador del usuario que ejecuta la importación.</param>
        /// <param name="istrinstrumento">Identificador del instrumento.</param>
        /// <param name="itasainterescuponvigente">Tasa de interés.</param>
        /// <param name="irendimientoequivalente">Tasa de rendimiento.</param>
        /// <param name="iporcentajeprecio">POrcentaje del precio.</param>
        /// <param name="itituloaux">Auxiliar del título del instrumento.</param>
        /// <param name="iFemisionAux">Fecha auxiliar de emisión.</param>
        /// <param name="iFvencimientoAux">Fecha auxiliar de vencimiento.</param>
        /// <param name="itasa">Tasa de interés.</param>
        /// <returns></returns>
        private void procesaResto(
            LinqToExcel.Row iRegistro
            , string iEmisorDetalle
            , ref string iEmisorDetalleAux
            , ref int iFechaAux
            , ref string iInstrumentoAux
            , int ifvaloracion
            , ref long icinversionaux
            , ref long icinvvectorprecios
            , string icusuario
            , string istrinstrumento
            , ref decimal itasainterescuponvigente
            , ref decimal irendimientoequivalente
            , ref decimal iporcentajeprecio
            , ref string itituloaux
            , ref int iFemisionAux
            , ref int iFvencimientoAux
            , ref decimal itasa)
        {

            DateTime FEmision = DateTime.Parse(iRegistro[istrinstrumento == "TITULA" ? 7 : 8]);

            DateTime FVencimiento = DateTime.Parse(iRegistro[9]);

            IList<Dictionary<string, object>> lresp = TinvInversionDal.obtenerTituloYCinversion(
                istrinstrumento,
                iEmisorDetalle,
                (FEmision.Year * 10000) + (FEmision.Month * 100) + FEmision.Day,
                (FVencimiento.Year * 10000) + (FVencimiento.Month * 100) + FVencimiento.Day,
                decimal.Parse(iRegistro[5]));

            if (lresp.Count > 0)
            {
                if (iEmisorDetalleAux == "")
                {
                    asignaVariablesResto(
                        iRegistro, 
                        iEmisorDetalle, 
                        ref iEmisorDetalleAux,
                        ref iFechaAux, 
                        ref iInstrumentoAux, 
                        (long)lresp[0]["cinversion"], 
                        (string)lresp[0]["codigotitulo"], 
                        ref icinversionaux, 
                        ref itituloaux, 
                        ref itasainterescuponvigente, 
                        ref irendimientoequivalente, 
                        ref iporcentajeprecio,
                        ref iFemisionAux,
                        ref iFvencimientoAux, 
                        ref itasa, 
                        istrinstrumento);
                }
                else if (iFechaAux != ((DateTime.Parse(iRegistro[0]).Year * 10000) + (DateTime.Parse(iRegistro[0]).Month * 100) + DateTime.Parse(iRegistro[0]).Day) || 
                    iEmisorDetalleAux != iEmisorDetalle || 
                    iInstrumentoAux != istrinstrumento ||
                    iFemisionAux != ((DateTime.Parse(iRegistro[8]).Year * 10000) + (DateTime.Parse(iRegistro[8]).Month * 100) + DateTime.Parse(iRegistro[8]).Day) ||
                    iFvencimientoAux != ((DateTime.Parse(iRegistro[9]).Year * 10000) + (DateTime.Parse(iRegistro[9]).Month * 100) + DateTime.Parse(iRegistro[9]).Day) ||
                    itasa != decimal.Parse(iRegistro[5]))
                {
                    //guardarResto(ifvaloracion, ref icinvvectorprecios, icusuario, (long)lresp[0]["cinversion"], (string)lresp[0]["codigotitulo"], itasainterescuponvigente, irendimientoequivalente, iporcentajeprecio);
                    guardarResto(iFechaAux, ref icinvvectorprecios, icusuario, (long)lresp[0]["cinversion"], (string)lresp[0]["codigotitulo"], itasainterescuponvigente, irendimientoequivalente, iporcentajeprecio);
                    asignaVariablesResto(iRegistro, iEmisorDetalle, ref iEmisorDetalleAux, ref iFechaAux, ref iInstrumentoAux, (long)lresp[0]["cinversion"], (string)lresp[0]["codigotitulo"], ref icinversionaux, ref itituloaux, ref itasainterescuponvigente, ref irendimientoequivalente, ref iporcentajeprecio, ref iFemisionAux, ref iFvencimientoAux, ref itasa, istrinstrumento);
                }
                else
                {
                    asignaVariablesResto(iRegistro, iEmisorDetalle, ref iEmisorDetalleAux, ref iFechaAux, ref iInstrumentoAux, (long)lresp[0]["cinversion"], (string)lresp[0]["codigotitulo"], ref icinversionaux, ref itituloaux, ref itasainterescuponvigente, ref irendimientoequivalente, ref iporcentajeprecio, ref iFemisionAux, ref iFvencimientoAux, ref itasa, istrinstrumento);
                }
            }
        }

        private class tEmisor
        {
            public string emisorAtlas;
            public string emisorAtlasBV;
            public string emisorAtlasBV1;
            public string emisorAtlasBV2;
        }

        /// <summary>
        /// Procesa las inversiones que no sean del tipo Acción.
        /// </summary>
        /// <param name="iEmisorNombreBV">Nombre del emisor de la bolsa de valores.</param>
        /// <param name="iEmisor">Nombre el emisor del SCPN.</param>
        /// <param name="lBuscaRestoColumnas">Bandera para indicar si la búsqueda abarca el resto de columnas de la hoja EXCEL.</param>
        /// <returns>string</returns>
        private static string FindPorEmisorBV(string iEmisorNombreBV, List<tEmisor> iEmisor, bool lBuscaRestoColumnas = false)
        {
            string lnombre = "";
            foreach (var item in iEmisor)
            {
                if (item.emisorAtlasBV.ToString().Trim() == iEmisorNombreBV.Trim())
                {
                    lnombre = TinvCatalogoDetalleDal.FindPorNombre(1213, item.emisorAtlas.ToString().Trim());
                }
                else if (lBuscaRestoColumnas && item.emisorAtlasBV1.ToString().Trim() == iEmisorNombreBV.Trim())
                {
                    lnombre = TinvCatalogoDetalleDal.FindPorNombre(1213, item.emisorAtlas.ToString().Trim());
                }
                else if (lBuscaRestoColumnas && item.emisorAtlasBV2.ToString().Trim() == iEmisorNombreBV.Trim())
                {
                    lnombre = TinvCatalogoDetalleDal.FindPorNombre(1213, item.emisorAtlas.ToString().Trim());
                }

            }
            return lnombre;
        }
    }
}
