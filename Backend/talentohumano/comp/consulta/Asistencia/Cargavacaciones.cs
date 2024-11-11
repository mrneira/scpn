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

namespace talentohumano.comp.consulta.Asistencia
{
    public class Cargavacaciones : ComponenteConsulta
    {

        private IList<tnommatrizvacacion> objresp { get; set; }

        private IList<tnommatrizvacacion> objresperror { get; set; }
        /// <summary>
        /// Busqueda del listado actual de
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            string path = "";
            string narchivo = "";
            string archivo = "";
            this.objresperror = new List<tnommatrizvacacion>();
            this.objresp = new List<tnommatrizvacacion>();

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
                throw new AtlasException("NOM-001", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA " + path + ", PARA POSIBILITAR LA CARGA DEL CRONOGRAMA DE VACACIONES.");
            }

            string sheetName = "Cronograma";

            var excelFile = new ExcelQueryFactory(path);
            excelFile.WorksheetRange("A3", "D5");
            var cargavacaciondatos = from a in excelFile.Worksheet(sheetName) select a;

            List<tnommatrizvacacion> objresp = new List<tnommatrizvacacion>();
            foreach (var vacacionf in cargavacaciondatos)
            {
                string err = "";
                tnommatrizvacacion cb = new tnommatrizvacacion();
                string documento = (vacacionf[0].ToString());
                tthfuncionariodetalle fun = TthFuncionarioDal.Find(documento);

                if (fun != null)
                {
                    cb.Mdatos.Add("documento", documento);
                    cb.Mdatos.Add("nfuncionario", fun.primernombre + " " + fun.primerapellido);
                    cb.cfuncionario = fun.cfuncionario;
                    long anio = 0;
                    long.TryParse(vacacionf[1].ToString(), out anio);
                   
                    if (anio == 0)
                    {
                        err += "Ha ocurrido un error al convertir " + vacacionf[1].ToString() + " en año. ";
                    }
                    else {
                        cb.anio = anio;
                        tnomparametrodetalle par = TnomparametroDal.Find(anio);
                        if (par == null) {
                            err += "No se ha parametrizado el año: " + vacacionf[1].ToString() + " en el sistema. ";

                        }
                    }
                    
                    try
                    {
                        cb.finicio = Convert.ToDateTime(vacacionf[2].ToString());
                    } catch (Exception ex) {
                        err += "Ha ocurrido un error al convertir " + vacacionf[2].ToString() + " en Fecha inicio. Error:" + ex.Message;

                    }
                    try
                    {
                        cb.ffin = Convert.ToDateTime(vacacionf[3].ToString());
                    }
                    catch (Exception ex)
                    {
                        err += "Ha ocurrido un error al convertir  " + vacacionf[3].ToString() + " en Fecha Fin. Error: "+ ex.Message;

                    }
                    cb.Esnuevo = true;
                    cb.Actualizar = false;
                    if (!buscar(cb.cfuncionario.Value))
                    {
                        err += "Ya se ha agregado el registro con la  identificación " + documento + ". ";
                    }
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
            rqconsulta.Response.Add("CARGADATOSVACACION", this.objresp);
            rqconsulta.Response.Add("CARGADATOSVACACIONERROR", this.objresperror);


        }
        private bool buscar(long cfuncionario) {
            foreach (tnommatrizvacacion mat in this.objresp)
            {
                if (mat.cfuncionario == cfuncionario) {
                    return false;
                }
            }
                
            return true;
        }
       
    }

}
