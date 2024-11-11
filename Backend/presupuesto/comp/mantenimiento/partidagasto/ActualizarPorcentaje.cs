using core.componente;
using core.servicios;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;

namespace presupuesto.comp.mantenimiento.partidagasto
{

    public class ActualizarPorcentajes : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de actualizar los porcentajes de ejecución y participación de las partidas
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            int aniofiscal = int.Parse(rqmantenimiento.Mdatos["aniofiscal"].ToString());

            TpptPartidaGastoDal.CalcularPartidasGasto(aniofiscal);
            TpptPartidaIngresoDal.CalcularPartidasIngreso(aniofiscal);
 
        }
    }
}
