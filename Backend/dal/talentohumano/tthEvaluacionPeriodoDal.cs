using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano
{
   public class tthEvaluacionPeriodoDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthevaluacionperiodo
        /// </summary>
        /// <returns>IList<tthevaluacionperiodo></returns>
        public static IList<tthevaluacionperiodo> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthevaluacionperiodo> ldatos = ldatos = contexto.tthevaluacionperiodo.AsNoTracking().ToList();
            return ldatos;
        }
        public static tthevaluacionperiodo Find(long cperiodo)
        {
            tthevaluacionperiodo obj = null;

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try
            {
                obj = contexto.tthevaluacionperiodo.Where(x => x.cperiodo==cperiodo).Single();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }

    }
}
