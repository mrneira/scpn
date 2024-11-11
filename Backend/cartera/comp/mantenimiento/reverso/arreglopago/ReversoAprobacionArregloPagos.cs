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

namespace cartera.comp.mantenimiento.reverso.arreglopago {

    public class ReversoAprobacionArregloPagos : ComponenteMantenimientoReverso {

        /// <summary>
        /// Ejecuta reverso de cobro de arreglo de pagos.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void EjecutarReverso(RqMantenimiento rqmantenimiento) {
            // Marcar como reversada la transaccion.
            tcaroperacion tcarOperacion = OperacionFachada.GetOperacion(rqmantenimiento).Tcaroperacion;
            TcarOperacionArregloPagoDal.ReversarAutorizacion(tcarOperacion.coperacion);
            String coperacion = tcarOperacion.coperacionarreglopago;

            TcarOperacionTasaDal.ReversoArregloPagos(coperacion);
            TcarOperacionCargosTablaDal.ReversoArregloPagos(coperacion);
            TcarOperacionPersonaDal.ReversoArregloPagos(coperacion);
            TcarOperacionRubroDal.ReversoArregloPagos(coperacion);
            TcarOperacionCuotaDal.ReversoArregloPagos(coperacion);
            TcarOperacionDal.ReversoArregloPagos(coperacion);
        }
    }
}
