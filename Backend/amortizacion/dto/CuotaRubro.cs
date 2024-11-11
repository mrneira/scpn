using System;
using System.Collections.Generic;
using System.Text;

namespace amortizacion.dto {
    public class CuotaRubro {

        /// <summary>
        /// Codigo de saldo Capital, Interes normal, Seguro vida, Seguro incendio.
        /// </summary>
        private String csaldo;

        /// <summary>
        /// Valor de la cuota asociado al rubro.
        /// </summary>
        private decimal valor;

        /// <summary>
        /// Tasa con la que se calcula el valor de la cuota, cuando esta es un tipo ACC.
        /// </summary>
        private decimal tasa;

        /// <summary>
        /// Tasa diaria con la que se calcula el valor de la cuota, cuando esta es un tipo ACC, se utiliza en progreciones geometricas cuando la
        /// cuota se calcula con tasa efectiva.
        /// </summary>
        private decimal tasadia;
        /// <summary>
        /// Monto sobre el cual se calcula el valor de la cuota si es tipo ACC.
        /// </summary>
        private decimal montotasa;

        /// <summary>
        /// Interes deudor de la cuota si es tipo ACC.
        /// </summary>
        private decimal interesdeudor;

        /// <summary>
        /// Saldo de tipos ACC, se calcula cuando la fecha desde la cual se calcula el interes es menos a la feha de generacion de la tabla.
        /// </summary>
        private decimal saldoaccrual;

        /// <summary>
        /// Crea una instancia de CuotaRubro.
        /// </summary>
        /// <param name="csaldo"> Codigo de saldo con el cual se crea la instancia.</param>
        /// <param name="valor"> Monto asociado al codigo de saldo con el cual se crea la instancia.</param>
        public CuotaRubro(String csaldo, decimal valor) {
            this.csaldo = csaldo;
            this.valor = valor;
        }


        /// <summary>
        /// Entrega y Fija el valor de: csaldo
        /// </summary>
        public string Csaldo { get => csaldo; set => csaldo = value; }

        /// <summary>
        /// Entrega y Fija el valor de: valor
        /// </summary>
        public decimal Valor { get => valor; set => valor = value; }

        /// <summary>
        /// Entrega y Fija el valor de: tasa
        /// </summary>
        public decimal Tasa { get => tasa; set => tasa = value; }

        /// <summary>
        /// Entrega y Fija el valor de: tasadia
        /// @return String
        /// </summary>
        public decimal Tasadia { get => tasadia; set => tasadia = value; }

        /// <summary>
        /// Entrega y Fija el valor de: montotasa
        /// </summary>
        public decimal Montotasa { get => montotasa; set => montotasa = value; }

        /// <summary>
        /// Entrega y Fija el valor de: interesdeudor
        /// </summary>
        public decimal Interesdeudor { get => interesdeudor; set => interesdeudor = value; }

        /// <summary>
        /// Entrega y Fija el valor de: saldoaccrual
        /// </summary>
        public decimal Saldoaccrual { get => saldoaccrual; set => saldoaccrual = value; }
    }
}
