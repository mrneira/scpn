using modelo;
using util.servicios.ef;

namespace dal.inversiones.registrodividendo
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para el registro de dividendos.
    /// </summary>
    public class TinvRegistroDividendoDal
    {

        private static string DELE = "delete from tinvregistrodividendo";

        /// <summary>
        /// Elimina el registro de dividendos.
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
