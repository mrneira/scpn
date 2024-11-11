using core.componente;
using dal.cartera;
using dal.generales;
using dal.persona;
using LinqToExcel;
using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using util;
using util.dto.consulta;

namespace cartera.comp.consulta.descuentos {
    public class ConsultaDescuentos : ComponenteConsulta {

        /// <summary>
        /// Ejecuta la carga de archivos de descuentos
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string path = "";
            string archivo = rqconsulta.Mdatos["archivo"].ToString();
            string narchivo = rqconsulta.Mdatos["narchivo"].ToString();

            tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqconsulta.Ccompania);
            path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
            path = path + "/" + narchivo;

            try {
                File.WriteAllBytes(path, Convert.FromBase64String(archivo));
            }
            catch {
                throw new AtlasException("CAR-0065", "ERROR EN LA RUTA DEL ARCHIVO DE DESCUENTOS [{0}]", path);
            }

            string sheetName = "DESCUENTOS";
            var excelFile = new ExcelQueryFactory(path);
            var carga = from a in excelFile.Worksheet(sheetName) select a;

            List<tcardescuentosdetalle> objresp = new List<tcardescuentosdetalle>();
            foreach (var des in carga) {
                objresp.Add(Asignacion(des, rqconsulta));
            }
            rqconsulta.Response["CARGADESCUENTOS"] = objresp;

        }


        /// <summary>
        /// Asigna los datos correspondientes a la entidad
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public tcardescuentosdetalle Asignacion(Row descuento, RqConsulta rqconsulta)
        {
            tcardescuentosdetalle descuentodetalle = new tcardescuentosdetalle();
            tperpersonadetalle per = TperPersonaDetalleDal.FindByIdentification(descuento[2].ToString());
            tcardescuentosdetalle des = TcarDescuentosDetalleDal.Find(int.Parse(rqconsulta.GetDatos("particion").ToString()),
                                                                      descuento[0].ToString(),
                                                                      (int)per.cpersona,
                                                                      rqconsulta.GetDatos("tipoarchivo").ToString());

            descuentodetalle = des;
            descuentodetalle.frespuesta = rqconsulta.Fconatable;
            descuentodetalle.montorespuesta = decimal.Parse(descuento[3].ToString());
            descuentodetalle.AddDatos("npersona", per.nombre);
            descuentodetalle.AddDatos("ntipopersona", TcarRelacionPersonaDal.Find((int)des.crelacion).nombre);
            descuentodetalle.AddDatos("montodiferencia", des.monto - des.montorespuesta);

            return descuentodetalle;
        }
    }

}
