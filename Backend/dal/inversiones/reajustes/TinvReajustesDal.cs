using util.servicios.ef;
using modelo;
using System.Collections.Generic;
using System.Linq;
using System.Data;

namespace dal.inversiones.reajustes
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para el reajuste de inversiones.
    /// </summary>
    public class TinvReajustesDal
    {

        /// <summary>
        /// Obtiene el histórico de reajustes y actualiza la nueva tasa, dado el identificador de la inversión.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <param name="itasaNueva">Nueva tasa de la inversión.</param>
        /// <param name="ifSistema">Fecha del sistema.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> GetPeriodosTasas(long cinversion, decimal itasaNueva, int ifSistema)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_InvConReajuste";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@icinversion"] = cinversion;
            parametros["@itasaNueva"] = itasaNueva;
            parametros["@ifSistema"] = ifSistema;
            DataTable DataTable = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros,0);
            IList<Dictionary<string, object>> list = DataTable.AsEnumerable().Select(dr => {
                var dic = new Dictionary<string, object>();
                dr.ItemArray.Aggregate(-1, (int i, object v) => {
                    i += 1; dic.Add(DataTable.Columns[i].ColumnName, v);
                    return i;
                });
                return dic;
            }).ToList();

            return list;
        }


    }
}
