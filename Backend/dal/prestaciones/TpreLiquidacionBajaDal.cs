using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla liquidacion baja
    /// </summary>
    public class TpreLiquidacionBajaDal {
        /// <summary>
        /// Obtiene las liquidaciones parametrizadas por tipo de baja del socio
        /// </summary>
        /// <param name="ctipobaja"></param>
        /// <returns></returns>
        public static List<tpreliquidacionbaja> FindToBaja(int ctipobaja) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpreliquidacionbaja> ldatos = contexto.tpreliquidacionbaja.AsNoTracking().Where(x => x.ctipobaja == ctipobaja).ToList();
            return ldatos;

        }
    }
}
