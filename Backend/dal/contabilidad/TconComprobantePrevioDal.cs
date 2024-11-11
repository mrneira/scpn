using modelo;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.contabilidad {

    public class TconComprobantePrevioDal {

        /// <summary>
        /// Entrega una lista de registros de TconComprobantePrevio.
        /// </summary>
        /// <param name="rqoperacion">Objeto que contine informacion del registro que esta ejecutando en el lote.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="cagencia">Codigo de agencia.</param>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="ctransaccion">Codigo de transaccion.</param>
        /// <returns></returns>
        public static List<tconcomprobanteprevio> Find(RequestOperacion rqoperacion, 
            int ccompania, int csucursal, int cagencia, int cmodulo, int ctransaccion, int cproducto, int ctipoproducto) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconcomprobanteprevio> lista = new List<tconcomprobanteprevio>();
            int particion = Constantes.GetParticion(rqoperacion.Fconatble.Value);
            try {
                lista = contexto.tconcomprobanteprevio.Where(x => x.fcontable == rqoperacion.Fconatble &&
                                                                    x.particion == particion &&
                                                                    x.ccompania == ccompania &&
                                                                    x.cagencia == cagencia &&
                                                                    x.csucursal == csucursal &&
                                                                    x.ctransaccion == ctransaccion &&
                                                                    x.cmodulo == cmodulo &&
                                                                    x.cproducto == cproducto &&
                                                                    x.ctipoproducto == ctipoproducto).ToList();

            } catch (System.InvalidOperationException) {
                throw;
            }
            return lista;
        }

        private static string SQL_DELETE = "delete from TconComprobantePrevio where fcontable >= @fcontable and cregistro is null";
        /// <summary>
        /// Elimina registros de TconComprobantePrevio, para evitar erroes en los reproceso.
        /// </summary>
        /// <param name="fcontabledesde"></param>
        public static void Eliminar(int fcontabledesde) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_DELETE, new SqlParameter("@fcontable", fcontabledesde));
            } catch (System.InvalidOperationException) {

            }
        }


        private static string SQL_UPDATE = " update TconComprobantePrevio set cregistro = @cregistro where fcontable >= @fcontable and " +
                                            " particion = @particion and " +
                                            " ccompania = @ccompania and " +
                                            " csucursal = @csucursal and " +
                                            " cagencia = @cagencia and " +
                                            " ctransaccion = @ctransaccion and " +
                                            " cmodulo = @cmodulo and " +
                                            " cmoduloproducto = @cmoduloproducto and " +
                                            " cproducto = @cproducto and " +
                                            " ctipoproducto = @ctipoproducto";
        /// <summary>
        /// Elimina registros de TconComprobantePrevio, para evitar erroes en los reproceso.
        /// </summary>
        public static void ActualizarCregistroEnComprobantePrevio(int ccompania, int csucursal, int cagencia, int cmodulo, 
                int ctransaccion, int cmoduloproducto, int cproducto, int ctipoproducto,int fcontable, int particion, string cregistro) {
            AtlasContexto contexto = new AtlasContexto();// Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_UPDATE, new SqlParameter("@cregistro", cregistro)
                                                            , new SqlParameter("@fcontable", fcontable)
                                                            , new SqlParameter("@particion", particion)
                                                            , new SqlParameter("@ccompania", ccompania)
                                                            , new SqlParameter("@csucursal", csucursal)
                                                            , new SqlParameter("@cagencia", cagencia)
                                                            , new SqlParameter("@ctransaccion", ctransaccion)
                                                            , new SqlParameter("@cmodulo", cmodulo)
                                                            , new SqlParameter("@cmoduloproducto", cmoduloproducto)
                                                            , new SqlParameter("@cproducto", cproducto)
                                                            , new SqlParameter("@ctipoproducto", ctipoproducto));
            } catch (System.InvalidOperationException) {
            
            }
        }

    }
}
