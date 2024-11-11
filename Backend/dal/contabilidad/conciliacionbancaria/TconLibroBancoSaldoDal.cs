using modelo;
using modelo.servicios;
using System.Collections.Generic;
using System.Linq;
using util.dto.consulta;
using util.servicios.ef;

namespace dal.contabilidad.conciliacionbancaria {
   public class TconLibroBancoSaldoDal {

        /// <summary>
        /// Obtiene el saldo de la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns>decimal</returns>
        public static decimal GetSaldo(RqConsulta rqconsulta) {
            string lSql = "select ISNULL(saldo,0) Saldo from tconlibrobancosaldo where fcontable = " +
                rqconsulta.Mdatos["fecha"].ToString().Trim() + " and ccuentabanco = '" +
                rqconsulta.Mdatos["ccuenta"].ToString().Trim();

            tconlibrobancosaldo fc = new tconlibrobancosaldo();
            // parametros de consulta del saldo de aportes.
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            // campos adiciones para la consulta.
            List<string> lcampos = new List<string>();
            lcampos.Add("Saldo");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
            fc = (tconlibrobancosaldo)ch.GetRegistro("tconlibrobancosaldo", lcampos);
            try {
                return decimal.Parse(fc.Mdatos.Values.ElementAt(0).ToString());
            } catch {
                return 0;
            }
        }

        /// <summary>
        /// Insertar el saldo de la cuenta contable.
        /// </summary>
        /// <param name="fecha">Fecha de la transacción.</param>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="saldo">Valor del saldo.</param>
        /// <param name="cusuario">Identificador del usuario.</param>
        /// <returns>int</returns>
        public static int InsertarSaldo(int fecha, string ccuentabanco,string ccuenta, decimal saldo, string cusuario) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                string lSQL = " INSERT INTO tconlibrobancosaldo (fcontable, ccuentabanco,cuentabanco, saldo, cusuarioing, fingreso) VALUES (" +
                    fecha +",'"+ ccuentabanco+"','" + ccuenta.Trim() + "', " + saldo.ToString().Replace(",", ".") + ", '" + cusuario.Trim() + "', GETDATE())";

                return contexto.Database.ExecuteSqlCommand(lSQL);

            } catch (System.InvalidOperationException ex ) {
                return 0;
            }

        }

        /// <summary>
        /// Actualiza el saldo de la cuenta contable.
        /// </summary>
        /// <param name="fecha">Fecha de la transacción.</param>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="saldo">Valor del saldo.</param>
        /// <param name="cusuario">Identificador del usuario.</param>
        /// <returns>int</returns>
        public static int ActualizarSaldo(int fecha, string ccuenta, decimal saldo, string cusuario) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                string lSQL = " UPDATE tconlibrobancosaldo SET saldo = " +
                    saldo.ToString().Replace(",", ".") +
                    ", cusuariomod = '" +
                    cusuario +
                    "', fmodificacion = GETDATE() WHERE fcontable = " +
                    fecha +
                    " AND ccuentabanco = '" +
                    ccuenta.Trim() + "'";

                return contexto.Database.ExecuteSqlCommand(lSQL);

            } catch (System.InvalidOperationException) {
                return 0;
            }

        }

        public static tconlibrobancosaldo GetSaldo(int ffin, string ccuenta) {
            tconlibrobancosaldo obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancosaldo.Where(x => x.fcontable == ffin && x.ccuentabanco == ccuenta).SingleOrDefault();
            return obj;
        }
        public static tconlibrobancosaldo GetSaldoBanco(int ffin, string ccuenta)
        {
            tconlibrobancosaldo obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancosaldo.Where(x => x.fcontable == ffin && x.cuentabanco == ccuenta).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Determinar la existencia del saldo de la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns>string</returns>
        public static string GetExist(RqConsulta rqconsulta) {
            string lSql = "select ISNULL(ccuentabanco,'') ccuenta from tconlibrobancosaldo where fcontable = " +
                rqconsulta.Mdatos["fecha"].ToString().Trim() + " and ccuentabanco = '" +
                rqconsulta.Mdatos["ccuenta"].ToString().Trim();


            tconlibrobancosaldo fc = new tconlibrobancosaldo();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("ccuentabanco");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
            fc = (tconlibrobancosaldo)ch.GetRegistro("tconlibrobancosaldo", lcampos);
            try {
                return fc.Mdatos.Values.ElementAt(0).ToString();
            } catch {
                return "";
            }
        }
    }
}
