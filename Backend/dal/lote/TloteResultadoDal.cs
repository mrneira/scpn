using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.lote
{
    public class TloteResultadoDal {

        /// <summary>
        ///     Actualiza el total de registros a procesar en el lote.
        /// </summary>
        public static tloteresultado Find(int cmodulo, string clote, int fproceso, int nejecucion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tloteresultado obj = contexto.tloteresultado.Where(x => x.fproceso == fproceso && x.numeroejecucion == nejecucion && x.clote == clote && x.cmodulo == cmodulo).Single();
            return obj;
        }

        private static String JPQL_MAIL = "select t.email from TperPersonaDetalle t where t.ccompania = @ccompania and t.cpersona = @cpersona";

        /// <summary>
        ///     Retorna el mail de la persona responsable.
        /// </summary>
        public static string ObtenerMailLote(int ccompania, long cpersona) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@ccompania"] = ccompania;
            parametros["@cpersona"] = cpersona;

            string mail = null;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, JPQL_MAIL);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistroDictionary();
            if (ldatos!=null && ldatos.Count>0) {
                if (ldatos.ElementAt(0)["email"]!=null) {
                    mail = ldatos.ElementAt(0)["email"].ToString();
                }
            }
            return mail;
        }


        /// <summary>
        ///     Inserta un registro en la tabla TLOTERESULTADO, con la fecha de inicio de ejecucion del lote por modulo.
        /// </summary>
        public static void Crear(int fcontable, int numeroejecucion, string clote, int cmodulo, String cusuario, int cmodulotranejecucion, int ctransaccionejecucion, int secuenciaresultado, string ctarea, String filtros) {
            tloteresultado obj = new tloteresultado();
            obj.fproceso = fcontable;
            obj.numeroejecucion = numeroejecucion;
            obj.clote = clote;
            obj.cmodulo = cmodulo;
            obj.secuencia = secuenciaresultado;
            obj.ctarea = ctarea;
            obj.cusuario = cusuario;
            obj.ctransaccionejecucion = ctransaccionejecucion;
            obj.cmodulotranejecucion = cmodulotranejecucion;
            obj.finicio = Fecha.GetFechaSistema();
            obj.filtros = filtros;
            Sessionef.Save(obj);
	    }


        /// <summary>
        ///     Actualiza la fecha de finalizacion dela ejecucion de un lote por modulo.
        /// </summary>
        public static void ActualizaFinalizacion(int fcontable, int numeroejecucion, String clote, int cmodulo, int secuenciaresultado, string ctarea, int total) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            List<tloteresultado> lobj = null;
            if (!String.IsNullOrEmpty(ctarea)) {
                lobj = contexto.tloteresultado.Where(x => x.fproceso == fcontable && x.numeroejecucion == numeroejecucion && x.clote == clote && x.cmodulo == cmodulo && x.secuencia == secuenciaresultado && x.ctarea == ctarea).ToList();
            } else {
                lobj = contexto.tloteresultado.Where(x => x.fproceso == fcontable && x.numeroejecucion == numeroejecucion && x.clote == clote && x.cmodulo == cmodulo && x.secuencia == secuenciaresultado).ToList();
            }

            foreach (tloteresultado obj in lobj) {
                obj.ffinalizacion = Fecha.GetFechaSistema();
                obj.total = total;
                obj.ejecutados = total;
                obj.cmodulo = cmodulo;
            }
            
	    }

        /// <summary>
        ///     Actualiza el total de registros a procesar en el lote.
        /// </summary>
        public static void ActualizaTotal(int fcontable, int numeroejecucion, string clote, int cmodulo, int secuenciaresultado, string ctarea, int total) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tloteresultado> lobj = null;
            if (!String.IsNullOrEmpty(ctarea)) {
                lobj = contexto.tloteresultado.Where(x => x.fproceso == fcontable && x.numeroejecucion == numeroejecucion && x.clote == clote && x.cmodulo == cmodulo && x.secuencia == secuenciaresultado && x.ctarea == ctarea).ToList();
            } else {
                lobj = contexto.tloteresultado.Where(x => x.fproceso == fcontable && x.numeroejecucion == numeroejecucion && x.clote == clote && x.cmodulo == cmodulo && x.secuencia == secuenciaresultado).ToList();
            }
            foreach (tloteresultado obj in lobj) {
                obj.total = total;
            }
        }

        /// <summary>
        ///     Actualiza contadores de ejecucion de lotes.
        /// </summary>
        public static void ActualizaContadores(int fcontable, int numeroejecucion, String clote, int cmodulo, int secuenciaresultado, string ctarea, int ejecutadas) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            int error = TloteResultadoIndividualDal.GetProcesadosError(fcontable, numeroejecucion, clote, cmodulo, ctarea);
            int exito = ejecutadas - error;

            List<tloteresultado> lobj = null;
            if (!String.IsNullOrEmpty(ctarea)) {
                lobj = contexto.tloteresultado.Where(x => x.fproceso == fcontable && x.numeroejecucion == numeroejecucion && x.clote == clote && x.cmodulo == cmodulo && x.secuencia == secuenciaresultado && x.ctarea == ctarea).ToList();
            } else {
                lobj = contexto.tloteresultado.Where(x => x.fproceso == fcontable && x.numeroejecucion == numeroejecucion && x.clote == clote && x.cmodulo == cmodulo && x.secuencia == secuenciaresultado).ToList();
            }
            foreach (tloteresultado obj in lobj) {
                obj.error = error;
                obj.exito = exito;
            }
        }


        private static string JPQL_LOTES_PROCESADOS = "select * from TloteResultado t where t.fproceso = @fproceso "
            + " and t.numeroejecucion=(select max(n.numeroejecucion) from TloteResultado n where n.fproceso = @fproceso "
            + "							  and n.clote=t.clote and n.cmodulo=t.cmodulo) ";

        /// <summary>
        /// Obtiene una lista de los ultimos lotes procesados.
        /// </summary>
        public static IList<Dictionary<string, object>> FindResultadosUltimosProcesados(int fproceso, string clote, int? cmodulo, string ctarea) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            String sql = JPQL_LOTES_PROCESADOS;
            if (!String.IsNullOrEmpty(clote)) {
                sql = sql + " and t.clote=@clote";
            }
            if (cmodulo != null) {
                sql = sql + " and t.cmodulo=@cmodulo";
            }
            if (!String.IsNullOrEmpty(ctarea)) {
                sql = sql + " and t.ctarea=@ctarea";
            }


            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@fproceso"] = fproceso;

            if (!String.IsNullOrEmpty(clote)) {
                parametros["@clote"] = clote;
            }
            if (cmodulo != null) {
                parametros["@cmodulo"] = cmodulo;
            }
            if (!String.IsNullOrEmpty(ctarea)) {
                parametros["@ctarea"] = ctarea;
            }

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, sql);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

    }
}
