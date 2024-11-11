using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla requisitos expedientes
    /// </summary>
    public class TpreTipoExpedienteRequisitoDal {
        /// <summary>
        /// Obtiene una lista de requisitos del expediente
        /// </summary>
        /// <param name="cdetalletipoexp"></param>
        /// <returns></returns>
        public static IList<tpretipoexpedienterequisito> Find(string cdetalletipoexp) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tpretipoexpedienterequisito> ldata = contexto.tpretipoexpedienterequisito.AsNoTracking().Where(x => x.ccatalogotipoexp == 2802 && x.cdetalletipoexp == cdetalletipoexp && x.verreg == 0 && x.activo == true).OrderBy(x => x.orden).ToList();
            return ldata;
        }
    }
}
