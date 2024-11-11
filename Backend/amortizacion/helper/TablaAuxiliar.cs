using amortizacion.dto;
using System;
using System.Collections.Generic;
using System.Text;

namespace amortizacion.helper {
    public class TablaAuxiliar {

        /** Cuota de la tabla de amortizacion original original. */
        private Cuota cuota;
        /** Numero de cuota siempre debe empezar en la cuota 1. */
        private int numerocuota;
        /** Dias acumlados de las cuotas no pagadas menores a la cuota de proceso. */
        private int diasacumulados;

        /// <summary>
        /// Crea una nueva instancia de TablaAuxiliar
        /// </summary>
        /// <param name="Cuota">Datos originales de una cuota.</param>
        /// <param name="diasacumulados">Numero de dias acumulados hasta la cuota en proceso.</param>
        public TablaAuxiliar(Cuota cuota, int diasacumulados) {
            this.cuota = cuota;
            this.diasacumulados = diasacumulados;
        }
        
        /// <summary>
        /// Entrega el valor de: numerocuota
        /// </summary>
        public int GetNumerocuota() {
            return this.numerocuota;
        }

        /// <summary>
        /// Fija el valor de: numerocuota
        /// </summary>
        /// <param name="numerocuota">parametro a setear</param>

        public void SetNumerocuota(int numerocuota) {
            this.numerocuota = numerocuota;
        }

        /// <summary>
        /// Entrega el valor de: cuota
        /// </summary>
        public Cuota GetCuota() {
            return this.cuota;
        }

        /// <summary>
        /// Entrega el valor de: diasacumulados
        /// </summary>
        public int GetDiasacumulados() {
            return this.diasacumulados;
        }
    }
}
