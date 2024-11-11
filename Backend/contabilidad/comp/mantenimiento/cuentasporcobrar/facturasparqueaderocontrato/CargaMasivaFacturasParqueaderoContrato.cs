using core.componente;
using core.servicios;
using dal.generales;
using modelo;
using System;
using System.IO;
using util;
using util.dto.mantenimiento;
using System.Collections.Generic;
using util.servicios.ef;
using Newtonsoft.Json;
using System.Globalization;
using dal.contabilidad;
using System.Threading;
using System.Linq;

namespace contabilidad.comp.mantenimiento.cuentasporcobrar.facturasparqueaderocontrato
{
    public class CargaMasivaFacturasParqueaderoContrato : ComponenteMantenimiento
    {
        /// <summary>    
        /// Ejecuta la carga de archivos, levanta un hilo para que el proceso sea asincronico.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-EC");


            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "upload")
            {
                string path = "";
                string narchivo = "";
                string archivo = "";
                tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
                path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
                narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                archivo = (string)rqmantenimiento.Mdatos["archivo"];
                archivo = archivo.Replace("data:text/plain;base64,", "");
                path = path + "/" + narchivo;


                try { File.WriteAllBytes(path, Convert.FromBase64String(archivo)); }
                catch { throw new AtlasException("CONTA-008", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA ''C:\CESANTIA_APP_HOME\SUBIRARCHIVOS'' EN EL DISCO ''C:\'', PARA HABILITAR LA CARGA MASIVA DE FACTURAS DEL PARQUEADERO."); }

                StreamReader file = null;
                string datosRegistro;  //Datos de una linea del archivo.
                file = new StreamReader(path, System.Text.Encoding.UTF8);
                List<tconfacturaparqueadero> listaFacturas = new List<tconfacturaparqueadero>();
                tconfacturaparqueadero tfp;
                int sub_ex = 0;
                int sub_err = 0;

                decimal? suma_subtotal = 0;
                decimal? suma_iva = 0;
                decimal? suma_total = 0;
                tperproveedor cliente = new tperproveedor();
                while ((datosRegistro = file.ReadLine()) != null)
                {
                    string lstrMensaje = "";

                    if (!string.IsNullOrEmpty(datosRegistro))
                    {
                        tfp = new tconfacturaparqueadero();                        
                        String[] lcampos = datosRegistro.Split(Convert.ToChar("\t"));

                        if (lcampos.Length != 8)
                        {
                            lstrMensaje += "El número de campos debe ser 8 y es " + lcampos.Length;
                        }
                        else {
                            try
                            {
                                DateTime temp = DateTime.ParseExact(lcampos[0], "d-M-yyyy", System.Globalization.CultureInfo.InvariantCulture);
                                tfp.ffactura = temp;
                            }
                            catch
                            {
                                lstrMensaje += "Error en la fecha de generación del documento. ";
                            }
                            tfp.secuencial = lcampos[3];
                            tfp.nombre = lcampos[1].Trim();
                            tfp.identificacion = lcampos[2];
                            cliente = TperProveedorDal.FindByIdentificacionAndTipo(tfp.identificacion, true);
                            if (cliente == null) {
                                lstrMensaje += "Cliente no se encuentra registrado";
                            }

                            tfp.subtotal = decimal.Parse(lcampos[5], new NumberFormatInfo() { NumberDecimalSeparator = "." });
                            suma_subtotal += tfp.subtotal;
                            if (tfp.subtotal < 0)
                            {
                                lstrMensaje += "El valor del subtotal no puede ser negativo. ";
                            }
                            tfp.montoiva = decimal.Parse(lcampos[6], new NumberFormatInfo() { NumberDecimalSeparator = "." });
                            suma_iva += tfp.montoiva;
                            if (tfp.montoiva < 0)
                            {
                                lstrMensaje += "El valor del IVA no puede ser negativo. ";
                            }
                            tfp.total = decimal.Parse(lcampos[7], new NumberFormatInfo() { NumberDecimalSeparator = "." });
                            suma_total += tfp.total;
                            if (tfp.total < 0)
                            {
                                lstrMensaje += "El valor del total no puede ser negativo. ";
                            }
                            listaFacturas.Add(tfp);
                        }

                        if (lstrMensaje.Length == 0)
                        {
                            tfp.Mdatos.Add("mensaje", "OK");
                            sub_ex++;
                            rqmantenimiento.Mdatos.Remove("narchivo");
                            rqmantenimiento.Mdatos.Remove("archivo");
                        }
                        else
                        {
                            tfp.Mdatos.Add("mensaje", lstrMensaje);
                            sub_err++;
                        }
                    }
                }
                List<decimal?> lista = new List<decimal?>();
                lista.Add(suma_subtotal);
                lista.Add(suma_iva);
                lista.Add(suma_total);

                rqmantenimiento.Response["suma_total"] = lista;

                if (file != null) { file.Close(); }
                setResponse(rqmantenimiento, listaFacturas, "CARGARON", sub_err, sub_ex);                
            }
            else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {

                 List<tconfacturaparqueadero> listaFacturasResponse = new List<tconfacturaparqueadero>();
                List<tconfacturaparqueadero> listaFacturas = listaFacturas = JsonConvert.DeserializeObject<List<tconfacturaparqueadero>>(rqmantenimiento.Mdatos["lregistros"].ToString())
                    .GroupBy(x => x.secuencial).Select(y => y.First()).Cast<tconfacturaparqueadero>().ToList();

                int err = 0;
                foreach (var tcfp in listaFacturas)
                {
                    bool flag = true;
                    string mensaje = "";
                    try
                    {
                        tcfp.estadoccatalogo = 1025;
                        tcfp.estadocdetalle = "INGRES";
                        tcfp.tipofactura = "C";
                        tcfp.ccompania = rqmantenimiento.Ccompania;
                        tcfp.email = "";
                        tcfp.cusuarioing = rqmantenimiento.Cusuario;
                        tcfp.fingreso = rqmantenimiento.Freal;

                        if (TconCargaMasivaFacturasParqueaderoDal.VerificarSecuencial(tcfp.secuencial))
                        {
                            mensaje += "El secuencial de la factura ya se encuentra ingresado. "; flag = false;
                        }
                        if (flag)
                        {
                            //tcfp.cfacturaparqueadero = DateTime.UtcNow.ToString("yyyyMMddhhmmssfff");
                            System.Threading.Thread.Sleep(100);
                            tcfp.cfacturaparqueadero = DateTime.UtcNow.ToString("yyyyMMddhhmmssfff");
                            Sessionef.Grabar(tcfp);
                        }
                    }
                    catch (Exception e) {
                        mensaje += "Se produjo un error al realizar la carga: " + e.Message;
                    }

                    if (mensaje.Length != 0)
                    {
                        err++;
                        tcfp.Mdatos.Add("mensaje", mensaje);
                    }                    
                    listaFacturasResponse.Add(tcfp);                
                }
                setResponse(rqmantenimiento, listaFacturasResponse, "GUARDARON", err, listaFacturasResponse.Count()-err);
            }
        }

        private void setResponse(RqMantenimiento rqmantenimiento, List<tconfacturaparqueadero> listaFacturas, string v, int sub_err, int sub_ex)
        {
            rqmantenimiento.Response["lregistros"] = listaFacturas;
            string msgCarga = "SE "+ v +" "+ sub_ex + " REGISTROS EXITOSAMENTE ";

            if (sub_err == 0)
                rqmantenimiento.Response.SetCod("000");
            else
            {
                rqmantenimiento.Response.SetCod("ERROR");
                msgCarga += "Y " + sub_err + " CON ERRORES";
            }
            msgCarga += ", DE UN TOTAL DE " + (sub_err + sub_ex) + " REGISTROS.";
            rqmantenimiento.Response.SetMsgusu(msgCarga);
        }
    }
}


