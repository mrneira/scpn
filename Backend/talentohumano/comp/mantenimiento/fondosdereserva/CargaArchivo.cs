using core.componente;
using dal.generales;
using dal.talentohumano;
using dal.talentohumano.nomina;
using dal.talentohumano.nomina.fondosdereserva;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace talentohumano.comp.mantenimiento.fondosdereserva
{
    class CargaArchivo : ComponenteMantenimiento
    {
        /// <summary>
        /// Clase para carga archivo fondo de reserva 
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "upload")
            {
                decimal factorFR = TthParametrosDal.GetValorNumerico("FACTOR_FONDOS_RESERVA", rqmantenimiento.Ccompania);
                string mesactual = rqmantenimiento.Freal.Month.ToString().PadLeft(2, '0');
                int? anio = rqmantenimiento.GetInt("anio");
                int  anioactual = (anio == null) ? anio.Value : rqmantenimiento.Freal.Year;

                rqmantenimiento.Response.Add("factorFR", factorFR);
                rqmantenimiento.Response.Add("mesactual", mesactual);
                rqmantenimiento.Response.Add("anioactual", anioactual);

                string path = "";
                string narchivo = "";
                string archivo = "";
                tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqmantenimiento.Ccompania);
                path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
                narchivo = (string)rqmantenimiento.Mdatos["narchivo"];
                archivo = (string)rqmantenimiento.Mdatos["archivo"];
                archivo = archivo.Replace("data:application/vnd.ms-excel;base64,", "");
                path = path + "/" + narchivo;

                try { File.WriteAllBytes(path, Convert.FromBase64String(archivo)); }
                catch { throw new AtlasException("CONTA-008", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA ''C:\CESANTIA_APP_HOME\SUBIRARCHIVOS'' EN EL DISCO ''C:\'', PARA HABILITAR LA CARGA DEL ARCHIVO."); }

                StreamReader file = null;
                string datosRegistro;  //Datos de una linea del archivo.
                file = new StreamReader(path, System.Text.Encoding.UTF8);

                List<tnomfondoreserva> tnomfondoreservaOK = new List<tnomfondoreserva>();
                List<tnomfondoreserva> tnomfondoreservaProb = new List<tnomfondoreserva>();
                List<object[]> registros = new List<object[]>();

                while ((datosRegistro = file.ReadLine()) != null)
                {
                    object[] lcampos = datosRegistro.Split(Convert.ToChar(","));
                    if (lcampos.Length == 7) {
                        try {                            
                            long cedula = Convert.ToInt64(lcampos[0]);
                            registros.Add(lcampos);
                        }
                        catch (Exception e) {                            
                        }
                    }
                }
                if (file != null) { file.Close(); }

                foreach (object[] lcampos in registros)
                {
                    tnomfondoreserva tnfr = new tnomfondoreserva();
                    string err = "";
                    long documento = Convert.ToInt64(lcampos[0]);
                    tthfuncionariodetalle funcionario = TthFuncionarioDal.Find(documento.ToString());
                    if (funcionario != null)
                    {
                        tnfr.Mdatos.Add("documento", documento);
                        tnfr.Mdatos.Add("nfuncionario", funcionario.primerapellido + " " + funcionario.primernombre);

                        tthcontratodetalle tthcontratodetalle = TthContratoDal.FindContratoFuncionario(funcionario.cfuncionario);
                        if (tthcontratodetalle != null)
                        {
                            tnomfondoreserva temp = TnomFondosDeReservaDal.FindByFuncionarioMesAnio(funcionario.cfuncionario, mesactual, anioactual);

                            if (temp == null)
                            {
                                tnfr.cfuncionario = funcionario.cfuncionario;
                                tnfr.mesccatalogo = 4;
                                tnfr.mescdetalle = mesactual;
                                tnfr.fechageneracion = rqmantenimiento.Freal;
                                tnfr.anio = anioactual;
                                tnfr.tienesolicitud = lcampos[3].ToString() == "SI";
                                if (tnfr.tienesolicitud.Value)
                                    tnfr.fechasolicitud = DateTime.ParseExact(lcampos[4].ToString(), new string[] { "d/M/yyyy", "dd/MM/yyyy", "d/MM/yyyy", "dd/M/yyyy" }, System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None);
                                tnfr.tienecargos = lcampos[5].ToString() == "SI";
                                tnfr.tienederecho = lcampos[6].ToString() == "SI";
                                tnfr.proporcional = false;
                                tnfr.diasproporcionales = 0;
                                tnfr.sueldoactual = tthcontratodetalle.remuneracion.Value;
                                tnfr.factorfr = factorFR;
                                tnfr.valor = tthcontratodetalle.remuneracion.Value * factorFR / 100;
                                tnfr.valor = decimal.Round(tnfr.valor, 2, MidpointRounding.AwayFromZero);
                                tnfr.mensualiza = lcampos[3].ToString() == "SI";
                                tnfr.contabilizado = false;
                                tnfr.accionccatalogo = 1143;
                                if (tnfr.tienederecho.Value)
                                {
                                    if (tnfr.tienesolicitud.Value) tnfr.accioncdetalle = "3";
                                    else tnfr.accioncdetalle = "2";
                                }
                                else
                                {
                                    tnfr.accioncdetalle = "1";
                                }
                            }
                            else
                            {
                                err += "Ya se ha generado un valor correspondiente a Fondos de Reserva para el funcionario con la identificación " + documento + " para el mes y el año actuales. ";

                            }                            
                        }
                        else
                        {
                            err += "No se ha encontrado un contrato vigente para el funcionario con la identificación " + documento + ". ";
                        }
                    }
                    else
                    {
                        err += "No se ha encontrado funcionario con la identificación " + documento + ". ";
                    }
                    tnfr.Mdatos.Add("err", err);
                    if (err.Length == 0)
                    {
                        tnomfondoreservaOK.Add(tnfr);
                    }
                    else
                    {
                        tnomfondoreservaProb.Add(tnfr);
                    }
                }
                tnomfondoreservaOK = tnomfondoreservaOK.GroupBy(x => x.cfuncionario).Select(y => y.First()).Cast<tnomfondoreserva>().ToList();
                
                string msg = "Se procesaron " + tnomfondoreservaOK.Count() + " registros correctamente.";
                if (tnomfondoreservaProb.Count() > 0)
                    msg += " Y "+ tnomfondoreservaProb.Count()+" registros presentan inconsistencias.";

                rqmantenimiento.Response.SetMsgusu(msg);
                rqmantenimiento.Response.Add("tnomfondoreservaOK", tnomfondoreservaOK);
                rqmantenimiento.Response.Add("tnomfondoreservaProb", tnomfondoreservaProb);
            }
            else
            {
                List<tnomfondoreserva> listaFacturas = listaFacturas = JsonConvert.DeserializeObject<List<tnomfondoreserva>>(rqmantenimiento.Mdatos["lregistros"].ToString());
                rqmantenimiento.AdicionarTabla("tnomfondoreserva", listaFacturas, false);
                
            }
        }
    }
}
