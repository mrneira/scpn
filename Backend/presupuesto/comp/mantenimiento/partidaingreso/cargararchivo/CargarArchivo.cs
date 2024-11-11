using core.componente;
using dal.generales;
using modelo;
using System;
using System.IO;
using util;
using util.dto.mantenimiento;
using System.Collections.Generic;
using dal.contabilidad.conciliacionbancaria;
using util.servicios.ef;
using Newtonsoft.Json;
using Microsoft.Office.Interop.Excel;
using dal.presupuesto;

namespace presupuesto.comp.mantenimiento.partidaingreso.cargararchivo
{
    public class CargarArchivo : ComponenteMantenimiento
    {

        /// <summary>    
        /// Ejecuta la carga de archivos, levanta un hilo para que el proceso sea asincronico.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "upload")
            {


                clsValidar lclsValidar = new clsValidar();

                string path = "";
                string narchivo = "";
                string archivo = "";
                tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
                path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
                narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                archivo = (string)rqmantenimiento.Mdatos["archivo"];
                archivo = archivo.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "");
                path = path + "/" + narchivo;

                try {
                    File.WriteAllBytes(path, Convert.FromBase64String(archivo));

                } catch {
                    throw new AtlasException("CONTA-007", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA 'C:\CESANTIA_APP_HOME\SUBIRARCHIVOS' EN EL DISCO 'C:\', PARA POSIBILITAR LA CARGA DEL PRESUPUESTO DE INGRESOS.");
                }

                StreamReader file = null;

                file = new StreamReader(path);

                List<tpptpartidaingreso> lpartidaingreso = new List<tpptpartidaingreso>();
                tpptpartidaingreso pg;

                bool controlError = true;

                Application ExcelObj = new Application();

                Workbook theWorkbook = ExcelObj.Workbooks.Open(path, 0, true, 5, "", "", true, XlPlatform.xlWindows, "\t", false, false, 0, true);

                Sheets sheets = theWorkbook.Worksheets;
                Worksheet worksheet = (Worksheet)sheets.get_Item(1);

                long lindice = 2;

                string lstrFilas = "";
                rqmantenimiento.Response["permitegrabar"] = true;

                while (true) {

                    lstrFilas = lindice.ToString().Trim();
                    string cpartidaingreso = "";
                    string padre = "";
                    int nivel;
                    int movimiento;
                    string nombre = "";
                    int aniofiscal;
                    decimal valormensual= 0;
                    int numeromeses = 0;
                    decimal montototal = 0;

                    string lstrMensaje = "";
                    string lestado = "Ok";
                    cpartidaingreso = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(worksheet.Range["A" + lstrFilas].Value2), 10, ref lstrMensaje, "partida");


                    if (cpartidaingreso.Equals("")) {
                        break;
                    }
                    if (TpptPartidaIngresoDal.FindClasificador(cpartidaingreso) == null) {
                        lstrMensaje = "CLASIFICADOR NO EXISTE";
                    }

                    padre = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(worksheet.Range["B" + lstrFilas].Value2), 10, ref lstrMensaje, "padre");
                    nivel = lclsValidar.clsValidarInt(lclsValidar.asignarObjeto(worksheet.Range["C" + lstrFilas].Value2), ref lstrMensaje, "nivel");
                    movimiento = lclsValidar.clsValidarInt(lclsValidar.asignarObjeto(worksheet.Range["D" + lstrFilas].Value2), ref lstrMensaje, "movimiento");
                    nombre = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(worksheet.Range["E" + lstrFilas].Value2), 250, ref lstrMensaje, "nombre");
                    aniofiscal = lclsValidar.clsValidarInt(lclsValidar.asignarObjeto(worksheet.Range["F" + lstrFilas].Value2), ref lstrMensaje, "anio_fiscal");
                    valormensual = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(worksheet.Range["G" + lstrFilas].Value2), ref lstrMensaje, "valor_mensual");
                    numeromeses = lclsValidar.clsValidarInt(lclsValidar.asignarObjeto(worksheet.Range["H" + lstrFilas].Value2), ref lstrMensaje, "numero_meses");
                    montototal = valormensual * numeromeses;

                    if (TpptPartidaIngresoDal.FindListaAniofiscal(aniofiscal).Count > 0) {
                        lstrMensaje = "YA EXISTEN PARTIDAS CARGADAS PARA EL AÑO FISCAL INGRESADO";
                    }

                    if (lstrMensaje.Trim().Length == 0) {
                        lstrMensaje = "Ok";
                        lestado = "OK";
                    } else {
                        if (controlError) {
                            controlError = false;
                        }
                        lestado = "ERROR";
                        rqmantenimiento.Response["permitegrabar"] = false;
                    }

                    pg = new tpptpartidaingreso();
                    pg.cpartidaingreso = cpartidaingreso;
                    pg.padre = padre == "" ? null : padre;
                    pg.nivel = nivel;
                    pg.movimiento = (movimiento == 0) ? false : true;
                    pg.nombre = nombre;
                    pg.aniofiscal = aniofiscal;
                    pg.valormensual = valormensual;
                    pg.numeromeses = numeromeses;
                    pg.montototal = montototal;
                    pg.Mdatos["numerolinea"] = lindice;
                    pg.Mdatos["mensaje"] = lstrMensaje;
                    pg.Mdatos["estado"] = lestado;
                    lpartidaingreso.Add(pg);
                    lindice++;
                }

                if (file != null) {
                    file.Close();
                }

                rqmantenimiento.Response["lregistros"] = lpartidaingreso;

            }
            else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {

                List<tpptpartidaingreso> lpartida = JsonConvert.DeserializeObject<List<tpptpartidaingreso>>(rqmantenimiento.Mdatos["lregistros"].ToString());
                foreach (tpptpartidaingreso item in lpartida) {
                    item.Esnuevo = true;
                    item.Actualizar = false;
                    item.ccompania = rqmantenimiento.Ccompania;
                    item.cusuarioing = rqmantenimiento.Cusuario;
                    item.fingreso = rqmantenimiento.Freal;
                    item.valordevengado = 0;
                    item.porcenejecucion = 0;
                    item.porcenparticipacion = 0;
                    Sessionef.Grabar(item);
                }

            }

        }
    }

    public class tpptpresupuesto : tconconciliacionbancariaeb
    {
        public int numerolinea;
        public string mensaje;
        public string estado;
    }

    public class clsValidar
    {

        public long clsValidarFecha(ref string mensaje,string istrFecha)
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
            mensajeAsignar(ref mensaje,lmensaje);
        }

        public string asignarObjeto(object iobj)
        {

            return iobj == null ? "" : iobj.ToString();

        }


        public string clsValidarStrLenght(string contenido, int lenghtMaxima, ref string mensaje, string nombreCampo="")
        {

            string lContenido = contenido.Trim();
            int llenght = lContenido.Length;

            if (llenght > lenghtMaxima) {
                mensajeAsignar(ref mensaje, "La longitud de máxima de" + nombreCampo + " debe ser [" + lenghtMaxima + "] y es de [" + llenght + "]");
            }

            return lContenido;

        }

        /// <summary>
        /// Validar números decimales
        /// </summary>
        /// <param name="mensaje"></param>
        /// <param name="contenido"></param>

        public int clsValidarInt(string istrInteger, ref string mensaje, string nombreCampo = "")
        {
            int result;
            if (!int.TryParse(istrInteger, out result))
            {
                mensajeAsignar(ref mensaje, "CAMPO :" + nombreCampo + " TIENE FORMATO INCORRECTO");
            }

            return result;

        }

    }


}


