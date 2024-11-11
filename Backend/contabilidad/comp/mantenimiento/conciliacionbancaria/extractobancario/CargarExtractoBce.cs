using core.componente;
using modelo;
using System;
using System.IO;
using System.Collections.Generic;
using util;
using System.Linq;
using util.dto.mantenimiento;
using dal.generales;
using dal.contabilidad.conciliacionbancaria;
using Newtonsoft.Json;
using LinqToExcel;
using dal.talentohumano;
using contabilidad.datos;
using System.Text;
using System.Threading;
using System.Globalization;

namespace contabilidad.comp.mantenimiento.conciliacionbancaria.extractobancario
{

    /// <summary>
    /// Clase que encapsula los procedimientos para importar el extracto bancario Bce.
    /// </summary>
    public class CargarExtractoBce : ComponenteMantenimiento
    {



        //RRO 20221216

        /// <summary>
        /// Fecha:  25072022
        /// Descripcion: Cambia el formato decimal. Ej. 1,256,23 => 1256.23
        /// RRP
        /// </summary>
        /// <param name="valorXls"></param>
        /// <returns></returns>
        private decimal cambiarFormatoDecimal(Cell valorXls)
        {
            try
            {
                decimal repuesta = 0;
                string valorInicio = string.IsNullOrEmpty(valorXls.ToString()) ? "0" : valorXls.ToString();

                if (valorInicio.Contains('.'))
                {
                    string[] strValor = valorInicio.Split('.');
                    if (strValor[0].Contains(','))
                        repuesta = Convert.ToDecimal(strValor[0].Replace(",", "") + "," + strValor[1]);
                    else
                        repuesta = Convert.ToDecimal(strValor[0]);
                }
                else
                {
                    repuesta = Convert.ToDecimal(valorInicio);
                }
                return repuesta;
            }
            catch
            {
                return 0;
            }
        }



        // RRP 25072022 - ANTERIOR -----------------------------------------------------------------------
        /// <summary>    
        /// Fecha: 25072022
        /// Descripcion: Ejecuta la carga del extracto bancario con el nuevo formato Excel
        /// RRP
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            const string cstrMensajeError = "EL EXTRACTO BANCARIO PARA LA CUENTA CONTABLE {0} CON FECHA {1} YA HA SIDO GENERADO POR {2} ";
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "upload")
            {
                clsValidarBce lclsValidarBce = new clsValidarBce();
                string path = "";
                string narchivo = "";
                string archivo = "";
                tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
                path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
                narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                archivo = (string)rqmantenimiento.Mdatos["archivo"];

                archivo = archivo.Replace("data:text/plain;base64,", "");
                path = path + "/" + narchivo;
                try
                {
                    File.WriteAllBytes(path, Convert.FromBase64String(archivo));
                }
                catch
                {
                    throw new AtlasException("CONTA-007", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA 'C:\CESANTIA_APP_HOME\SUBIRARCHIVOS' EN EL DISCO 'C:\', PARA POSIBILITAR LA CARGA DEL EXTRACTO BANCARIO BCE.");
                }

                StreamReader objReader = new StreamReader(path, Encoding.Default);
                string linea = string.Empty;
                int contador = 1;
                List<DetalleCargaEB> lextracto = new List<DetalleCargaEB>();
                bool controlError = true;


                tconbanco tconbanco = TconBancoDal.Find((string)rqmantenimiento.Mdatos["ccuenta"].ToString());

                clsValidar lclsValidar = new clsValidar();

                // RRP 14122022 ----------------------------------------------------------

                decimal totalCredito = 0;
                decimal totalDebito = 0;

                // RRP 14122022 ----------------------------------------------------------

                while (linea != null)
                {
                    linea = objReader.ReadLine();

                    if (linea != null && !linea.Contains("Total Movimientos:"))
                    {
                        if (contador > 9) // && contador < cargaextractobancario.Count())
                        {
                            string[] info = linea.Split('\t');

                            string numeroComprobante = info[3].ToString();
                            string numeroDocumento = info[4].ToString();
                            decimal valorDebito = 0;
                            decimal valorCredito = 0;
                            decimal saldo = 0;
                            string concepto;
                            string mensaje = string.Empty;
                            long fechaInsertar = 0;
                            string estado = string.Empty;
                            string fecha;

                            fecha = lclsValidarBce.asignarObjetoBce(info[0]);
                            if (fecha.Trim() == "")
                            {
                                break;
                            }

                            try
                            {
                                fechaInsertar = (long)lclsValidarBce.clsValidarFechaFormatoBce(ref mensaje, info[0]);
                            }
                            catch
                            {
                                lclsValidarBce.mensajeAsignarBce(ref mensaje, lclsValidarBce.pfErrorFechaBce());
                            }



                            //--------------------------------------------------------------------------------------------------------------------------------
                            if (string.IsNullOrEmpty(info[6].ToString()))



                                valorCredito = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(info[7]), ref mensaje, "Crédito");
                            else
                                valorDebito = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(info[6]), ref mensaje, "Débito");

                            //     saldo = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(info[8]), ref mensaje, "Saldo");
                            //--------------------------------------------------------------------------------------------------------------------------------

                            concepto = info[5] + " " + info[9];

                            if (valorCredito == 0 && valorDebito == 0)
                            {
                                lclsValidarBce.mensajeAsignarBce(ref mensaje, "Al menos el valor del crédito o del débito debe ser mayor a cero");
                            }
                            else
                            {
                                if (valorCredito != 0 && valorDebito != 0)
                                {
                                    lclsValidarBce.mensajeAsignarBce(ref mensaje, "El valor del crédito y del débito no pueden ser simultáneamente diferentes a cero");
                                }
                            }

                            if (mensaje.Trim().Length == 0)
                            {
                                estado = "Ok";
                                if (fechaInsertar > 0)
                                {
                                    if (tconbanco == null)
                                    {
                                        throw new AtlasException("CONTA-004", cstrMensajeError, rqmantenimiento.Mdatos["ccuenta"].ToString(), fecha);
                                    }

                                    tconextractobancario eb = tconconciliacionbancariaextDal.ExisteFechaNumeroDocumento(tconbanco.ccuentabanco, (int)fechaInsertar, numeroDocumento, valorCredito, valorDebito, numeroComprobante);
                                    if (eb != null)
                                    {
                                        estado = estado == "1" ? "CONCILIADO" : "CARGADO";
                                    }
                                }
                            }
                            else
                            {
                                if (controlError)
                                {
                                    controlError = false;
                                }
                                estado = mensaje;
                            }

                            DetalleCargaEB detalle = new DetalleCargaEB();
                            detalle.fecha = (int)fechaInsertar;
                            detalle.numeroComprobante = numeroComprobante;
                            detalle.numeroDocumento = numeroDocumento;
                            detalle.valorDebito = valorDebito;
                            detalle.valorCredito = valorCredito;
                            detalle.saldo = saldo;
                            detalle.concepto = concepto;

                            if (detalle.concepto.Length > 100)
                                detalle.concepto = concepto.Substring(0, 100);

                            detalle.numeroLinea = contador;
                            detalle.estado = estado;
                            detalle.optlock = 0;
                            lextracto.Add(detalle);

                            // RRP 14122022 ----------------------------------------------------------

                            totalCredito += valorCredito;
                            totalDebito += valorDebito;

                            // RRP 14122022 ----------------------------------------------------------
                        }
                        contador += 1;
                    }
                }
                objReader.Close();

                rqmantenimiento.Response["lregistros"] = lextracto;

                // RRP 14122022 ----------------------------------------------------------
                rqmantenimiento.Response["totalCredito"] = totalCredito.ToString();
                rqmantenimiento.Response["totalDebito"] = totalDebito.ToString();
                // RRP 14122022 ----------------------------------------------------------

                if (!controlError)
                {
                    rqmantenimiento.Response.SetCod("000");
                    rqmantenimiento.Response.SetMsgusu("EXISTEN ERRORES EN LA CARGA. REVISE LOS MENSAJES EN LA COLUMNA MENSAJE");
                }
            }
            else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {
                string cusuariocreacion = ""; //para verificar si cuenta ya ha sido generada
                int fecha = -100; //para verificar su cuenta ya ha sido generada en esa fecha
                dynamic array = JsonConvert.DeserializeObject(rqmantenimiento.Mdatos["lregistros"].ToString());
                //List<tconconciliacionbancariaeb> lextracto = new List<tconconciliacionbancariaeb>();
                List<tconextractobancario> lextracto = new List<tconextractobancario>();

                foreach (var item in array)
                {
                    if (item.estado == "Ok")
                    {
                        tconbanco tconbanco = TconBancoDal.Find((string)rqmantenimiento.Mdatos["ccuenta"].ToString());
                        if (tconbanco == null)
                        {
                            throw new AtlasException("CONTA-004", cstrMensajeError, rqmantenimiento.Mdatos["ccuenta"].ToString(), fecha, cusuariocreacion);
                        }

                        tconextractobancario eb = tconconciliacionbancariaextDal.ExisteFechaNumeroDocumento(tconbanco.ccuentabanco,
                            int.Parse(item.fecha.Value.ToString()), item.numeroDocumento.Value, (decimal)item.valorCredito.Value, (decimal)item.valorDebito.Value, item.numerocomprobante);

                        if (eb != null)
                        {
                            throw new AtlasException("CONTA-004", cstrMensajeError, rqmantenimiento.Mdatos["ccuenta"].ToString(), fecha, cusuariocreacion);
                        }
                        try
                        {

                            tconextractobancario tconextractobancario = new tconextractobancario();
                            tconextractobancario.Esnuevo = true;
                            tconextractobancario.Actualizar = false;
                            tconextractobancario.ccuentabanco = tconbanco.ccuentabanco;
                            tconextractobancario.fmovimiento = item.fecha;
                            tconextractobancario.comprobante = item.numeroComprobante;
                            tconextractobancario.documento = item.numeroDocumento;
                            tconextractobancario.concepto = item.concepto;
                            tconextractobancario.montodebito = item.valorDebito;
                            tconextractobancario.montocredito = item.valorCredito;
                            tconextractobancario.conciliado = false;
                            tconextractobancario.cusuarioing = rqmantenimiento.Cusuario;
                            tconextractobancario.fingreso = rqmantenimiento.Freal;
                            tconextractobancario.ajusteextracto = false;
                            lextracto.Add(tconextractobancario);

                        }
                        catch (Exception ex)
                        {
                            throw new AtlasException("CONTA-004", ex.Message);
                        }
                    }
                }

                rqmantenimiento.AdicionarTabla("tconextractobancario", lextracto, false);
            }
        }





        /// <summary>    
        /// Obtener datos del funcionario que ejecutó la conciliación bancaria.
        /// </summary>
        /// <param name="registro">Línea con los datos de la transacción.</param>
        /// <returns>tnommatrizvacacion</returns>
        public tnommatrizvacacion Asignacion(Row registro)
        {
            tnommatrizvacacion cb = new tnommatrizvacacion();

            try
            {
                long cfuncionario = long.Parse(registro[0].ToString());
                cb.cfuncionario = cfuncionario;
                cb.Mdatos["nfuncionario"] = TthFuncionarioDal.Find(cfuncionario).primernombre + TthFuncionarioDal.Find(cfuncionario).primerapellido;
                cb.finicio = Convert.ToDateTime(registro[2].ToString());
                cb.ffin = Convert.ToDateTime(registro[3].ToString());
                cb.Esnuevo = true;
                cb.Actualizar = false;
            }
            catch (Exception ex)
            {

            }
            return cb;
        }
    }


    public class clsValidarBce
    {

        /// <summary>    
        /// Obtener mensaje de error de formato incorrecto de la fecha.
        /// </summary>
        /// <returns></returns>
        public string pfErrorFechaBce()
        {
            return "La fecha no cumple con el formato correspondiente";
        }


        /// <summary>    
        /// Validar formato de fecha.
        /// </summary>
        /// <param name="mensaje">Variable de referencia del mensaje de error.</param>
        /// <param name="iobjFecha">Variable que contiene la fecha a validar.</param>
        /// <returns>long?</returns>
        public long? clsValidarFechaFormatoBce(ref string mensaje, object iobjFecha)
        {
            try
            {
                DateTime fec = DateTime.Parse(iobjFecha.ToString());
                return (fec.Year * 10000) + (fec.Month * 100) + fec.Day;
            }
            catch
            {
                mensajeAsignarBce(ref mensaje, pfErrorFechaBce());
                return null;
            }
        }

        /// <summary>    
        /// Validar fecha.
        /// </summary>
        /// <param name="mensaje">Variable de referencia del mensaje de error.</param>
        /// <param name="istrFecha">Cadena que contiene la fecha a validar.</param>
        /// <returns>long</returns>
        public long clsValidarFechaBce(ref string mensaje, string istrFecha)
        {
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
                mensajeAsignarBce(ref mensaje, pfErrorFechaBce());
                return 0;
            }

            if (anio == 0 || mes == 0 || dia == 0)
            {
                mensajeAsignarBce(ref mensaje, "Fecha obligatoria");
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
        /// <param name="istrDecimal">Cadena que contiene el número decimal a validar.</param>
        /// <param name="mensaje">Cadena de referencia que contiene el mansaje a desplegar.</param>
        /// <param name="nombreCampo">Nombre del campo que se corresponde con el número decimal a validar.</param>
        /// <param name="numerodecimales">Número máximo de decimales que debe contener el número decimal.</param>
        /// <returns>decimal</returns>
        public decimal clsValidarDecimalBce(string istrDecimal, ref string mensaje, string nombreCampo = "", int numerodecimales = 2)
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
                                mensajeAsignarBceConNombreCampo(ref mensaje, "debe tener máximo " + numerodecimales.ToString().Trim() + " dígitos decimales", nombreCampo);
                            }

                        }

                    }

                    decimal ldecimalResultado = lenteroaux + ldecimalaux;

                    if (ldecimalResultado < 0)
                    {
                        mensajeAsignarBceConNombreCampo(ref mensaje, "debe ser un valor mayor que cero", nombreCampo);
                    }

                    return ldecimalResultado;

                }
                catch
                {
                    mensajeAsignarBceConNombreCampo(ref mensaje, "debe tener formato numérico de máximo " + numerodecimales.ToString().Trim() + " dígitos decimales", nombreCampo);

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
        /// <returns></returns>
        public void validarDosDecimalesBce(decimal idecimal, ref string mensaje, string nombreCampo = "")
        {
            decimal ldecimal = idecimal * 100;

            if (Convert.ToInt64(ldecimal) - ldecimal != 0)
            {
                mensajeAsignarBceConNombreCampo(ref mensaje, "debe tener máximo 2 dígitos decimales", nombreCampo);
            }

        }

        /// <summary>
        /// Asignar contenido al mensaje del error.
        /// </summary>
        /// <param name="mensaje">Cadena de referencia que contiene el mansaje a desplegar.</param>
        /// <param name="contenido">Contenido del mensaje.</param>
        /// <returns></returns>
        public void mensajeAsignarBce(ref string mensaje, string contenido)
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
        private void mensajeAsignarBceConNombreCampo(ref string mensaje, string contenido, string nombreCampo = "")
        {

            string lmensaje = nombreCampo.Trim().Length == 0 ? "" : nombreCampo.Trim() + " ";
            lmensaje = lmensaje + contenido;
            mensajeAsignarBce(ref mensaje, lmensaje);
        }

        /// <summary>
        /// Asignar el objeto a validar, retorna "" si es nulo.
        /// </summary>
        /// <param name="iobj">Objeto a asignar.</param>
        /// <returns>string</returns>
        public string asignarObjetoBce(object iobj)
        {

            return iobj == null ? "" : iobj.ToString();


        }


        /// <summary>
        /// Validar la longitud del objeto.
        /// </summary>
        /// <param name="contenido">Contenido de la cadena a validar.</param>
        /// <param name="lenghtMaxima">Longitud máxima del campo a validar.</param>
        /// <param name="mensaje">Mensaje a mostrar.</param>
        /// <param name="nombreCampo">Nombre del campo a validar.</param>
        /// <returns>string</returns>
        public string clsValidarStrLenghtBce(string contenido, int lenghtMaxima, ref string mensaje, string nombreCampo = "")
        {

            string lContenido = contenido.Trim();
            int llenght = lContenido.Length;

            if (llenght > lenghtMaxima)
            {
                mensajeAsignarBce(ref mensaje, "La longitud de máxima de" + nombreCampo + " debe ser [" + lenghtMaxima + "] y es de [" + llenght + "]");
            }

            return lContenido;

        }


    }
}