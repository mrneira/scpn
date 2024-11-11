using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarTipoArregloPago.
    /// </summary>
    public class TcarTipoArregloPagoDal {

        /// <summary>
        /// Consulta los datos de un tipo de arreglo de pagos.
        /// </summary>
        /// <param name="ctipoarreglopago">Codigo de tipo de arreglo de pagos.</param>
        /// <returns></returns>
        public static tcartipoarreglopago Find(string ctipoarreglopago) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcartipoarreglopago obj = null;
            obj = contexto.tcartipoarreglopago.Where(x => x.ctipoarreglopago == ctipoarreglopago).SingleOrDefault();
            return obj;
        }

    }
}
