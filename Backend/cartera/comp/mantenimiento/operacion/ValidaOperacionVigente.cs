using cartera.datos;
using core.componente;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.operacion {

    /// <summary>
    /// Clase que se encarga de validar que una operacion se encuentre vigente.
    /// </summary>
    public class ValidaOperacionVigente : ComponenteMantenimiento {

        /// <summary>
        /// Valida que una operacion de cartea este en estado VIG.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            tcaroperacion tco = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            TcarOperacionDal.ValidaOperacionVigente(tco);
        }

    }
}
