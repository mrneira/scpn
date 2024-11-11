using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.evaluacion
{
    public class TthAsignacionRespDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthasignacionresp, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<tthasignacionresp></returns>
        public static IList<tthasignacionresp> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthasignacionresp> ldatos = ldatos = contexto.tthasignacionresp.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cevaluacion"></param>
        /// <returns></returns>
        public static tthasignacionresp Find(long casignacion)
        {
            tthasignacionresp ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthasignacionresp.AsNoTracking().Where(x => x.casignacion == casignacion).Single();


            }
            catch (Exception ex)
            {
                ldatos = null;
            }
            return ldatos;
        }
    }
}
