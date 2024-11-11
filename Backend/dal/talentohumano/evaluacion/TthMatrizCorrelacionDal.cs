using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.evaluacion
{
  public  class TthMatrizCorrelacionDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthmatrizcorrelacion, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<tthmatrizcorrelacion></returns>
        public static IList<tthmatrizcorrelacion> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthmatrizcorrelacion> ldatos = ldatos = contexto.tthmatrizcorrelacion.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cmatriz"></param>
        /// <returns></returns>
        public static tthmatrizcorrelacion Find(long cmatriz)
        {
            tthmatrizcorrelacion ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthmatrizcorrelacion.AsNoTracking().Where(x => x.cmatriz == cmatriz).Single();


            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }

      
    }
}
