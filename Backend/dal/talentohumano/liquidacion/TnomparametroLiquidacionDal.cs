using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.liquidacion
{
  public  class TnomparametroLiquidacionDal
    {
        /// Consulta en la base de datos la definicion de tnomparametroliquidacion.
        /// </summary>
        /// <returns>IList<tnomparametroliquidacion></returns>
        public static IList<tnomparametroliquidacion> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnomparametroliquidacion> ldatos = ldatos = contexto.tnomparametroliquidacion.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tnomparametroliquidacion por cdetalle y código parametro
        /// </summary>
        /// <returns>IList<tnomparametroliquidacion></returns>
        public static List<tnomparametroliquidacion> Find(string cdetalle)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tnomparametroliquidacion> obj = null;
            try
            {
                obj = contexto.tnomparametroliquidacion.Where(x => x.ctipocdetalle.Equals(cdetalle)).ToList();
            }
            catch (Exception)
            {
                obj = null;

            }
            return obj;
        }
       

    }
}
