using contabilidad.datos;
using core.componente;
using core.servicios;
using core.util;
using dal.contabilidad;
using dal.monetario;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto;
using util.dto.mantenimiento;

namespace contabilidad.saldo {

    /// <summary>
    /// Clase encargada del manejo de saldos contables.
    /// </summary>
    public class SaldoCierreHelper {

        public bool reversar = false;

        /// <summary>
        /// Metodo que se encarga de acumular saldos en cuenta padre, los saldos acumulados los llena en la tabla tconsaldoscierre.
        /// </summary>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <param name="fproceso">Fecha contable a la cual se realiza el rollup de los saldos.</param>
        public void Rollup(int ccompania, int fcontable) {

            //Encuentra el registro de periodo actual en funcion de fecha contable.
            tconperiodocontable periodoactual = TconPeriodoContableDal.Find(fcontable);

            //Elimina registros de saldos para el periodo actual
            TconSaldosCierreDal.Eliminar(periodoactual.fperiodofin, ccompania);

            //Insertar saldos para cuentas de movimiento del periodo actual
            TconSaldosCierreDal.Insertar(periodoactual, fcontable);

            //Obtener el mayor nivel por plan de cuentas
            IList<tconnivel> lnivel = TconNivelDal.FindDescendente(ccompania);

            //primer RollUP para calcular utilidad en cada plan
            foreach (tconnivel tconNivel in lnivel)
            {
                if (((int)tconNivel.cnivel).CompareTo(1) == 0)
                {
                    break;
                }

                TconSaldosCierreDal.Rollup(periodoactual.fperiodofin,ccompania, (int)tconNivel.cnivel, fcontable);
            }

            //cálculo de saldo para cuenta '7340201' --Resultados del ejercicio
            decimal saldo71 = TconSaldosCierreDal.GetSaldosPorCuenta("71", periodoactual.fperiodofin);
            decimal saldo72 = TconSaldosCierreDal.GetSaldosPorCuenta("72", periodoactual.fperiodofin);
            decimal saldo731 = TconSaldosCierreDal.GetSaldosPorCuenta("731", periodoactual.fperiodofin);
            decimal saldo733 = TconSaldosCierreDal.GetSaldosPorCuenta("733", periodoactual.fperiodofin);
            decimal saldo7340201 = saldo71 - (saldo72 + saldo731 + saldo733);

            //cálculo de saldo para cuenta '330201' --Resultados del ejercicio
            decimal saldo1 = TconSaldosCierreDal.GetSaldosPorCuenta("1", periodoactual.fperiodofin);
            decimal saldo2 = TconSaldosCierreDal.GetSaldosPorCuenta("2", periodoactual.fperiodofin);
            decimal saldo330201 = saldo1 - (saldo2);

            //Elimina registros de saldos para el periodo actual
            TconSaldosCierreDal.Eliminar(periodoactual.fperiodofin, ccompania);

            //Insertar saldos para cuentas de movimiento del periodo actual
            TconSaldosCierreDal.Insertar(periodoactual, fcontable);

            //Actualizar saldos de cuentas de resultado
            TconSaldosCierreDal.Actualizar(periodoactual.fperiodofin, saldo7340201, "7340201");
            TconSaldosCierreDal.Actualizar(periodoactual.fperiodofin, saldo330201, "330201");


            //RollUP final
            foreach (tconnivel tconNivel in lnivel) {
                if (((int)tconNivel.cnivel).CompareTo(1) == 0) {
                    break;
                }

                TconSaldosCierreDal.Rollup(periodoactual.fperiodofin, ccompania, (int)tconNivel.cnivel, fcontable);
            }


        }
    }
}
