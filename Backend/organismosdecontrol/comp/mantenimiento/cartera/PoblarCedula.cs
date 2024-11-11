using core.componente;
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
using dal.organismosdecontrol;
using dal.persona;

namespace organismosdecontrol.comp.mantenimiento.cartera
{
    public class PoblarCedula : ComponenteMantenimiento
    {

        /// <summary>    
        /// Ejecuta la carga de archivos, levanta un hilo para que el proceso sea asincronico.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
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
                archivo = archivo.Replace("data:text/plain;base64,", "");
                path = path + "/" + narchivo;                

                try { File.WriteAllBytes(path, Convert.FromBase64String(archivo)); }
                catch { throw new AtlasException("ODC-001", @"ERROR: DEBE CREAR LA RUTA ''C:\CESANTIA_APP_HOME\SUBIRARCHIVOS'' EN EL DISCO ''C:\''."); }

                StreamReader file = null;
                string datosRegistro;  //Datos de una linea del archivo.
                file = new StreamReader(path, System.Text.Encoding.UTF8);
                List<tperpersonadetalle> listaPersonas = new List<tperpersonadetalle>();
                IList<Dictionary<string,object>> datospersona;
                todcparametros cod = new todcparametros();
                tperpersonadetalle tpd;

                while ((datosRegistro = file.ReadLine()) != null)
                {
                    if (!string.IsNullOrEmpty(datosRegistro))
                    {
                        tpd = new tperpersonadetalle();                        
                        String[] lcampos = datosRegistro.Split(Convert.ToChar("\t"));
                        tpd.identificacion = lcampos[0];
                        datospersona = TperPersonaDetalleDal.FindPoblarCedulas(tpd.identificacion);
                        cod = TodcParametrosDal.FindXCodigo("POB.CED", 1);

                        if (datospersona.Count > 0)
                        {
                            tpd.nombre = datospersona[0]["nombre"].ToString();
                            tpd.Mdatos.Add("codigo", cod.texto);
                            tpd.Mdatos.Add("fnacimiento", datospersona[0]["fnacimiento"].ToString());
                            tpd.Mdatos.Add("status", "OK");
                        }
                        else
                        {
                            tpd.Mdatos.Add("status", "Error: Datos no encontrados");
                            tpd.Mdatos.Add("codigo", cod.texto);
                        }

                        listaPersonas.Add(tpd);
                        
                    }
                }
                rqmantenimiento.Response["lregistros"] = listaPersonas;
                
            }
            }
        }

        
}


