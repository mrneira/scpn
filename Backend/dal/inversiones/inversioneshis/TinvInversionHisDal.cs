using System.Collections.Generic;
using System.Linq;
using modelo;
using util.servicios.ef;
using modelo.helper;
using modelo.servicios;
using util;
using System.Data.SqlClient;

namespace dal.inversiones.inversioneshis
{
    /// <summary>
    /// Clase que encapsula los procedimientos funcionales de la tabla histórica de inversiones.
    /// </summary>
    public class TinvInversionHisDal
    {

        private static string DELHIS = "delete from tinvinversionhis where cinversionhis = @cinversionhis ";

        /// <summary>
        /// Elimina el histórico de inversiones, dado su identificador.
        /// </summary>
        /// <param name="icinversionhis">Identificador del histórico de inversiones.</param>
        /// <returns></returns>
        public static void DeleteHis(long icinversionhis)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELHIS,
                new SqlParameter("cinversionhis", icinversionhis));
        }



        private static string DEL = "delete from tinvinversionhis where cinversion = @cinversion ";

        /// <summary>
        /// Elimina el histórico de inversiones, dado el identificador de la inversión.
        /// </summary>
        /// <param name="icinversion">Identificador de la inversión.</param>
        /// <returns></returns>
        public static void Delete(long icinversion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DEL,
                new SqlParameter("cinversion", icinversion));
        }


        /// <summary>
        /// Obtener un registro del histórico de inversiones, dado su identificador.
        /// </summary>
        /// <param name="cinversionhis">Identificador del histórico de inversiones.</param>
        /// <returns>tinvinversionhis</returns>
        public static tinvinversionhis Find(long cinversionhis)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvinversionhis obj;
            obj = contexto.tinvinversionhis.Where(x => x.cinversionhis.Equals(cinversionhis)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Obtener el histórico de inversiones, dado el identificador de su inversión.
        /// </summary>
        /// <param name="cinversion">Identificador del histórico de inversiones.</param>
        /// <returns>tinvinversionhis</returns>
        public static tinvinversionhis FindCInversion(long cinversion)
        {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tinvinversionhis obj;
            obj = contexto.tinvinversionhis.Where(x => x.cinversion.Equals(cinversion)).SingleOrDefault();
            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;

        }

        /// <summary>
        /// Obtener la nueva tasa de la inversión, dado el identificador de la inversión.
        /// </summary>
        /// <param name="cinversion">Identificador del histórico de inversiones.</param>
        /// <returns>decimal</returns>
        public static decimal obtenerNuevaTasa(long cinversion)
        {

            string lSql = "select tasanueva tasanueva from tinvinversionhis where cinversion = " +
                cinversion.ToString();

            tinvinversionhis fc = new tinvinversionhis();
            Dictionary<string, object> parametros = new Dictionary<string, object>();
            List<string> lcampos = new List<string>();
            lcampos.Add("tasanueva");
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                ConsultaHelper ch = new ConsultaHelper(contexto, parametros, lSql);
                fc = (tinvinversionhis)ch.GetRegistro("tinvinversionhis", lcampos);
            }
            catch (System.InvalidOperationException)
            {
                throw new AtlasException("INV-0001", "'ERROR AL GENERAR CIDINVERSION");
            }

            return decimal.Parse(fc.Mdatos.Values.ElementAt(0).ToString());

        }


        private static string DELE = "delete from tinvinversionhis";

        /// <summary>
        /// Eliminar el histórico de inversiones.
        /// </summary>
        /// <returns></returns>
        public static void DeleteAll()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(
                DELE);
        }



    }
}
