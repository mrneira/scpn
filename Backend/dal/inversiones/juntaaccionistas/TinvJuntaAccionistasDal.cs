using modelo;
using util.servicios.ef;

namespace dal.inversiones.juntaaccionistas
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales de la tabla de las juntas de accionistas.
    /// </summary>
    public class TinvJuntaAccionistasDal
    {
        private static string DELE = "delete from tinvjuntaaccionistas";

        /// <summary>
        /// Elimna la tabla de junta de accionistas.
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
