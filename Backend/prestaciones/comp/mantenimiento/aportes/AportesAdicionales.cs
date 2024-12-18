﻿using core.componente;
using core.servicios.mantenimiento;
using dal.generales;
using dal.persona;
using dal.prestaciones;
using dal.socio;
using socio.datos;//CCA 20210722
using general.archivos.bulkinsert;
using modelo;
using modelo.interfaces;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace prestaciones.comp.mantenimiento.aportes {
    class AportesAdicionales : ComponenteMantenimiento {
        private IList<tpreaporte> objresp { get; set; }

        private IList<tpreaporte> objresperror { get; set; }

        /// <summary>    
        /// Ejecuta la carga de archivos, levanta un hilo para que el proceso sea asincronico.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("es-PE");
            CultureInfo usCulture = new CultureInfo("es-PE");
            objresperror = new List<tpreaporte>();
            objresp = new List<tpreaporte>();
            DateTime Freal = new DateTime(rqmantenimiento.Freal.Year, rqmantenimiento.Freal.Month, 1);


            string connectionString = ConfigurationManager.ConnectionStrings["AtlasContexto"].ConnectionString.Replace("metadata=res://*/ModeloEF.csdl|res://*/ModeloEF.ssdl|res://*/ModeloEF.msl;provider=System.Data.SqlClient;provider connection string", "");
            connectionString = connectionString.Substring(connectionString.IndexOf("data source"));
            connectionString = connectionString.Substring(0, connectionString.Length - 1);


            int faporte = int.Parse(rqmantenimiento.Mdatos["fechaaporte"].ToString());



            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "upload") {
                decimal aportePersonalP = TpreParametrosDal.GetValorNumerico("POR-APORTE-PERSONAL");
                aportePersonalP = aportePersonalP / 100;
                decimal aportePatronalP = TpreParametrosDal.GetValorNumerico("POR-APORTE-PATRONO");
                aportePatronalP = aportePatronalP / 100;

                //obtiene todos los registros de tperpersonadetalle
                List<tperpersonadetalle> lstPersonas = TperPersonaDetalleDal.Find(rqmantenimiento.Ccompania);

                //obtiene todos los registros de tpreaporte
                List<tpreaporte> laportes = TpreAportesDal.GetAportesXFaporte(faporte);
                SqlConnection cnx = new SqlConnection(connectionString);
                cnx.Open();

                string path = "";
                string narchivo = "";
                string archivo = "";
                tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
                path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
                narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                archivo = (string)rqmantenimiento.Mdatos["archivo"];
                archivo = archivo.Replace("data:text/plain;base64,", "");
                path = path + "/" + narchivo;


                try { File.WriteAllBytes(path, Convert.FromBase64String(archivo)); } catch { throw new AtlasException("CONTA-008", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA ''C:\CESANTIA_APP_HOME\SUBIRARCHIVOS'' EN EL DISCO ''C:\'', PARA HABILITAR LA CARGA MASIVA DE FACTURAS DEL PARQUEADERO."); }

                StreamReader file = null;
                string datosRegistro;  //Datos de una linea del archivo.
                file = new StreamReader(path, System.Text.Encoding.UTF8);
                List<tpreaporte> listaFacturas = new List<tpreaporte>();
                tpreaporte aporte = null;
                String identificacion = "";


                while ((datosRegistro = file.ReadLine()) != null) {
                    string errores = "";

                    if (!string.IsNullOrEmpty(datosRegistro)) {
                       // aporte = new tpreaporte();
                        decimal result = 0;
                        bool boolresult = false;
                        errores = "";
                        String[] lcampos = datosRegistro.Split(Convert.ToChar(";"));

                        if (lcampos.Length != 5) {
                            errores += "EL NÚMERO DE CAMPOS DEBE SER 5 Y SON " + lcampos.Length;
                        } else {

                            identificacion = (lcampos[0]).Replace("\"", "");

                            if (identificacion.Trim().Length == 0) {
                                errores += "IDENTIFICACIÓN VACÍA";
                            } else {
                                tperpersonadetalle persona = lstPersonas.Find(x => x.identificacion.Equals(identificacion));
                                aporte = TpreAportesDal.FindPorCpersonaFaporte(persona.cpersona, faporte);

                                if(aporte != null) {
                                    aporte.Mdatos["identificacion"] = identificacion;
                                    String nombre = (lcampos[1]).Replace("\"", "");

                                    if (nombre.Trim().Length == 0) {
                                        errores += "NOMBRE VACÍO";
                                    }
                                    aporte.Mdatos["nombre"] = nombre;
                                }

                         
                                
                                boolresult = decimal.TryParse(lcampos[3].ToString(), out result);
                                if (result <= 0) {

                                    continue;
                                }

                                //  tperpersonadetalle persona = lstPersonas.Find(x => x.identificacion.Equals(identificacion));

                                if (persona == null) {
                                    errores += "PERSONA CON IDENTIFICACIÓN " + identificacion + " NO EXISTE";
                                } else {
                                    if (aporte == null) {
                                        errores += "APORTE NO SE ENCUENTRA CARGADO "  + identificacion;
                                    } else {
                                        if (aporte.ajuste > 0) {
                                            errores += "YA EXISTE APORTE ADICIONAL CARGADOS";
                                        }
                                        aporte.cpersona = persona.cpersona;
                                        aporte.ccompania = rqmantenimiento.Ccompania;
                                        aporte.fechaaporte = faporte;

                                        aporte.ajuste = 0;
                                        aporte.activo = true;
                                        aporte.valido = true;
                                        aporte.descripcion = "";
                                        aporte.comprobantecontable = 0;
                                        aporte.cusuariocrea = rqmantenimiento.Cusuario;
                                        aporte.fechahoracrea = rqmantenimiento.Freal;
                                        aporte.interesgenerado = 0;

                                        decimal sueldo = 0, ajuste = 0;


                                        boolresult = decimal.TryParse(lcampos[2].ToString(), out result);
                                        if (boolresult) {
                                            sueldo = result;
                                            //  sueldo = sueldo / 100;
                                            if (sueldo <= 0) {
                                                errores += "EL SUELDO DEBE SER MAYOR QUE CERO";
                                                aporte.aportepersonal = 0;
                                                aporte.aportepatronal = 0;
                                                aporte.sueldo = 0;

                                            } else {
                                                //  aporte.sueldo = sueldo;
                                                result = 0;
                                                boolresult = decimal.TryParse(lcampos[3].ToString(), out result);
                                                if (boolresult) {
                                                    ajuste = result;
                                                    //         aportepersonal = aportepersonal / 100;
                                                    if (ajuste <= 0) {
                                                        aporte.ajuste = 0;
                                                        aporte.ajuste = 0;

                                                    } else {

                                                        aporte.ajuste = ajuste;
                                                        /*decimal sueldoCalculado = CalcularSueldo((decimal)aporte.ajuste, aportePersonalP);
                                                        aporte.ajustepatronal = CalcularAportePatronal(sueldoCalculado, aportePatronalP);*/ //CCA 20210722
                                                        aporte.ajustepatronal = CalcularAportePatronal(sueldo, aportePatronalP); //CCA 20210722
                                                        aporte.ajustepatronal = decimal.Round(aporte.ajustepatronal.Value, 4, MidpointRounding.AwayFromZero);

                                                    }
                                                } else {
                                                    errores += "EL APORTE PERSONAL DEBE SER UN VALOR NUMÉRICO";
                                                    aporte.ajuste = 0;
                                                    aporte.ajustepatronal = 0;
                                                }



                                            }

                                        } else {
                                            errores += "EL SUELDO DEBE SER UN VALOR NUMÉRICO";
                                            aporte.ajuste = 0;
                                            aporte.ajustepatronal = 0;
                                            aporte.sueldo = 0;
                                        }
                                        
                                    }

                                    

                                    

                                }

                            }

                        }

                        
                        if (errores.Length == 0) {
                            if (aporte == null)
                                aporte = new tpreaporte();
                            aporte.Mdatos.Add("err", errores);
                            this.objresp.Add(this.ADD(aporte));
                        } else {
                            if (aporte == null)
                                aporte = new tpreaporte();
                            aporte.Mdatos.Add("err", errores);
                            this.objresperror.Add(this.ADD(aporte));
                        }
                    }
                }
                cnx.Close();
                file.Close();
                string msg = "REGISTROS SIN CONFLICTOS: " + this.objresp.Count() + "<br/> ";
                msg += "REGISTROS CON CONFLICTOS: " + this.objresperror.Count() + "<br/> ";
                msg += "TOTAL REGISTROS: " + (this.objresperror.Count() + this.objresp.Count());

                if (this.objresperror.Count() > 0) {
                    rqmantenimiento.Response.Add("ERRORES", true);

                } else {
                    rqmantenimiento.Response.Add("ERRORES", false);

                }

                rqmantenimiento.Response.SetMsgusu(msg);
                rqmantenimiento.Response.Add("registrosok", this.objresp.Count());
                rqmantenimiento.Response.Add("registroserror", this.objresperror.Count());
                rqmantenimiento.Response.Add("registrostotal", (this.objresperror.Count() + this.objresp.Count()));

                rqmantenimiento.Response.Add("LREGISTROS", this.objresp);
                rqmantenimiento.Response.Add("LREGISTROSCONFLICTO", this.objresperror);
            } else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read") {

                List<tpreaporte> listaAportes = new List<tpreaporte>();
                List<tpreaporte> listaAporte = JsonConvert.DeserializeObject<List<tpreaporte>>(rqmantenimiento.Mdatos["lregistros"].ToString());

                decimal porcentajepatronal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PATRONO");
                decimal porcentajepersonal = TpreParametrosDal.GetValorNumerico("POR-APORTE-PERSONAL");
                tgencatalogodetalle estadosocio;//CCA 20210722

                //tgensecuencia sec = new tgensecuencia();
                //AtlasContexto contexto = Sessionef.GetAtlasContexto();
                //sec = TgenSecuenciaDal.Find(contexto, "APORTES");
                //long caporte = sec.valoractual.Value;
                //TgenSecuenciaDal.ActualizarSecuenciaPorSqlCommand("APORTES", caporte + listaAporte.Count);

                decimal sumpersonal = 0, sumpatronal = 0, valortotal = 0;
                foreach (IBean o in listaAporte) {
                    tpreaporte obj = (tpreaporte)o;
                    //CCA 20210722
                    long cpersona = obj.cpersona;
                    Socios socio = new Socios(cpersona, rqmantenimiento);
                    estadosocio = socio.GetEstadoSocio();
                    //CCA 20210722
                    obj.Actualizar = true;
                    // obj.ajustepatronal = decimal.Round(((decimal)obj.ajuste * porcentajepersonal / porcentajepatronal), 7);
                    // caporte++;
                    // obj.caporte = caporte;
                    /*CCA 20210722*/
                    if (estadosocio.cdetalle != "BLQ")
                    {
                        sumpersonal += obj.ajuste.Value;
                        sumpatronal += Math.Round(obj.ajustepatronal.Value, 2, MidpointRounding.AwayFromZero);//CCA prestaciones 20210325 - 20210722
                        listaAportes.Add(obj);
                    }
                    else
                    {
                        sumpersonal += obj.ajuste.Value;
                        sumpatronal += Math.Round(obj.ajustepatronal.Value, 2, MidpointRounding.AwayFromZero);//CCA prestaciones 20210325 - 20210722
                        //listaAportes.Add(obj);
                    }
                    /*CCA 20210722*/
                }

                valortotal = sumpersonal + sumpatronal;
               // BulkInsertHelper.Grabar(listaAporte, "tpreaporte");

                DateTime fcarga = new DateTime(int.Parse(faporte.ToString().Substring(0, 4)), int.Parse(faporte.ToString().Substring(4, 2)), 1);

                tgencargaarchivolog cargaarchivolog = TgenCargaArchivoLogDal.crear(28, 3, "CARGA APORTES", rqmantenimiento.Mdatos["narchivo"].ToString(),
                                                        fcarga, rqmantenimiento.Freal, "F", int.Parse(rqmantenimiento.Mdatos["registrosok"].ToString()),
                                                        int.Parse(rqmantenimiento.Mdatos["registroserror"].ToString()), int.Parse(rqmantenimiento.Mdatos["registrostotal"].ToString()),
                                                        valortotal, 0, 0, "", rqmantenimiento.Freal, rqmantenimiento.Cusuario);
                rqmantenimiento.AdicionarTabla("tgencargaarchivolog", cargaarchivolog, false);
                rqmantenimiento.AdicionarTabla("Tpreaporte", listaAportes, false);//CCA 20210722 listaAporte

                rqmantenimiento.AddDatos("totalAporteIndividual", Math.Round(sumpersonal, 2, MidpointRounding.AwayFromZero));
                rqmantenimiento.AddDatos("totalAportePatronal", Math.Round(sumpatronal, 2, MidpointRounding.AwayFromZero));
                RqMantenimiento rq = (RqMantenimiento)rqmantenimiento.Clone();
                rq.EncerarRubros();
                Mantenimiento.ProcesarAnidado(rq, 28, 4);

            }


        }


        public bool buscarAportes(int faporte, SqlConnection sqlConnection) {
            String SQL_BACKUP = "SELECT COUNT(1) FROM tpreaporte WHERE fechaaporte = @faporte";
            using (var sqlCommand = new SqlCommand(SQL_BACKUP, sqlConnection)) {
                sqlCommand.CommandTimeout = 0;
                sqlCommand.Parameters.AddWithValue("@faporte", faporte);
                int ob = (int)sqlCommand.ExecuteScalar();
                if (ob != 1) {
                    return false;
                }
            }
            return true;
        }

        /// <summary>
        /// Cálcula que permite calcular el aporte patronal
        /// </summary>
        /// <param name="sueldo"></param>
        /// <returns></returns>
        public decimal CalcularAportePatronal(decimal sueldo, decimal porcentaje) {
            decimal aportePatronal = sueldo * porcentaje;
            return aportePatronal;
        }
        /// <summary>
        /// Cálcula el sueldo en base a el aporte personal
        /// </summary>
        /// <param name="sueldo"></param>
        /// <returns></returns>
        public decimal CalcularSueldo(decimal aportePersonal, decimal porcentaje) {
            decimal sueldo = aportePersonal / porcentaje;

            return sueldo;
        }

        public tpreaporte ADD(tpreaporte aporte) {
            tpreaporte aporteN = null;
            aporteN = aporte;
            aporteN.RemoveDatos("BEANORIGINAL");
            return aporteN;
        }

    }
}
