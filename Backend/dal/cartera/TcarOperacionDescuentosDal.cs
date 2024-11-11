using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionDescuentos.
    /// </summary>
    public class TcarOperacionDescuentosDal {

        /// <summary>
        /// Busca y entrega entrega la las condiciones de descuento de una operacion de cartera.
        /// </summary>
        public static tcaroperaciondescuentos Find(string coperacion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcaroperaciondescuentos obj = contexto.tcaroperaciondescuentos.AsNoTracking().Where(x => x.coperacion == coperacion && x.verreg == 0).SingleOrDefault();
            return obj;
        }

    }
}
