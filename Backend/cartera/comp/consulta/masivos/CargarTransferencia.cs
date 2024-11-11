using core.componente;
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

namespace cartera.comp.consulta.masivos {
    public class CargarTransferencia : ComponenteConsulta {

        // Variables respuesta
        decimal totalmonto = Constantes.CERO;
        int totalregistros = Constantes.CERO;

        /// <summary>
        /// Ejecuta la carga del archivo de transferencia ISSPOL
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string path = "";
            string archivo = rqconsulta.Mdatos["archivo"].ToString();
            string narchivo = rqconsulta.Mdatos["narchivo"].ToString();
            this.totalmonto = 0;
            this.totalregistros = 0;
            tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqconsulta.Ccompania);
            path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
            path = path + "/" + narchivo;

            try {
                File.WriteAllBytes(path, Convert.FromBase64String(archivo));
            }
            catch {
                throw new AtlasException("CAR-0065", "ERROR EN LA RUTA DEL ARCHIVO [{0}]", path);
            }

            string sheetName = "ISSPOL";
            var excelFile = new ExcelQueryFactory(path);
            var carga = from a in excelFile.Worksheet(sheetName) select a;

            List<tcartransferenciapersona> objresp = new List<tcartransferenciapersona>();
            foreach (var des in carga) {
                objresp.Add(this.Asignacion(des, rqconsulta.Fconatable));
            }
            rqconsulta.Response["CARGATRANSFERENCIA"] = objresp;

            // Totales de archivo
            this.Totales(rqconsulta);
        }


        /// <summary>
        /// Asigna los datos correspondientes a la entidad
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public tcartransferenciapersona Asignacion(Row descuento, int fcontable)
        {
            string identificacion = descuento[0].ToString();
            string nombre = descuento[1].ToString();
            decimal monto = decimal.Parse(descuento[2].ToString());

            tperpersonadetalle per = TperPersonaDetalleDal.FindByIdentification(identificacion);
            if (per == null) {
                throw new AtlasException("BPER-006", "PERSONA NO ENCONTRADA: {0}", nombre);
            }

            tcartransferenciapersona tpersona = new tcartransferenciapersona {
                Esnuevo = true,
                cpersona = per.cpersona,
                ccompania = per.ccompania,
                ftransferencia = fcontable,
                identificacion = identificacion,
                nombre = nombre,
                monto = monto
            };
            totalmonto = decimal.Add(totalmonto, monto);
            totalregistros = totalregistros + 1;

            return tpersona;
        }

        /// <summary>
        /// Asigna los datos correspondientes a la entidad
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public void Totales(RqConsulta rqconsulta)
        {
            Dictionary<string, object> mtotales = new Dictionary<string, object>();
            mtotales.Add("totalmonto", totalmonto);
            mtotales.Add("totalregistros", totalregistros);
            rqconsulta.Response["TOTALESCARGA"] = mtotales;
        }
    }

}
