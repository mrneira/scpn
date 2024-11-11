using modelo;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using util.servicios.ef;

namespace dal.storeprocedure
{
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgenCatalogo.
    /// </summary>

    public class StoreProcedureDal
    {
        public static DataTable GetDataTable(string storeprocedure, Dictionary<string, object> parametros, int? icmdTimeOut = 0)
        { //NCH 20221109

            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            var table = new DataTable();
            storeprocedure += " ";
            using (var ctx = new AtlasContexto())
            {
                var cmd = ctx.Database.Connection.CreateCommand();

                if (icmdTimeOut != null) cmd.CommandTimeout = icmdTimeOut.Value;

                var sqlparam = new SqlParameter[parametros.Count];
                foreach (string key in parametros.Keys)
                {
                    cmd.Parameters.Add(new SqlParameter(key, parametros[key]));
                    storeprocedure += " " + key + ",";
                }
                storeprocedure = storeprocedure.Substring(0, storeprocedure.Length - 1);
                cmd.CommandText = storeprocedure;
                cmd.Connection.Open();
                table.Load(cmd.ExecuteReader());
            }

            return table;
        }

    }
}
