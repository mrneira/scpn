using System;
using modelo;
using System.Linq;
using util.servicios.ef;
using util;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarProductoRequisitosDto.
    /// </summary>
    public class TcarProductoRequisitosDal {
                
        /// <summary>
        /// Consulta en la base de datos la definicion de informacion requerida para el producto.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <returns> List TcarProductoRequisitosDto </returns>
        public static List<tcarproductorequisitos> Find(int cmodulo, int cproducto, int ctipoproducto) {

            List<tcarproductorequisitos> ldatos = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            ldatos = contexto.tcarproductorequisitos.AsNoTracking().Where(x => x.cmodulo == cmodulo && 
                x.cproducto == cproducto && 
                x.ctipoproducto == ctipoproducto &&
                x.verreg == 0 &&
                x.activo.Value.Equals(true)).ToList();

            return ldatos;
        }
    }

}
