using contabilidad.datos;
using core.componente;
using core.servicios;
using core.util;
using dal.contabilidad;
using dal.monetario;
using dal.presupuesto;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util;
using util.dto;
using util.dto.mantenimiento;

namespace presupuesto.saldo {

    /// <summary>
    /// Clase encargada del manejo de saldos contables.
    /// </summary>
    public class SaldoCierrePresupuestoHelper {

        /// <summary>
        /// Metodo que se encarga de actualizar  los saldos de las partidas de presupuesto de ingresos y gastos.
        /// posterior realiza una copia de estos saldos a la tabla tpptsaldoscierrepg y tpptsaldoscierrepi con la fecha
        /// de cierre mensual
        /// </summary>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <param name="fproceso">Fecha de proceso a la cual se realiza el rollup de los saldos.</param>
        public void Ejecutar(int ccompania, int fproceso) {

            // actualizar porcentajes
            TpptPartidaGastoDal.CalcularPartidasGasto(Fecha.GetAnio(fproceso));
            TpptPartidaIngresoDal.CalcularPartidasIngreso(Fecha.GetAnio(fproceso));

            TpptPartidaGastoDal.Eliminar(fproceso, ccompania);
            TpptPartidaIngresoDal.Eliminar(fproceso, ccompania);

            TpptPartidaGastoDal.InsertarSaldosMensuales(ccompania, fproceso);
            TpptPartidaIngresoDal.InsertarSaldosMensuales(ccompania, fproceso);
            

        }
    }
}
