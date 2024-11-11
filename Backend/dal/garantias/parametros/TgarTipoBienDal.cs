using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.garantias.parametros {

    public class TgarTipoBienDal {

        /// <summary>
        /// Consulta en la base de datos la definicion de un tipo de bien por tipo de garantia.
        /// </summary>
        /// <param name="ctipogarantia"></param>
        /// <param name="ctipobien"></param>
        /// <returns></returns>
        public static tgartipobien Find(string ctipogarantia, string ctipobien) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgartipobien obj = null;
            obj = contexto.tgartipobien.AsNoTracking().Where(x => x.ctipogarantia == ctipogarantia && x.ctipobien == ctipobien).SingleOrDefault();
            return obj;
        }

    }
}
