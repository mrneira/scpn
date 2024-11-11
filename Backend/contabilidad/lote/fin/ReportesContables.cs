using contabilidad.saldo;
using dal.contabilidad;
using dal.generales;
using dal.lote;
using dal.lote.contabilidad;
using general.comp.mantenimiento.reporte;
using general.reporte;
using modelo;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using util;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace contabilidad.lote.fin
{
    /// <summary>
    /// Clase que se encarga de obtener registros de contabilidad a generar comprobantes y los inserta en TconRegistroLote.
    /// </summary>
    public class ReportesContables : ITareaFin
    {
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            byte[] archivo = null;
            string fechadia = requestmodulo.Fconatble.ToString();
            //IList<tgencatalogodetalle> ldetalle = TgenCatalogoDetalleDal.Find(1001);
            
            //tgenparametros UrlServidor = TgenParametrosDal.Find("SRV_RS", requestmodulo.Ccompania);
            //tgenparametros User = TgenParametrosDal.Find("SRV_USER", requestmodulo.Ccompania);
            //tgenparametrosseguridad Pass = TgenParametrosSeguridadDal.Find("SRV_PASS", requestmodulo.Ccompania);
            //tgenparametros Dom = TgenParametrosDal.Find("SRV_DOM", requestmodulo.Ccompania);
            //tgenparametros rutaArchivosServidor = TgenParametrosDal.Find("RUTA_ARCHIVOS_SERVIDOR", requestmodulo.Ccompania);
            //ReporteBase onjReporte;

            //foreach (tgencatalogodetalle item in ldetalle) {
            //    onjReporte = new ReporteBase();
            //    int maxnivel = TconCatalogoDal.MaximoNivelUsado(item.cdetalle);
            //    Dictionary<string, object> parametros = new Dictionary<string, object>();

            //    parametros.Add("@i_anioactual", Fecha.GetAnio(requestmodulo.Fconatble));
            //    parametros.Add("@i_mesactual", Fecha.GetMes(requestmodulo.Fconatble));
            //    parametros.Add("@i_anio", Fecha.GetAnio(requestmodulo.Fconatble));
            //    parametros.Add("@i_mes", Fecha.GetMes(requestmodulo.Fconatble));
            //    parametros.Add("@i_nivel", maxnivel);
            //    parametros.Add("@i_tipoplancdetalle", item.cdetalle);
            //    parametros.Add("@i_consaldo",true);
            //    parametros.Add("@i_notabalance", false);
            //    parametros.Add("archivoReporteUrl", "/CesantiaReportes/Contabilidad/rptConBalanceGeneralModelo2");
            //    parametros.Add("urlServidor", UrlServidor.texto.ToString());
            //    parametros.Add("user", User.texto.ToString());
            //    parametros.Add("pass", EncriptarParametros.Desencriptar(Pass.texto.ToString()));
            //    parametros.Add("dom", Dom.texto.ToString());
            //    parametros.Add("formatoexportar", "xls");
            //    archivo = onjReporte.ReporteByte(parametros);
            //    Directory.CreateDirectory(rutaArchivosServidor.texto);
            //    FileStream stream = File.Create(rutaArchivosServidor.texto + "BalanceGeneral_" + item.cdetalle + "_" + fechadia + ".xls", archivo.Length);
            //    stream.Write(archivo, 0, archivo.Length);
            //    stream.Close();
            //}

            //foreach (tgencatalogodetalle item in ldetalle) {
            //    onjReporte = new ReporteBase();
            //    int maxnivel = TconCatalogoDal.MaximoNivelUsado(item.cdetalle);
            //    Dictionary<string, object> parametros = new Dictionary<string, object>();


            //    //this.jasper.parametros['@i_tipoplancdetalle'] = this.mcampos.tipoplancuenta;
            //    //this.jasper.parametros['@i_nivel'] = this.mcampos.nivel;
            //    //this.jasper.parametros['@i_consaldo'] = this.consaldo === 'consaldo' ? true : false;
            //    //this.jasper.parametros['@i_notabalance'] = this.connotas === 'connotas' ? true : false;
            //    //this.jasper.parametros['@i_anio'] = this.mcampos.anio;
            //    //this.jasper.parametros['@i_mes'] = this.mesactual;
            //    //this.jasper.parametros['archivoReporteUrl'] = '/CesantiaReportes/Contabilidad/rptConEstadoDeResultadosAcumulado';

            //    //parametros.Add("@i_anioactual", Fecha.GetAnio(requestmodulo.Fconatble));
            //    //parametros.Add("@i_mesactual", Fecha.GetMes(requestmodulo.Fconatble));
            //    parametros.Add("@i_anio", Fecha.GetAnio(requestmodulo.Fconatble));
            //    parametros.Add("@i_mes", Fecha.GetMes(requestmodulo.Fconatble));
            //    parametros.Add("@i_nivel", maxnivel);
            //    parametros.Add("@i_tipoplancdetalle", item.cdetalle);
            //    parametros.Add("@i_consaldo", true);
            //    parametros.Add("@i_notabalance", false);
            //    parametros.Add("archivoReporteUrl", "/CesantiaReportes/Contabilidad/rptConEstadoDeResultadosAcumulado");
            //    parametros.Add("urlServidor", UrlServidor.texto.ToString());
            //    parametros.Add("user", User.texto.ToString());
            //    parametros.Add("pass", EncriptarParametros.Desencriptar(Pass.texto.ToString()));
            //    parametros.Add("dom", Dom.texto.ToString());
            //    parametros.Add("formatoexportar", "xls");
            //    archivo = onjReporte.ReporteByte(parametros);
            //    FileStream stream = File.Create(rutaArchivosServidor.texto + "EstadoResultadosAcumulado_" + item.cdetalle + "_" + fechadia + ".xls", archivo.Length);
            //    stream.Write(archivo, 0, archivo.Length);
            //    stream.Close();
            //}

            GenerarHistoricoPortafolio(requestmodulo.Fconatble);
            GenerarHistorialRendimientoPortafolio(requestmodulo.Fconatble,requestmodulo.Cusuario);
            GenerarHistoricoPortafolioRentaVariable(requestmodulo.Fconatble);


        }

        public static void GenerarHistoricoPortafolio(int fcontable) {

            string storeprocedure = "sp_InvRptResumenRentaFijaContabilidad";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fvaloracion "] = fcontable;
            dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);

        }

        public static void GenerarHistorialRendimientoPortafolio(int fcontable,string cusuario)
        {

            string storeprocedure = "sp_InvPortafoliorendimiento";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fproceso "] = fcontable;
            parametros["@cusuario "] = cusuario;
            dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);

        }

        public static void GenerarHistoricoPortafolioRentaVariable(int fcontable)
        {

            string storeprocedure = "sp_InvRptResumenRentaVariableHistorico";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fvaloracion "] = fcontable;
            parametros["@valorMercado "] = 0;
            dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros, 0);

        }
    }
}