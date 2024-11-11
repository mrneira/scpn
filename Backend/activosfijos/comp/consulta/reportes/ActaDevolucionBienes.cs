using core.componente;
using dal.activosfijos;
using modelo;
using System;
using util.dto.consulta;
using System.Collections.Generic;

namespace activosfijos.comp.consulta.reportes
{

    public class ActaDevolucionBienes : ComponenteConsulta
    {

        /// <summary>
        /// Metodo que entrega los datos para el acta de devolucion de bienes entregados a un funcionario
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
          
                string ingreso = rqconsulta.Mdatos["cingreso"].ToString();
                string cpersona = rqconsulta.Mdatos["cpersona"].ToString();
                string tipoDescarga = rqconsulta.Mdatos["tipodescarga"].ToString();
                string funcionario = rqconsulta.Mdatos["UsuarioDevuelve"].ToString();
                tacfparametros usr = TacfParametrosDal.FindXCodigo("RPT_USR_ENC_AF_BCI", rqconsulta.Ccompania);
                tacfparametros ced = TacfParametrosDal.FindXCodigo("RPT_CED_USR_ENC_AF", rqconsulta.Ccompania);
                tacfparametros jefadm = TacfParametrosDal.FindXCodigo("RPT_USR_VIS_BUE", rqconsulta.Ccompania);
                tacfparametros car = TacfParametrosDal.FindXCodigo("RPT_CAR_USR_VIS_BUE", rqconsulta.Ccompania);

                tacfparametros usrdevolucion = TacfParametrosDal.FindXCodigo("RPT_USR_RECIBE_DEVO", rqconsulta.Ccompania);
                tacfparametros cardevolucion = TacfParametrosDal.FindXCodigo("RPT_CAR_USR_REC_DEV", rqconsulta.Ccompania);
                tacfparametros ceddevolucion = TacfParametrosDal.FindXCodigo("RPT_CED_USR_RECI_DEV", rqconsulta.Ccompania);
                tacfparametros depdevolucion = TacfParametrosDal.FindXCodigo("RPT_DEP_USR_REC_DEV", rqconsulta.Ccompania);

                string uencargado = usr.texto;
                string cedula = ced.texto;
                string vistobueno = jefadm.texto;
                string cargovistobueno = car.texto;

                string userdevolucion = usrdevolucion.texto;
                string cargodevolucion = cardevolucion.texto;
                string ceduladevolucion = ceddevolucion.texto;
                string departamentodevolucion = depdevolucion.texto;
                

                int ccompania = rqconsulta.Ccompania;
                string tipoArchivo = string.Empty;
                switch (tipoDescarga)
                {
                    
                    case "btnpdf":
                        tipoArchivo = "pdf";
                        Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
                        parametrosPdf.Add("i_cingreso", ingreso);
                        parametrosPdf.Add("i_cpersona", cpersona);
                        parametrosPdf.Add("i_uencargado", uencargado);
                        parametrosPdf.Add("i_cedencargado", cedula);
                        parametrosPdf.Add("i_uvistobueno", vistobueno);
                        parametrosPdf.Add("i_carvistobueno", cargovistobueno);

                        parametrosPdf.Add("i_urecidevolu", userdevolucion);
                        parametrosPdf.Add("i_ucargorecibdevolu", cargodevolucion);
                        parametrosPdf.Add("i_udeprecibdevolu", departamentodevolucion);
                        parametrosPdf.Add("i_ucedrecibdevolu", ceduladevolucion);
                        string tipoReporte = "RptAcfActaDevolucionBienes";

                        byte[] archivoPdf = null;
                        general.reporte.GenerarArchivo.generarArchivo("PDF", "/CesantiaReportes/ActivosFijos/", tipoReporte, " c:\\tmp\\", "ActaDevolucionBienes", parametrosPdf, true, out archivoPdf);
                        if (archivoPdf != null)
                        {
                            rqconsulta.Response["archivoDescarga"] = archivoPdf;
                            rqconsulta.Response["nombre"] = string.Format("{0}_{1}.{2}", ingreso, funcionario, tipoArchivo);
                        }
                        else
                        {
                            rqconsulta.Response["archivoDescarga"] = null;
                        }
                        break;
                case "btnxls":
                    tipoArchivo = "xls";
                    Dictionary<string, object> parametrosXls = new Dictionary<string, object>();
                    parametrosXls.Add("i_cingreso", ingreso);
                    parametrosXls.Add("i_cpersona", cpersona);
                    parametrosXls.Add("i_uencargado", uencargado);
                    parametrosXls.Add("i_cedencargado", cedula);
                    parametrosXls.Add("i_uvistobueno", vistobueno);
                    parametrosXls.Add("i_carvistobueno", cargovistobueno);

                    parametrosXls.Add("i_urecidevolu", userdevolucion);
                    parametrosXls.Add("i_ucargorecibdevolu", cargodevolucion);
                    parametrosXls.Add("i_udeprecibdevolu", departamentodevolucion);
                    parametrosXls.Add("i_ucedrecibdevolu", ceduladevolucion);
                    string tipoReporte2 = "RptAcfActaDevolucionBienes";

                    byte[] archivoXls = null;
                    general.reporte.GenerarArchivo.generarArchivo("EXCEL", "/CesantiaReportes/ActivosFijos/", tipoReporte2, " c:\\tmp\\", "ActaDevolucionBienes", parametrosXls, true, out archivoXls);
                    if (archivoXls != null)
                    {
                        rqconsulta.Response["archivoDescarga"] = archivoXls;
                        rqconsulta.Response["nombre"] = string.Format("{0}_{1}.{2}", ingreso, funcionario, tipoArchivo);
                    }
                    else
                    {
                        rqconsulta.Response["archivoDescarga"] = null;
                    }
                    break;


            }
        }
    }
}
