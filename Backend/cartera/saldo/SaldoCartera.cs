using cartera.datos;
using modelo;
using monetario.util;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace cartera.saldo {

    public class SaldoCartera : util.thread.Saldo {

        /// <summary>
        /// Metodo a implemtar en clase por modulo, que se encarga de actulizar saldos de operaciones.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del rquest utilizado en la ejecucion de transacciones.</param>
        /// <param name="rubromonetario">Objeto que almacena informacion relacionada a un rubro monetario.</param>
        public override void Actualizar(RqMantenimiento rqmantenimiento, IRubroMonetario rubromonetario) {
            Rubro rubro = (Rubro)rubromonetario;
            tcarmovimiento mov = (tcarmovimiento)(rubro.Movimiento);

            // Obtiene una instancia de la operacion a la vista.
            Operacion operacion = OperacionFachada.GetOperacion(mov.coperacion, false);

            // Los saldos de las cuotas se actualizan en cada generacion del movimiento y el reverso regresa registros dado el numeor de mensaje
            // de reverso.
            if (rubro.Movimiento.csaldo.IndexOf("CXP") >= 0) {
                // Actualiza saldos de cxp con los dados del movimiento.
                Operacioncxp cxp = new Operacioncxp(operacion.tcaroperacion);
                cxp.ActulizarSaldo(mov, rubro);
            }
        }

        /// <summary>
        /// Metodo que se encarga de ejecutar tareas al finalizar la ejecucion de una transaccion, ejemplo en vista calcular accrual.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del rquest utilizado en la ejecucion de transacciones.</param>
        public override void Finalizar(RqMantenimiento rqmantenimiento) {
            // No tomar accion.
        }
    }
}
