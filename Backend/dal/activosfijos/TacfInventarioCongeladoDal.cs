using modelo;
using modelo.helper;
using System.Linq;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.activosfijos {

    public class TacfInventarioCongeladoDal {


        /// <summary>
        /// Entrega status del inventario de activos y bienes de control.
        /// </summary>
        /// <returns>TacfInventarioCongelado</returns>
        public static bool DevolverStatus()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tacfinventariocongelado.SingleOrDefault().congelaactivos.Value;
        }

        /// <summary>
        /// Entrega status del inventario para suministros.
        /// </summary>
        /// <returns>TacfInventarioCongelado</returns>
        public static bool DevolverStatusSuministros()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tacfinventariocongelado.SingleOrDefault().congelasuministros.Value;
        }

    }

}
