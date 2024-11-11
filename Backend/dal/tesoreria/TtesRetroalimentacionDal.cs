using modelo;
using modelo.helper;
using modelo.interfaces;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.tesoreria {
    public class TtesRetroalimentacionDal
    {
        /// <summary>
        /// Entrega la lista de respuesta de cash para cada módulo
        /// </summary>
        /// <returns></returns>
        public static List<ttesretroalimentacion> FindRetroalimentacionModulOperacion(int cmodulorigen, int ctransaccionorigen, bool activo)
        {
            List<ttesretroalimentacion> obj = new List<ttesretroalimentacion>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.ttesretroalimentacion.AsNoTracking().Where(x => x.cmoduloriginal == cmodulorigen && x.ctransaccionoriginal == ctransaccionorigen && x.activo == activo).OrderBy(x => x.orden).ToList();
            return obj;
        }
    }
}
