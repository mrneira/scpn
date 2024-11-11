using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace modelo.helper {

    /// <summary>
    /// Clase utilitaria que se encarga del manejo en un theread local del contexto del entity framework.
    /// </summary>
    public class ContextoHelper {
        /// <summary>
        /// Thread local que almacena un contexto asociado a una conexion a la base de datos.
        /// </summary>
        [ThreadStatic]
        public static AtlasContexto thread_AtlasContexto = null;

        /// <summary>
        /// Fija un AtlasContexto en el thread local.
        /// </summary>
        /// <param name="atlasContexto"></param>
        public static void FijarAtlasContexto(AtlasContexto atlasContexto) {
            ContextoHelper.thread_AtlasContexto = atlasContexto;
        }

        /// <summary>
        /// Obtiene y entraga una session del thread local.
        /// </summary>
        /// <returns>ISession</returns>
        public static AtlasContexto GetAtlasContexto() {
            AtlasContexto atlasContexto = ContextoHelper.thread_AtlasContexto;
            return atlasContexto;
        }
    }
}
