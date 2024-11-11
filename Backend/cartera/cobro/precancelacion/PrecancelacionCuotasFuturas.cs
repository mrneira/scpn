using cartera.cobro.helper;
using cartera.comp.mantenimiento.util;
using cartera.enums;
using cartera.saldo;
using dal.cartera;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace cartera.cobro.precancelacion {

    /// <summary>
    /// Clase que se encarga del cobro de capital de las cuotas por vencer, inclye la cuota en curso. 
    /// Crea registros de historia de las cuotas y los rubros.
    /// Marca como pagados los rubros y cuotas por vencer.
    /// </summary>
    public class PrecancelacionCuotasFuturas : CobroHelper {

        /// <summary>
        /// Clase que se encarga de acumular montos por codigo contable y ejecutar monetarios acumulados.
        /// </summary>
        private MonetarioAcumuladoCartera monetarioacumuladocartera = new MonetarioAcumuladoCartera();

        /// <summary>
        /// Crea una instancia de PrecancelacionCuotasFuturas.
        /// </summary>
        /// <param name="saldo">Objeto que contiene los valores adeudados por rubro.</param>
        /// <param name="fcobro">Fecha de cobro de las cuotas.</param>
        public PrecancelacionCuotasFuturas(Saldo saldo, int fcobro) {
            base.Fijavariables(saldo, fcobro);
        }

        /// <summary>
        /// Metodo que ejecuta el cobro de cuotas de la operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se procesa la transaccion.</param>
        public void Ejecutar(RqMantenimiento rqmantenimiento, Dictionary<string, decimal> mcobro) {
            this.rqmantenimiento = rqmantenimiento;

            List<tcaroperacioncuota> lcuotas = saldo.Operacion.Lcuotas;
            foreach (tcaroperacioncuota cuota in lcuotas) {
                this.Precancelacuota(cuota, mcobro);
            }

            // Ejecuta transaccion monetaria.
            monetarioacumuladocartera.EjecutaMonetario(rqmantenimiento, tcaroperacion, EnumEventos.PRECANCELACION.Cevento);
        }

        /// <summary>
        /// Metodo que precancela los rubros de capital de una cuota.
        /// </summary>
        /// <param name="cuota">Objeto que contiene los datos de una cuota.</param>
        private void Precancelacuota(tcaroperacioncuota cuota, Dictionary<string, decimal> mcobro) {
            // se precancelan unicamente las cuotas que no estan vencidas.
            if (TcarOperacionCuotaDal.EstavencidaOpagada(cuota, fcobro)) {
                return;
            }
            List<tcaroperacionrubro> lrubros = cuota.GetRubros();
            // Crea registro de historia de la cuota para reversos.
            TcarOperacionCuotaHistoriaDal.RegistraHistoria(cuota, fcobro, rqmantenimiento.Mensaje, true);

            // Marca como pagada la cuoata.
            cuota.fpago = fcobro;
            // Procesa rubros de la cuota.
            foreach (tcaroperacionrubro rubro in lrubros) {
                // Crea registros de historia de todos los rubros de la cuota para reversos.
                TcarOperacionRubroHistoriaDal.RegistraHistoria(cuota, rubro, fcobro, rqmantenimiento.Mensaje, true, decimales);
                // Marca el rubro como pagado.
                rubro.fpago = fcobro;
                base.Fijamontopagadoenrubro(cuota, rubro, monetarioacumuladocartera);

                decimal valorpagado = 0;
                if (!rubro.Mdatos.ContainsKey("actulizomontoarrglopagos")) {
                    valorpagado = rubro.GetPagadoentransaccion();
                }
                if ( valorpagado == 0) {
                    continue;
                }
                decimal acumulado = 0;
                if(mcobro.ContainsKey(rubro.csaldo)) {
                    acumulado = mcobro[rubro.csaldo];
                }
                mcobro[rubro.csaldo] = valorpagado + acumulado;
            }
        }

    }
}
