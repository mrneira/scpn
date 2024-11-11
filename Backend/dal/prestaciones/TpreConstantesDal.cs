using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.prestaciones {
    public class TpreConstantesDal {
        /// <summary>
        /// Método que obtiene por año las constantes para la formula de prestaciones
        /// </summary>
        /// <param name="anio"></param>
        /// <param name="cdetallejerarquia"></param>
        /// <returns></returns>
        public static tpreconstantes Find(long anio, string cdetallejerarquia) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogodetalle jerarquia = TgenCatalogoDetalleDal.Find(2701, cdetallejerarquia);
            tpreconstantes data = contexto.tpreconstantes.AsNoTracking().Where(x => x.anio == anio && x.ccatalogojerarquia == 2701 && x.cdetallejerarquia == cdetallejerarquia && x.verreg == 0).SingleOrDefault();
            if (data == null) {
                throw new AtlasException("PRE-022", "EL PARAMETRO NO DEFINIDO EN TPRECONSTANTES AÑO: {0} PARA EL TIPO DE JERARQUIA: {1} ", anio, jerarquia.nombre);
            }
            return data;
        }
    }
}
