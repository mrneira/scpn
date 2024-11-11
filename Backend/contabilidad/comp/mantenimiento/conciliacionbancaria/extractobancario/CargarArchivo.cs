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

namespace contabilidad.comp.mantenimiento.conciliacionbancaria.extractobancario
{

    /// <summary>
    /// Clase que encapsula los procedimientos para importar el extracto bancario.
    /// </summary>
    public class CargarArchivo : ComponenteMantenimiento
    {
        /// <summary>    
        /// Ejecuta la carga del extracto bancario.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            const string cstrMensajeError = "EL EXTRACTO BANCARIO PARA LA CUENTA CONTABLE {0} CON FECHA {1} YA HA SIDO GENERADO POR {2} ";

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
                try
                {
                    File.WriteAllBytes(path, Convert.FromBase64String(archivo));

                }
                catch
                {
                    throw new AtlasException("CONTA-007", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA 'C:\CESANTIA_APP_HOME\SUBIRARCHIVOS' EN EL DISCO 'C:\', PARA POSIBILITAR LA CARGA DEL EXTRACTO BANCARIO.");
                }

                var excelFile = new ExcelQueryFactory(path);
                var cargaextractobancario = from a in excelFile.Worksheet(0) select a;
                List<DetalleCargaEB> lextracto = new List<DetalleCargaEB>();
                List<DetalleCargaEB> lextractoResul = new List<DetalleCargaEB>();
                bool controlError = true;
                string estado = string.Empty;
                int numeroLinea = 1;
                foreach (var registro in cargaextractobancario)
                {
                    string mensaje = string.Empty;
                    long fechaInsertar = 0;
                    //lstrFilas = lindice.ToString().Trim();
                    string fecha;
                    fecha = lclsValidar.asignarObjeto(registro[0]);
                    if (fecha.Trim() == "")
                    {
                        break;
                    }

                    string numeroComprobante;
                    string numeroDocumento;
                    decimal valorDebito = 0;
                    decimal valorCredito = 0;
                    decimal saldo = 0;
                    string concepto;

                    try
                    {
                        fechaInsertar = (long)lclsValidar.clsValidarFechaFormato(ref mensaje, registro[0]);
                    }
                    catch
                    {
                        lclsValidar.mensajeAsignar(ref mensaje, lclsValidar.pfErrorFecha());
                    }

                    numeroComprobante = registro[1];
                    numeroDocumento = registro[2];
                    valorDebito = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(registro[3]), ref mensaje, "Débito");
                    valorCredito = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(registro[4]), ref mensaje, "Crédito");
                    saldo = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(registro[5]), ref mensaje, "Saldo");
                    concepto = registro[6];
                    //lcedula = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[1]), 20, ref lstrMensaje, " la Credencial");
                    //lcredencial = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[2]), 20, ref lstrMensaje, " la Credencial");
                    //lnumerodocumento = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[3]), 30, ref lstrMensaje, " el Número de Documento");
                    //linformacion = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[7]), 80, ref lstrMensaje, " la Información");
                    //lapellidosnombres = lclsValidar.clsValidarStrLenght(lclsValidar.asignarObjeto(registro[8]), 100, ref lstrMensaje, " los Apellidos y Nombres");

                    if (valorCredito == 0 && valorDebito == 0)
                    {
                        lclsValidar.mensajeAsignar(ref mensaje, "Al menos el valor del crédito o del débito debe ser mayor a cero");
                    }
                    else
                    {
                        if (valorCredito != 0 && valorDebito != 0)
                        {
                            lclsValidar.mensajeAsignar(ref mensaje, "El valor del crédito y del débito no pueden ser simultáneamente diferentes a cero");
                        }
                    }

                    if (mensaje.Trim().Length == 0)
                    {
                        estado = "Ok";
                        if (fechaInsertar > 0)
                        {
                            tconbanco tconbanco = TconBancoDal.Find((string)rqmantenimiento.Mdatos["ccuenta"].ToString());
                            tconextractobancario eb = tconconciliacionbancariaextDal.ExisteFechaNumeroDocumento(tconbanco.ccuentabanco,
                            (int)fechaInsertar, numeroDocumento, valorCredito, valorDebito, numeroComprobante);


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
                    detalle.numeroLinea = numeroLinea;
                    detalle.estado = estado;
                    detalle.optlock = 0;
                    lextracto.Add(detalle);
                    numeroLinea = numeroLinea + 1;
                }

                rqmantenimiento.Response["lregistros"] = lextracto;

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


                            //tconconciliacionbancariaeb tconconciliacionbancariaext = new tconconciliacionbancariaeb();
                            //tconconciliacionbancariaext.ccuenta = rqmantenimiento.Mdatos["ccuenta"].ToString();
                            //tconconciliacionbancariaext.cuentabancaria = (string)rqmantenimiento.Mdatos["ncuentabancaria"];
                            //tconconciliacionbancariaext.fecha = item.fecha;
                            //tconconciliacionbancariaext.numerodocumentobancario = item.numeroDocumento;
                            //tconconciliacionbancariaext.valordebito = item.valorDebito;
                            //tconconciliacionbancariaext.valorcredito = item.valorCredito;
                            //tconconciliacionbancariaext.estadoconciliacionccatalogo = 1020;
                            //tconconciliacionbancariaext.estadoconciliacioncdetalle = "2";
                            //tconconciliacionbancariaext.concepto = item.concepto;
                            //tconconciliacionbancariaext.cusuariocreacion = rqmantenimiento.Cusuario;
                            //tconconciliacionbancariaext.fingreso = DateTime.Now;
                            //tconconciliacionbancariaext.numerocomprobante = item.numeroComprobante;
                            //tconconciliacionbancariaext.optlock = 0;
                            //lextracto.Add(tconconciliacionbancariaext);

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
                            tconextractobancario.ajusteextracto = false;
                            tconextractobancario.fingreso = DateTime.Now;
                            lextracto.Add(tconextractobancario);



                        }
                        catch(Exception ex )
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



    public class tconciliacionAux : tconconciliacionbancariaeb
    {
        public int numerolinea;
        public string mensaje;
        public string estado;
    }

    public class clsValidar
    {

        /// <summary>    
        /// Obtener mensaje de error de formato incorrecto de la fecha.
        /// </summary>
        /// <returns></returns>
        public string pfErrorFecha()
        {
            return "La fecha no cumple con el formato correspondiente";
        }


        /// <summary>    
        /// Validar formato de fecha.
        /// </summary>
        /// <param name="mensaje">Variable de referencia del mensaje de error.</param>
        /// <param name="iobjFecha">Variable que contiene la fecha a validar.</param>
        /// <returns>long?</returns>
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
        /// Validar fecha.
        /// </summary>
        /// <param name="mensaje">Variable de referencia del mensaje de error.</param>
        /// <param name="istrFecha">Cadena que contiene la fecha a validar.</param>
        /// <returns>long</returns>
        public long clsValidarFecha(ref string mensaje, string istrFecha)
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
                mensajeAsignar(ref mensaje, pfErrorFecha());
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
        /// <param name="istrDecimal">Cadena que contiene el número decimal a validar.</param>
        /// <param name="mensaje">Cadena de referencia que contiene el mansaje a desplegar.</param>
        /// <param name="nombreCampo">Nombre del campo que se corresponde con el número decimal a validar.</param>
        /// <param name="numerodecimales">Número máximo de decimales que debe contener el número decimal.</param>
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
        /// <returns></returns>
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
        /// Validar la longitud del objeto.
        /// </summary>
        /// <param name="contenido">Contenido de la cadena a validar.</param>
        /// <param name="lenghtMaxima">Longitud máxima del campo a validar.</param>
        /// <param name="mensaje">Mensaje a mostrar.</param>
        /// <param name="nombreCampo">Nombre del campo a validar.</param>
        /// <returns>string</returns>
        public string clsValidarStrLenght(string contenido, int lenghtMaxima, ref string mensaje, string nombreCampo = "")
        {

            string lContenido = contenido.Trim();
            int llenght = lContenido.Length;

            if (llenght > lenghtMaxima)
            {
                mensajeAsignar(ref mensaje, "La longitud de máxima de" + nombreCampo + " debe ser [" + lenghtMaxima + "] y es de [" + llenght + "]");
            }

            return lContenido;

        }


    }


}


