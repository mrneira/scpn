using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.liquidacion
{
   public class TnomPagoLiquidacionDal
    {
        /// Consulta en la base de datos la definicion de tnomparametroliquidacion.
        /// </summary>
        /// <returns>IList<tnomparametroliquidacion></returns>
        public static IList<tnompagoliquidacion> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tnompagoliquidacion> ldatos = ldatos = contexto.tnompagoliquidacion.AsNoTracking().ToList();
            return ldatos;
        }


        /// Consulta en la base de datos la definicion de tnomparametroliquidacion.
        /// </summary>
        /// <returns>IList<tnomparametroliquidacion></returns>
        public static bool Find(string saldo, bool pagado)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tnompagoliquidacion ldatos = null;
            try
            {
                ldatos = contexto.tnompagoliquidacion.AsNoTracking().Where(x => x.saldocdetalle.Equals(saldo) && x.pagado == pagado).FirstOrDefault();

            }
            catch (Exception ex)
            {

            }
            if (ldatos == null)
            {
                return false;
            }
            else {
                return true;
            }
        }



    }
}
