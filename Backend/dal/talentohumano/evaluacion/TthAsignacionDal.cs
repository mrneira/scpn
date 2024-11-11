using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using util.servicios.ef;
using modelo.helper;

namespace dal.talentohumano.evaluacion
{
    public class TthAsignacionDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthasignacion, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<TcarAccrualDto></returns>
        public static IList<tthasignacion> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthasignacion> ldatos = ldatos = contexto.tthasignacion.AsNoTracking().ToList();
            return ldatos;
        }
      /// <summary>
      /// 
      /// </summary>
      /// <param name="cevaluacion"></param>
      /// <returns></returns>
        public static tthasignacion Find(long cevaluacion)
        {
            tthasignacion ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthasignacion.AsNoTracking().Where(x => x.cevaluacion == cevaluacion ).Single();

                if (ldatos != null)
                {
                    EntityHelper.SetActualizar(ldatos);
                }
            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }

        
    }
}
