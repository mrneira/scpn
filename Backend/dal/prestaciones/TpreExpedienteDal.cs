using modelo;
using modelo.servicios;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;
using util.dto.consulta;
using dal.generales;
using System.Configuration;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla expediente
    /// </summary>
    public class TpreExpedienteDal {
        /// <summary>
        /// Método que busca el expediente por persona , compania
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        private static string connectionString;

        public static tpreexpediente Find(long cpersona, int ccompania) {
            tpreexpediente obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.cdetalleestado != "NEG").SingleOrDefault();
            return obj;
        }
        /// <summary>
        /// Método que busca todos los expedientes del socio por persona y compania
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static List<tpreexpediente> FindToList(long cpersona, int ccompania) {
            List<tpreexpediente> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania).ToList();
            return obj;
        }

        /// <summary>
        /// Método que busca al expediente por código de expediente
        /// </summary>
        /// <param name="cexpediente"></param>
        /// <returns></returns>
        public static tpreexpediente FindToExpediente(string cexpediente) {
            tpreexpediente obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cexpediente == cexpediente).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Método que busca al expediente por secuencia del expediente
        /// </summary>
        /// <param name="secuencia"></param>
        /// <returns></returns>
        public static tpreexpediente FindToExpediente(int secuencia) {
            tpreexpediente obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.secuencia == secuencia).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Método que busca un expediente por persona y compania dependiendo del estado
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="estado"></param>
        /// <returns></returns>
        public static tpreexpediente FindToEstado(long cpersona, int ccompania, string estado) {
            tpreexpediente obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.ccatalogoestado == 2803 && x.cdetalleestado == estado).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Método que busca un expediente por persona y compania dependiendo de la etapa
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="etapa"></param>
        /// <param name="cdetalletipoexp"></param>
        /// <returns></returns>
        public static tpreexpediente FindToEtapa(long cpersona, int ccompania, string etapa, string cdetalletipoexp) {
            tpreexpediente obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            //obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.ccatalogoetapa == 2806 && x.cdetalleetapa == etapa && x.ccatalogoestado == 2803 && x.cdetalletipoexp == cdetalletipoexp && x.cdetalleestado != "CAN").SingleOrDefault();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.ccatalogoetapa == 2806 && x.cdetalleetapa == etapa && x.ccatalogoestado == 2803 && x.cdetalletipoexp == cdetalletipoexp && x.cdetalleestado != "CAN").OrderByDescending(x => x.fingreso).Take(1).SingleOrDefault();// MNE20240910
            return obj;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>

        public static tpreexpediente FindToUltimaEtapa(long cpersona, int ccompania) {
            tpreexpediente obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.ccatalogoetapa == 2806 && x.cdetalleetapa == "5" && x.ccatalogoestado == 2803 && x.cdetalletipoexp != "ANT").SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Método que busca un expediente por codigo de expediente dependiendo del estado
        /// </summary>
        /// <param name="cexpediente"></param>
        /// <param name="etapa"></param>
        /// <returns></returns>
        public static tpreexpediente FindToExpedienteEtapa(string cexpediente, string etapa) {
            tpreexpediente obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cexpediente == cexpediente && x.ccatalogoetapa == 2806 && x.cdetalleetapa == etapa && x.ccatalogoestado == 2803 && x.cdetalleestado != "CAN").SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Método que busca el ultimo expediente del socio 
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tpreexpediente FinToExpedienteLiquidado(long cpersona, int ccompania) {
            tpreexpediente obj = null;
            long? secuenciamax = GetMaxSecuenciaLiquidado(cpersona, ccompania);
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.anticipo == false && x.secuencia == secuenciamax).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Métdo que obtiene el ultimo expediente es estado cancelaado que tiene un socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static long? GetMaxSecuenciaLiquidado(long cpersona, int ccompania) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            long? max = 0;
            max = contexto.tpreexpediente.Where(p => p != null && p.cpersona == cpersona && p.ccompania == ccompania && p.anticipo == false && p.cdetalleestado == "CAN")
           .Select(p => p.secuencia)
           .DefaultIfEmpty()
           .Max();
            return max;
        }

        /// <summary>
        /// Métdo que obtiene el ultimo expediente es estado activo que tiene un socio
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tpreexpediente FindBanca(long cpersona, int ccompania) {
            tpreexpediente obj = null;
            long? secuenciamax = GetMaxSecuencia(cpersona, ccompania);
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.anticipo == false && x.secuencia == secuenciamax).SingleOrDefault();
            return obj;
        }

        /// <summary>
        ///  Métdo que obtiene la secuencia maxima de un expediente activo yq ue no sea anticipo
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static long? GetMaxSecuencia(long cpersona, int ccompania) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            long? max = 0;
            max = contexto.tpreexpediente.Where(p => p != null && p.cpersona == cpersona && p.ccompania == ccompania && p.anticipo == false)
           .Select(p => p.secuencia)
           .DefaultIfEmpty()
           .Max();
            return max;
        }

        private static string SQL_secuencia = "  select  count(cdetalletipoexp) + 1 secuencia ,  cdetalletipoexp  from tpreexpediente " +
                                            " group by cdetalletipoexp, year(fechainicio) order by 1 ";

        /// <summary>
        /// Obtiene las secuencias del expediebte
        /// </summary>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetListaSecuencia() {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();

            List<string> lcampos = new List<string>();
            lcampos.Add("ruta");
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_secuencia);
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;

        }

        /// <summary>
        /// Obtiene las secuencias del expediente por liquidacion y anno
        /// </summary>
        /// <param name="cdetalletipoexp"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public static int? GetSecuenciaporTipoLiquidacion(string cdetalletipoexp, int year) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            var valor = contexto.tpreexpediente
            .Where(o => o.cdetalletipoexp.Equals(cdetalletipoexp) && o.fechainicio.Year == year)
            .Count();
            return valor;
        }

        /// <summary>
        /// Obtiene los expedientes del socio por tipo de liquidacion su estado 
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <param name="cdetalletipoexp"></param>
        /// <param name="etapafinal"></param>
        /// <returns></returns>
        public static tpreexpediente FindToLiquidacion(long cpersona, int ccompania, string cdetalletipoexp, bool etapafinal = false) {
            tpreexpediente obj = null;
            string cdetalleestado = "ACT";
            if (etapafinal) {
                cdetalleestado = "CAN";
            }

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.cdetalletipoexp == cdetalletipoexp && x.cdetalleestado == cdetalleestado).SingleOrDefault();

            if (obj == null) {
                if (cdetalletipoexp.Equals("CEF")) {
                    cdetalletipoexp = "CES";
                    obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.cdetalletipoexp == cdetalletipoexp && x.cdetalleestado == cdetalleestado).SingleOrDefault();
                    if (obj != null) {
                        return obj;
                    }
                }

                if (cdetalletipoexp.Equals("CES")) {
                    cdetalletipoexp = "CEF";
                    obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.cdetalletipoexp == cdetalletipoexp && x.cdetalleestado == cdetalleestado).SingleOrDefault();
                    if (obj != null) {
                        return obj;
                    }
                }

                if (cdetalletipoexp.Equals("DEH")) {
                    cdetalletipoexp = "DEV";
                    obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.cdetalletipoexp == cdetalletipoexp && x.cdetalleestado == cdetalleestado).SingleOrDefault();
                    if (obj != null) {
                        return obj;
                    }
                }

                if (cdetalletipoexp.Equals("DEV")) {
                    cdetalletipoexp = "DEH";
                    obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.cdetalletipoexp == cdetalletipoexp && x.cdetalleestado == cdetalleestado).SingleOrDefault();
                    if (obj != null) {
                        return obj;
                    }
                }
            }

            return obj;


        }

        private static String SQL = " SELECT a.cpersona,g.cdetallejerarquia,h.festado,h.csubestado,h.cgradoactual,count(a.caporte) taportes"
                      + " FROM tpreaporte a,tsoccesantia s, tsoccesantiahistorico h,tsoctipogrado g, tperpersonadetalle p"
                      + " WHERE a.cpersona = s.cpersona AND a.ccompania = s.ccompania AND s.verreg = 0"
                      + " AND s.cpersona = h.cpersona AND s.ccompania = h.ccompania AND h.verreg = 0 AND s.verreg = 0 AND s.secuenciahistorico = h.secuencia"
                      + " AND h.cestadosocio = 3"
                      + " AND g.cgrado = h.cgradoactual"
                      + " AND p.cpersona = s.cpersona"
                      + " AND p.ccompania = s.ccompania"
                      + " AND p.verreg = 0"
                      + " AND h.festado > '2002-09-13'"
                      + " and not EXISTS (select 1 from tpreexpediente i"
                                     + " where i.cpersona = s.cpersona and i.ccompania = 1"
                                     + " and i.cdetalletipoexp != 'ANT')"
                      + " GROUP BY a.cpersona,g.cdetallejerarquia,h.festado,h.csubestado,h.cgradoactual";
        /// <summary>
        /// Entrega una lista de no cobradas.
        /// </summary>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetSocio() {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            // parametros["@crol"] = crol;
            // parametros["@ccompania"] = ccompania;
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);
            ch.registrosporpagina = 5000;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }


        private static String SQLDelete = " delete from tprenocobradas";
        /// <summary>
        /// Eliminar tabla para datos de prestaciones no cobradas
        /// </summary>
        public static void EliminarNoCobradas() {
            SqlCommand cmdDelete = new SqlCommand(SQLDelete);
            //cmdDeleteSaldo.Parameters.AddWithValue("@fcierre", fcierre);
            // cmdDeleteSaldo.Parameters.AddWithValue("@ccompania", ccompania);
            EjecutarSQLCommand(cmdDelete);

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
        public static void SetConnectionString() {
            connectionString = ConfigurationManager.ConnectionStrings["AtlasContexto"].ConnectionString.Replace("metadata=res://*/ModeloEF.csdl|res://*/ModeloEF.ssdl|res://*/ModeloEF.msl;provider=System.Data.SqlClient;provider connection string", "");
            connectionString = connectionString.Substring(connectionString.IndexOf("data source"));
            connectionString = connectionString.Substring(0, connectionString.Length - 1);
        }
    }
}
