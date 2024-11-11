using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
    public class TnomNominaDal
    {
        public static string CONSULTA =
                          " DELETE FROM tnomingreso WHERE crol IN(SELECT crol FROM tnomrol WHERE cnomina = @cnomina)"
                        + " DELETE FROM tnomegreso WHERE crol IN(SELECT crol FROM tnomrol WHERE cnomina =@cnomina) " +
                            "UPDATE dbo.tnomnomina SET estadicdetalle = 'GEN' WHERE cnomina = @cnomina ";

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomnomina.
        /// </summary>
        /// <returns>IList<tnomnomina></returns>
        public static IList<tnomnomina> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomnomina> ldatos = ldatos = contexto.tnomnomina.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomnomina por cnomina
        /// </summary>
        /// <returns>tnomnomina</returns>
        public static tnomnomina Find(long? cnomina)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnomnomina obj = null;
            try
            {
                obj = contexto.tnomnomina.Where(x => x.cnomina == cnomina).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            if (obj != null) EntityHelper.SetActualizar(obj);
            return obj;
        }
        /// <summary>
        /// Elimina registros de tnomnomina dado un código de tnomnomina.
        /// </summary>

        /// <param name="cnomina">Numero de nómina.</param>
        /// <returns>int</returns>
        public static void Eliminar(long cnomina)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                int registroseliminados = contexto.Database.ExecuteSqlCommand(CONSULTA
                   , new SqlParameter("@cnomina", cnomina));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
