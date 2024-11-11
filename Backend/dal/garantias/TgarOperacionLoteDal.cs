using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.lote;
using util.servicios.ef;

namespace dal.garantias {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgarOperacionLote.
    /// </summary>
    public class TgarOperacionLoteDal {

        // Sentecnia que se encarga de eliminar operaciones a procesar, para una fecha de proceso y lote.
        private static String SQL_DELETE = "delete from TGAROPERACIONLOTE where  "
            + "FPROCESO = @fproceso and CLOTE = @clote and CMODULO = @cmodulo and CTAREA = @ctarea and EJECUTADA is null ";

        /// <summary>
        /// Metodo que se encarga de eliminar tareas no ejecutadas de la tabla TgarOperacionLote.
        /// </summary>
        public static void Eliminar(RequestModulo rqmodulo, String ctarea)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_DELETE, new SqlParameter("fproceso", rqmodulo.Fconatble), new SqlParameter("clote", rqmodulo.Clote)
                                                           , new SqlParameter("cmodulo", rqmodulo.Cmodulo), new SqlParameter("ctarea", ctarea));
        }

        // Sentecnia que se encarga de eliminar operaciones a procesar, para una fecha de proceso y lote.
        private static String SQL_ALL_DELETE = "delete from TGAROPERACIONLOTE where FPROCESO = @fproceso and CLOTE = @clote and CMODULO = @cmodulo and CTAREA = @ctarea ";

        /// <summary>
        /// Metodo que se encarga de eliminar tareas no ejecutadas de la tabla TgarOperacionLote.
        /// </summary>
        public static void EliminarTodos(RequestModulo rqmodulo, String ctarea)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_ALL_DELETE, new SqlParameter("fproceso", rqmodulo.Fconatble), new SqlParameter("clote", rqmodulo.Clote)
                                                           , new SqlParameter("cmodulo", rqmodulo.Cmodulo), new SqlParameter("ctarea", ctarea));
        }

        private static String JPQL_TAREAS = "select ctarea from TgarOperacionLote t where t.coperacion = @coperacion and t.fproceso = @fproceso "
                + "and t.clote = @clote and t.cmodulo = @cmodulo and t.ctarea in(select i.ctarea from TloteModuloTareas i where activo=1) and t.ejecutada is null ";

        /// <summary>
        /// Entrega una lista de tareas a ejecutar por operacion.
        /// </summary>
        public static IList<string> GetTareas(RequestOperacion rqoperacion)
        {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            String SQL = JPQL_TAREAS;
            if (!String.IsNullOrEmpty(rqoperacion.Ctareahorizontal)) {
                SQL = SQL + " t.ctarea = @ctarea";
            }
            SQL = SQL + " order by t.orden";

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@coperacion"] = rqoperacion.Coperacion;
            parametros["@fproceso"] = rqoperacion.Fconatble;
            parametros["@clote"] = rqoperacion.Clote;
            parametros["@cmodulo"] = rqoperacion.Cmodulo;
            if (!String.IsNullOrEmpty(rqoperacion.Ctareahorizontal)) {
                parametros["@ctarea"] = rqoperacion.Ctareahorizontal;
            }

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            foreach (Dictionary<string, object> item in ldatos) {
                lcampos.Add(item["ctarea"].ToString());
            }

            return lcampos;
        }

        private static string JPQL_MARCAPROCESADAS = "update TgarOperacionLote set ejecutada = @ejecutada, mensaje = @mensaje, freal = current_timestamp, numeroejecucion = @numeroejecucion "
                + " where coperacion = @coperacion and fproceso = @fproceso and clote = @clote and cmodulo = @cmodulo and ejecutada is null ";


        public static int MarcaProcesadas(RequestOperacion rqoperacion, string mensaje)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.Database.ExecuteSqlCommand(JPQL_MARCAPROCESADAS
                , new SqlParameter("numeroejecucion", rqoperacion.Numeroejecucion), new SqlParameter("coperacion", rqoperacion.Coperacion)
                , new SqlParameter("fproceso", rqoperacion.Fconatble), new SqlParameter("clote", rqoperacion.Clote)
                , new SqlParameter("cmodulo", rqoperacion.Cmodulo), new SqlParameter("ejecutada", "1")
                , new SqlParameter("mensaje", mensaje));
        }

        // Sentencia que entrega las cuentas a procesar para un modulo.
        private static String SQL_RESULTSET = " select distinct coperacion from TGAROPERACIONLOTE t where t.FPROCESO = @fproceso and t.CLOTE = @clote and t.CMODULO = @cmodulo and t.ejecutada is null ";

        /// <summary>
        /// Entrega un resultset con las operaciones a procesar para un lote, modulo y fecha de proceso.
        /// </summary>
        public static ScrollableResults LlenaResultset(int fproceso, string clote, int cmodulo, string ctarea)
        {
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

        /// <summary>
        /// Entrega un resultset con las operaciones a ingresadas.
        /// </summary>
        public static List<tgaroperacion> LlenarResultadoOperaciones(string cestatus)
        {
            List<tgaroperacion> obj = new List<tgaroperacion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tgaroperacion.AsNoTracking().Where(x => x.cestatus == cestatus).ToList();
            return obj;
        }
    }
}
