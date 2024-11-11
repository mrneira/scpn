using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.lote
{
   public class TLotePredecesoraDal
    {
        /// <summary>
        /// Entrega la definición de lotes predecesoras
        /// </summary>
        /// <param name="clote"></param>
        /// <returns></returns>
        public static List< tlotepredecesora> Find(string clote)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tlotepredecesora> predecesoras = contexto.tlotepredecesora.AsNoTracking().Where(x => x.clote == clote).OrderByDescending(y => y.orden).ToList();
            return predecesoras;
        }
    }
}
