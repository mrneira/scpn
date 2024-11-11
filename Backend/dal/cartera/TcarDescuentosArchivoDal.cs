using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarDescuentosArchivoDto.
    /// </summary>
    public class TcarDescuentosArchivoDal {

        /// <summary>
        /// Metodo que entrega el listado de archivos por particion. Busca los datos en cache, si no encuentra los datos en cache
        /// busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="particion">Particion de generacion de descuentos.</param>
        /// <returns>IList<TcarDescuentosArchivoDto></returns>
        public static IList<tcardescuentosarchivo> Find(int particion)
        {
            IList<tcardescuentosarchivo> ldatos = null;
            string key = "tcardescuentosarchivo";
            CacheStore cs = CacheStore.Instance;
            ldatos = (IList<tcardescuentosarchivo>)cs.GetDatos("tcardescuentosarchivo", key);
            if (ldatos == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcardescuentosarchivo");
                ldatos = FindInDatabase(particion);
                m[key] = ldatos;
                cs.PutDatos("tcardescuentosarchivo", m);
            }
            return ldatos;
        }

        /// <summary>
        /// Busca en la base de datos la lista de archivos.
        ///// </summary>
        /// <param name="particion">Particion de generacion de descuentos.</param>
        /// <returns>TcarDescuentosArchivoDto</returns>
        private static IList<tcardescuentosarchivo> FindInDatabase(int particion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcardescuentosarchivo> ldatos = contexto.tcardescuentosarchivo.AsNoTracking().Where(x => x.particion == particion).ToList();
            return ldatos;
        }

        /// <summary>
        /// Busca en la base de datos el archivo de descuentos.
        ///// </summary>
        /// <param name="particion">Particion de generacion de descuentos.</param>
        /// <param name="carchivo">Codigo de archivo.</param>
        /// <returns>TcarDescuentosArchivoDto</returns>
        public static tcardescuentosarchivo FindArchivo(int particion, string carchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentosarchivo obj = contexto.tcardescuentosarchivo.AsNoTracking().Where(x => x.particion == particion && x.archivoinstituciondetalle == carchivo).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Busca en la base de datos la lista de archivos.
        ///// </summary>
        /// <param name="particion">Particion de generacion de descuentos.</param>
        /// <param name="cestado">Codigo de estado.</param>
        /// <returns>TcarDescuentosArchivoDto</returns>
        public static IList<tcardescuentosarchivo> FindPorEstado(int particion, string cestado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcardescuentosarchivo> ldatos = contexto.tcardescuentosarchivo.AsNoTracking().Where(x => x.particion == particion && x.cdetalleestado == cestado).ToList();
            return ldatos;
        }


        /// <summary>
        /// Sentencia utilizada para actualizar los datos de la generacion de archivos de descuentos.
        /// </summary>
        private static String JPQL_ARCHIVOS = "insert into TcarDescuentosArchivo (particion, archivoinstitucioncodigo, archivoinstituciondetalle, ccatalogoestado, cdetalleestado, fingreso, registros, monto )" +
                                                "select particion, archivoinstitucioncodigo, archivoinstituciondetalle, 707, 'ING', @fgeneracion, " +
                                                "count(coperacion), sum(monto) " +
                                                "from TcarDescuentosDetalle " +
                                                "where particion = @particion " +
                                                "group by particion, archivoinstitucioncodigo, archivoinstituciondetalle";

        /// <summary>
        /// Inserta detalle de archivos generados
        /// </summary>
        public static void InsertArchivos(int particion, int fgeneracion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_ARCHIVOS, new SqlParameter("particion", particion), new SqlParameter("fgeneracion", fgeneracion));
        }



        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de la generacion de archivos de descuentos.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarDescuentosArchivo where particion = @particion ";

        /// <summary>
        /// Elimina registros de archivos dado la particion.
        /// </summary>
        /// <param name="particion">Numero de particion.</param>
        /// <returns>int</returns>
        public static void Eliminar(int particion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("particion", particion));
        }

        public static List<tcardescuentosarchivo> FindPorEstadoArchivo(string tipoArchivo, string cestado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcardescuentosarchivo> ldatos = contexto.tcardescuentosarchivo.AsNoTracking().Where(x => x.archivoinstituciondetalle == tipoArchivo 
                                                                                                        && x.cdetalleestado == cestado).ToList();
            return ldatos;
        }
    }
}
