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

namespace cartera.comp.mantenimiento.reverso {
    /// <summary>
    /// Clase que se encarga de reversar datos de tabla TcarOperacion marca como reversada.
    /// </summary>
    public class ReversoTcarOperacion : ComponenteMantenimientoReverso {
        public override void EjecutarReverso(RqMantenimiento rqmantenimiento) {
            // Marcar como reversada la transaccion.
            tcaroperacion tcarOperacion = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;
            if (rqmantenimiento.Mensajereverso == tcarOperacion.mensaje) {
                TcarOperacionDal.Reversar(tcarOperacion);
            }
        }

    }
}
