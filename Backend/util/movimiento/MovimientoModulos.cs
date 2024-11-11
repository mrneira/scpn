using modelo.helper.cartera;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace util.movimiento {

    /// <summary>
    /// Interface que tiene que implemntar los beans que completan informacion de cuenta con la cual se ejecuta un movimiento, ejemplo vista, plazo, prestamos, contabilidad, caja, etc.
    /// </summary>
    public interface MovimientoModulos {

        /// <summary>
        /// Metodo a implemtar en cada modulo, que se encarga de completar el movimiento con datos de la cuenta.
        /// </summary>
        /// <param name="movimiento">Objeto que contiene los datos del movimeinto de una cuenta.</param>
        /// <param name="rqmantenimiento">Datos del rquest utilizado en la ejecucion de transacciones.</param>
        /// <param name="rqrubro">Datos del rquest del rubro.</param>
        void Completardatos(Movimiento movimiento, RqMantenimiento rqmantenimiento, RqRubro rqrubro);
    }

}
