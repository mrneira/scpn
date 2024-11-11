using util.servicios.ef;
using modelo;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Data;


namespace dal.inversiones.reverso
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para el vererso contable.
    /// </summary>
    public class TinvReversoDal
    {

        /// <summary>
        /// Ejecuta el reverso de un reajuste, por identificador del comprobante contable.
        /// </summary>
        /// <param name="ccomprobante">Identificador del comprobante contable.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> ReversoReajustes(string ccomprobante)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_InvConReverso";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@iccomprobante"] = ccomprobante;
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
