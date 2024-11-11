using core.componente;
using core.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace general.comp.mantenimiento
{
    public class ObtieneSecuenciaFlip : ComponenteMantenimiento
    {

        /// <summary>
        /// Metodo que genera una secuencia dado un codigo
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            String nsecuencia = (String)rqmantenimiento.GetDatos("NSECUENCIA");
            long secuencia = Secuencia.GetProximovalor(nsecuencia);
            rqmantenimiento.Response["secuencia"] = secuencia;
        }
    }
}