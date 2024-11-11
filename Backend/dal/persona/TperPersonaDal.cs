using modelo;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.persona {
    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TperPersonaDal {
        /// <summary>
        /// Metodo que entrega los datos de una persona.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tperpersona Find(long cpersona, int ccompania) {
            tperpersona obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tperpersona.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania).SingleOrDefault();
            return obj;
        }
    }

}
