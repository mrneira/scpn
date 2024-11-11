using modelo;
using System.Linq;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgenLogo.
    /// </summary>
    public class TgenLogoDal {

        /// <summary>
        /// Entrega logo
        /// </summary>
        public static tgenlogo Find() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenlogo tgenLogo = null;
            tgenLogo = contexto.tgenlogo.AsNoTracking().SingleOrDefault();
            return tgenLogo;
        }
    }
}
