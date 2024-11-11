using core.componente;
using dal.contabilidad;

using System.Collections.Generic;
using util.dto.consulta;

namespace organismosdecontrol.comp.consulta.cartera{

    public class Operaciones : ComponenteConsulta {

        /// <summary>
        /// Metodo que entrega consuta de operaciones de cartera.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la consulta.</param>
        public override void Ejecutar(RqConsulta rqconsulta) {
            string codigoconsulta = rqconsulta.Mdatos["CODIGOCONSULTA"].ToString();
            string storeprocedure = rqconsulta.Mdatos["storeprocedure"].ToString();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            foreach (var pair in rqconsulta.Mdatos) {
                if (pair.Key.Contains("parametro_")) {
                    parametros[pair.Key.Replace("parametro_","@")] = pair.Value;
                }
            }
            rqconsulta.Response[codigoconsulta] = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros); ;
        }
    }
}
