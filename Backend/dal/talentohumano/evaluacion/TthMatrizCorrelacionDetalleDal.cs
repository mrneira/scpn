using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.evaluacion
{
  public  class TthMatrizCorrelacionDetalleDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthmatrizcorrelaciondetalle, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<tthmatrizcorrelaciondetalle></returns>
        public static IList<tthmatrizcorrelaciondetalle> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthmatrizcorrelaciondetalle> ldatos = ldatos = contexto.tthmatrizcorrelaciondetalle.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cmatrizdetalle"></param>
        /// <returns></returns>
        public static tthmatrizcorrelaciondetalle Find(long cmatrizdetalle)
        {
            tthmatrizcorrelaciondetalle ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthmatrizcorrelaciondetalle.Include("tthmatrizcorrelacion").Include("tthdepartamento").AsNoTracking().Where(x => x.cmatrizdetalle == cmatrizdetalle).Single();


            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }

       
    }
}
