using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarDescuentosDetalleDto.
    /// </summary>
    public class TcarDescuentosDetalleDal {

        /// <summary>
        /// Consulta en la base de datos el registro de descuento generado.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="tipoarchivo">Tipo de archivo generado.</param>
        /// <returns>TcarDescuentosDetalleDto</returns>
        public static tcardescuentosdetalle Find(int particion, string coperacion, int cpersona, string tipoarchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentosdetalle obj = contexto.tcardescuentosdetalle.Where(x => x.particion == particion
                                                                               && x.coperacion.Equals(coperacion)
                                                                               && x.cpersona == cpersona
                                                                               && x.archivoinstituciondetalle.Equals(tipoarchivo)).SingleOrDefault();

            if (obj == null) {
                throw new AtlasException("CAR-0066", "DESCUENTO NO REGISTRADO. OPERACION: {0} - ARCHIVO: {1}", coperacion, TgenCatalogoDetalleDal.Find(704, tipoarchivo).nombre);
            }

            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos el listado de descuentos generados por tipo de archivo.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <param name="tipoarchivo">Tipo de archivo generado.</param>
        /// <returns>TcarDescuentosDetalleDto</returns>
        public static List<tcardescuentosdetalle> Find(int particion, string tipoarchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcardescuentosdetalle> ldescuentos = contexto.tcardescuentosdetalle.Where(x => x.particion == particion
                                                                                             && x.archivoinstituciondetalle.Equals(tipoarchivo)).ToList();

            return ldescuentos;
        }

        /// <summary>
        /// Consulta en la base de datos el listado de descuentos generados por tipo de archivo pendientes de cobro.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <param name="tipoarchivo">Tipo de archivo generado.</param>
        /// <returns>TcarDescuentosDetalleDto</returns>
        public static List<tcardescuentosdetalle> FindPendiente(int particion, string tipoarchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcardescuentosdetalle> ldescuentos = contexto.tcardescuentosdetalle.Where(x => x.particion == particion
                                                                                             && x.archivoinstituciondetalle.Equals(tipoarchivo)
                                                                                             && x.fpago == null
                                                                                             && x.fdevolucion == null).ToList();
            return ldescuentos;
        }

        /// <summary>
        /// Consulta en la base de datos el listado de descuentos generados por tipo de archivo pendientes de cobro.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <param name="tipoarchivo">Tipo de archivo generado.</param>
        /// <returns>TcarDescuentosDetalleDto</returns>
        public static List<tcardescuentosdetalle> FindPendiente(int particion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcardescuentosdetalle> ldescuentos = contexto.tcardescuentosdetalle.Where(x => x.particion == particion
                                                                                             && x.frespuesta != null
                                                                                             && x.fpago == null
                                                                                             && x.fdevolucion == null).ToList();
            return ldescuentos;
        }

        /// <summary>
        /// Consulta en la base de datos el listado de descuentos generados por operacion.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <returns>TcarDescuentosDetalleDto</returns>
        public static List<tcardescuentosdetalle> FindOperacion(int particion, string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcardescuentosdetalle> ldescuentos = contexto.tcardescuentosdetalle.Where(x => x.particion == particion
                                                                                             && x.coperacion.Equals(coperacion)).OrderBy(x => x.crelacion).ToList();

            return ldescuentos;
        }

        /// <summary>
        /// Consulta en la base de datos el listado de operaciones de descuentos generados.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <returns>TcarDescuentosDetalleDto</returns>
        public static List<string> FindDistinctOperacion(int particion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<string> obj = contexto.tcardescuentosdetalle.Where(x => x.particion == particion
                                                                      && x.frespuesta != null).Select(x => x.coperacion).Distinct().ToList();

            return obj;
        }

        /// <summary>
        /// Sentencia utilizada para actualizar regirtros de la carga de descuentos.
        /// </summary>
        private static String JPQL_UPDATE = "update TcarDescuentosDetalle set montorespuesta = @montorespuesta, frespuesta = @frespuesta " +
                                            "where particion = @particion and coperacion = @coperacion and cpersona = @cpersona ";

        /// <summary>
        /// Actualiza registros de descuentos.
        /// </summary>
        /// <param name="particion">Numero de particion.</param>
        /// <returns>int</returns>
        public static void Actualizar(decimal montorespuesta, int frespuesta, int particion, string coperacion, long cpersona)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_UPDATE, new SqlParameter("montorespuesta", montorespuesta),
                                                             new SqlParameter("frespuesta", frespuesta),
                                                             new SqlParameter("particion", particion),
                                                             new SqlParameter("coperacion", coperacion),
                                                             new SqlParameter("cpersona", cpersona));
        }

        /// <summary>
        /// Consulta en la base de datos el listado de operación de descuentos solo para bancos.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <returns>TcarDescuentosDetalleDto</returns>
        public static tcardescuentosdetalle Find(int particion, string archivoinstituciondetalle, string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentosdetalle descuento = contexto.tcardescuentosdetalle.Where(x => x.particion == particion
                                                                                             && x.archivoinstituciondetalle.Equals(archivoinstituciondetalle)
                                                                                             && x.coperacion.Equals(coperacion)).SingleOrDefault();
            return descuento;
        }

        public static DataTable FindDescuentos(int particion, string tipoArchivo)
        {
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@i_particion"] = particion;
            parametros["@i_tipoarchivo"] = tipoArchivo;

            DataTable dt = dal.storeprocedure.StoreProcedureDal.GetDataTable("sp_CarConArchivoDescuentos", parametros);

            return dt;
        }

        /// <summary>
        /// Consulta en la base de datos el registro de descuento generado.
        /// </summary>
        /// <param name="coperacion">Codigo de operacion de cartera.</param>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <returns>TcarDescuentosDetalleDto</returns>
        public static tcardescuentosdetalle Find(string coperacion, int cpersona)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentosdetalle obj = contexto.tcardescuentosdetalle.Where(x => x.coperacion.Equals(coperacion)
                                                                               && x.cpersona == cpersona).SingleOrDefault();

            if (obj == null) {
                throw new AtlasException("CAR-0066", "DESCUENTO NO REGISTRADO. OPERACION: {0} - ARCHIVO: {1}", coperacion, 704);
            }

            return obj;
        }

        private static string SQL_ACTUALIZA_DETALLE_DESCUENTOS = "update tcardescuentosdetalle set frespuesta = @frespuesta, montorespuesta = @montorespuesta " +
            " where coperacion=@coperacion and cpersona=@cpersona";

        public static void ActualizarDetalleDescuentos(tcardescuentosdetalle tcardescuentosdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_ACTUALIZA_DETALLE_DESCUENTOS
            , new SqlParameter("frespuesta", tcardescuentosdetalle.frespuesta)
            , new SqlParameter("montorespuesta", tcardescuentosdetalle.montorespuesta)
            , new SqlParameter("coperacion", tcardescuentosdetalle.coperacion)
            , new SqlParameter("cpersona", tcardescuentosdetalle.cpersona));
        }

        /// <summary>
        /// Entrega el descuento detalle homologado
        /// </summary>
        /// <param name="coperacion">Numero de operacion de cartera a buscar cuotas no pagadas.</param>
        /// <returns>TcarDescuentoDetalle</returns>
        private static string HQL_DESCUENTO = "select d.* from tcardescuentoscarga c, tcardescuentoshomologacion h, tcaroperacion o, tcardescuentosdetalle d " +
                                              "where c.cproductoarchivo = h.cproductoarchivo and c.cpersona = d.cpersona and o.coperacion = d.coperacion " +
                                              "and o.cproducto = h.cproducto and o.ctipoproducto = h.ctipoproducto and h.crelacion = d.crelacion " +
                                              "and c.archivoinstitucioncodigo = d.archivoinstitucioncodigo and c.archivoinstituciondetalle = d.archivoinstituciondetalle " +
                                              "and c.particion = d.particion and c.particion = @particion " +
                                              "and c.cpersona = @cpersona and c.cproductoarchivo = @cproductoarchivo and c.archivoinstituciondetalle = @archivo ";

        public static tcardescuentosdetalle FindHomologado(int particion, long cpersona, int cproductoarchivo, String archivo)
        {
            IList<tcardescuentosdetalle> ldatos = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ldatos = contexto.tcardescuentosdetalle.SqlQuery(HQL_DESCUENTO, new SqlParameter("@particion", particion)
                                                                          , new SqlParameter("@cpersona", cpersona)
                                                                          , new SqlParameter("@cproductoarchivo", cproductoarchivo)
                                                                          , new SqlParameter("@archivo", archivo)).ToList();
            if (ldatos.Count > 0) {
                return ldatos[0];
            }
            return null;
        }
    }
}
