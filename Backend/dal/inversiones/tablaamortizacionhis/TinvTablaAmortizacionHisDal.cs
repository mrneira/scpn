using modelo;
using util.servicios.ef;
using System.Data.SqlClient;

namespace dal.inversiones.tablaamortizacionhis
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para el el histórico de las tablas de amortización.
    /// </summary>
    public class TinvTablaAmortizacionHisDal
    {
        private static string DEL = "delete from tinvtablaamortizacionhis where cinversionhis in (select cinversionhis from tinvinversionhis where cinversion = @cinversion) ";

        /// <summary>
        /// Elimina el histórico de los dividendos de una inversión, dado el identificador de la inversión.
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


        private static string DELHIS = "delete from tinvtablaamortizacionhis where cinversionhis = @cinversionhis ";

        /// <summary>
        /// Elimina el histórico de los dividendos de una inversión, dado su identificador.
        /// </summary>
        /// <param name="icinversionhis">Identificador del dividendo histórico.</param>
        /// <returns></returns>
        public static void DeleteHis(long icinversionhis)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELHIS,
                new SqlParameter("cinversionhis", icinversionhis));
        }

        private static string DELE = "delete from tinvtablaamortizacionhis";

        /// <summary>
        /// Elimina el histórico de los dividendos de las inversiones.
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
