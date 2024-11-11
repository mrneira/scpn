using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.prestaciones {
   public class TprePagoDal {
        /// <summary>
        /// Método que consulta los aportes del socio por persona
        /// </summary>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static tprepago Find(string tnovedad) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tprepago obj = null;
            obj = contexto.tprepago.AsNoTracking().Where(x => x.ccatalogonovedad == 220 && x.cdetallenovedad == tnovedad).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Método que consulta los aportes del socio por persona
        /// </summary>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static List<tprepago> Find() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tprepago> ldata = null;
            ldata = contexto.tprepago.AsNoTracking().OrderBy(x => x.cpersona).ToList();
            return ldata;
        }

    }
}
