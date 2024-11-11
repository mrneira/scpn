using System.Linq;
using util.servicios.ef;
using modelo;
using modelo.helper;
using System.Data;
using System.Data.SqlClient;


namespace dal.inversiones.ventaacciones
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales para la venta de acciones.
    /// </summary>
    public class TinvVentaAccionesDal
    {

        private static string DEL = "delete from tinvventaacciones where cinversion = @cinversion ";

        /// <summary>
        /// Elimina la venta de acciones de una inversión, dado el identificador de la inversión.
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


        private static string DELE = "delete from tinvventaacciones";

        /// <summary>
        /// Elimina la venta de todas las acciones de una inversión.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }

        /// <summary>
        /// Obtiene una definición de una venta de acciones de una inversión, dado su identificador.
        /// </summary>
        /// <param name="cinvventaaccion">Identificador de la venta de la acción.</param>
        /// <returns>tinvventaacciones</returns>
        public static tinvventaacciones Find(long cinvventaaccion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvventaacciones obj;
            obj = contexto.tinvventaacciones.Where(x => x.cinvventaaccion.Equals(cinvventaaccion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }


        private static string UPDESTADO = "update tinvventaacciones set estadocdetalle = @estadocdetalle where cinvventaaccion in (SELECT distinct cinvventaaccion FROM tinvcontabilizacion"
            + " where ccomprobante = @ccomprobante "
            + " and ccompania = @ccompania "
            + " and fcontable = @fcontable )";

        /// <summary>
        /// Actualiza el estado de una definición de una venta de acciones de una inversión, dado el comprobante contable.
        /// </summary>
        /// <param name="iccomprobante">Identificador del comprobante contable.</param>
        /// <param name="ifcontable">Fecha del comprobante contable.</param>
        /// <param name="iccompania">Identificador de la compañía.</param>
        /// <param name="iestadocdetalle">Identificador del nuevo estado de la venta de acciones.</param>
        /// <returns></returns>
        public void UpdateEstado(string iccomprobante, int ifcontable, int iccompania, string iestadocdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                UPDESTADO,
                new SqlParameter("@estadocdetalle ", iestadocdetalle),
                new SqlParameter("@ccomprobante", iccomprobante),
                new SqlParameter("@ccompania", iccompania),
                new SqlParameter("@fcontable", ifcontable));
        }


    }
}
