using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
    public class TnomIngresosDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomingreso.
        /// </summary>
        /// <returns>IList<tnomingreso></returns>
        public static IList<tnomingreso> findInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomingreso> ldatos = ldatos = contexto.tnomingreso.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tnomingreso por cingreso.
        /// </summary>
        /// <returns>IList<tnomingreso></returns>
        public static IList<tnomingreso> Find(long? cingreso)
        {
            IList<tnomingreso> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomingreso.Where(x =>x.cingreso==cingreso).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        public static IList<tnomingreso> FindRol(long? crol)
        {
            IList<tnomingreso> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomingreso.Where(x => x.crol == crol ).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

       
        public static IList<tnomingreso> FindNomina(long? cnomina)
        {
            IList<tnomingreso> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tnomingreso.Where(x => x.tnomrol.cnomina==cnomina).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

        public static decimal IngresosRetencionesFuente(long anio,long cfuncionario)
        {
            String SQL = "SELECT ISNULL(sum(ing.calculado),0) AS total FROM tnomingreso ing "
                    + "INNER JOIN tnomrol rol ON ing.crol = rol.crol "
                    + "JOIN tnomnomina nom ON nom.cnomina = rol.cnomina "
                    + "WHERE rol.cfuncionario= @cfuncionario "
                    + "AND ing.tipocdetalle = 'RETIRE' "
                    + "AND nom.estadicdetalle= 'CON' "
                    + "AND nom.anio=@anio";


            tnomingreso fc = new tnomingreso();
            // parametros de consulta de ingresos
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cfuncionario"] = cfuncionario;
            parametros["@anio"] = anio;
            // campos adiciones para la consulta.
            List<string> lcampos = new List<string>();
           
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL);

            fc = (tnomingreso)ch.GetRegistro("tnomingreso", lcampos);
            try
            {
                return decimal.Parse(fc.Mdatos.Values.ElementAt(0).ToString());
            }
            catch
            {
                return 0;
            }
        }
        public static decimal IngresosDecimoTercero(String mes, long? cfuncionario)
        {
            string lSql = "SELECT (SELECT sum(tni.calculado) FROM " +
                          "tnomingreso tni,tnombeneficio tnb " +
                          "WHERE tni.crol = tnr.crol " +
                          "AND tnb.ingreso = 1 " +
                          "AND tni.mescdetalle = " + mes + ") " +
                          "AS total from tnomrol tnr " +
                          "WHERE tnr.cfuncionario = " + cfuncionario.ToString();

            tnomingreso fc = new tnomingreso();
            // parametros de consulta de ingresos
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            // campos adiciones para la consulta.
            List<string> lcampos = new List<string>();

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);

            fc = (tnomingreso)ch.GetRegistro("tnomingreso", lcampos);
            try
            {
                return decimal.Parse(fc.Mdatos.Values.ElementAt(0).ToString());
            }
            catch
            {
                return 0;
            }
        }
    }
}
