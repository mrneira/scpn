using cartera.datos;
using dal.cartera;
using dal.generales;
using modelo;
using System;
using System.Collections.Generic;
using util;
using util.dto.interfaces.lote;
using util.dto.mantenimiento;

namespace cartera.lote.operacion
{
    /// <summary>
    /// Clase que se encarga de cerrar el accrual, actualiza a cero el valor del campo ACCRUAL, actualiza el saldo pendiente de pago de los
    /// rubros tipo accrual.Las cuotas que vencen antes de la proxima fecha contable el cierre se hace en el dia contable, ejemplo cuotas que
    /// vence el viernes se cierra el viernes, cuotas que vencen domingo se cierra el viernes el calculo se hace hasta un dia antes de la fecha
    /// de vencimiento.
    /// </summary>
    public class CierreAccrual : ITareaOperacion {

        private IList<tcaraccrual> laccrual;

        public void Ejecutar(RqMantenimiento rqmantenimiento, RequestOperacion requestoperacion) {
            Operacion operacion = OperacionFachada.GetOperacion(rqmantenimiento);
            if (operacion.tcaroperacion.cestatus.Equals("APR") || operacion.tcaroperacion.cestatus.Equals("NEG")) {
                return;
            }
            List<tcaroperacioncuota> lcuotas = operacion.GetLcuotas();
            laccrual = TcarAccrualDal.FindAll();
            foreach (tcaroperacioncuota cuota in lcuotas) {
                // Ejecuta cambio de estatus si el estatus destino es diferente y tiene cuotas venciadas
                if (!TcarOperacionCuotaDal.EstavencidaOpagada(cuota, requestoperacion.Fconatbleproxima)) {
                    break;
                }
                if (cuota.fvencimiento >= requestoperacion.Fconatbleproxima) {
                    break;
                }
                this.ProcesaCuota(rqmantenimiento, cuota, operacion.tcaroperacion);
            }
        }

        /// <summary>
        /// Metodo que ejecuta cierre del accrual por cuota.
        /// </summary>
        private void ProcesaCuota(RqMantenimiento rqmantenimiento, tcaroperacioncuota cuota, tcaroperacion tcarOperacion) {
                List<tcaroperacionrubro> lrubros = cuota.GetRubros();
		    foreach (tcaroperacionrubro rubro in lrubros) {
			    if (!this.Procesar(rubro)) {
				    continue;
			    }
			    if (rubro.fvigencia < cuota.fvencimiento) {
				    // Historia del registro
				    TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, cuota.fvencimiento??0, rqmantenimiento.Mensaje,
						    false, TgenMonedaDal.GetDecimales(tcarOperacion.cmoneda));
			    }
                // si tiene un registro de historia el valor del accrual diario tiene que actualizarce a cero.
                rubro.accrual = 0;
		    }
	    }

        /// <summary>
        /// Valida si ejecuta el cierre del accrual para el tipo de saldo.
        /// </summary>
        private Boolean Procesar(tcaroperacionrubro rubro) {
		    if (!(rubro.esaccrual??false)) {
                return false;
            }
		        if (rubro.accrual != null && rubro.accrual == 0) {
                return false;
            }
            tcaraccrual tcarAccrual = TcarAccrualDal.Find(laccrual, rubro.csaldo);
		        if (tcarAccrual == null || tcarAccrual.accrualdesde.Equals("V")) {
                return false;
            }
		        return true;
        }
        

    }
}
