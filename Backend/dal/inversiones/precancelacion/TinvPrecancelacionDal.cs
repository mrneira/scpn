using System.Linq;
using util.servicios.ef;
using modelo;
using modelo.helper;
using System.Data;
using System.Data.SqlClient;

namespace dal.inversiones.precancelacion
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para la precancelación de inversiones.
    /// </summary>
    public class TinvPrecancelacionDal
    {
        /// <summary>
        /// Obtiene una definición de la precancelación, dado su identificador.
        /// </summary>
        /// <param name="cinvprecancelacion">Identificador la precancelación.</param>
        /// <returns>tinvprecancelacion</returns>
        public static tinvprecancelacion Find(long cinvprecancelacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvprecancelacion obj;
            obj = contexto.tinvprecancelacion.Where(x => x.cinvprecancelacion.Equals(cinvprecancelacion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        private static string UPDESTADO = "update tinvprecancelacion set estadocdetalle = @estadocdetalle , cusuariomod = @cusuariomod , fmodificacion = getdate()  where cinvprecancelacion in (SELECT distinct cinvprecancelacion FROM tinvcontabilizacion"
            + " where ccomprobante = @ccomprobante )";

        /// <summary>
        /// Actualiza el estado de una precancelación, dado el comprobante contable.
        /// </summary>
        /// <param name="iccomprobante">Identificador del comprobente contable.</param>
        /// <param name="iestadocdetalle">Nuevo estado de la precancelación.</param>
        /// <param name="icusuariomod">Identificador del usuario que realiza el proceso.</param>
        /// <returns></returns>
        public void UpdateEstado(string iccomprobante, string iestadocdetalle, string icusuariomod)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                UPDESTADO,
                new SqlParameter("@estadocdetalle", iestadocdetalle),
                new SqlParameter("@cusuariomod", icusuariomod),
                new SqlParameter("@ccomprobante", iccomprobante));
        }


        private static string UpdEstPorId = "update tinvprecancelacion set estadocdetalle = @estadocdetalle , cusuariomod = @cusuariomod , fmodificacion = getdate() where cinvprecancelacion = @cinvprecancelacion ";

        /// <summary>
        /// Actualiza el estado de una precancelación, dado su identificador.
        /// </summary>
        /// <param name="iestadocdetalle">Nuevo estado de la precancelación.</param>
        /// <param name="icinvprecancelacion">Identificador de la precancelación.</param>
        /// <param name="icusuariomod">Identificador del usuario que ejecuta el proceso.</param>
        /// <returns></returns>
        public void UpdateEstadoPorCinvprecancelacion(string iestadocdetalle, long icinvprecancelacion, string icusuariomod)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                UpdEstPorId,
                new SqlParameter("@estadocdetalle", iestadocdetalle),
                new SqlParameter("@cusuariomod", icusuariomod),
                new SqlParameter("@cinvprecancelacion", icinvprecancelacion));
        }


        /// <summary>
        /// Elimina la tabla de precancelaciones.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                "delete tinvprecancelacion");
        }
    }
}
