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
    /// Clase que se encarga de reversar datos de tabla de pagos de cartera dado un numero de mensaje y operacion.
    /// </summary>
    public class ReversoTabla : ComponenteMantenimientoReverso {

        /// <summary>
        /// Datos de la operacion a reversar.
        /// </summary>
        private tcaroperacion tcaroperacion;

        public override void EjecutarReverso(RqMantenimiento rqmantenimiento) {
            tcaroperacion = OperacionFachada.GetOperacion(rqmantenimiento).tcaroperacion;
            // Elimina registrso de rubros y cuotas vigentes.
            EliminaRegistrosVigentes(rqmantenimiento.Mensajereverso);
            // Activa cuotas y rubros.
            ActivaRegistros(rqmantenimiento);
        }

        /// <summary>
        /// Elimina registros de tcaroperacioncuota y/o tcaroperacionrubro para el numeor de mensaje de reverso y operacion.
        /// Si no existe registros para el mensaje significa que no se reversa la transaccion en orden inverso.
        /// </summary>
        /// <param name="mensajereverso">Numero de mensaje a reversar.</param>
        private void EliminaRegistrosVigentes(String mensajereverso) {
            TcarOperacionRubroDal.Delete(mensajereverso, tcaroperacion.coperacion);
            TcarOperacionCuotaDal.Delete(mensajereverso, tcaroperacion.coperacion);
            TcarOperacionCxCDal.Delete(mensajereverso, tcaroperacion.coperacion);
        }

        /// <summary>
        /// Activa registros de la tabla tcaroperaciocuotareverso y/o tcaroperacioncuotareverso si existen, elimina registros de las mismas tablas.
        /// Si la fecha de vigencia del registro a activar es diferente a la fecha de proceso se elimina los registros de historia asociados al
        /// mensaje y numeor de operacion. La fecha de vigencia del registro que se activa es la fecha de proceso.
        /// </summary>
        /// <param name="rqmantenimiento">Numero de mensaje a reversar.</param>
        private void ActivaRegistros(RqMantenimiento rqmantenimiento) {
            // Activar cuotas desde la tabla tcaroperacioncuotareverso a la tabla tcaroperacioncuota, elimina registros de la tabla de reverso.
            TcarOperacionCuotaDal.Activarcuotas(rqmantenimiento.Mensajereverso, tcaroperacion.coperacion, (int)rqmantenimiento.Fproceso);

            // Activar rubros desde la tabla tcaroperacionrubroreverso a la tabla tcaroperacionrubro, elimina registros de la tabla de reverso.
            TcarOperacionRubroDal.Activarcuotas(rqmantenimiento.Mensajereverso, tcaroperacion.coperacion, (int)rqmantenimiento.Fproceso);

            // Activar cxc desde la tabla tcaroperacioncxcreverso a la tabla tcaroperacioncxc, elimina registros de la tabla de reverso.
            TcarOperacionCxCDal.ActivarCxC(rqmantenimiento.Mensajereverso, tcaroperacion.coperacion, (int)rqmantenimiento.Fproceso);
        }

    }
}
