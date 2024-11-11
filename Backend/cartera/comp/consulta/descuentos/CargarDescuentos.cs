using core.componente;
using dal.cartera;
using dal.generales;
using dal.persona;
using general.archivos.bulkinsert;
using LinqToExcel;
using modelo;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using util;
using util.dto.consulta;

namespace cartera.comp.consulta.descuentos {
    public class CargarDescuentos : ComponenteConsulta {

        // Variables respuesta
        int CCATALOGO_ARCHIVOS = 704;
        decimal montorespuesta = Constantes.CERO;
        decimal registrosrespuesta = Constantes.CERO;

        /// <summary>
        /// Ejecuta la carga de archivos de descuentos
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string path = "";
            int particion = int.Parse(rqconsulta.GetDatos("particion").ToString());
            string archivo = rqconsulta.Mdatos["archivo"].ToString();
            string narchivo = rqconsulta.Mdatos["narchivo"].ToString();
            string tarchivo = rqconsulta.Mdatos["tipoarchivo"].ToString();
            this.montorespuesta = 0;
            this.registrosrespuesta = 0;
            // Elimina carga previa
            TcarDescuentosCargaDal.Eliminar(particion, tarchivo);

            // Lectura de archivo
            tgenparametros param = TgenParametrosDal.Find("RUTA_CARGA_ARCHIVOS", rqconsulta.Ccompania);
            path = FUtil.ReemplazarVariablesAmbiente(param.texto, "CESANTIA_APP_HOME");
            path = path + "/" + narchivo;

            try {
                File.WriteAllBytes(path, Convert.FromBase64String(archivo));
            }
            catch {
                throw new AtlasException("CAR-0065", "ERROR EN LA RUTA DEL ARCHIVO [{0}]", path);
            }

            string sheetName = "DESCUENTOS";
            var excelFile = new ExcelQueryFactory(path);
            var carga = from a in excelFile.Worksheet(sheetName) select a;

            List<tcardescuentoscarga> lcarga = new List<tcardescuentoscarga>();
            foreach (var des in carga) {
                lcarga.Add(Asignacion(des, rqconsulta.Fconatable, particion, tarchivo));

                // Totales
                montorespuesta = montorespuesta + decimal.Parse(des[2].ToString());
                registrosrespuesta = registrosrespuesta + 1;
            }
            BulkInsertHelper.Grabar(lcarga, "tcardescuentoscarga");

            // Totales de archivo
            Totales(rqconsulta, particion, tarchivo);
        }


        /// <summary>
        /// Asigna los datos correspondientes a la entidad
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public tcardescuentoscarga Asignacion(Row descuento, int fcontable, int particion, string tarchivo)
        {
            string identificacion = descuento[1].ToString().Trim();
            tperpersonadetalle per = TperPersonaDetalleDal.FindByIdentification(identificacion);
            if (per == null) {
                throw new AtlasException("BPER-007", "PERSONA NO DEFINIDA EN TPERPERSONDETAIL IDENTIFICACIÓN: {0}", identificacion);
            }

            tcardescuentoscarga obj = new tcardescuentoscarga();
            obj.Esnuevo = true;
            obj.identificacion = per.identificacion;
            obj.nombre = descuento[0].ToString().Trim();
            obj.monto = Math.Round(decimal.Parse(descuento[2].ToString()), 2, MidpointRounding.AwayFromZero);
            obj.archivoinstitucioncodigo = CCATALOGO_ARCHIVOS;
            obj.archivoinstituciondetalle = tarchivo;
            obj.fcarga = fcontable;
            obj.particion = particion;
            obj.cpersona = per.cpersona;
            if (descuento.Count >= 4) {
                obj.cproductoarchivo = int.Parse(descuento[3].ToString());
            } else {
                obj.cproductoarchivo = Constantes.CERO;
            }

            return obj;
        }

        /// <summary>
        /// Asigna los datos correspondientes a la entidad
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public void Totales(RqConsulta rqconsulta, int particion, string tarchivo)
        {
            List<Dictionary<string, object>> ltotales = new List<Dictionary<string, object>>();
            Dictionary<string, object> mtotales = new Dictionary<string, object>();
            mtotales = new Dictionary<string, object>();
            mtotales.Add("tipo", "ARCHIVO RESPUESTA");
            mtotales.Add("monto", montorespuesta);
            mtotales.Add("registros", registrosrespuesta);
            ltotales.Add(mtotales);

            rqconsulta.Response["TOTALESCARGA"] = ltotales;
        }
    }

}
