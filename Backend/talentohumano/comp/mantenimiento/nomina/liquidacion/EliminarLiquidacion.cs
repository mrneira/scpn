using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using dal.talentohumano.nomina;
using util;

namespace talentohumano.comp.mantenimiento.nomina.liquidacion
{
    /// <summary>
    /// Clase que se encarga de eliminar la liquidación
    /// </summary>
    public class EliminarLiquidacion : ComponenteMantenimiento
    {
        /// <summary>
        /// Eliminar liquidación
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {

            long cliquidacion = 0;
            if (!rqmantenimiento.Mdatos.ContainsKey("cliquidacion") || !rqmantenimiento.Mdatos.ContainsKey("eliminar")) {
                return;
            }

            try
            {
                cliquidacion= long.Parse(rqmantenimiento.Mdatos["cliquidacion"].ToString());
                TnomLiquidacionDal.Eliminar(cliquidacion);

            }
            catch (Exception err)
            {
                rqmantenimiento.Response["mensaje"] = err.Message;
                throw new AtlasException("TTH-015", "HA OCURRIDO UN ERROR AL ELIMINAR LA LIQUIDACIÓN {0}",cliquidacion );
               
            }
            rqmantenimiento.Response["ELIMINADO"] = true;
            rqmantenimiento.Response["CLIQUIDACION"] = cliquidacion;


        }
    }
}
