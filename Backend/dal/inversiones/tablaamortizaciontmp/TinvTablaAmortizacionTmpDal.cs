using util.servicios.ef;
using modelo;
using System.Data.SqlClient;
using System.Collections.Generic;
using System.Linq;
using System.Data;


//using util.servicios.ef;
//using modelo;
//using System.Data.SqlClient;
//using System.Collections.Generic;
using System;

//using System.Linq;
using modelo.helper;
using modelo.interfaces;
//using System.Data;
using modelo.servicios;

namespace dal.inversiones.tablaamortizaciontmp
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para la tabla de amortización temporal.
    /// </summary>
    public class TinvTablaAmortizacionTmpDal
    {

        /// <summary>
        /// Construye y obtiene el temporal de los dividendos de una inversión, dado el identificador de la inversión.
        /// </summary>
        /// <param name="cinversion">Identificador de la inversión.</param>
        /// <returns>IList<Dictionary<string, object>></returns>
        public static IList<Dictionary<string, object>> GetTablaPagos(long cinversion)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_InvConTablaPagosTmp";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@icinversion"] = cinversion;
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

        private static string DEL = "delete from tinvtablaamortizaciontmp where cinversion = @cinversion ";

        /// <summary>
        /// Elimina el temporal de los dividendos de una inversión, dado el identificador de la inversión.
        /// </summary>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <returns></returns>
        public static void Delete(long icinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DEL,
                new SqlParameter("cinversion", icinversion));
        }


        private static string DELE = "delete from tinvtablaamortizaciontmp ";

        /// <summary>
        /// Elimina el temporal de los dividendos de las inversiones.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }


    }
}
