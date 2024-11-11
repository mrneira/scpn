using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.talentohumano.evaluacion
{
   public class TthCalificacionCualitativaDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tthcalificacioncualitativa, con los codigos de horario, nombre y tipo.
        /// </summary>
        /// <returns>IList<tthcalificacioncualitativa></returns>
        public static IList<tthcalificacioncualitativa> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tthcalificacioncualitativa> ldatos = ldatos = contexto.tthcalificacioncualitativa.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ccalificacion"></param>
        /// <returns></returns>
        public static tthcalificacioncualitativa Find(long ccalificacion)
        {
            tthcalificacioncualitativa ldatos;
            try
            {
                AtlasContexto contexto = Sessionef.GetAtlasContexto();
                ldatos = ldatos = contexto.tthcalificacioncualitativa.AsNoTracking().Where(x => x.ccalificacion == ccalificacion).Single();

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
