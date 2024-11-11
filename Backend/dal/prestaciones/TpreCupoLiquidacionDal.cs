using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using modelo;
using util.servicios.ef;
using modelo.helper;

namespace dal.prestaciones {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla cupos liquidacion
    /// </summary>
    public class TpreCupoLiquidacionDal {
        /// <summary>
        /// Método que busca cupos por anno , jerarquia , tipo expediente
        /// </summary>
        /// <param name="anio"></param>
        /// <param name="jerarquia"></param>
        /// <param name="tipoliquidacion"></param>
        /// <returns></returns>
        public static tprecuposliquidacion FindPorAnio(int anio, string jerarquia, string tipoliquidacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tprecuposliquidacion ldata = null;
            ldata = contexto.tprecuposliquidacion.AsNoTracking().Where(x => x.anio == anio && x.tipojerarquiacdetalle.Equals(jerarquia) && x.tipocupocdetalle.Equals(tipoliquidacion)).SingleOrDefault();
            EntityHelper.SetActualizar(ldata);
            return ldata;
        }
    }



}
