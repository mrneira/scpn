using core.componente;
using dal.activosfijos;
using modelo;
using System;
using util.dto.consulta;
using System.Collections.Generic;
using System.Globalization;

namespace activosfijos.comp.consulta.reportes
{

    public class ActaEntregaRecepcion : ComponenteConsulta
    {

        /// <summary>
        /// Metodo que entrega los datos para el acta de entrega de bienes asignados a un funcionario
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {

            DateTime fingreso = Convert.ToDateTime(rqconsulta.Mdatos["fingreso"].ToString());
            string cpersona = rqconsulta.Mdatos["cpersona"].ToString();
            //long? ckardex = rqconsulta.GetLong("ckardexprodcodi");
            string tipoDescarga = rqconsulta.Mdatos["tipodescarga"].ToString();
            string funcionario = rqconsulta.Mdatos["Funcionario"].ToString();
            tacfparametros usr = TacfParametrosDal.FindXCodigo("RPT_USR_ENC_AF_BCI", rqconsulta.Ccompania);
            tacfparametros usrTwo = TacfParametrosDal.FindXCodigo("RPT_USR_ENC_AF_BCI_TWO", rqconsulta.Ccompania);
            tacfparametros ced = TacfParametrosDal.FindXCodigo("RPT_CED_USR_ENC_AF", rqconsulta.Ccompania);
            tacfparametros cedTwo = TacfParametrosDal.FindXCodigo("RPT_CED_USR_ENC_AF_TWO", rqconsulta.Ccompania);
            tacfparametros jefadm = TacfParametrosDal.FindXCodigo("RPT_USR_VIS_BUE", rqconsulta.Ccompania);
            tacfparametros cedjefadm = TacfParametrosDal.FindXCodigo("RPT_CED_USR_VIS_BUE", rqconsulta.Ccompania);
            tacfparametros car = TacfParametrosDal.FindXCodigo("RPT_CAR_USR_VIS_BUE", rqconsulta.Ccompania);
            int enebleUser = (usr != null) ? Convert.ToInt32(usr.numero) : 0;
            int enebleUserTwo = (usrTwo != null) ? Convert.ToInt32(usrTwo.numero) : 0;
            bool multipleUsr = (enebleUser == 1 && enebleUserTwo == 1);
            string vistobueno = jefadm.texto;
            string cedulavistobueno = (cedjefadm != null) ? cedjefadm.texto : ""; ;
            string cargo = car.texto;
            string tipoArchivo = string.Empty;
            int ccompania = rqconsulta.Ccompania;

            //RNI 20240929
            switch (tipoDescarga)
            {

                case "btnpdf":
                    tipoArchivo = "pdf";
                    Dictionary<string, object> parametrosPdf = new Dictionary<string, object>();
                    if (!multipleUsr)
                    {
                        if (enebleUser == 1)
                        {
                            parametrosPdf.Add("i_uencargado", usr.texto);
                            parametrosPdf.Add("i_cedencargado", ced.texto);
                        }
                        else
                        {
                            parametrosPdf.Add("i_uencargado", usrTwo.texto);
                            parametrosPdf.Add("i_cedencargado", cedTwo.texto);
                        }
                    }
                    else
                    {
                        parametrosPdf.Add("i_uencargado", usr.texto);
                        parametrosPdf.Add("i_cedencargado", ced.texto);
                        parametrosPdf.Add("i_uencargadotwo", usrTwo.texto);
                        parametrosPdf.Add("i_cedencargadotwo", cedTwo.texto);
                    }

                    parametrosPdf.Add("i_multCust", multipleUsr);
                    parametrosPdf.Add("i_fingreso", fingreso);
                    parametrosPdf.Add("i_cpersona", cpersona);
                    parametrosPdf.Add("i_uvistobueno", vistobueno);
                    parametrosPdf.Add("i_cedjefeadmin", cedulavistobueno);
                    parametrosPdf.Add("i_carvistobueno", cargo);
                    string tipoReporte = "RptAcfActaEntregaRecepcion";

                    byte[] archivoPdf = null;
                    general.reporte.GenerarArchivo.generarArchivo("PDF", "/CesantiaReportes/ActivosFijos/", tipoReporte, " c:\\tmp\\", "ActaEntregaRecepcion", parametrosPdf, true, out archivoPdf);
                    if (archivoPdf != null)
                    {
                        rqconsulta.Response["archivoDescarga"] = archivoPdf;
                        rqconsulta.Response["nombre"] = string.Format("{0}_{1}.{2}", "", funcionario, tipoArchivo);
                    }
                    else
                    {
                        rqconsulta.Response["archivoDescarga"] = null;
                    }
                    break;
                    //    }
            }
        }
    }
}
