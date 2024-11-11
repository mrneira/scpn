using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace util.thread {

    /// <summary>
    /// Clase que tiene que implemntar las clases que se encargan de actualizar saldos de operaciones, ejemplo vista, plazo, prestamos,  contabilidad, caja, etc.
    /// </summary>
    public abstract class Saldo {

        /// <summary>
        /// Metodo a implemtar en clase por modulo, que se encarga de actulizar saldos de operaciones.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del rquest utilizado en la ejecucion de transacciones.</param>
        /// <param name="rubro">Objeto que almacena informacion relacionada a un rubro monetario.</param>
        public abstract void Actualizar(RqMantenimiento rqmantenimiento, IRubroMonetario rubro);

        /// <summary>
        /// Metodo que se encarga de ejecutar tareas al finalizar la ejecucion de una transaccion, ejemplo en vista calcular accrual.
        /// </summary>
        /// <param name="rqmantenimiento">Datos del rquest utilizado en la ejecucion de transacciones.</param>
        public abstract void Finalizar(RqMantenimiento rqmantenimiento);
    }
}