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
    class NombreScucursal : ComponenteMantenimiento
    {

        /// <summary>
        /// Metodo que completa el nombre de la sucursal.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Dictionary<string, object> map = (Dictionary<string, object>)rqmantenimiento.Response["mradicacion"];
            tgensucursal suc = TgenSucursalDal.Find((int)map["cs"], rqmantenimiento.Ccompania);
            map["ns"] = suc.nombre;// Nombre sucursal
        }

    }
}