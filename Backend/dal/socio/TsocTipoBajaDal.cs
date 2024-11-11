using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.socio {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla tipo baja
    /// </summary>
    public class TsocTipoBajaDal {
        /// <summary>
        /// Obtiene los tipo de baja por baja
        /// </summary>
        /// <param name="ctipobaja"></param>
        /// <returns></returns>
        public static tsoctipobaja Find(long ctipobaja) {
            tsoctipobaja obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoctipobaja.AsNoTracking().Where(x => x.ctipobaja == ctipobaja).SingleOrDefault();
            return obj;
        }
        /// <summary>
        /// Obtiene los tipo de baja por baja dependiendo si genera anticipo
        /// </summary>
        /// <param name="ctipobaja"></param>
        /// <returns></returns>
        public static tsoctipobaja FindToAnticipo(long ctipobaja) {
            tsoctipobaja obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoctipobaja.AsNoTracking().Where(x => x.ctipobaja == ctipobaja && x.puedeotorgaranticipo == true).SingleOrDefault();
            return obj;
        }

    }
}
