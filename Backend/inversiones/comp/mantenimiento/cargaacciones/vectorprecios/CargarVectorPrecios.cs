using core.componente;
using dal.generales;
using modelo;
using System;
using System.IO;
using util;
using util.dto.mantenimiento;
using System.Collections.Generic;
using dal.inversiones.cargaacciones;
using util.servicios.ef;
using Newtonsoft.Json;
using System.Linq;
using LinqToExcel;
using dal.inversiones.inversiones;
using inversiones.comp.mantenimiento.migracion;
using dal.inversiones.reajustes;
namespace inversiones.comp.mantenimiento.cargaacciones.vectorprecios
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para importar el vector de precios.
    /// </summary>
    public class CargarVectorPrecios : ComponenteMantenimiento
    {

        /// <summary>
        /// Importar el vector de precios de las inversiones de renta fija.
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
                string tipoarchivo = (string)rqmantenimiento.Mdatos["ntipoarchivo"];
                archivo = archivo.Replace("data:"+tipoarchivo+";base64,", "");
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

                var cargatabla = from a in excelFile.WorksheetNoHeader("Precios") select a;


                List<tvectorprecios> lvectorprecios = new List<tvectorprecios>();

                bool controlError = true;

                int controlErrorGeneral = 0;

                string lstrMensaje = "";

                clsValidar lclsValidar = new clsValidar();

                string lstrFecha;

                object objFecha = null;

                long lfvaloracion = 0;

                foreach (var registro in cargatabla)
                {

                    lstrFecha = lclsValidar.asignarObjeto(registro[1]);

                    objFecha = registro[1];

                    break;

                }

                try
                {
                    lfvaloracion = (long)lclsValidar.clsValidarFechaFormato(ref lstrMensaje, objFecha);
                }
                catch
                {
                    lclsValidar.mensajeAsignar(ref lstrMensaje, lclsValidar.pfErrorFecha());
                }


                if (lfvaloracion == 0)
                {
                    controlErrorGeneral = 1;
                }
                else
                {
                    lstrMensaje = TinvVectorPreciosDal.GetExisteFecha(lfvaloracion);
                    if (lstrMensaje != "")
                    {
                        controlError = false;
                        controlErrorGeneral = 2;
                    }

                }

                if (controlErrorGeneral == 0)
                {

                    long lcinvinversion = 0;

                    long lindice = 7;

                    string lstrFilas = "";

                    long lcontrol = 0;

                    //RentaFija lRentaFija = new RentaFija();

                    foreach (var registro in cargatabla)
                    {
                        if (lcontrol >= 6)
                        {
                            string lcodigoTitulo = "";
                            string lcalificacionRiesgo = "";
                            string lemisor = "";

                            lstrFilas = lindice.ToString().Trim();
                            lcodigoTitulo = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[1]), 30, ref lstrMensaje, " el Código del Título");
                            if (lcodigoTitulo.Trim() == "")
                            {
                                break;
                            }

                            

                           //    lcinvinversion = TinvInversionDal.obtenerPorTitulo(
                           //      lcodigoTitulo
                           //     , (int)RentaFija.convertDateToInt(registro[6].ToString())
                           //    , (int)RentaFija.convertDateToInt(registro[7].ToString())
                           //    , int.Parse(registro[8].ToString().Replace(",","").Replace(".","")));

                            lcinvinversion = TinvVectorPreciosDal.GetcInvInversionPorCodigoTitulo(lcodigoTitulo);

                            //lcinvinversion = tinvinv


                            if (lcinvinversion != 0)
                            {
                                lstrMensaje = "";
                                decimal ltasainterescuponvigente = 0;
                                decimal ltasareferencia = 0;
                                decimal lmargen = 0;
                                decimal ltasadescuento = 0;
                                decimal lrendimientoequivalente = 0;
                                decimal lporcentajeprecio = 0;

                                lcalificacionRiesgo = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[2]), 6, ref lstrMensaje, " la Calificación de Riesgo");
                                lemisor = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[3]), 200, ref lstrMensaje, "l Emisor");
                                ltasainterescuponvigente = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(this.convertPercentDec(registro[9])), ref lstrMensaje, "Tasa de Interés del Cupón Vigente", 10);
                                ltasareferencia = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(this.convertPercentDec(registro[11])), ref lstrMensaje, "Tasa de Referencia", 20);
                                lmargen = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(this.convertPercentDec(registro[12])), ref lstrMensaje, "Margen", 22,false);
                                ltasadescuento = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(this.convertPercentDec(registro[13])), ref lstrMensaje, "Tasa de Descuento", 21);
                                lrendimientoequivalente = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(this.convertPercentDec(registro[14])), ref lstrMensaje, "Rendimiento Equivalente", 21);
                                lporcentajeprecio = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(this.convertPercentDec(registro[16])), ref lstrMensaje, "Rendimiento Equivalente", 20);

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
                                lvectorprecios.Add(
                                    new tvectorprecios()
                                    {
                                        numerolinea = (int)lindice,
                                        codigotitulo = lcodigoTitulo,
                                        calificacionriesgocdetalle = lcalificacionRiesgo,
                                        tasainterescuponvigente = ltasainterescuponvigente,
                                        tasareferencia = ltasareferencia,
                                        margen = lmargen,
                                        tasadescuento = ltasadescuento,
                                        rendimientoequivalente = lrendimientoequivalente,
                                        porcentajeprecio = lporcentajeprecio,
                                        fvaloracion = (int)lfvaloracion,
                                        mensaje = lstrMensaje,
                                        cinversion = lcinvinversion
                                    });

                            }


                        }
                        else
                        {
                            lcontrol++;
                        }

                        lindice++;

                    }

                }


                rqmantenimiento.Response["lregistros"] = lvectorprecios;

                if (!controlError)
                {
                    rqmantenimiento.Response.SetCod("000");
                    rqmantenimiento.Response.SetMsgusu(controlErrorGeneral == 2 ? lstrMensaje : "EXISTEN ERRORES EN LA CARGA. REVISE LOS MENSAJES EN LA COLUMNA MENSAJE");
                }

                if (controlErrorGeneral == 1)
                {
                    throw new AtlasException("INV-0004", "LA FECHA DE VALORACIÓN DEBE CONSTAR EN LA CELDA [B1] DE LA HOJA 1 DEL LIBRO {0}, CON EL FORMATO DE FECHA", narchivo);
                }

            }
            else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {
                  int fvaloracion = rqmantenimiento.Fconatable;
                long cInvVectorPrecios = TinvVectorPreciosDal.GetccInvVectorPrecios(); // tconconciliacionbancariaextDal.GetcConconciliacionBancariaExtracto();
                dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistros"].ToString());
                IList<tinvvectorprecios> vec = new List<tinvvectorprecios>();
                bool lblPrimerRegistro = true;


                foreach (var item in array)
                {

                    if (lblPrimerRegistro)
                    {
                        lblPrimerRegistro = false;

                        string lMensaje = TinvVectorPreciosDal.GetExisteFecha((long)item.fvaloracion);

                        if (lMensaje != "")
                        {
                            throw new AtlasException("INV-0010", "ERROR: {0}", lMensaje);
                        }

                    }

                  fvaloracion = item.fvaloracion;
                    tinvvectorprecios tInvVectorPrecios = new tinvvectorprecios();

                    tInvVectorPrecios.cinvvectorprecios = cInvVectorPrecios;
                    tInvVectorPrecios.optlock = 0;
                    tInvVectorPrecios.fvaloracion = item.fvaloracion;
                    tInvVectorPrecios.cinversion = item.cinversion;
                    tInvVectorPrecios.codigotitulo = item.codigotitulo;
                    tInvVectorPrecios.tasainterescuponvigente = item.tasainterescuponvigente;
                    tInvVectorPrecios.tasareferencia = item.tasareferencia;
                    tInvVectorPrecios.margen = item.margen;
                    tInvVectorPrecios.tasadescuento = item.tasadescuento;
                    tInvVectorPrecios.rendimientoequivalente = item.rendimientoequivalente;
                    tInvVectorPrecios.porcentajeprecio = item.porcentajeprecio;
                    tInvVectorPrecios.calificacionriesgoccatalogo = 1207;
                    tInvVectorPrecios.calificacionriesgocdetalle = item.calificacionriesgocdetalle;
                    tInvVectorPrecios.fingreso = DateTime.Now;
                    tInvVectorPrecios.cusuarioing = rqmantenimiento.Cusuario;
                    vec.Add(tInvVectorPrecios);
                    Sessionef.Grabar(tInvVectorPrecios);

                    cInvVectorPrecios++;

                }
                IList<tinvportafoliohistorico> phnuevo = new List<tinvportafoliohistorico>();
                foreach (tinvvectorprecios v in vec)
                {
                    IList<tinvportafoliohistorico> phs = TinvPortafolioHistoricoDal.FindFechaProceso(fvaloracion,v.cinversion.Value);
                    foreach (tinvportafoliohistorico ph in phs) {

                        ph.Actualizar = true;
                        ph.Esnuevo = false;
                        ph.preciohoy = v.porcentajeprecio;
                        ph.precio = v.porcentajeprecio.Value;
                        ph.preciohis = v.porcentajeprecio.Value;
                        try
                        {
                           decimal vmercado=  ph.valornominal.Value * (v.porcentajeprecio.Value / 100) + ph.accrualcostoamortizado.Value;
                            vmercado=     decimal.Round(vmercado, 6, MidpointRounding.AwayFromZero);
                            ph.valormercado = vmercado;
                        }

                        catch (Exception ex)
                        {
                            ph.valormercado = 0;
                        }
                        ph.vectorprecio = true;
                        phnuevo.Add(ph);
                        

                    }

                }
                rqmantenimiento.AdicionarTabla("tinvportafoliohistorico", phnuevo, false);
            }

        }

        /// <summary>
        /// Elimina símbolo % de objeto.
        /// </summary>
        /// <param name="iobj">Objeto a procesar.</param>
        /// <returns>string</returns>
        private string convertPercentDec(object iobj)
        {
            return iobj.ToString().Replace("%", "");
        }

    }

    public class clsValidar
    {

        /// <summary>
        /// Validar si valor string corresponde a un formato de fecha.
        /// </summary>
        /// <param name="mensaje">Mensaje en el caso de que se produzca error.</param>
        /// <param name="istrFecha">String a validar.</param>
        /// <returns>long</returns>
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
        /// Validar si valor string corresponde a un formato numérico con decimales.
        /// </summary>
        /// <param name="istrDecimal">String a validar.</param>
        /// <param name="mensaje">Mensaje en el caso de que se produzca error.</param>
        /// <param name="nombreCampo">Nombre del campo al cual corresponde el valor.</param>
        /// <param name="numerodecimales">Número máximo de decimales que debe contener el valor validado.</param>
        /// <param name="iblnValidaPositivo">Bandera que indica si el número a validar debe ser positivo.</param>
        /// <returns>decimal</returns>
        public decimal clsValidarDecimal(string istrDecimal, ref string mensaje, string nombreCampo = "", int numerodecimales = 8, bool iblnValidaPositivo = true)
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

                        if (Int64.Parse(lvalor[1].Trim().ToString()) != 0)
                        {

                            string lstrDivisor = "1";

                            for (int i = 0;i < lvalor[1].Trim().Length; i++)
                            {
                                lstrDivisor = lstrDivisor + "0";
                            }

                            ldecimalaux = 1 + decimal.Parse(lvalor[1].Trim()) / decimal.Parse(lstrDivisor);

                            ldecimalaux = ldecimalaux - 1;

                            if (ldecimalaux.ToString().Trim().Length - 2 > numerodecimales)
                            {
                                mensajeAsignarConNombreCampo(ref mensaje, "debe tener máximo " + numerodecimales.ToString().Trim() + " dígitos decimales", nombreCampo);
                            }

                        }

                    }

                    decimal ldecimalResultado = 0;

                    if (lenteroaux < 0)
                    {
                        ldecimalResultado = lenteroaux + (ldecimalaux * -1);
                    }
                    else
                    {
                        if (ldecimalaux < 0)
                        {
                            ldecimalResultado = (lenteroaux * -1) + ldecimalaux;
                        }
                        else
                        {
                            ldecimalResultado = lenteroaux + ldecimalaux;
                        }
                    }

                    if (ldecimalResultado < 0 && iblnValidaPositivo)
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

        /// <summary>
        /// Validar números con máximo dos decimales.
        /// </summary>
        /// <param name="idecimal">Número decimal a validar.</param>
        /// <param name="mensaje">Cadena de referencia que contiene el mansaje a desplegar.</param>
        /// <param name="nombreCampo">Nombre del campo que se corresponde con el número decimal a validar.</param>
        public void validarDosDecimales(decimal idecimal, ref string mensaje, string nombreCampo = "")
        {
            decimal ldecimal = idecimal * 100;

            if (Convert.ToInt64(ldecimal) - ldecimal != 0)
            {
                mensajeAsignarConNombreCampo(ref mensaje, "debe tener máximo 2 dígitos decimales", nombreCampo);
            }

        }

        /// <summary>
        /// Asignar contenido al mensaje del error.
        /// </summary>
        /// <param name="mensaje">Cadena de referencia que contiene el mansaje a desplegar.</param>
        /// <param name="contenido">Contenido del mensaje.</param>
        /// <returns></returns>
        public void mensajeAsignar(ref string mensaje, string contenido)
        {
            if (mensaje.Trim().Length != 0)
            {
                mensaje = mensaje + ".  ";
            }
            mensaje = mensaje + contenido;
        }

        /// <summary>
        /// Asignar el nombre del campo al mensaje.
        /// </summary>
        /// <param name="mensaje">Cadena de referencia que contiene el mansaje a desplegar.</param>
        /// <param name="contenido">Contenido del mensaje.</param>
        /// <param name="nombreCampo">Nombre del campo.</param>
        /// <returns></returns>
        private void mensajeAsignarConNombreCampo(ref string mensaje, string contenido, string nombreCampo = "")
        {

            string lmensaje = nombreCampo.Trim().Length == 0 ? "" : nombreCampo.Trim() + " ";
            lmensaje = lmensaje + contenido;
            mensajeAsignar(ref mensaje, lmensaje);
        }

        /// <summary>
        /// Asignar el objeto a validar, retorna "" si es nulo.
        /// </summary>
        /// <param name="iobj">Objeto a asignar.</param>
        /// <returns>string</returns>
        public string asignarObjeto(object iobj)
        {

            return iobj == null ? "" : iobj.ToString();

        }

        /// <summary>
        /// Obtener el mensaje de error del formato de fecha.
        /// </summary>
        /// <returns>string</returns>
        public string pfErrorFecha()
        {
            return "La fecha no cumple con el formato correspondiente";
        }

        /// <summary>
        /// Validar si valor string corresponde a un formato de fecha.
        /// </summary>
        /// <param name="mensaje">Mensaje en el caso de que se produzca error.</param>
        /// <param name="iobjFecha">Objeto a validar.</param>
        /// <returns>long</returns>
        public long? clsValidarFechaFormato(ref string mensaje, object iobjFecha)
        {

            try
            {

                DateTime fec = DateTime.Parse(iobjFecha.ToString());
                return (fec.Year * 10000) + (fec.Month * 100) + fec.Day;
            }
            catch
            {
                mensajeAsignar(ref mensaje, pfErrorFecha());
                return null;
            }

        }

        /// <summary>
        /// Validar la longidud máxima del objeto.
        /// </summary>
        /// <param name="contenido">Cadena a validar.</param>
        /// <param name="lenghtMaxima">Longitud máxima.</param>
        /// <param name="mensaje">Mensaje en el caso de que se produzca error.</param>
        /// <param name="nombreCampo">Nombre del campo al cual corresponde el objeto a validar.</param>
        /// <returns>string</returns>
        public string clsValidarStrLenght(string contenido, int lenghtMaxima, ref string mensaje, string nombreCampo = "")
        {

            string lContenido = contenido.Trim();
            int llenght = lContenido.Length;

            if (llenght > lenghtMaxima)
            {
                mensajeAsignar(ref mensaje, "La longitud máxima de" + nombreCampo + " debe ser [" + lenghtMaxima + "] y es de [" + llenght + "]");
            }

            return lContenido;

        }

    }
    public class tvectorprecios : tinvvectorprecios
    {
        public int numerolinea;
        public string mensaje;
    }

}
