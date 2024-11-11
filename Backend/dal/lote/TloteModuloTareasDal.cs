using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.lote
{
    /// <summary>
    ///     Clase que implemeta, consultas manuales de la tabla TloteModuloTareas.
    /// </summary>
    public class TloteModuloTareasDal {

        /// <summary>
        ///     Consulta en la base de datos la definicion de TloteModuloTareas.
        /// </summary>
        /// <param name="clote">Codigo de lote.</param>
        /// /// <param name="cmodulo">Codigo de modulo.</param>
        /// <returns>TloteControlEjecucion</returns>
        public static List<tlotemodulotareas> Find(string clote, int cmodulo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tlotemodulotareas> ldata = contexto.tlotemodulotareas.AsNoTracking().Where(x => x.clote == clote && x.cmodulo == cmodulo).OrderBy(x => x.orden).ToList();

            return ldata;
        }

        /// <summary>
        /// Busca las tareas activas del modulo
        /// </summary>
        /// <param name="clote"></param>
        /// <param name="cmodulo"></param>
        /// <returns></returns>
        public static List<tlotemodulotareas> FindActivos(string clote, int cmodulo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tlotemodulotareas> ldata = contexto.tlotemodulotareas.AsNoTracking().Where(x => x.clote == clote && x.cmodulo == cmodulo && x.activo == true).OrderBy(x => x.orden).ToList();

            return ldata;
        }

    }
}
