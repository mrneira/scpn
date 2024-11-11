using dal.generales;
using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.contabilidad.cuentasporpagar.liquidacionviaticos {

    public class TconLiquidacionGastosDal
    {
        /// <summary>
        /// Entrega cabecera de una liquidacion.
        /// </summary>
        /// <returns>tconligastosdetalle</returns>
        public static tconliquidaciongastos Find(long cliquidaciongastos, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconliquidaciongastos obj = null;
            obj = contexto.tconliquidaciongastos.Where(x => x.cliquidaciongastos == cliquidaciongastos && 
                                                        x.ccompania== ccompania).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        
        /// <summary>
        /// elimina un tconligastosdetalle
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="comprobante"></param>
        public static void Eliminar(RqMantenimiento rqmantenimiento, tconliquidaciongastos liquidacion) {
            liquidacion = Find(liquidacion.cliquidaciongastos, liquidacion.ccompania);
            //liquidacion.eliminado = true;
            liquidacion.cusuariomod = rqmantenimiento.Cusuario;
            liquidacion.fmodificacion = rqmantenimiento.Freal;
            rqmantenimiento.Actualizar = true;
            rqmantenimiento.Mtablas["CABECERA"] = null;
            rqmantenimiento.Mtablas["DETALLE"] = null;
            rqmantenimiento.AdicionarTabla("tconligastosdetalle", liquidacion, false);
        }

    }

}
