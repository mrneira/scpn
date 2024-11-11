using modelo;
using modelo.servicios;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.consulta;
using util.servicios.ef;

namespace dal.contabilidad.conciliacionbancaria
{
    /// <summary>
    /// Clase que encapsula los procedimientos para operar los saldos contables en la conciliación bancaria.
    /// </summary>
    public class TconconciliacionBancariaSaldoDal
    {

        /// <summary>
        /// Obtiene el saldo de la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns>decimal</returns>
        public static decimal GetSaldo(RqConsulta rqconsulta)
        {
            string lSql = "select ISNULL(saldo,0) Saldo from tconconciliacionbancariasaldo where ccompania = " +
                rqconsulta.Mdatos["ccompania"].ToString().Trim() + " and ccuenta = '" +
                rqconsulta.Mdatos["ccuenta"].ToString().Trim() + "' and fecha = " +
                rqconsulta.Mdatos["fecha"].ToString().Trim();

            tconconciliacionbancariasaldo fc = new tconconciliacionbancariasaldo();
            // parametros de consulta del saldo de aportes.
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            // campos adiciones para la consulta.
            List<string> lcampos = new List<string>();
            lcampos.Add("Saldo");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
            fc = (tconconciliacionbancariasaldo)ch.GetRegistro("tconconciliacionbancariasaldo", lcampos);
            try
            {
                return decimal.Parse(fc.Mdatos.Values.ElementAt(0).ToString());
            }
            catch
            {
                return 0;
            }
        }

        public static tconlibrobancosaldo GetSaldo(int ffin, string ccuenta)
        {
            tconlibrobancosaldo obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tconlibrobancosaldo.Where(x => x.fcontable == ffin && x.ccuentabanco == ccuenta).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Determinar la existencia del saldo de la libro bancos mayor a una fecha inicio.
        /// </summary>
        /// <param name="ccuenta">cuenta bancos.</param>
        /// <param name="finicio">fecha inicio.</param>
        public List<tconlibrobancos> LibroSaldos(string ccuenta, int finicio)
        {
            
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconlibrobancos> ldata = contexto.tconlibrobancos.Where(x => x.cuentabanco == ccuenta && x.fcontable > finicio).ToList();
            return ldata;
        }

        /// <summary>
        /// Determinar la existencia del saldo de la conciliación bancaria.
        /// </summary>
        /// <param name="rqconsulta">Request con el que se ejecuta la transaccion.</param>
        /// <returns>string</returns>
        public static string GetExist(RqConsulta rqconsulta)
        {
            string lSql = "select ISNULL(ccuenta,'') ccuenta from tconconciliacionbancariasaldo where ccompania = " +
                rqconsulta.Mdatos["ccompania"].ToString().Trim() + " and ccuenta = '" +
                rqconsulta.Mdatos["ccuenta"].ToString().Trim() + "' and fecha = " +
                rqconsulta.Mdatos["fecha"].ToString().Trim();

            tconconciliacionbancariasaldo fc = new tconconciliacionbancariasaldo();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("ccuenta");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
            fc = (tconconciliacionbancariasaldo)ch.GetRegistro("tconconciliacionbancariasaldo", lcampos);
            try
            {
                return fc.Mdatos.Values.ElementAt(0).ToString();
            }
            catch
            {
                return "";
            }
        }

        /// <summary>
        /// Actualiza el saldo de la cuenta contable.
        /// </summary>
        /// <param name="ccompania">Compañía.</param>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="fecha">Fecha de la transacción.</param>
        /// <param name="saldo">Valor del saldo.</param>
        /// <param name="cusuario">Identificador del usuario.</param>
        /// <returns>int</returns>
        public static int ActualizarSaldo(int ccompania, string ccuenta, int fecha, decimal saldo, string cusuario)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = " UPDATE tconlibrobancosaldo SET saldo = " + 
                    saldo.ToString().Replace(",",".") +
                    ", cusuariomod = '" + 
                    cusuario +
                    "', fmodificacion = GETDATE() WHERE ccompania = " +
                    ccompania +
                    " AND ccuenta = '" +
                    ccuenta.Trim() +
                    "' AND fecha = " +
                    fecha;

                return contexto.Database.ExecuteSqlCommand(lSQL);

            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }

        }

        /// <summary>
        /// Insertar el saldo de la cuenta contable.
        /// </summary>
        /// <param name="ccompania">Compañía.</param>
        /// <param name="ccuenta">Cuenta contable.</param>
        /// <param name="fecha">Fecha de la transacción.</param>
        /// <param name="saldo">Valor del saldo.</param>
        /// <param name="cusuario">Identificador del usuario.</param>
        /// <returns>int</returns>
        public static int InsertarSaldo(int ccompania, string ccuenta, int fecha, decimal saldo, string cusuario)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                string lSQL = " INSERT INTO tconlibrobancosaldo (fcontable, ccuenta, saldo, cusuarioing, fingreso) VALUES (" +
                    ccompania +
                    ", '" + ccuenta.Trim() + ", " + saldo.ToString().Replace(",", ".") + ", '" + cusuario.Trim() + "', GETDATE())";

                return contexto.Database.ExecuteSqlCommand(lSQL);

            }
            catch (System.InvalidOperationException)
            {
                return 0;
            }

        }

    }
}
