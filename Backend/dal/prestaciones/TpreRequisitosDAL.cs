using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla parametros de la requisitos
    /// </summary>
    public class TpreRequisitosDAL {
        /// <summary>
        /// Obtiene los requisitos
        /// </summary>
        /// <param name="crequisito"></param>
        /// <returns></returns>
        public static tprerequisitos Find(int crequisito) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tprerequisitos obj = new tprerequisitos();
            obj = contexto.tprerequisitos.AsNoTracking().Where(x => x.crequisito == crequisito).SingleOrDefault();
            if(obj == null) {
                throw new AtlasException("", "");
            }
            return obj;
        }
    }
}
