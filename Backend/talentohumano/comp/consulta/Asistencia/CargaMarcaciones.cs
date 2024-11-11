using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.consulta;
using util.dto.mantenimiento;
using modelo;
using dal.generales;
using util;
using System.IO;
using LinqToExcel;
using dal.talentohumano;
using util.dto.TMarcacion;

namespace talentohumano.comp.consulta.Asistencia
{
    public class CargaMarcaciones : ComponenteConsulta
    {


        List<TMarcacion> objresp = new List<TMarcacion>();

        List<TMarcacion> objresperror = new List<TMarcacion>();
        /// <summary>
        /// Busqueda del listado actual de
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            string path = "";
            string narchivo = "";
            string archivo = "";

            archivo = rqconsulta.Mdatos["archivo"].ToString();
            narchivo = rqconsulta.Mdatos["narchivo"].ToString();
            tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqconsulta.Ccompania);
            path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
            path = path + "/" + narchivo;

            try
            {
                File.WriteAllBytes(path, Convert.FromBase64String(archivo));

            }
            catch
            {
                throw new AtlasException("NOM-001", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA " + path + ", PARA POSIBILITAR LA CARGA DE LAS MARCACIONES DE VACACIONES.");
            }

            string sheetName = "Marcaciones";

            var excelFile = new ExcelQueryFactory(path);
            var cargavacaciondatos = from a in excelFile.Worksheet(sheetName) select a;


          

                foreach (var lineaArchivo in cargavacaciondatos)
                {
                    string err = "";
                    TMarcacion cb = new TMarcacion();
                    string documento = (lineaArchivo[1].ToString());
                    tthfuncionariodetalle fun = TthFuncionarioDal.Find(documento);
                    if (fun != null)
                    {
                        cb.Mdatos.Add("documento", documento);
                        cb.Mdatos.Add("nfuncionario", fun.primernombre + " " + fun.primerapellido);
                        cb.cusuario = fun.codigobiometrico;
                        DateTime fecha = new DateTime();
                        DateTime hora = new DateTime();
                        int validas = 0;

                       try
                        {
                            fecha = Convert.ToDateTime(lineaArchivo[2].ToString());
                           
                            validas++;
                        }
                        catch (Exception ex)
                        {
                            err += "Ha ocurrido un error al convertir " + lineaArchivo[2].ToString() + " en Fecha. Error: " +ex.Message;
                            validas--;

                        
                        }

                    try
                    {
                        hora = Convert.ToDateTime(lineaArchivo[3].ToString());
                        cb.marcacionint = int.Parse(fecha.ToString("HHmmss"));
                        validas++;
                    }
                    catch (Exception ex)
                    {

                        err += "Ha ocurrido un error al convertir " + lineaArchivo[3].ToString() + " en Hora, Error:"+ ex.Message;
                            validas--;
                        }
                        if (validas == 2)
                        {
                            cb.fmarcacion = fecha.ToString("yyy/MM/dd") + " " + hora.ToString("HH:mm:ss");
                             cb.fecha = cb.fmarcacion;
                        }
                        else {
                            err += " ";
                        }

                      
                        try
                        {
                            cb.marcacion = int.Parse(lineaArchivo[4].ToString());
                            
                        }
                        catch (Exception ex)
                        {
                            err += "Ha ocurrido un error al convertir " + lineaArchivo[4].ToString() + " en Tipo de marcación. Error:" + ex.Message;
                           
                        }

                       
                        
                        
                    
                        cb.esnuevo = true;
                        cb.actualizar = false;
                        cb.biometrico = 2;
                        cb.eliminado = false;
                        cb.fingreso = DateTime.Now.ToString();
                    }

                    else
                    {
                        err += "No se ha encontrado funcionario con la identificación " + documento + ". ";
                    }

                    cb.Mdatos.Add("err", err);
                    if (err.Length == 0)
                    {
                        this.objresp.Add(cb);
                    }
                    else
                    {
                        this.objresperror.Add(cb);
                    }


                }
               
            string msg = "Se procesaron " + this.objresp.Count() + " registros correctamente.";
            if (this.objresperror.Count() > 0)
                msg += " Y " + this.objresperror.Count() + " registros presentan inconsistencias.";
            rqconsulta.Response.SetMsgusu(msg);
            rqconsulta.Response.Add("CARGAMARCACION", this.objresp);
            rqconsulta.Response.Add("CARGAMARCACIONERROR", this.objresperror);


        }
      
    }

}
