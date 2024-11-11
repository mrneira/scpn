using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.inversiones.reajustes
{
   public class TinvDefaultDal
    {
        /// <summary>
        /// Consulta en la base de datos la definicion de tinvdefault.
        /// </summary>
        /// <returns>IList<tinvdefault></returns>
        public static IList<tinvdefault> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tinvdefault> ldatos = ldatos = contexto.tinvdefault.AsNoTracking().ToList();
            return ldatos;
        }
        /// <summary>
        /// Consulta en la base de datos la definicion de tinvportafoliohistorico por cdefault.
        /// </summary>
        /// <returns>IList<tinvdefault></returns>
        public static tinvdefault Find(long cdefault)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
           tinvdefault ldatos = ldatos = contexto.tinvdefault.Where(x => x.cdefault == cdefault).SingleOrDefault();
              return ldatos;
        }
    }
}
