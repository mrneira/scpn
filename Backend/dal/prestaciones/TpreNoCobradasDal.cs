using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.prestaciones {
    public class TpreNoCobradasDal {
        /// <summary>
        /// Método que consulta las personas con liquidaciones no reclamadas
        /// </summary>
        /// <param name="cpersona"></param>
        /// <returns></returns>
        public static tprenocobradas Find(int cpersona)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tprenocobradas obj = null;
            obj = contexto.tprenocobradas.AsNoTracking().Where(x => x.cpersona == cpersona).SingleOrDefault();
            return obj;
        }

        /// <summary>
        /// Método que consulta los socios con liquidaciones no reclamadas
        /// </summary>
        /// <returns></returns>
        public static List<tprenocobradas> Find()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tprenocobradas> ldata = null;
            ldata = contexto.tprenocobradas.AsNoTracking().OrderBy(x => x.cpersona).ToList();
            return ldata;
        }

    }
}
