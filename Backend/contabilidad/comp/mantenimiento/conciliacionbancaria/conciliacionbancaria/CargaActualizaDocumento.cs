using core.componente;
using modelo;
using System;
using System.IO;
using System.Collections.Generic;
using util;
using util.dto.mantenimiento;
using dal.generales;
using dal.contabilidad.conciliacionbancaria;
using contabilidad.datos;
using System.Text;
using System.Threading;
using System.Globalization;
using contabilidad.comp.mantenimiento.conciliacionbancaria.extractobancario;

namespace contabilidad.comp.mantenimiento.conciliacionbancaria.conciliacionbancaria
{
    public class CargaActualizaDocumento : ComponenteMantenimiento
    {
        /// <summary>    
        /// Fecha: 25072022
        /// Descripcion: Ejecuta carga del archivo txt para la actualizacion de los documentos de libro banco
        /// RRO 20230130
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns></returns>

        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
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
                catch(Exception ex)
                {
                    throw new AtlasException("CONTA-007", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA 'C:\CESANTIA_APP_HOME\SUBIRARCHIVOS' EN EL DISCO 'C:\', PARA POSIBILITAR LA CARGA DEL ARCHIVO.");
                }

                StreamReader objReader = new StreamReader(path, Encoding.Default);
                string linea = string.Empty;
                int contador = 1;
                List<DetalleLB> lLibroBanco = new List<DetalleLB>();
                bool controlError = true;

                tconbanco tconbanco = TconBancoDal.Find((string)rqmantenimiento.Mdatos["ccuenta"].ToString());
                clsValidar lclsValidar = new clsValidar();

                decimal totalCredito = 0;
                decimal totalDebito = 0;
                int numerolinea = 1;
                string documentoerror = string.Empty;

                while (linea != null)
                {
                    linea = objReader.ReadLine();

                    if (linea != null)
                    {
                        if (contador > 1)
                        {
                            string[] info = linea.Split('\t');
                            string numeroDocumentoInicial = info[1].ToString();
                            string numeroDocumentoFinal = info[3].ToString();
                            decimal valorDebito = 0;
                            string mensaje = string.Empty;
                            long fechaInsertar = 0;
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

                            if (!string.IsNullOrEmpty(info[2].ToString()))
                                valorDebito = lclsValidar.clsValidarDecimal(lclsValidar.asignarObjeto(info[2]), ref mensaje, "Débito");
                            else
                                lclsValidarBce.mensajeAsignarBce(ref mensaje, "El valor no puede ser nulo");

                            tconlibrobancos librobco = TconLibroBancosDal.FindLibroBancoParametros(tconbanco.ccuentabanco, Convert.ToInt32(fecha), numeroDocumentoInicial, valorDebito);

                            DetalleLB detalle = new DetalleLB();

                            if (librobco != null)
                            {
                                detalle.clibrobanco = librobco.clibrobanco;
                                detalle.cuentabanco = librobco.cuentabanco;
                                detalle.freal = librobco.freal;
                                detalle.fcontable = librobco.fcontable;
                                detalle.ccomprobante = librobco.ccomprobante;
                                detalle.cmodulo = librobco.cmodulo;
                                detalle.ctransaccion = librobco.ctransaccion;
                                detalle.montodebito = librobco.montodebito;
                                detalle.montocredito = librobco.montocredito;
                                detalle.conciliado = librobco.conciliado;
                                detalle.cusuariomod = librobco.cusuariomod;
                                detalle.fmodificacion = librobco.fmodificacion;
                                detalle.ajustelibro = librobco.ajustelibro;
                                detalle.conciliaaux = librobco.conciliaaux;

                                detalle.documentohist = numeroDocumentoInicial;
                                detalle.documento = numeroDocumentoFinal;

                                detalle.cambioComprobante = librobco.cambioComprobante;
                                detalle.operacion = librobco.operacion;
                                detalle.formapago = librobco.formapago;
                                lLibroBanco.Add(detalle);

                                totalCredito += Convert.ToDecimal(librobco.montodebito ?? 0);
                                totalDebito += Convert.ToDecimal(librobco.montocredito ?? 0);
                                numerolinea += 1;
                            }
                            else
                            {
                                documentoerror += numeroDocumentoInicial + ", ";
                            }
                        }
                        contador += 1;
                    }
                }
                objReader.Close();

                if (string.IsNullOrEmpty(documentoerror))
                {
                    rqmantenimiento.Response["lregistros"] = lLibroBanco;
                    rqmantenimiento.Response["totalCredito"] = totalCredito.ToString();
                    rqmantenimiento.Response["totalDebito"] = totalDebito.ToString();
                    rqmantenimiento.Response["archivoCargado"] = 1;
                }
                else
                {
                    rqmantenimiento.Response.SetCod("000");
                    rqmantenimiento.Response.SetMsgusu("EXISTEN ERRORES EN LA CARGA. NO EXISTEN LOS SIGUIENTES DOCUMENTOS: " + documentoerror.Substring(0, documentoerror.Length - 2));
                }

                if (!controlError)
                {
                    rqmantenimiento.Response.SetCod("000");
                    rqmantenimiento.Response.SetMsgusu("EXISTEN ERRORES EN LA CARGA. REVISE LOS MENSAJES EN LA COLUMNA MENSAJE");
                }
            }
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
        /// Asignar el objeto a validar, retorna "" si es nulo.
        /// </summary>
        /// <param name="iobj">Objeto a asignar.</param>
        /// <returns>string</returns>
        public string asignarObjetoBce(object iobj)
        {
            return iobj == null ? "" : iobj.ToString();
        }

    }
}

