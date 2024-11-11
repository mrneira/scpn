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
    /// <summary>
    /// Clase que implemeta, dml's de la tabla cuantia basica
    /// </summary>
    public class TpreCuantiaBasicaDal {
        /// <summary>
        /// Método que busca la cuantia básica por anno y jerarquia
        /// </summary>
        /// <param name="anio"></param>
        /// <param name="cdetallejerarquia"></param>
        /// <returns></returns>
        public static tprecuantiabasica Find(long anio, string cdetallejerarquia) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencatalogodetalle jerarquia = TgenCatalogoDetalleDal.Find(2701, cdetallejerarquia);
            tprecuantiabasica data = contexto.tprecuantiabasica.AsNoTracking().Where(x => x.anio == anio && x.ccatalogojerarquia == 2701 && x.cdetallejerarquia == cdetallejerarquia && x.verreg == 0).SingleOrDefault();
            if(data == null) {
                throw new AtlasException("PRE-003", "EL PARAMETRO NO DEFINIDO EN TPRECUANTIBASICA AÑO: {0} PARA EL TIPO DE JERARQUIA: {1} ", anio, jerarquia.nombre);
            }
            return data;
        }
    }
}
