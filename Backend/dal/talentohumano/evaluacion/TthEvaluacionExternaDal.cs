using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.evaluacion
{
 public   class TthEvaluacionExternaDal
    {

        /// <summary>
        /// Consulta en la base de datos la definicion de tthevaluacionexterna, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<tthevaluacionexterna></returns>
        public static IList<tthevaluacionexterna> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthevaluacionexterna> ldatos = ldatos = contexto.tthevaluacionexterna.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cexterna"></param>
        /// <returns></returns>
        public static tthevaluacionexterna Find(long cexterna)
        {
            tthevaluacionexterna ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthevaluacionexterna.AsNoTracking().Where(x => x.cexterna == cexterna).Single();


            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cexterna"></param>
        /// <returns></returns>
        public static decimal FindPeriodo(long cperiodo)
        {
            IList<tthevaluacionexterna> ldatos;
            decimal total = 0;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                total = contexto.tthevaluacionexterna
                    .AsNoTracking()
                    .Where(x => x.cperiodo == cperiodo).ToList()
                    .Select(x=> x.promedio.Value)
                    .Average();
                 
            }
            catch (Exception ex)
            {
                ldatos = null;
            }


            return total;
        }
    }
}
