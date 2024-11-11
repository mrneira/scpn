using contabilidad.saldo;
using core.componente;
using dal.contabilidad;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento {

    /// <summary>
    /// Reversa la actualizacion de saldos 
    /// </summary>
    public class ReversarSaldo : ComponenteMantenimiento {

        /// <summary>
        /// Actualiza saldos contables del movimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

        }

    }

}

