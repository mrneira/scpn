using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.nomina
{
  public  class TnomLiquidacionDal
    {
        private static string CONSULTA = "DELETE FROM tnomliquidaciondetalle WHERE cliquidacion =@cliquidacion; " +
                                         "DELETE FROM tnomliquidacion WHERE cliquidacion =@cliquidacion;";

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomliquidacion.
        /// </summary>
        /// <returns>IList<tnomliquidacion></returns>
        public static IList<tnomliquidacion> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomliquidacion> ldatos = ldatos = contexto.tnomliquidacion.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomliquidacion por cliquidación
        /// </summary>
        /// <returns>tnomliquidacion</returns>
        public static tnomliquidacion Find(long? cliquidacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnomliquidacion obj = null;
            try
            {
                obj = contexto.tnomliquidacion.Where(x => x.cliquidacion == cliquidacion).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
        /// <summary>
        /// Elimina registros de liquidacion dado un código de liquidación.
        /// </summary>

        /// <param name="cliquidacion">Numero de liquidación.</param>
        /// <returns>int</returns>
        public static void Eliminar(long cliquidacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                int registroseliminados = contexto.Database.ExecuteSqlCommand(CONSULTA
                   , new SqlParameter("@cliquidacion", cliquidacion));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
