using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarProductoDocumentosDal {
        /// <summary>
        /// Consulta en la base de datos la definicion de informacion requerida para el producto.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <param name="ensolicitud">Bandera para saber si esta en solicitud.</param>
        /// <returns> List TcarProductoDocumentosDto </returns>
        public static List<tcarproductodocumentos> Find(int cmodulo, int cproducto, int ctipoproducto,bool ensolicitud = true) {

            List<tcarproductodocumentos> ldatos = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            ldatos = contexto.tcarproductodocumentos.AsNoTracking().Where(x => x.cmodulo == cmodulo &&
                x.cproducto == cproducto &&
                x.ctipoproducto == ctipoproducto &&
                x.verreg == 0 &&
                x.ensolicitud == ensolicitud &&
                x.activo.Value.Equals(true)).ToList();

            return ldatos;
        }
    }
}
