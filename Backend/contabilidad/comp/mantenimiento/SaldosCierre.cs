using contabilidad.saldo;
using core.componente;
using dal.contabilidad;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace contabilidad.comp.mantenimiento {

    /// <summary>
    /// Clase que se encarga de actualziar saldos contables de un comprobante contable.
    /// </summary>
    public class SaldosCierre : ComponenteMantenimiento {

        /// <summary>
        /// Actualiza saldos contables del movimiento.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            SaldoCierreHelper sch = new SaldoCierreHelper();
            sch.Rollup(rqmantenimiento.Ccompania, (int)rqmantenimiento.Mdatos["fcierre"]);
            
        }

    }

}
