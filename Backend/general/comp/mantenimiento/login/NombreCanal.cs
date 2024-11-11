using core.componente;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace general.comp.mantenimiento.login
{
    public class NombreCanal: ComponenteMantenimiento
    {
        /// <summary>
        /// Metodo que completa el nombre del canal.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Dictionary<string, object> map = (Dictionary<string, object>)rqmantenimiento.Response["mradicacion"];
            tgencanales c = TgenCanalesDal.Find((string)map["cca"]);
            map["ncan"] = c.nombre;// Nombre canal
        }
    }
}
