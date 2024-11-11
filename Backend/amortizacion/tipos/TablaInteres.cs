using amortizacion.helper;
using System;
using System.Collections.Generic;
using System.Text;
using amortizacion.dto;
using util;

namespace amortizacion.tipos {

    /// <summary>
    /// Clase que implementa la tabla de amortizacion de interes y capital al vencimiento.
    /// </summary>
    public class TablaInteres : helper.Tabla {

        /** Objeto que contien los datos necesarios para genrar la tabla de pagos. */
        private Parametros parametros;

        /** Numero de cuota, a generar. */
        private int numerocuota = 0;

        /** Monto del capital reducido. */
        private decimal capitalreducido;

        public override List<Cuota> Generar(Parametros parametros) {
            this.parametros = parametros;
            // installmentParameters = pInstallment.getInstallmentParameters();
            capitalreducido = (decimal)parametros.Monto;
            numerocuota = (int)this.parametros.Cuotainicio;
            generartabla();
            return base.cuotas;
        }
        
        /// <summary>
        /// Calcula el interes de las cuotas, en la ultima cuota va el capital total de la operacion.
        /// </summary>
        private void generartabla() {
            Boolean end = false;
            int size = (int)parametros.Numerocuotas;
            size = size + numerocuota - 1;
            for (int i = numerocuota; i <= size; i++) {
                base.Calculafechas(parametros);
                if (i == size) {
                    end = true;
                }
                // Calcula tipos ACC
                base.CalculaAccrual(parametros, capitalreducido, false);

                Generacuota(end);
                numerocuota++;
            }// end for
        }
        
        /// <summary>
        /// Calcula el capital de la cuota, si es la ultima cuota va todo el capital.
        /// </summary>
        /// <param name="pEnd">Indica si se esta generando la ultima cuota de la tabla de amortizacion.</param>
        private void Generacuota(Boolean pEnd) {
            decimal capital = Constantes.CERO;
            if (pEnd) {
                capital = capitalreducido;
            }
            base.Adicionacuota(parametros, numerocuota, capital, capitalreducido, true, true);
        }

    }

}
