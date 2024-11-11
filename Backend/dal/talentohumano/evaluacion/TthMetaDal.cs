using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.evaluacion
{
    public class TthMetaDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthmeta, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<tthmeta></returns>
        public static IList<tthmeta> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthmeta> ldatos = ldatos = contexto.tthmeta.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cevaluacion"></param>
        /// <returns></returns>
        public static tthmeta Find(long cmeta)
        {
            tthmeta ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthmeta.AsNoTracking().Where(x => x.cmeta == cmeta).Single();


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
        /// <param name="cperiodo"></param>
        /// <param name="cdepartamento"></param>
        /// <returns></returns>
        public static decimal Find(long cperiodo,long cdepartamento)
        {
            
            decimal promedio = 0;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                promedio = contexto.tthmeta
                    .AsNoTracking()
                    .Where(x => x.cperiodo == cperiodo && x.cdepartamento == cdepartamento && x.finalizada==true).ToList()
                    .Select(x => x.promedio.Value)
                    .Average();
            }
            catch (Exception ex)
            {
                promedio = 0;
            }


            return promedio;
        }
    }
}
