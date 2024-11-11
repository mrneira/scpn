using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.lote;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionLote.
    /// </summary>
    public class TcarOperacionLoteDal {

        // Sentecnia que se encarga de eliminar operaciones a procesar, para una fecha de proceso y lote.
        private static String SQL_DELETE = "delete from TCAROPERACIONLOTE where  "
            + "FPROCESO = @fproceso and CLOTE = @clote and CMODULO = @cmodulo and CTAREA = @ctarea and EJECUTADA is null ";

        /// <summary>
        /// Metodo que se encarga de eliminar tareas no ejecutadas de la tabla TcarOperacionLote.
        /// </summary>
        public static void Eliminar(RequestModulo rqmodulo, String ctarea)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_DELETE, new SqlParameter("fproceso", rqmodulo.Fconatble), new SqlParameter("clote", rqmodulo.Clote)
                                                           , new SqlParameter("cmodulo", rqmodulo.Cmodulo), new SqlParameter("ctarea", ctarea));
        }

        // Sentecnia que se encarga de eliminar operaciones a procesar, para una fecha de proceso y lote.
        private static String SQL_ALL_DELETE = "delete from TCAROPERACIONLOTE where FPROCESO = @fproceso and CLOTE = @clote and CMODULO = @cmodulo and CTAREA = @ctarea ";

        /// <summary>
        /// Metodo que se encarga de eliminar tareas no ejecutadas de la tabla TcarOperacionLote.
        /// </summary>
        public static void EliminarTodos(RequestModulo rqmodulo, String ctarea)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SQL_ALL_DELETE, new SqlParameter("fproceso", rqmodulo.Fconatble), new SqlParameter("clote", rqmodulo.Clote)
                                                           , new SqlParameter("cmodulo", rqmodulo.Cmodulo), new SqlParameter("ctarea", ctarea));
        }

        private static String JPQL_TAREAS = "select ctarea from TcarOperacionLote t where t.coperacion = @coperacion and t.fproceso = @fproceso "
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

        private static string JPQL_MARCAPROCESADAS = "update TcarOperacionLote set ejecutada = @ejecutada, mensaje = @mensaje, freal = current_timestamp, numeroejecucion = @numeroejecucion "
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
        private static String SQL_RESULTSET = " select distinct coperacion from TCAROPERACIONLOTE t where t.FPROCESO = @fproceso and t.CLOTE = @clote and t.CMODULO = @cmodulo and t.ejecutada is null ";

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
        /// Entrega un resultset con las operaciones a procesar para un lote, modulo y fecha de proceso.
        /// </summary>
        public static List<tcaroperacioncuota> LlenarOperacionesVencidas(int fcontable, decimal diasVenciomiento)
        {
            //string SQL_VENCIMIENTO = "select distinct toc.coperacion from tcaroperacioncuota toc where (toc.fvencimiento - {0})<{1}";
            List<tcaroperacioncuota> obj = new List<tcaroperacioncuota>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperacioncuota.AsNoTracking().Where(x => (x.fvencimiento - fcontable) < diasVenciomiento).Distinct().ToList();
            return obj;
        }

        /// <summary>
        /// Entrega un resultset con las operaciones a ingresadas.
        /// </summary>
        public static List<tcaroperacion> LlenarResultadoOperaciones(string cestatus)
        {
            List<tcaroperacion> obj = new List<tcaroperacion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperacion.AsNoTracking().Where(x => x.cestatus == cestatus).ToList();
            return obj;
        }

        /// <summary>
        /// Entrega un resultset con las operaciones en proceso.
        /// </summary>
        public static List<tcaroperacionlote> FindNoProcesadas(string ctarea, int fcontable, String clote, int cmodulo)
        {
            List<tcaroperacionlote> obj = new List<tcaroperacionlote>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperacionlote.Where(x => x.ctarea == ctarea && x.fproceso == fcontable && x.clote == clote && x.cmodulo == cmodulo && x.ejecutada == null).ToList();
            return obj;
        }
    }
}
