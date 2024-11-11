using modelo;
using modelo.helper;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.socio {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla estado socio
    /// </summary>
    public class TsocEstadoSocioDal {

        /// <summary>
        /// Entrega datos del estado del socio.
        /// </summary>
        /// <param name="cestadosocio">Codigo de estado.</param>
        /// <returns></returns>
        public static tsocestadosocio Find(long cestadosocio) {
            tsocestadosocio obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsocestadosocio.AsNoTracking().Where(x => x.cestadosocio == cestadosocio).SingleOrDefault();

            return obj;
        }

        /// <summary>
        /// Entrega datos del estado del socio.
        /// </summary>
        /// <param name="cestadosocio">Codigo de estado.</param>
        /// <returns></returns>
        public static tsocestadosocio FindToEstatus(string cdetalleestatus) {
            tsocestadosocio obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsocestadosocio.AsNoTracking().Where(x => x.cdetalleestatus == cdetalleestatus).SingleOrDefault();

            return obj;
        }
    }
}

