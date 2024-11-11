using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// 
    /// </summary>
    public class TcarTipoTablaAmortizacionDal {

        /// <summary>
        /// Consulta en la base de datos la definicion de una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud"></param>
        /// <returns></returns>
        public static tcartipotablaamortizacion Find(int ctabla) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcartipotablaamortizacion.AsNoTracking().Where(x => x.ctabla == ctabla).SingleOrDefault();
        }

        /// <summary>
        /// Consulta en la base de datos las tablas de amortización
        /// </summary>
        /// <returns></returns>
        public static List<tcartipotablaamortizacion> FindAll() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcartipotablaamortizacion.AsNoTracking().ToList();
        }

    }
}
