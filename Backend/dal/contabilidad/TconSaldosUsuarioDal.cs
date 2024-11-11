using modelo;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.contabilidad {
    public class TconSaldosUsuarioDal {

        private static string SQL_DELETE = "delete from TconSaldosUsuario t where t.cusuario = @cusuario and t.ccompania = @ccompania ";
        /// <summary>
        /// Metodo que se encarga de eliminar registros de saldos por usuario y compania.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario a eliminar registos.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        public static void Eliminar(string cusuario, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_DELETE, new SqlParameter("@cusuario", cusuario), new SqlParameter("@ccompania", ccompania));
            } catch (System.InvalidOperationException) {
                return;
            }
        }

        private static string SQL_INSERT = "insert into tconsaldosusuario(ccuenta, cusuario, cagencia, csucursal,ccompania,cmoneda,cmonedaoficial,monto,montooficial) "
                + " select ccuenta, @cusuario, cagencia, csucursal, ccompania, cmoneda, cmonedaoficial, sum(monto), sum(montooficial) "
                + " from tconsaldos t where t.ccompania = @ccompania and t.fvigencia <= @fproceso  "
                + " group by ccuenta, cagencia, csucursal, ccompania, cmoneda, cmonedaoficial"
                + " union"
                + " select ccuenta, @cusuario, cagencia, csucursal, ccompania, cmoneda, cmonedaoficial, sum(monto), sum(montooficial) "
                + " from tconsaldoshistoria t where t.ccompania = @ccompania and @fproceso between t.fvigencia and t.fcaducidad and t.particion = @particion "
                + " group by ccuenta, cagencia, csucursal, ccompania, cmoneda, cmonedaoficial ";
        /// <summary>
        /// Metodo que se encarga de insertar registros de saldos por usuario y compania.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario a insertar registos.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <param name="fproceso">Fecha con la cual se inserta los saldos en tconsaldosusuario, seleccionando de tconsaldos o tconsaldoshistoria.</param>
        public static void Insertar(string cusuario, int ccompania, int fproceso) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_INSERT, new SqlParameter("@cusuario", cusuario), 
                                                                new SqlParameter("@ccompania", ccompania),
                                                                new SqlParameter("@fproceso", fproceso),
                                                                new SqlParameter("@particion", Constantes.GetParticion(fproceso)));
            } catch (System.InvalidOperationException) {
                return;
            }

        }

        private static string SQL_ROLLUP = "insert into tconsaldosusuario(ccuenta, cusuario, cagencia, csucursal,ccompania,cmoneda,cmonedaoficial,monto,montooficial) "
                + " select tc.padre, tsu.cusuario, tsu.cagencia, tsu.csucursal, tsu.ccompania, tsu.cmoneda, tsu.cmonedaoficial, sum(tsu.monto), sum(tsu.montooficial) "
                + " from tconcatalogo tc, tconsaldosusuario tsu "
                + " where tc.ccuenta = tsu.ccuenta "
                + " and tc.ccompania = tsu.ccompania "
                + " and tsu.cusuario = @cusuario "
                + " and tc.cnivel = @cnivel "
                + " and tc.ccompania = @ccompania "
                + " group by tc.padre, tsu.cusuario, tsu.cagencia, tsu.csucursal, tsu.ccompania, tsu.cmoneda, tsu.cmonedaoficial ";
        /// <summary>
        /// Metodo que se encarga de acmular saldos en cuentas padre.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <param name="cnivel">Codigo de nivel a acumular saldos en cuentas padre.</param>
        public static void Rollup(string cusuario, int ccompania, int cnivel) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_ROLLUP, new SqlParameter("@cusuario", cusuario),
                                                                new SqlParameter("@ccompania", ccompania),
                                                                new SqlParameter("@cnivel", cnivel));
            } catch (System.InvalidOperationException) {
                return;
            }
        }

        private static string SQL_UPD_ORDEN = "update  tconsaldosusuario set monto = coalesce((select monto from tconsaldosusuario where ccuenta = '71'),0) + "
        + "coalesce((select monto from tconsaldosusuario where ccuenta = '73'),0) - "
        + "coalesce((select monto from tconsaldosusuario where ccuenta = '72'),0) - "
        + "coalesce((select monto from tconsaldosusuario where ccuenta = '74'),0), "
        + " montooficial = coalesce((select montooficial from tconsaldosusuario where ccuenta = '71'),0) + "
        + "coalesce((select montooficial from tconsaldosusuario where ccuenta = '73'),0) - "
        + "coalesce((select montooficial from tconsaldosusuario where ccuenta = '72'),0) - "
        + "coalesce((select montooficial from tconsaldosusuario where ccuenta = '74'),0) "
        + " where ccuenta in ('7') and cusuario = @cusuario and ccompania = @ccompania  ";
        /// <summary>
        /// Actualiza primer nivel de cuentas de orden.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        public static void UpdateOrden(string cusuario, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_UPD_ORDEN, new SqlParameter("@cusuario", cusuario),
                                                                new SqlParameter("@ccompania", ccompania));
                                                              
            } catch (System.InvalidOperationException) {
                return;
            }
        }


        private static string SQL_UPD_CONTINGENTE = "update  tconsaldosusuario set monto = coalesce((select monto from tconsaldosusuario where ccuenta = '61'),0) + "
        + "coalesce((select monto from tconsaldosusuario where ccuenta = '63'),0) - "
        + "coalesce((select monto from tconsaldosusuario where ccuenta = '62'),0) - "
        + "coalesce((select monto from tconsaldosusuario where ccuenta = '64'),0), "
        + " montooficial = coalesce((select montooficial from tconsaldosusuario where ccuenta = '61'),0) + "
        + "coalesce((select montooficial from tconsaldosusuario where ccuenta = '63'),0) - "
        + "coalesce((select montooficial from tconsaldosusuario where ccuenta = '62'),0) - "
        + "coalesce((select montooficial from tconsaldosusuario where ccuenta = '64'),0) "
        + "where ccuenta in ('6') and cusuario = @cusuario and ccompania = @ccompania ";
        /// <summary>
        /// Actualiza primer nivel de cuentas contingente.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        public static void UpdateContinegente(string cusuario, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_UPD_CONTINGENTE, new SqlParameter("@cusuario", cusuario),
                                                                new SqlParameter("@ccompania", ccompania));

            } catch (System.InvalidOperationException) {
                return;
            }
        }

    }
}
