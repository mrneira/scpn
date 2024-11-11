using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.garantias {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tgaroperacionavaluo.
    /// </summary>
    public class TgarOperacionAvaluoDal {

        /// <summary>
        /// Consulta la solicitud asociada a la garantia.
        /// </summary>
        /// <param name="coperaciongarantia">Numero de operacion.</param>
        /// <returns>List tcarsolicitudgarantias</returns>
        public static tgaroperacionavaluo Find(string coperaciongarantia)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgaroperacionavaluo avalgar = contexto.tgaroperacionavaluo.AsNoTracking().Where(x => x.coperacion == coperaciongarantia && x.verreg == 0).FirstOrDefault();
            return avalgar;
        }


        public static IList<tgaroperacionavaluo> FindReavaluo(string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tgaroperacionavaluo> obj = contexto.tgaroperacionavaluo.AsNoTracking().Where(x => x.coperacion == coperacion && x.verreg == 0).ToList();
            return obj;
        }

    }
}
