using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.lote
{
    public class TloteResultadoIndividualDal {

        private static string JPQL_DELETE = "delete from TloteResultadoIndividual where cidentificador = @cidentificador and fproceso = @fproceso "
            + "and clote = @clote and cmodulo = @cmodulo  ";
        /// <summary>
        ///     Borra los resultados individuales dado el identificador.
        /// </summary>
        private static void Delete(RequestOperacion rqoperacion, String cidentificador) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("cidentificador", cidentificador), new SqlParameter("fproceso", rqoperacion.Fconatble)
                                                           , new SqlParameter("clote", rqoperacion.Clote), new SqlParameter("cmodulo", rqoperacion.Cmodulo));
	    }

        public static tloteresultadoindividual Find(string cidentificador, int fcontable, String clote, int cmodulo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tloteresultadoindividual obj = contexto.tloteresultadoindividual.Where(x=> x.cidentificador == cidentificador && x.fproceso == fcontable && x.clote == clote && x.cmodulo == cmodulo).SingleOrDefault();
		    return obj;
	    }

        public static void registraerror(RequestOperacion rqoperacion, String ctarea, String mensaje, String cresultado, string textoresultado) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            String cidentificador = null;
		    if (rqoperacion.Coperacion != null) {
			    cidentificador = rqoperacion.Coperacion.ToString();
            } else {
			    cidentificador = rqoperacion.Cregistro;
                if (string.IsNullOrEmpty(cidentificador))
                {
                    cidentificador = rqoperacion.Cregistronumero.ToString();
                }
		    }
            TloteResultadoIndividualDal.Delete(rqoperacion, cidentificador);
		    if (cresultado.Length > 12) {
			    cresultado = cresultado.Substring(0, 11);
		    }
		    if (textoresultado.Length > 200) {
			    textoresultado = textoresultado.Substring(0, 199);
		    }
            tloteresultadoindividual obj = new tloteresultadoindividual();
            obj.cidentificador = cidentificador;
            obj.fproceso = rqoperacion.Fconatble ?? 0;
            obj.clote = rqoperacion.Clote;
            obj.cmodulo = rqoperacion.Cmodulo ?? 0;
            obj.ctarea = ctarea;
            obj.cresultado = cresultado;
            obj.textoresultado = textoresultado;
            obj.mensaje = mensaje;
            obj.numeroejecucion = rqoperacion.Numeroejecucion;
            obj.freal = Fecha.GetFechaSistema();

            Sessionef.Save(obj);
        }

        private static string SQL_EXIEERRORES = " select coalesce(count(*),0) as cantidad from TloteResultadoIndividual t where t.fproceso = @fcontable "
            + "and t.numeroejecucion = @numeroejecucion  and t.cmodulo = @cmodulo and t.clote = @clote and t.cresultado != '0' ";
        /// <summary>
        ///     Metodo que valida si existe errores en procesos de creación de TloteResultadoPrevio, para la fecha contable, numero de ejecucion y codigo de lote.
        /// </summary>
        /// <param name="fcontable"></param>
        /// <param name="numeroejecucion"></param>
        /// <param name="clote"></param>
        /// <param name="cmodulo"></param>
        public static Boolean ExisteErrores(int fcontable, int numeroejecucion, string clote, int cmodulo) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            parametros["@numeroejecucion"] = numeroejecucion;
            parametros["@clote"] = clote;
            parametros["@cmodulo"] = cmodulo;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_EXIEERRORES);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistroDictionary();
            if (ldatos == null || ldatos.Count <= 0) {
                return false;
            }
            object item = ldatos[0]["cantidad"];
            if (int.Parse(item.ToString()) == 0) {
                return false;
            }
            return true;
        }

        // Sentencia que entrega el numero de errores en la ejecucion del lote.
        private static String SQL_EXITO = " select coalesce(count(*),0) as cantidad from TloteResultadoIndividual t where t.fproceso = @fcontable and t.numeroejecucion = @numeroejecucion "
            + "and t.clote = @clote and t.cresultado = '0' and t.cmodulo = @cmodulo ";

        /// <summary>
        ///     Sentencia que entrega el numero de errores resultado de ejecutar un lote por modulo.
        /// </summary>
        public static int GetProcesadosExito(int fcontable, int numeroejecucion, string clote, int cmodulo) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            parametros["@numeroejecucion"] = numeroejecucion;
            parametros["@clote"] = clote;
            parametros["@cmodulo"] = cmodulo;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_EXITO);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistroDictionary();
            if (ldatos == null || ldatos.Count <= 0) {
                return 0;
            }
            
            object item = ldatos[0]["cantidad"];
            int exitos = int.Parse(item.ToString());
     
		    return exitos;
	    }


        // Sentencia que entrega el numero de errores en la ejecucion del lote.
        private static String SQL_ERRORES = " select coalesce(count(*),0) as cantidad from TloteResultadoIndividual t where t.fproceso = @fcontable and t.numeroejecucion = @numeroejecucion "
            + "and t.clote = @clote and t.cresultado != '0' ";

        /// <summary>
        ///     Sentencia que entrega el numero de errores resultado de ejecutar un lote por modulo.
        /// </summary>
        public static int GetProcesadosError(int fcontable, int numeroejecucion, string clote, int? cmodulo, string ctarea) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            String SQL = SQL_ERRORES;
            if (cmodulo  != null) {
                SQL = SQL + " and t.cmodulo = @cmodulo";
            }
            if (!String.IsNullOrEmpty(ctarea)) {
                SQL = SQL + " and t.ctarea = @ctarea";
            }

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fcontable"] = fcontable;
            parametros["@numeroejecucion"] = numeroejecucion;
            parametros["@clote"] = clote;            
            if (cmodulo != null) {
                parametros["@cmodulo"] = cmodulo;
            }
            if (!String.IsNullOrEmpty(ctarea)) {
                parametros["@ctarea"] = ctarea;
            }

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_ERRORES);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistroDictionary();
            if (ldatos == null || ldatos.Count <= 0) {
                return 0;
            }

            object item = ldatos[0]["cantidad"];
            int errores = int.Parse(item.ToString());

            return errores;
        }


    }
}
