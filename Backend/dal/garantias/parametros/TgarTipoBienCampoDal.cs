using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.garantias.parametros {

    public class TgarTipoBienCampoDal {

        /// <summary>
        /// Entrega la lista de compos dinamicos por tipo de garantia y tipo de bien
        /// </summary>
        /// <param name="codigoconsulta"></param>
        /// <param name="canal"></param>
        /// <returns></returns>
        public static IList<tgartipobiencampo> ObtenerCampos(string ctipogarantia, string ctipobien) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tgartipobiencampo> ldata = null;
            ldata = contexto.tgartipobiencampo.AsNoTracking().Where(x => x.ctipogarantia == ctipogarantia && x.ctipobien == ctipobien).OrderBy(o => o.orden).ToList();
            return ldata;
        }


    }
}
