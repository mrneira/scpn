using modelo;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.contabilidad {
    public class TconSaldosCierreDal {

        private static string SQL_DELETE = "delete from TconSaldosCierre  where fcierre = @fcierre and ccompania = @ccompania ";
        private static string connectionString;

        public static void SetConnectionString() {
            connectionString = ConfigurationManager.ConnectionStrings["AtlasContexto"].ConnectionString.Replace("metadata=res://*/ModeloEF.csdl|res://*/ModeloEF.ssdl|res://*/ModeloEF.msl;provider=System.Data.SqlClient;provider connection string", "");
            connectionString = connectionString.Substring(connectionString.IndexOf("data source"));
            connectionString = connectionString.Substring(0, connectionString.Length - 1);
        }

        public static void EjecutarSQLCommand(SqlCommand cmd) {
            SetConnectionString();
            SqlConnection cnx = new SqlConnection(connectionString);
            try {
                cnx.Open();
                cmd.Connection = cnx;
                cmd.ExecuteNonQuery();
                cnx.Close();
            } catch (System.Exception) {
                cnx.Close();
            }
        }

        public static DataTable EjecutarSQLQuery(SqlCommand cmd) {
            SetConnectionString();
            SqlConnection cnx = new SqlConnection(connectionString);
            SqlDataAdapter da = new SqlDataAdapter();
            DataTable table = new DataTable();
            try {
                cnx.Open();
                cmd.Connection = cnx;
                da.SelectCommand = cmd;
                da.Fill(table);
                cnx.Close();
                return table;
            } catch (System.Exception) {
                cnx.Close();
                return null;
            }
        }
        /// Metodo que se encarga de eliminar registros de saldos por usuario y compania.
        /// </summary>
        /// <param name="fcierre">Codigo de usuario a eliminar registos.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        public static void Eliminar(int fcierre, int ccompania)
        {
            SqlCommand cmdDeleteSaldo = new SqlCommand(SQL_DELETE);
            cmdDeleteSaldo.Parameters.AddWithValue("@fcierre", fcierre);
            cmdDeleteSaldo.Parameters.AddWithValue("@ccompania", ccompania);
            EjecutarSQLCommand(cmdDeleteSaldo);
        }
        /// <summary>
        /// Metodo que se encarga de insertar registros de saldos al cierre de mes.
        /// </summary>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario</param>
        /// <param name="fcierre">Fecha con la cual se inserta los saldos en TCONSALDOSCIERRE</param>
        /// <param name="cninvel">Nivel de la cuenta</param>
        public static void Insertar(tconperiodocontable periodoactual, int fcontable) {
            List<tconcatalogo> lcuentasmovimiento = TconCatalogoDal.GetCuentasMovimiento();
            SqlCommand cmdConsultaSaldo;
            SqlCommand cmdInsertaSaldo;
            foreach (tconcatalogo item in lcuentasmovimiento) {

                cmdConsultaSaldo = new SqlCommand("sp_ConSaldoFechaCierreMes");
                cmdConsultaSaldo.CommandType = CommandType.StoredProcedure;
                cmdConsultaSaldo.Parameters.AddWithValue("@i_ccuenta", item.ccuenta);
                cmdConsultaSaldo.Parameters.AddWithValue("@i_fecha", Fecha.GetFechaPresentacionAnioMesDia(periodoactual.fperiodofin)) ;
                DataTable dt = EjecutarSQLQuery(cmdConsultaSaldo);
                //insertar registros de saldos al cierre de mes.
                string SQL_INSERT_TCONSALDOSC = "insert into tconsaldoscierre "
                                        + " (fcierre, fproceso, ccuenta, cagencia, csucursal, particion, ccompania, cmoneda, cmonedaoficial, monto, montooficial, tipocierreccatalogo, tipocierrecdetalle)"
                                        + " select"
                                        + " @fcierre, @fproceso, @ccuenta, 1, 1, @particion, 1, 'USD', 'USD', "
                                        + " @monto,"
                                        + " @monto, 1028, 'MES'";

                cmdInsertaSaldo = new SqlCommand(SQL_INSERT_TCONSALDOSC);
                cmdInsertaSaldo.Parameters.AddWithValue("@ccuenta", item.ccuenta);
                cmdInsertaSaldo.Parameters.AddWithValue("@monto", dt.Rows[0].Field<decimal>("saldo"));
                cmdInsertaSaldo.Parameters.AddWithValue("@fcierre", periodoactual.fperiodofin);
                cmdInsertaSaldo.Parameters.AddWithValue("@fproceso", fcontable);
                cmdInsertaSaldo.Parameters.AddWithValue("@particion", Constantes.GetParticion(periodoactual.fperiodofin));
                EjecutarSQLCommand(cmdInsertaSaldo);
            }
        }


        /// <summary>
        /// Metodo que se encarga de acmular saldos en cuentas padre.
        /// </summary>
        /// <param name="fcierre">Fecha de cierre</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <param name="cnivel">Codigo de nivel a acumular saldos en cuentas padre.</param>
        public static void Rollup(int fcierre, int ccompania, int cnivel, int fproceso) {

            string SQL_ROLLUP = "insert into tconsaldoscierre(fcierre, fproceso, ccuenta, cagencia, csucursal, particion, ccompania,cmoneda,cmonedaoficial,monto,montooficial,tipocierreccatalogo, tipocierrecdetalle) "
                + " select ts.fcierre, @fproceso, tc.padre, ts.cagencia, ts.csucursal, ts.particion, ts.ccompania, ts.cmoneda, ts.cmonedaoficial, sum(ts.monto), sum(ts.montooficial) , 1028, 'MES'"
                + " from tconcatalogo tc, tconsaldoscierre ts "
                + " where tc.ccuenta = ts.ccuenta "
                + " and tc.ccompania = ts.ccompania "
                + " and tc.cnivel = @cnivel "
                + " and tc.ccompania = @ccompania "
                + " and ts.fcierre = @fcierre "
                + " group by tc.padre, ts.fcierre, ts.cagencia, ts.csucursal, ts.particion, ts.ccompania, ts.cmoneda, ts.cmonedaoficial ";
            SqlCommand cmdInsertaSaldo = new SqlCommand(SQL_ROLLUP);
            cmdInsertaSaldo.Parameters.AddWithValue("@fcierre", fcierre);
            cmdInsertaSaldo.Parameters.AddWithValue("@ccompania", ccompania);
            cmdInsertaSaldo.Parameters.AddWithValue("@cnivel", cnivel);
            cmdInsertaSaldo.Parameters.AddWithValue("@fproceso", fproceso);
            EjecutarSQLCommand(cmdInsertaSaldo);
            
        }


        public static decimal GetSaldosPorCuenta(string ccuenta, int fcierre) {
            string SQL = "select monto from tconsaldoscierre where fcierre = @fcierre and ccuenta = @ccuenta";
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            decimal saldo = 0;
            try {
                saldo = contexto.Database.SqlQuery<decimal>(SQL, new SqlParameter("@fcierre", fcierre),
                                                                new SqlParameter("@ccuenta", ccuenta)).FirstOrDefault();
            } catch (System.InvalidOperationException) {
                return 0;
            }
            return saldo;
        }


        /// <summary>
        /// Metodo que se encarga de actualizar saldos de cuentas
        /// </summary>
        public static void Actualizar(int fcierre, decimal monto, string ccuenta) {
            string SQL_UPDATE = "UPDATE TCONSALDOSCIERRE SET MONTO = @monto, montooficial = @monto where fcierre = @fcierre and ccuenta=@ccuenta";
            SqlCommand cmdUpdateSaldo = new SqlCommand(SQL_UPDATE);
            cmdUpdateSaldo.Parameters.AddWithValue("@fcierre", fcierre);
            cmdUpdateSaldo.Parameters.AddWithValue("@monto", monto);
            cmdUpdateSaldo.Parameters.AddWithValue("@ccuenta", ccuenta);
            EjecutarSQLCommand(cmdUpdateSaldo);
        }


        private static string SQL_UPD_CONTINGENTE_PLAN1 = "update  tconsaldoscierre set monto = coalesce((select monto from tconsaldoscierre where ccuenta = '61' and fcierre = @fcierre and ccompania = @ccompania),0) + "
        + "coalesce((select monto from tconsaldoscierre where ccuenta = '63' and fcierre = @fcierre and ccompania = @ccompania),0) - "
        + "coalesce((select monto from tconsaldoscierre where ccuenta = '62' and fcierre = @fcierre and ccompania = @ccompania),0) - "
        + "coalesce((select monto from tconsaldoscierre where ccuenta = '64' and fcierre = @fcierre and ccompania = @ccompania),0), "
        + " montooficial = coalesce((select montooficial from tconsaldoscierre where ccuenta = '61' and fcierre = @fcierre and ccompania = @ccompania),0) + "
        + "coalesce((select montooficial from tconsaldoscierre where ccuenta = '63' and fcierre = @fcierre and ccompania = @ccompania),0) - "
        + "coalesce((select montooficial from tconsaldoscierre where ccuenta = '62' and fcierre = @fcierre and ccompania = @ccompania),0) - "
        + "coalesce((select montooficial from tconsaldoscierre where ccuenta = '64' and fcierre = @fcierre and ccompania = @ccompania),0) "
        + "where ccuenta in ('6') and fcierre = @fcierre and ccompania = @ccompania ";
        /// <summary>
        /// Actualiza primer nivel de cuentas contingente.
        /// </summary>
        /// <param name="fcierre">Fecha de cierre</param>
        /// <param name="ccompania">Codigo de compania.</param>
        public static void UpdateContinegente(int fcierre, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_UPD_CONTINGENTE_PLAN1, new SqlParameter("@fcierre", fcierre),
                                                                new SqlParameter("@ccompania", ccompania));

            } catch (System.InvalidOperationException) {
                return;
            }
        }

    }
}
