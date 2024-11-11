using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla expediente
    /// </summary>
    public class TpreExpedienteAprobadoDal {
        /// <summary>
        /// Métdod que busca expedientes aprobados
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tpreexpediente Find(int cpersona, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tpreexpediente obj = null;
            obj = contexto.tpreexpediente.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.ccatalogoestado == 2802 && x.cdetalleestado == "ACE").SingleOrDefault();
            return obj;
        } 
    }
}
