using System;
using modelo;
using System.Linq;
using util.servicios.ef;
using util;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarProductoCargosTabla.
    /// </summary>
    public class TcarProductoCargosTablaDal {
                
        /// <summary>
        /// Consulta en la base de datos la definicion de cargos a adicionar a la tabla de amortizacfion definidos por producto de cartera.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo.</param>
        /// <param name="cproducto">Codigo de producto.</param>
        /// <param name="ctipoproducto">Codigo de tipo de producto.</param>
        /// <returns>List<TcarProductoCargosTablaDto></returns>
        public static List<tcarproductocargostabla> Find(int cmodulo, int cproducto, int ctipoproducto) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarproductocargostabla.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.cproducto == cproducto && x.ctipoproducto == ctipoproducto).ToList();         
        }
    }
}
