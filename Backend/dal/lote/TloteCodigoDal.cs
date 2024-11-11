using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.lote
{
    public class TloteCodigoDal {

        /// <summary>
        ///     Consulta en la base de datos la definicion de una tlotecodigo.
        /// </summary>
        /// <param name="clote">Codigo de lote.</param>
        /// <returns>TloteControlEjecucion</returns>
        public static tlotecodigo Find(string clote) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tlotecodigo.AsNoTracking().Where(x => x.clote == clote).SingleOrDefault();
        }


    }
}
