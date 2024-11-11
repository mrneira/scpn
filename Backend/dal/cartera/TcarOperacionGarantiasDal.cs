using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    public class TcarOperacionGarantiasDal {

        /// <summary>
        /// Entrega una lista de garantias relacionadas a una operacion de cartera.
        /// </summary>
        /// <param name="coperacioncartera">Numero de operacion de cartera.</param>
        /// <returns></returns>
        public static List<tcaroperaciongarantias> Find(String coperacioncartera)
        {
            List<tcaroperaciongarantias> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcaroperaciongarantias.AsNoTracking().Where(x => x.coperacion == coperacioncartera).ToList();
            return obj;
        }
    }
}
