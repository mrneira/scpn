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
using System.Data;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla aportes
    /// </summary>
    public class TpreAportesDal {
        /// <summary>
        /// Método que consulta los aportes del socio por persona
        /// </summary>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static IList<tpreaporte> FindPorPersona(long cpersona) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tpreaporte> ldata = contexto.tpreaporte.AsNoTracking().Where(x => x.cpersona == cpersona).ToList();
            return ldata;
        }


        private static string sql_aportes = " SET LANGUAGE spanish " +
                                                "select t1.*, t2.adicional, t2.acumulado from( " +
                                                "select* from( " +
                                                "select year(CONVERT (date,convert(char(8),fechaaporte*100+1)))  as anio, DATENAME(month, CONVERT (date,convert(char(8),fechaaporte*100+1))) mes, aportepersonal  as aporte from tpreaporte " +
                                                "where cpersona = @cpersona and activo = 1 and valido = 1)srv " +
                                                "pivot " +
                                                "(sum(aporte) " +
                                                "for mes in ([enero],[febrero],[marzo],[abril],[mayo],[junio],[julio],[agosto],[septiembre],[octubre],[noviembre],[diciembre])) as taportes  ) t1 " +
                                                "inner join( " +
                                                "select year(CONVERT (date,convert(char(8),fechaaporte*100+1)))  as anio, sum(ajuste) adicional, sum(aportepersonal) + sum(ajuste) acumulado  from tpreaporte " +
                                                "where cpersona = @cpersona and activo = 1 and valido = 1 " +
                                                "group by year(CONVERT (date,convert(char(8),fechaaporte*100+1)))) t2 on t1.anio = t2.anio " +
                                                "order by t1.anio ";

        /// <summary>
        /// Método que consulta los aportes en una matriz de aportes personales
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetAportes(RqConsulta rqconsulta) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = rqconsulta.Mdatos["cpersona"];

            List<string> lcampos = new List<string>();
            lcampos.Add("ruta");
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, sql_aportes);
            ch.registrosporpagina = 1000;
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;
        }

        private static string sql_aportesPatronales = " SET LANGUAGE spanish " +
                                        "select t1.*, t2.adicional, t2.acumulado from( " +
                                        "select* from( " +
                                        "select year(CONVERT (date,convert(char(8),fechaaporte*100+1)))  as anio, DATENAME(month, CONVERT (date,convert(char(8),fechaaporte*100+1))) mes, aportepatronal  as aporte from tpreaporte " +
                                        "where cpersona = @cpersona and activo = 1 and valido = 1)srv " +
                                        "pivot " +
                                        "(sum(aporte) " +
                                        "for mes in ([enero],[febrero],[marzo],[abril],[mayo],[junio],[julio],[agosto],[septiembre],[octubre],[noviembre],[diciembre])) as taportes  ) t1 " +
                                        "inner join( " +
                                        "select year(CONVERT (date,convert(char(8),fechaaporte*100+1)))  as anio, sum(ajustepatronal) adicional, sum(aportepatronal) + sum(ajustepatronal) acumulado  from tpreaporte " +
                                        "where cpersona = @cpersona and activo = 1 and valido = 1 " +
                                        "group by year(CONVERT (date,convert(char(8),fechaaporte*100+1)))) t2 on t1.anio = t2.anio " +
                                        "order by t1.anio ";

        /// <summary>
        /// Método que consulta los aportes en una matriz de aportes patronales
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetAportesPatronal(RqConsulta rqconsulta) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = rqconsulta.Mdatos["cpersona"];

            List<string> lcampos = new List<string>();
            lcampos.Add("ruta");
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, sql_aportesPatronales);
            ch.registrosporpagina = 1000;
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;
        }

        private static string SQL_totales = " select count(cpersona) naportes, sum (aportepersonal + ajuste) TAPORTE, isnull(sum(interesgenerado),0)  interes, sum(aportepersonal) taportepersonal "
                                     + "from tpreaporte where cpersona = @cpersona and activo = 1 and valido = 1 order by 1 ";

        /// <summary>
        /// Método que obtiene el total de aportes , total de aportes e interes por consulta
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetTotalAportes(RqConsulta rqconsulta) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = rqconsulta.Mdatos["cpersona"];

            List<string> lcampos = new List<string>();
            lcampos.Add("ruta");
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_totales);
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;

        }

        /// <summary>
        /// Método que obtiene el total de aportes , total de aportes e interes por mantenimiento
        /// </summary>
        /// <param name="rm"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetTotalAportes(RqMantenimiento rm) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cpersona"] = rm.Mdatos["cpersona"];

            List<string> lcampos = new List<string>();
            lcampos.Add("ruta");
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_totales);
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;

        }
        /// <summary>
        /// Método que obtiene el total de aportes , total de aportes e interes por persona y por simulacion
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="simulacion"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> GetTotalAportes(long cpersona, string simulacion = "S") {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            string storeprocedure = "sp_Interes";
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@i_simulacion"] = simulacion;
            parametros["@i_cpersona"] = cpersona;
            DataTable DataTable = dal.storeprocedure.StoreProcedureDal.GetDataTable(storeprocedure, parametros);
            IList<Dictionary<string, object>> list = DataTable.AsEnumerable().Select(dr => {
                var dic = new Dictionary<string, object>();
                dr.ItemArray.Aggregate(-1, (int i, object v) => {
                    i += 1; dic.Add(DataTable.Columns[i].ColumnName, v);
                    return i;
                });
                return dic;
            }).ToList();

            return list;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="faporte">Fecha de aporte, únicamente se envía anio y mes formato 201801</param>
        /// <returns></returns>
        public static List<tpreaporte> FindPorFaporte(int faporte) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpreaporte> ldata = contexto.tpreaporte.AsNoTracking().Where(x => x.fechaaporte == faporte).ToList();
            return ldata;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="faporte">Fecha de aporte, únicamente se envía anio y mes formato 201801</param>
        /// <returns></returns>
        public static tpreaporte FindPorCpersonaFaporte(long cpersona, int faporte) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpreaporte obj = contexto.tpreaporte.AsNoTracking().Where(x => x.fechaaporte == faporte && x.cpersona == cpersona).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Método que obtiene la maxima secuencia del aporte
        /// </summary>
        /// <returns></returns>
        public static long? GetMaxCaportes() {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            long? max = 0;
            max = contexto.tpreaporte.Where(p => p != null)
           .Select(p => p.caporte)
           .DefaultIfEmpty()
           .Max();
            return max;
        }

        /// <summary>
        /// Método que obtiene los aportes al 2002
        /// </summary>
        /// <param name="taportes"></param>
        /// <returns></returns>
        public static decimal? GetTotalAportes2002(IList<Dictionary<string, object>> taportes) {
            decimal? valor = 0;
            valor = decimal.Parse(taportes[0]["TAPORTE2002"].ToString());
            return valor;
        }

        /// <summary>
        /// Método que obtiene el número de aportes de los oficiales por persona fecha de alta y fecha de baja
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="fechaAlta"></param>
        /// <param name="fechaBaja"></param>
        /// <returns></returns>
        public static int? GetNumAporteOficial(long cpersona, DateTime fechaAlta, DateTime fechaBaja) {
            int falta = Fecha.DateToInteger(fechaAlta);
            int fbaja = Fecha.DateToInteger(fechaBaja);
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            var valor = contexto.tpreaporte
            .Where(o => o.activo == true && o.cpersona == cpersona && (o.fechaaporte * 100) + 1 >= falta
                                                    && (o.fechaaporte * 100) + 1 <= fbaja)
            .Count();

            return valor;

        }

        /// <summary>
        /// Método que obtiene la suma de los aportes patronales
        /// </summary>
        /// <param name="laportes"></param>
        /// <returns></returns>
        public static decimal? GetSumPatronal(List<tpreaporte> laportes) {
            decimal? valor = 0;
            foreach(tpreaporte laportesaux in laportes) {
                valor = valor + laportesaux.aportepatronal;
            }
            return valor;

        }

        /// <summary>
        /// Método que obtiene la suma de los aportes personales
        /// </summary>
        /// <param name="laportes"></param>
        /// <returns></returns>
        public static decimal? GetSumPersonal(List<tpreaporte> laportes) {
            decimal? valor = 0;
            foreach(tpreaporte laportesaux in laportes) {
                valor = valor + laportesaux.aportepersonal;
            }
            return valor;

        }

        /// <summary>
        /// Método que obtiene el ultimo aporte del socio por persona
        /// </summary>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static DateTime GetFultimoaporte(long cpersona) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            tpreaporte obj = null;
            long? max = 0;
            max = contexto.tpreaporte.Where(p => p != null && p.cpersona == cpersona && p.activo == true && p.valido == true)
           .Select(p => p.fechaaporte)
           .DefaultIfEmpty()
           .Max();
            //obj = contexto.tpreaporte.AsNoTracking().Where(x => x.cpersona == cpersona && x.caporte == max).SingleOrDefault();
            DateTime fecha = new DateTime();
            fecha = DateTime.Now;
            if(max ==null || max == 0)
            {
                max=Fecha.DateToInteger(fecha);
                max = Fecha.GetAnio((int)max) * 100 + Fecha.GetMes((int)max);
            }
            return Fecha.ToDate((int)max * 100 + 1);
        }

        public static List<tpreaporte> GetAportesXFaporte(int faporte) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            List<tpreaporte> laportes = new List<tpreaporte>();
            laportes = contexto.tpreaporte.AsNoTracking().Where(x => x.fechaaporte == faporte).ToList();
            return laportes;
        }
    }
}

