using dal.cartera;
using modelo;
using util.dto.interfaces.lote;
using util.dto.lote;
using util.servicios.ef;
using System.Collections.Generic;
using dal.inversiones.contabilizacion;
using util.dto.mantenimiento;
using util;
using dal.lote;
using System;

namespace inversiones.lote.previo {

    /// <summary>
    /// Clase que se encarga de ejecutar la operación de actualización del accrual diario de los intereses generados, de las inversiones.
    /// </summary>
    public class ActualizacionAccrual : ITareaPrevia {

        private RqMantenimiento rqmantenimiento = null;

        /// <summary>
        /// Elimina e inserta la operación del accrual diario de los intereses generados de las inversiones.
        /// </summary>
        /// <param name="requestmodulo">Request del  módulo con el que se ejecuta la transaccion.</param>
        /// <param name="ctarea">Identificador de la tarea a ejectuar.</param>
        /// <param name="orden">Orden con el cual se ejecuta la tarea.</param>
        /// <returns></returns>
        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {

            rqmantenimiento = (RqMantenimiento)requestmodulo.GetDatos("RQMANTENIMIENTO");

            try
            {
                TinvContabilizacionDal.AccruaInteresDiario(
                rqmantenimiento.Cusuario
                , rqmantenimiento.Fconatable
                , rqmantenimiento.Ccompania
                , rqmantenimiento.Cagencia
                , rqmantenimiento.Cagencia);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }
    }
}
