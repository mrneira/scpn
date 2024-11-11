using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarDescuentosCargaDto.
    /// </summary>
    public class TcarDescuentosCargaDal {

        /// <summary>
        /// Consulta en la base de datos el registro de descuento.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <returns>TcarDescuentosCargaDto</returns>
        public static tcardescuentoscarga Find(int particion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentoscarga obj = contexto.tcardescuentoscarga.Where(x => x.particion == particion).SingleOrDefault();

            return obj;
        }

        /// <summary>
        /// Busca en la base de datos el archivo de descuentos.
        ///// </summary>
        /// <param name="particion">Particion de generacion de descuentos.</param>
        /// <param name="carchivo">Codigo de archivo.</param>
        /// <returns>TcarDescuentosCargaDto</returns>
        public static IList<tcardescuentoscarga> FindArchivo(int particion, string carchivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcardescuentoscarga> lcarga = contexto.tcardescuentoscarga.AsNoTracking().Where(x => x.particion == particion && x.archivoinstituciondetalle == carchivo).ToList();
            return lcarga;
        }

        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de la generacion de descuentos.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarDescuentosCarga where particion = @particion and archivoinstituciondetalle = @archivo ";

        /// <summary>
        /// Elimina registros de cuotas dado la particion.
        /// </summary>
        /// <param name="particion">Numero de particion.</param>
        /// <param name="archivo">Tipo de archivo de descuentos.</param>
        /// <returns></returns>
        public static void Eliminar(int particion, string archivo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("particion", particion),
                                                             new SqlParameter("archivo", archivo));
        }
    }
}
