
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
using dal.talentohumano.nomina;


namespace talentohumano.comp.consulta.nomina
{
    public class CargaDescuentos : ComponenteConsulta
    {

        private IList<tnomdescuentopersona> objresp { get; set; }

        private IList<tnomdescuentopersona> objresperror { get; set; }
        /// <summary>
        /// Busqueda del listado actual de
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            string path = "";
            string narchivo = "";
            string mes = "";
            string archivo = "";
            this.objresperror = new List<tnomdescuentopersona>();
            this.objresp = new List<tnomdescuentopersona>();

            archivo = rqconsulta.Mdatos["archivo"].ToString();
            mes = rqconsulta.Mdatos["mescdetalle"].ToString();
            long anio = int.Parse(rqconsulta.Mdatos["anio"].ToString());
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
                throw new AtlasException("TTH-018", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA {0}, PARA HABILITAR LA CARGA DEL ARCHIVO SELECIONADO.",path);
            }

            string sheetName = "Descuentos";

            var excelFile = new ExcelQueryFactory(path);
           
            var cargavacaciondatos = from a in excelFile.Worksheet(sheetName) select a;

            List<tnomdescuentopersona> objresp = new List<tnomdescuentopersona>();
            foreach (var lineaArchivo in cargavacaciondatos)
            {
                string err = "";
                tnomdescuentopersona cb = new tnomdescuentopersona();
                string documento = (lineaArchivo[1].ToString());
                tthfuncionariodetalle fun = TthFuncionarioDal.Find(documento);
                if (fun != null)
                {
                    cb.Mdatos.Add("documento", documento);
                    cb.Mdatos.Add("nfuncionario", fun.primernombre + " " + fun.primerapellido);
                    cb.cfuncionario = fun.cfuncionario;
                    cb.mesccatalogo = 4;
                    cb.mescdetalle = mes;
                    cb.anio = anio;
                    cb.estado = true;
                    long cdescuento;
                    long.TryParse(lineaArchivo[2].ToString(), out cdescuento);
                    if (cdescuento == 0)
                    {
                        err += "Ha ocurrido un error al convertir " + lineaArchivo[2].ToString() + " en código de un descuento. ";
                    }
                    else
                    {
                        tnomdescuento d = TnomDescuentoDal.Find(cdescuento);
                        if (d == null)
                        {
                            err += "No se ha encontrado un descuento con el siguiente código " + cdescuento + ". ";
                        }
                        else {
                            cb.cdescuento = cdescuento;

                            cb.Mdatos.Add("ndescuento",d.nombre);
                        }
                    }
                    try
                    {
                        cb.valor = decimal.Parse(lineaArchivo[3].ToString());
                    }
                    catch (Exception ex)
                    {
                        err += "Ha ocurrido un error al convertir " + lineaArchivo[3].ToString() + " en un valor para descuento en el rol. ";

                    }
                   
                    cb.Esnuevo = true;
                    cb.Actualizar = false;
                    cb.fingreso = rqconsulta.Freal;
                    cb.cusuarioing = rqconsulta.Cusuario;
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
            rqconsulta.Response.Add("CARGADESCUENTOS", this.objresp);
            rqconsulta.Response.Add("CARGADESCUENTOSERROR", this.objresperror);


        }
        

    }

}
