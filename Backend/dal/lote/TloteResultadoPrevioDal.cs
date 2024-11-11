using modelo;
using modelo.helper;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.lote
{
    public class TloteResultadoPrevioDal {

        /// <summary>
        ///     Crea y entrega un objeto de tipo TloteResultadoPrevio.
        /// </summary>
        /// <param name="clote">Codigo de lote.</param>
        /// <returns>tloteresultadoprevio</returns>
        public static tloteresultadoprevio Crear(int fcontable, int numeroejecucion, string clote, int cmodulo, string ctarea,
                string cresultado, string textoresultado) {
		    if (cresultado.Length > 12) {
			    cresultado = cresultado.Substring(0, 11);
		    }
		    if (textoresultado.Length > 200) {
			    textoresultado = textoresultado.Substring(0, 199);
		    }
            tloteresultadoprevio obj = new tloteresultadoprevio();
            obj.fproceso = fcontable;
            obj.numeroejecucion = numeroejecucion;
            obj.clote = clote;
            obj.cmodulo = cmodulo;
            obj.ctarea = ctarea;
            obj.cresultado = cresultado;
		    obj.textoresultado = textoresultado;
		    obj.finicio = Fecha.GetDataBaseTimestamp();

		    return obj;
	    }

        /// <summary>
        ///     Entrega un objeto de tipo TloteResultadoPrevio.
        /// </summary>
        /// <param name="fcontable">Fecha contable.</param>
        /// <returns>tloteresultadoprevio</returns>
        public static IList<tloteresultadoprevio> Find(int fcontable) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
           IList<tloteresultadoprevio> obj = null;
            obj = contexto.tloteresultadoprevio.Where(x => x.fproceso == fcontable).ToList();
            return obj;
        }

        private static string SQL_EXIEERRORES = " select coalesce(count(*),0) as cantidad from tloteresultadoprevio t where t.fproceso = @fcontable and t.numeroejecucion = @numeroejecucion "
            + "and t.clote = @clote and t.cresultado != '0'  ";


        /// <summary>
        ///     Metodo que valida si existe errores en procesos de creación de TloteResultadoPrevio, para la fecha contable, numero de ejecucion codigo de lote.
        /// </summary>
        /// <param name="fcontable"></param>
        /// <param name="numeroejecucion"></param>
        /// <param name="clote"></param>
        public static Boolean ExisteErrores(int fcontable, int numeroejecucion, string clote, int? cmodulo, string ctarea) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            string sql = SQL_EXIEERRORES;
            if (cmodulo != null) {
                sql = sql + " and t.cmodulo=@cmodulo";
            }
            if (!String.IsNullOrEmpty(ctarea)) {
                sql = sql + " and t.ctarea=@ctarea";
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

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, sql);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistroDictionary();

            if (ldatos == null || ldatos.Count<=0) {
                return false;
            }
            object item = ldatos[0]["cantidad"];
            if (int.Parse(item.ToString()) == 0) {
			    return false;
		    }
		    return true;
	    }


    }
}
