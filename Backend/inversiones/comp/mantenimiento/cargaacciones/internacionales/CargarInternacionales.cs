
using core.componente;
using dal.generales;
using dal.inversiones.cargaacciones;
using modelo;
using System;
using System.IO;
using util;
using util.dto.mantenimiento;
using System.Collections.Generic;
using util.servicios.ef;
using Newtonsoft.Json;
using System.Linq;
using LinqToExcel;
using dal.inversiones.inversiones;
using inversiones.comp.mantenimiento.cargaacciones.vectorprecios;
using dal.inversiones.precioscierre;

namespace inversiones.comp.mantenimiento.cargaacciones.internacionales
{
    public class CargarInternacionales : ComponenteMantenimiento
    {

        private const string lstrOk = "Ok";
        
        /// <summary>
        /// Importar los precios de cierre de las acciones.
        /// </summary>
        /// <param name="rqmantenimiento">Request de mantenimiento.</param>
        /// <returns></returns>
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
                archivo = archivo.Replace("data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,", "");
                path = path + "/" + narchivo;

                try
                {
                    File.WriteAllBytes(path, Convert.FromBase64String(archivo));

                }
                catch
                {
                    throw new AtlasException("INV-0003", @"ERROR: DEBE CREAR LA SIGUIENTE RUTA 'C:\CESANTIA_APP_HOME\SUBIRARCHIVOS' EN EL DISCO 'C:\', PARA POSIBILITAR LA CARGA DEL EXTRACTO BANCARIO.");
                }


                var excelFile = new ExcelQueryFactory(path);

                var cargatabla = from a in excelFile.Worksheet(0) select a;

                List<tprecioscierre> lprecioscierre = new List<tprecioscierre>();

                long llinea = 0;

                string lstrMensaje = "";

                long llngFecha = long.Parse(rqmantenimiento.Mdatos["fecha"].ToString());

                bool controlError = false;

                clsValidar lclsValidar = new clsValidar();

                foreach (var registro in cargatabla)
                {
                    if (llinea < 2)
                    {
                        llinea++;
                        continue;
                    }
                    else if (registro[0].ToString().Trim().Length == 0)
                    {
                        break;
                    }

                    lstrMensaje = "";

                    List<tinvinversion> lInversion = TinvInversionDal.GetXCodigoTitulo(registro[4].ToString().Trim());

                    string lEmisorDetalle = "";

                    if (lInversion.Count == 0)
                    {
                        lstrMensaje = "EMISOR NO EXISTE";
                    }
                    else
                    {
                        lEmisorDetalle = lInversion[0].emisorcdetalle.Trim();
                        List<tinvprecioscierre> lPreciosCiere = TinvPreciosCierreDal.GetXEmisorFechaValoracion((int)lInversion[0].emisorccatalogo, lEmisorDetalle, (int)llngFecha);
                        if (lPreciosCiere.Count > 0) lstrMensaje = "YA SE CARGARON LOS PRECIOS PARA ESTE EMISOR EN ESTA FECHA";
                    }
                    tinvprecioscierre pc= TinvPrecioCierreDal.UltimoprecioEmisor(lEmisorDetalle);

                    decimal lpreciocierre = lclsValidar.clsValidarDecimal(registro[5].Value.ToString(), ref lstrMensaje, "Precio de Cierre", 20);

                    decimal lvalornominal = lclsValidar.clsValidarDecimal(registro[6].Value.ToString(), ref lstrMensaje, "Precio Actual", 20);

                    lprecioscierre.Add(
                        new tprecioscierre()
                        {
                            numerolinea = (int)llinea
                            ,
                            fvaloracion = (int)llngFecha
                            ,
                            mensaje = lstrMensaje
                            ,
                            nombreemisor = registro[2]
                            ,
                            ultpreciocierre = (pc == null) ? 0 : pc.preciocierre,
                            preciocierre = lpreciocierre
                            ,
                            valornominal = lvalornominal
                            ,
                            emisorcdetalle = lEmisorDetalle
                            ,
                            fultimocierre = (pc == null) ? (int)llngFecha : pc.fvaloracion,

                        });


                    if (!controlError && lstrMensaje == lstrOk) controlError = true;

                    llinea++;

                }


                rqmantenimiento.Response["lregistros"] = lprecioscierre;

            //    if (!controlError)
             //   {
              //      rqmantenimiento.Response.SetCod("000");
               //     rqmantenimiento.Response.SetMsgusu("NO SE CARGÓ NINGÚN REGISTRO");
               // }

            }
            else
            if (rqmantenimiento.Mdatos["cargaarchivo"].ToString() == "read")
            {

                long cInvPreciosCierre = TinvPreciosCierreDal.GetcInvPreciosCierreMax();

                var lregistrospreciocierre = JsonConvert.DeserializeObject<IList<tprecioscierre>>(rqmantenimiento.Mdatos["lregistros"].ToString());

                List<tinvprecioscierre> regvalidos = new List<tinvprecioscierre>();

                // dynamic array = JsonConvert.DeserializeObject(IList< tprecioscierre > rqmantenimiento.Mdatos["lregistros"].ToString());
                //bool lblPrimerRegistro = true;
                int reg = 0;
                foreach (var item in lregistrospreciocierre)
                {

                    if (item.mensaje.Length==0)
                    {
                        tinvprecioscierre tInvPreciosCierre = new tinvprecioscierre();
                        tInvPreciosCierre.cinvprecioscierre = cInvPreciosCierre;
                        tInvPreciosCierre.optlock = 0;
                        tInvPreciosCierre.fvaloracion = item.fvaloracion;
                        tInvPreciosCierre.fultimocierre = item.fultimocierre;
                        tInvPreciosCierre.emisorccatalogo = 1213;
                        tInvPreciosCierre.emisorcdetalle = item.emisorcdetalle;
                        tInvPreciosCierre.valornominal = item.valornominal;
                        tInvPreciosCierre.preciocierre = item.preciocierre;
                        tInvPreciosCierre.fingreso = DateTime.Now;
                        tInvPreciosCierre.cusuarioing = rqmantenimiento.Cusuario;
                      
                        regvalidos.Add(tInvPreciosCierre);
                        reg++;
                        cInvPreciosCierre++;
                    }



                }
                if (reg == 0)
                {
                    throw new AtlasException("INV-005", "NO EXISTEN PRECIOS DE CIERRE PARA PROCESAR EN ESTAS FECHAS O YA SE PROCESARON");

                }
                else
                {
                    //CARGANDO INFORMACIÓN PARA DATA INFORMACIÓN
                    var json = JsonConvert.SerializeObject(regvalidos);
                    rqmantenimiento.Mdatos["ldatos"] = json;

                }

            }



        }

    }

    public class tprecioscierre : tinvprecioscierre
    {
        public int numerolinea;
        public string mensaje;
        public string nombreemisor;
        public decimal ultpreciocierre;
    }

}
