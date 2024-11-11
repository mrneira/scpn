using dal.generales;
using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla secuencia expediente
    /// </summary>
    public class TpreSecuencialExpedienteDal {
        /// <summary>
        /// Obtiene la secuencia por tipo de jerarquia y anno
        /// </summary>
        /// <param name="cdetallejerarquia"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public static int? GetSecuenciaToJerarquia(string cdetallejerarquia, int? year) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            int? valor = 0;
            tpresecuencialexpediente obj;
            tgencatalogodetalle jerarquia = TgenCatalogoDetalleDal.Find(2701, cdetallejerarquia);
            obj = contexto.tpresecuencialexpediente.AsNoTracking().Where(x => x.cdetallejerarquia.Equals(cdetallejerarquia) && x.anio == year).SingleOrDefault();
            if(obj != null) {
                valor = obj.secuencia + 1;
            } else {
                throw new AtlasException("PRE-004", "NO TIENE PARAMATRIZADA LA SECUENCIA PARA LA JERARQUIA: {0} AÑO DE BAJA: {1}", jerarquia.nombre, year);
            }
            return valor;
        }
        /// <summary>
        /// Busca la secuencia del expediente por jerarquia y por anno
        /// </summary>
        /// <param name="cdetallejerarquia"></param>
        /// <param name="year"></param>
        /// <returns></returns>
        public static tpresecuencialexpediente FindSecuenciaToJerarquia(string cdetallejerarquia, int? year) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();
            tpresecuencialexpediente obj = null;
            obj = contexto.tpresecuencialexpediente.AsNoTracking().Where(x => x.cdetallejerarquia.Equals(cdetallejerarquia) && x.anio == year).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
    }
}
