using modelo;
using util.servicios.ef;
using System.Data.SqlClient;

namespace dal.inversiones.vectorprecios
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para vector de precios.
    /// </summary>
    public class TinvInvVectorPreciosDal
    {

        private static string DEL = "delete from tinvvectorprecios where cinversion = @cinversion ";

        /// <summary>
        /// Elimina el vector de precios de una inversión, dado el identificador de la inversión.
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


        private static string DELE = "delete from tinvvectorprecios";

        /// <summary>
        /// Elimina todos los registros del vector de precios.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }

        private static string DELEANIO = "delete from tinvvectorprecios where fvaloracion between @fechaini and @fechafin ";

        /// <summary>
        /// Elimina los registros del vector de precios, por año.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAnio(int ianio)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            string lstrAnioini = ianio.ToString().Trim() + "0000";
            string lstrAniofin = ianio.ToString().Trim() + "9999";

            contexto.Database.ExecuteSqlCommand(
                DELEANIO,
                new SqlParameter("fechaini", int.Parse(lstrAnioini)),
                new SqlParameter("fechafin", int.Parse(lstrAniofin)));
        }



    }
}
