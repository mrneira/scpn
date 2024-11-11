using System.Linq;
using util.servicios.ef;
using modelo;
using modelo.helper;
using System.Data;
using System.Data.SqlClient;


namespace dal.inversiones.inversionrentavariable
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales de la tabla de inversiones de renta variable.
    /// </summary>
    public class TinvInversionRentaVariableDal
    {

        private static string DEL = "delete from tinvinversionrentavariable where cinversion = @cinversion ";

        /// <summary>
        /// Elimina el detalle de inversiones de renta variable, dado el identificador de la inversión.
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


        private static string DELE = "delete from tinvinversionrentavariable";

        /// <summary>
        /// Elimina el detalle de inversiones de renta variable.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }

        /// <summary>
        /// Obtener el detalle de inversiones de renta variable, dado su identificador.
        /// </summary>
        /// <param name="cinversionrentavariable">Identificador del detalle de la inversión de renta variable.</param>
        /// <returns>tinvinversionrentavariable</returns>
        public static tinvinversionrentavariable Find(long cinversionrentavariable)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvinversionrentavariable obj;
            obj = contexto.tinvinversionrentavariable.Where(x => x.cinversionrentavariable.Equals(cinversionrentavariable)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

    }
}
