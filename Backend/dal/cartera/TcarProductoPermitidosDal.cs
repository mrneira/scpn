using modelo;
using System.Linq;
using util.servicios.ef;
using System.Collections.Generic;

namespace dal.cartera
{

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarProductoPermitidosDto.
    /// </summary>
    public class TcarProductoPermitidosDal
    {

        /// <summary>
        /// Consulta en la base de datos la definicion de informacion requerida para el producto.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <returns> List TcarProductoPermitidosDto </returns>
        public static List<tcarproductopermitidos> Find(int cmodulo, int cproducto, int ctipoproducto)
        {
            List<tcarproductopermitidos> ldatos = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            ldatos = contexto.tcarproductopermitidos.AsNoTracking().Where(x => x.cmodulo == cmodulo &&
                                                                          x.cproducto == cproducto &&
                                                                          x.ctipoproducto == ctipoproducto &&
                                                                          x.verreg == 0).ToList();

            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de informacion requerida para el producto.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <returns> List TcarProductoPermitidosDto </returns>
        public static tcarproductopermitidos FindToPermitido(int cmodulo, int cproducto, int ctipoproducto,
                                                             int cproductopermitido, int ctipoproductopermitido)
        {
            tcarproductopermitidos obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            obj = contexto.tcarproductopermitidos.AsNoTracking().Where(x => x.cmodulo == cmodulo &&
                                                                          x.cproducto == cproducto &&
                                                                          x.ctipoproducto == ctipoproducto &&
                                                                          x.cproductopermitido == cproductopermitido &&
                                                                          x.ctipoproductopermitido == ctipoproductopermitido &&
                                                                          x.verreg == 0).SingleOrDefault();

            return obj;
        }
    }

}
