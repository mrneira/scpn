using modelo;
using System;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarDescuentosDto.
    /// </summary>
    public class TcarDescuentosDal {

        /// <summary>
        /// Consulta en la base de datos el registro de descuento.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <returns>TcarDescuentosDto</returns>
        public static tcardescuentos Find(int particion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentos obj = contexto.tcardescuentos.Where(x => x.particion == particion).SingleOrDefault();

            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos el registro de descuento no pagado.
        /// </summary>
        /// <param name="particion">Codigo de particion.</param>
        /// <returns>TcarDescuentosDto</returns>
        public static tcardescuentos FindNoPagada()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardescuentos obj = contexto.tcardescuentos.Where(x => x.pagoaplicado == false).SingleOrDefault();

            return obj;
        }

        /// <summary>
        /// Sentencia utilizada para actualizar los datos de la generacion de descuentos.
        /// </summary>
        private static String JPQL_DESCUENTOS = "insert into TcarDescuentos (particion, fgeneracion, pagoaplicado, sumcpersona, sumcoperacion, summonto) " +
                                                "select particion, " +
                                                "@fgeneracion, 0, " +
                                                "(select count(distinct cpersona) from tcardescuentosdetalle where particion = @particion), " +
                                                "(select count(distinct coperacion) from tcardescuentosdetalle where particion = @particion), " +
                                                "sum(monto) " +
                                                "from TcarDescuentosDetalle " +
                                                "where particion = @particion " +
                                                "group by particion";

        /// <summary>
        /// Inserta consolidado de descuentos
        /// </summary>
        public static void InsertDescuentos(int particion, int fgeneracion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DESCUENTOS, new SqlParameter("particion", particion), new SqlParameter("fgeneracion", fgeneracion));
        }



        /// <summary>
        /// Sentencia utilizada para eliminar regirtros de la generacion de descuentos.
        /// </summary>
        private static String JPQL_DELETE = "delete from TcarDescuentos where particion = @particion ";

        /// <summary>
        /// Elimina registros de cuotas dado la particion.
        /// </summary>
        /// <param name="particion">Numero de particion.</param>
        /// <returns>int</returns>
        public static void Eliminar(int particion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("particion", particion));
        }

        /// <summary>
        /// Actualiza los archivos de descuentos dado la particion.
        /// </summary>
        /// <param name="particion">Numero de particion.</param>
        /// <returns>int</returns>
        private static String JPQL_UPDATE = "update tcardescuentosarchivo set cdetalleestado = @cestatus, fpago = @fpago, cusuariopago = @cusuario where particion = @particion " +
                                            "update tcardescuentos set pagoaplicado = 1 where particion = @particion ";
        public static void Actualizar(int particion, String cestatus, int fpago, String cusuario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_UPDATE, new SqlParameter("particion", particion)
                                                           , new SqlParameter("cestatus", cestatus)
                                                           , new SqlParameter("fpago", fpago)
                                                           , new SqlParameter("cusuario", cusuario));
        }
    }
}
