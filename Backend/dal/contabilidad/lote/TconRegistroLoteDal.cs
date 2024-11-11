using modelo;
using modelo.helper;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.lote;
using util.servicios.ef;

namespace dal.lote.contabilidad {

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TconRegistroLote.
    /// </summary>
    public class TconRegistroLoteDal {


	    // Sentecnia que se encarga de eliminar registros a procesar, para una fecha de proceso y lote.
        private static string SQL_DELETE = "delete from TCONREGISTROLOTE where "
			+ "FPROCESO = @fproceso and CLOTE = @clote and CMODULO = @cmodulo and CTAREA = @ctarea and EJECUTADA is null ";

        /// <summary>
        /// Metodo que se encarga de eliminar tareas no ejecutadas de la tabla TconRegistroLote.
        /// </summary>
        /// <param name="rqmodulo">Objeto que contiene fechas contables, y transaccion desde la cual se ejecuta el fin de dia.</param>
        /// <param name="ctarea">Codigo de accion con el que se almacena las acciones a ejecutar por cuenta.</param>
        /// <returns></returns>
        public static void Eliminar(RequestModulo rqmodulo, String ctarea) {
            int fcontable = rqmodulo.Fconatble;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_DELETE , new SqlParameter("fproceso", fcontable), new SqlParameter("clote", rqmodulo.Clote)
                                                           , new SqlParameter("cmodulo", rqmodulo.Cmodulo), new SqlParameter("ctarea", ctarea));
	    }


        private static string JPQL_TAREAS = "select ctarea from TconRegistroLote t where t.cregistro = @cregistro and t.fproceso = @fproceso "
			+ "and t.clote = @clote and t.cmodulo = @cmodulo and t.ejecutada is null order by t.orden ";

        /**
	     * Entrega una lista de tareas a ejecutar por codigo de registro.
	     * @param rqoperacion Objeto que contine informacion de la operacion que esta ejecutando en el lote.
	     * @return List<String>
	     * @throws Exception
	     */

        public static IList<string> GetTareas(RequestOperacion rqoperacion) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cregistro"] = rqoperacion.Cregistro;
            parametros["@fproceso"] = rqoperacion.Fconatble;
            parametros["@clote"] = rqoperacion.Clote;
            parametros["@cmodulo"] = rqoperacion.Cmodulo;

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, JPQL_TAREAS);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            foreach (Dictionary<string, object> item in ldatos) {
                lcampos.Add(item["ctarea"].ToString());
            }

            return lcampos;
	    }

	    private static string JPQL_MARCAPROCESADAS = "update TconRegistroLote set ejecutada = @ejecutada, mensaje = @mensaje, ccomprobante = @ccomprobante, freal = current_timestamp, numeroejecucion = @numeroejecucion "
			    + " where cregistro = @cregistro and fproceso = @fproceso and clote = @clote and cmodulo = @cmodulo and ejecutada is null ";

	    public static void MarcaProcesadas(RequestOperacion rqoperacion, string mensaje, string ccomprobante) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_MARCAPROCESADAS, new SqlParameter("numeroejecucion", rqoperacion.Numeroejecucion), new SqlParameter("cregistro", rqoperacion.Cregistro)
                                                                    , new SqlParameter("fproceso", rqoperacion.Fconatble), new SqlParameter("clote", rqoperacion.Clote)
                                                                    , new SqlParameter("cmodulo", rqoperacion.Cmodulo), new SqlParameter("ejecutada", "1")
                                                                    , new SqlParameter("mensaje", mensaje), new SqlParameter("ccomprobante", ccomprobante));
        }

        /** Sentencia que entrega las cuentas a procesar para un modulo. */
        private static string SQL_RESULTSET = " select distinct cregistro from TCONREGISTROLOTE t "
			    + " where t.FPROCESO = @fproceso and t.CLOTE = @clote and t.CMODULO = @cmodulo and t.ejecutada is null ";

	    /**
	     * Entrega un resultset con las operaciones a procesar para un lote, modulo y fecha de proceso.
	     * @param fproceso Fecha de proceso del lote.
	     * @param clote Codigo de lote.
	     * @param cmodulo Codigo de modulo al que pertenece el lote.
	     * @return ScrollableResults
	     * @throws Exception
	     */
	    public static ScrollableResults LlenaResultset(int fproceso, String clote, int cmodulo, string ctarea) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            String SQL = SQL_RESULTSET;
            if (!String.IsNullOrEmpty(ctarea)) {
                SQL = SQL + " and t.ctarea=@ctarea";
            }

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fproceso"] = fproceso;
            parametros["@clote"] = clote;
            parametros["@cmodulo"] = cmodulo;
            if (!String.IsNullOrEmpty(ctarea)) {
                parametros["@ctarea"] = ctarea;
            }

            ScrollableResults rSet = new ScrollableResults(contexto, parametros, SQL, 5000);
            return rSet;
	    }


    }
}
