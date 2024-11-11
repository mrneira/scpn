using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.lote {
    public class TloteModuloDal {

        /// <summary>
        ///     Consulta en la base de datos la definicion de una TloteModulo.
        /// </summary>
        /// <param name="clote">Codigo de lote.</param>
        /// <returns>TloteControlEjecucion</returns>
        public static List<tlotemodulo> Find(string clote)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tlotemodulo.AsNoTracking().Where(x => x.clote == clote && x.activo == true).OrderBy(x => x.orden).ToList();
        }

        /// <summary>
        ///     Consulta en la base de datos la definicion de una TloteModulo.
        /// </summary>
        /// <param name="clote">Codigo de lote.</param>
        /// <returns>TloteControlEjecucion</returns>
        public static tlotemodulo Find(int cmodulo, string clote)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tlotemodulo.AsNoTracking().Where(x => x.clote == clote && x.cmodulo == cmodulo).SingleOrDefault();
        }

        /// <summary>
        ///     Valida que el numero de hilos este definido.
        /// </summary>
        /// <param name="tlotemodulo">Objeto de defincion de lote por modulo.</param>
        /// <returns></returns>
        public static void Validahilos(tlotemodulo tlotemodulo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            if (tlotemodulo.numerohilos == null || tlotemodulo.numerohilos == 0) {
                throw new AtlasException("BLOTE-0003", "NUMERO DE HILOS NO DEFINIDO EN TLOTEMODULO CLOTE: {0} CMODULO: {1}", tlotemodulo.clote, tlotemodulo.cmodulo);
            }
        }

    }
}
