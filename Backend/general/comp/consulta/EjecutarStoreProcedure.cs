using core.componente;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using util.dto.consulta;
using System.Web.Script.Serialization;
using modelo.interfaces;

namespace general.comp.consulta {

    public class EjecutarStoreProcedure : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega la cabecera y detalle de un comprobante contable.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta)
        {
            string codigoconsulta = rqconsulta.Mdatos["CODIGOCONSULTA"].ToString();
            string storeprocedure = rqconsulta.Mdatos["storeprocedure"].ToString();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            foreach (var pair in rqconsulta.Mdatos) {
                if (pair.Key.Contains("parametro_")) {
                    parametros[pair.Key.Replace("parametro_", "@")] = pair.Value;
                }
            }

            DataTable dt = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros);
            var rows = dt.AsEnumerable()
                .Select(r => r.Table.Columns.Cast<DataColumn>()
                .Select(c => new KeyValuePair<string, object>(c.ColumnName, r[c.Ordinal]))
                .ToDictionary(z => z.Key, z => z.Value)).ToList();

            List<object> lresp = new List<object>();
            foreach (var row in rows) {
                Dictionary<string, object> data = new Dictionary<string, object>();
                Dictionary<string, object> mdatos = new Dictionary<string, object>();

                foreach (var pair in row) {
                    if (pair.Key.Equals("mdatos")) {
                        continue;
                    }
                    if (pair.Key.Contains("mdatos.")) {
                        mdatos.Add(pair.Key.Replace("mdatos.", ""), pair.Value);
                    } else {
                        data.Add(pair.Key, pair.Value);
                    }
                }
                data.Add("mdatos", mdatos);
                data.Add("actualizar", false);
                data.Add("esnuevo", false);
                lresp.Add(data);
            }
            rqconsulta.Response[codigoconsulta] = lresp;
        }
    }
}
