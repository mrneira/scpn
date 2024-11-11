
using core.componente;
using dal.generales;
using dal.inversiones.cargaacciones;
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
using modelo.helper;
using dal.inversiones.precioscierre;

namespace inversiones.comp.mantenimiento.cargaacciones.precioscierre
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para imnportar los precios de cierre.
    /// </summary>
    public class CargarPreciosCierre : ComponenteMantenimiento
    {

        /// <summary>
        /// Importar los precios de cierre de las acciones.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
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

                List<tprecioscierre> lprecioscierre = new List<tprecioscierre>();

                bool controlError = true;

                int controlErrorGeneral = 0;


                var excelFile = new ExcelQueryFactory(path);
                var cargatabla = from a in excelFile.Worksheet("MAX-MIN BVQ") select a;


                string lstrMensaje = "";

                clsValidar lclsValidar = new clsValidar();

                string lstrFecha = "";

                int lintIndice = 0;

                foreach (var registro in cargatabla)
                {

                    string fech = registro[2].ToString();

                    if (lintIndice ==4)
                    {
                        lstrFecha = lclsValidar.asignarObjeto(registro[2]);

                        break;

                    }

                    lintIndice++;

                }

                long lfvaloracion = lclsValidar.clsDescomponerFecha(ref lstrMensaje, lstrFecha);

                if (lfvaloracion == 0)
                {
                    controlErrorGeneral = 1;
                }
                //else
                //{
                //    lstrMensaje = TinvPreciosCierreDal.GetExisteFecha(lfvaloracion);
                //    if (lstrMensaje != "")
                //    {
                //        controlError = false;
                //        controlErrorGeneral = 2;
                //    }

                //}

                if (controlErrorGeneral == 0)
                {

                    long lindice = 16;

                    long llinea = 0;

                    byte lcontrol = 0;

                    foreach (var registro in cargatabla)
                    {

                        if (lcontrol > 12)
                        {
                            break;
                        }
                        else
                        {

                            if (llinea >= 14 && registro[2].ToString().Trim().Length == 3)
                            {




                                lcontrol = 0;

                                IList<tgencatalogodetalle> tgenCatalogoDetalle = TinvPreciosCierreDal.Find(registro[2].ToString().Trim());

                                foreach (var item in tgenCatalogoDetalle)
                                {



                                    lstrMensaje = "";

                                    DateTime ldteFechaCierre = DateTime.Parse(registro[8]);

                                    int lfcierre = (ldteFechaCierre.Year * 10000) + (ldteFechaCierre.Month * 100) + ldteFechaCierre.Day;

                                    List<tinvprecioscierre> lPreciosCiere = TinvPreciosCierreDal.GetXEmisorFechaValoracion(1213, item.cdetalle, (int)lfvaloracion);
                                    // List<tinvprecioscierre> lPreciosCiereant = TinvPreciosCierreDal.GetXEmisorFecha(1213, item.cdetalle, (int)lfvaloracion);
                                    string lemisorcdetalle = item.cdetalle;
                                    tinvprecioscierre pc = TinvPrecioCierreDal.UltimoprecioEmisor(lemisorcdetalle);
                                    decimal valornominal, precio;
                                    decimal.TryParse(registro[3], out valornominal);
                                    decimal.TryParse(registro[4], out precio);
                                    if (valornominal == 0) {
                                        try {
                                            valornominal = convertDateDecimal(registro[3]);
                                        } catch (Exception ex){
                                        }
                                    }
                                    if (precio == 0)
                                    {
                                        try
                                        {
                                            precio = convertDateDecimal(registro[4]);
                                        }
                                        catch (Exception ex)
                                        {
                                        }
                                    }

                                    decimal lvalornominal = valornominal;
                                    decimal lpreciocierre = precio;

                                    if (lPreciosCiere.Count == 0)
                                    {


                                        if (lstrMensaje.Trim().Length == 0)
                                        {
                                            lstrMensaje = "";
                                        }
                                        else
                                        {
                                            if (controlError)
                                            {
                                                controlError = false;
                                            }
                                        }
                                        tprecioscierre pr = new tprecioscierre();

                                        lprecioscierre.Add(
                                            new tprecioscierre()
                                            {
                                                numerolinea = (int)lindice
                                                ,
                                                fvaloracion = (int)lfvaloracion
                                                ,
                                                mensaje = lstrMensaje
                                                ,
                                                nombreemisor = item.nombre
                                                ,
                                                preciocierre = lpreciocierre

                                                ,
                                                ultpreciocierre = (pc == null) ? 0 : pc.preciocierre,
                                                
                                                valornominal = lvalornominal
                                                ,
                                                emisorcdetalle = lemisorcdetalle
                                                ,
                                                fultimocierre = (pc == null) ? (int)lfcierre : pc.fultimocierre,
                                                
                                            });


                                    }
                                    else
                                    {
                                        lstrMensaje = "YA SE CARGARON LOS PRECIOS PARA ESTE EMISOR EN ESTA FECHA";
                                        lprecioscierre.Add(
                                            new tprecioscierre()
                                            {
                                                numerolinea = (int)lindice
                                                ,
                                                fvaloracion = (int)lfvaloracion
                                                ,
                                                mensaje = lstrMensaje
                                                ,
                                                nombreemisor = item.nombre
                                                ,
                                                preciocierre = lpreciocierre,
                                                ultpreciocierre = (pc == null) ? 0 : pc.preciocierre
                                                ,
                                                
                                                valornominal = lvalornominal
                                                ,
                                                emisorcdetalle = lemisorcdetalle
                                                ,
                                                fultimocierre = (pc == null) ? (int)lfcierre : pc.fultimocierre,
                                            });
                                    }

                                }

                            }
                            else
                            {
                                llinea++;
                                if (llinea >= 14)
                                {
                                    lcontrol++;
                                }
                            }

                        }
                        lindice++;

                    }


                }


                rqmantenimiento.Response["lregistros"] = lprecioscierre;

                if (!controlError)
                {
                    rqmantenimiento.Response.SetCod("000");
                    rqmantenimiento.Response.SetMsgusu(controlErrorGeneral == 2 ? lstrMensaje : "EXISTEN ERRORES EN LA CARGA. REVISE LOS MENSAJES EN LA COLUMNA MENSAJE");
                }

                if (controlErrorGeneral == 1)
                {
                    throw new AtlasException("INV-0004", "LA FECHA DE VALORACIÓN DEBE CONSTAR EN LA CELDA [C6][C7] DE LA HOJA 1 DEL LIBRO {0}, CON EL FORMATO DE FECHA", narchivo);
                }

            }
            else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {

                long cInvPreciosCierre = TinvPreciosCierreDal.GetcInvPreciosCierreMax();
                var lregistrospreciocierre = JsonConvert.DeserializeObject<IList<tprecioscierre>>(rqmantenimiento.Mdatos["lregistros"].ToString());
                List<tinvprecioscierre> regvalidos = new List<tinvprecioscierre>();

                dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistros"].ToString());
                int reg = 0;
                foreach (var item in lregistrospreciocierre)
                {


                    if (item.mensaje.Length == 0)
                    {
                        tinvprecioscierre tInvPreciosCierre = new tinvprecioscierre();
                        tInvPreciosCierre.cinvprecioscierre = cInvPreciosCierre;
                        tInvPreciosCierre.optlock = 0;
                        tInvPreciosCierre.fvaloracion = item.fvaloracion;
                        tInvPreciosCierre.fultimocierre = item.fultimocierre;
                        tInvPreciosCierre.emisorccatalogo = 1213;
                        tInvPreciosCierre.emisorcdetalle = item.emisorcdetalle;
                        tInvPreciosCierre.valornominal = item.valornominal;
                        tInvPreciosCierre.preciocierre = item.preciocierre;
                        tInvPreciosCierre.fingreso = DateTime.Now;
                        tInvPreciosCierre.cusuarioing = rqmantenimiento.Cusuario;
                        
                        cInvPreciosCierre++;
                        regvalidos.Add(tInvPreciosCierre);
                        reg++;




                    }


                }
                if (reg == 0)
                {
                    throw new AtlasException("INV-005", "NO EXISTEN PRECIOS DE CIERRE PARA PROCESAR EN ESTAS FECHAS O YA SE PROCESARON");

                }
                else {
                    //CARGANDO INFORMACIÓN PARA DATA INFORMACIÓN
                    var json = JsonConvert.SerializeObject(regvalidos);
                    rqmantenimiento.Mdatos["ldatos"] = json;
                   
                }


            }
        }

        /// <summary>
        /// Convertir un string a decimal.
        /// </summary>
        /// <param name="istrDate">String a convertir.</param>
        /// <returns>decimal</returns>
        private static decimal convertDateDecimal(string istrDate)
        {
            DateTime ldte;
            try {
                ldte = DateTime.Parse(istrDate);

            }
            catch (Exception ex) {
                return 0;
            }
            
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

    public class clsValidar
    {


        /// <summary>
        /// Descomponer una variable tipo fecha para su posterior validación.
        /// </summary>
        /// <param name="mensaje">Mensaje en el caso de que se produzca error.</param>
        /// <param name="istrDate">String a descomponer.</param>
        /// <returns>long</returns>
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
                DateTime f = DateTime.Now;
                if (mes == 0) {
                     f= DateTime.Parse(istrFecha);
                    mes = f.Month;
                }

                try {
                    f = DateTime.Parse(istrFecha);
                }
                catch (Exception ex) {
                    
                }
                anio = int.Parse(lstrFECHA.Substring(lstrFECHA.Length - 4, 4));
                if (dia != f.Day) {
                    dia = f.Day;
                }

                DateTime fec = new DateTime(anio, mes, dia);

                return (anio * 10000) + (mes * 100) + dia;


            }
            catch
            {
                mensajeAsignar(ref mensaje, lcmensaje);
                return 0;
            }

        }


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
        /// <returns>decimal</returns>
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
        public string asignarObjeto(object iobj)
        {

            return iobj == null ? "" : iobj.ToString();

        }

    }

    public class tprecioscierre : tinvprecioscierre
    {
        public int numerolinea;
        public string mensaje;
        public string nombreemisor;
        public decimal ultpreciocierre;
    }

}
