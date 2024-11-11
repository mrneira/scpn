using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.prestaciones {
    public class TpreActosServicioDal {
        public static IList<tpreactosservicio> Find(long ctipobaja) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tpreactosservicio> ldata = contexto.tpreactosservicio.AsNoTracking().Where(x => x.ctipobaja == ctipobaja).ToList();
            return ldata;
        }



        private static string SQL = " SELECT ctipobaja FROM tpreactosservicio GROUP BY ctipobaja ";
                                     

        /// <summary>
        /// Método que obtiene el total de aportes , total de aportes e interes por consulta
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindToAll() {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
          
            ConsultaHelper ch = new ConsultaHelper(contexto, null, SQL);
            IList<Dictionary<string, object>> listaRutas = ch.GetRegistrosDictionary();
            return listaRutas;

        }
    }
}
