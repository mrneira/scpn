using core.componente;
using dal.activosfijos;
using dal.generales;
using dal.persona;
using dal.seguridades;
using LinqToExcel;
using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using util;
using util.dto.consulta;

namespace activosfijos.comp.consulta.cargas
{
    public class CargaProducto : ComponenteConsulta
    {
        private IList<tacfproductocodificado> objresp { get; set; }

        private IList<tacfproductocodificado> objresperror { get; set; }
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string path = "";
            string narchivo = "";
            string mes = "";
            string archivo = "";
            this.objresperror = new List<tacfproductocodificado>();
            this.objresp = new List<tacfproductocodificado>();

            archivo = rqconsulta.Mdatos["archivo"].ToString();
            //mes = rqconsulta.Mdatos["mescdetalle"].ToString();
            //long anio = int.Parse(rqconsulta.Mdatos["anio"].ToString());
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
                throw new AtlasException("TTH-018", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA {0}, PARA HABILITAR LA CARGA DEL ARCHIVO SELECIONADO.", path);
            }

            string sheetName = "Productos";

            var excelFile = new ExcelQueryFactory(path);

            List<tgencatalogodetalle> cat = TgenCatalogoDetalleDal.FindInDataBase();

            var cargavacaciondatos = from a in excelFile.Worksheet(sheetName) select a;
            List<secuencia> lista = new List<secuencia>();
            List<tperpersonadetalle> per = TperPersonaDetalleDal.Find(rqconsulta.Ccompania);
            IList<tsegusuariodetalle> us = TsegUsuarioDetalleDal.Find(rqconsulta.Ccompania);


            List<tacfproductocodificado> objresp = new List<tacfproductocodificado>();
            foreach (var lineaArchivo in cargavacaciondatos)
            {
                string err = "";
                tacfproductocodificado cb = new tacfproductocodificado();
                int cproducto;
                int.TryParse(lineaArchivo[3].ToString(), out cproducto);
                if (cproducto == 0)
                {
                    err += "Ha ocurrido un error al convertir " + lineaArchivo[3].ToString() + " en código de producto. ";
                }
                // int cproducto = int.Parse(lineaArchivo[1].ToString());
                
                

                tacfproducto pr = TacfProductoDal.Find(cproducto);
                if (pr != null)
                {
                    long cproductocodificado = 0;
                    long.TryParse(lineaArchivo[0].ToString(), out cproductocodificado);
                    cb.cproductocodificado=cproductocodificado;
                    cb.serial = lineaArchivo[1].ToString();
                    // cb.cbarras = lineaArchivo[2].ToString();
                    cb.cproducto = cproducto;
                    tacfproducto pb = TacfProductoDal.FindGrCodificable(cb.cproducto);
                    List<secuencia> nuevase = null;
                    int valor = 0;
                    try
                    {
                        
                        foreach (secuencia result in lista)
                        {
                            if (result.codigo.Equals(pb.codigo)) {
                                valor = result.valor;
                            }
                        }
                    }
                    catch (Exception ex) {

                    }
                    string cbarras = "";
                    int sec = 0;
                    if (valor==0)
                    {
                        sec = TacfProductoCodificadoDal.FindxCproducto(pb.codigo);
                        sec++;
                        secuencia nse = new secuencia();
                        nse.valor = sec;
                        nse.codigo = pb.codigo;
                        lista.Add(nse);
                        cbarras = pb.codigo + "." + sec;
                    }
                    else
                    {
                        sec = valor;
                        sec++;
                        cbarras = pb.codigo + "." + sec;
                        secuencia nse = new secuencia();
                        nse.valor = sec;
                        nse.codigo = pb.codigo;
                        lista.Add(nse);
                    }
                    cb.cbarras = cbarras;

                    cb.Mdatos.Add("nproducto", pr.nombre);
                    cb.estadoccatalogo = 1301;
                    cb.estadocdetalle = lineaArchivo[5].ToString();
                    tgencatalogodetalle estado = cat.Find( x => x.ccatalogo==cb.estadoccatalogo.Value && x.cdetalle.Equals(cb.estadocdetalle.Trim()));
                    if (estado != null)
                    {
                        cb.ubicacionccatalogo = 1309;
                        cb.ubicacioncdetalle = lineaArchivo[7].ToString();
                        tgencatalogodetalle ubicacion = cat.Find(x => x.ccatalogo == cb.ubicacionccatalogo.Value && x.cdetalle.Equals(cb.ubicacioncdetalle.Trim()));
                        if (ubicacion != null)
                        {
                            cb.centrocostosccatalogo = 1002;
                            cb.centrocostoscdetalle = lineaArchivo[9].ToString();
                            tgencatalogodetalle centrocosto = cat.Find(x => x.ccatalogo == cb.centrocostosccatalogo.Value && x.cdetalle.Equals(cb.centrocostoscdetalle.Trim()));
                            if (centrocosto != null)
                            {
                                cb.cingreso = 0;
                                cb.estado = 1;

                                cb.infoadicional = lineaArchivo[12].ToString();
                                decimal vunitario = 0;
                                decimal.TryParse(lineaArchivo[13].ToString(), out vunitario);
                                cb.vunitario = vunitario;
                                decimal vlibros = 0;
                                decimal.TryParse(lineaArchivo[14].ToString(), out vlibros);
                                cb.valorlibros = vlibros;
                                decimal vresidual = 0;
                                decimal.TryParse(lineaArchivo[15].ToString(), out vresidual);
                                cb.valorresidual = vresidual;
                                decimal porcentajedep = 0;
                                decimal.TryParse(lineaArchivo[16].ToString(), out porcentajedep);
                                cb.porcendepreciacion = porcentajedep;
                                int vutil = 0;
                                int.TryParse(lineaArchivo[17].ToString(), out vutil);
                                cb.vidautil = vutil;
                                cb.comentario = lineaArchivo[22].ToString();
                                cb.cusuarioing = lineaArchivo[23].ToString();
                                //cb.cusuarioasignado = lineaArchivo[24].ToString();
                                string usuario = "";
                                usuario = lineaArchivo[24].ToString();
                                string resultado = Regex.Replace(usuario, @"[^\d]", "");
                                
                                if (resultado.Length == 0)
                                {
                                    cb.cusuarioasignado = lineaArchivo[24].ToString();
                                    if (lineaArchivo[24].ToString().Equals("BODEGA") || lineaArchivo[24].ToString().Equals("CUSTODIOAF"))
                                    {
                                        usuario = lineaArchivo[24].ToString();
                                    }
                                    else {
                                        err += lineaArchivo[24].ToString() + " No pertenece a ningun usuario de bodega o activos fijos. ";

                                    }
                                }
                                else {
                                    long cpersona = 0;
                                    try {
                                        cpersona = per.Find(x => x.identificacion.Contains(lineaArchivo[24].ToString())).cpersona;
                                        //tsegusuariodetalle usuariog= us.Where(x => x.cpersona == cpersona).FirstOrDefault();
                                        usuario = cpersona.ToString();

                                    } catch (Exception ex) {
                                        cpersona = 0;
                                        err += "No se ha encontrado la persona con cédula " + lineaArchivo[24].ToString() + ". ";

                                    }


                                }
                                cb.cusuarioasignado = usuario;
                                DateTime fingreso;
                                DateTime.TryParse(lineaArchivo[25].ToString(), out fingreso);
                                cb.fingreso = fingreso;
                                cb.fmodificacion = fingreso;
                                cb.color = lineaArchivo[28].ToString();
                                bool codificable;
                                bool.TryParse(lineaArchivo[33].ToString(), out codificable);
                                cb.codificado = codificable;
                                cb.canterior = lineaArchivo[37].ToString();
                                cb.marcaccatalogo = 1302;
                                cb.marcacdetalle = lineaArchivo[40].ToString();
                                tgencatalogodetalle marca = cat.Find(x => x.ccatalogo == cb.marcaccatalogo.Value && x.cdetalle.Equals(cb.marcacdetalle.Trim()));
                                if (marca != null)
                                {
                                    cb.modelo = lineaArchivo[41].ToString();
                                    cb.estructuraccatalogo = 1310;
                                    cb.estructuracdetalle = lineaArchivo[43].ToString();
                                    tgencatalogodetalle estructura = cat.Find(x => x.ccatalogo == cb.estructuraccatalogo.Value && x.cdetalle.Equals(cb.estructuracdetalle.Trim()));
                                    if (estructura == null)
                                    {
                                        err += "No se ha encontrado la estructura con el código  " + lineaArchivo[43].ToString() + ". ";

                                    }

                                }
                                else
                                {
                                    err += "No se ha encontrado la marca con el código  " + lineaArchivo[40].ToString() + ". ";

                                }
                            }
                            else
                            {

                                err += "No se ha encontrado centro de costos con el código  " + lineaArchivo[9].ToString() + ". ";


                            }
                        }
                        else
                        {
                            err += "No se ha encontrado ubicación con el código  " + lineaArchivo[7].ToString() + ". ";

                        }



                        cb.Esnuevo = true;
                        cb.Actualizar = false;
                        cb.fingreso = rqconsulta.Freal;
                        cb.cusuarioing = rqconsulta.Cusuario;
                    }
                    else
                    {
                        err += "No se ha encontrado estado con el código  " + lineaArchivo[5].ToString() + ". ";

                    }
                }

                else
                {
                    err += "No se ha encontrado producto con el código  " + cproducto + ". ";
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
            rqconsulta.Response.Add("CARGAPRODUCTOS", this.objresp);
            rqconsulta.Response.Add("CARGAPRODUCTOSERROR", this.objresperror);


        }
       public class secuencia {
            public string codigo { get; set; }
            public int valor { get; set; }
        }

    }
}

