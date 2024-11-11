using modelo;
using System;
using System.Data.SqlClient;
using util.dto.lote;
using util.servicios.ef;

namespace dal.cobranzas
{
    public class TcobCobranzaLoteDal
    {
        private static String SQL_DELETE = "delete from TCAROPERACIONLOTE where "+
            "FPROCESO = @fproceso and CLOTE = @clote and CMODULO = @cmodulo and CTAREA = @ctarea and EJECUTADA is null ";

        /// <summary>
        /// Metodo que se encarga de eliminar tareas no ejecutadas de la tabla TcarOperacionLote.
        /// </summary>
        public static void Eliminar(RequestModulo rqmodulo, String ctarea)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_DELETE, new SqlParameter("fproceso", rqmodulo.Fconatble), new SqlParameter("clote", rqmodulo.Clote)
                                                           , new SqlParameter("cmodulo", rqmodulo.Cmodulo), new SqlParameter("ctarea", ctarea));
        }
    }
}
