using System;
using System.Collections.Generic;
using System.Text;
namespace amortizacion.dto {

    /// <summary>
    /// Clase utilitaria que contiene informacion temporal asociada a una tabla de amortizacion.
    /// </summary>
    public class Cuota {

        /// <summary>
        /// Numero de cuota.
        /// </summary>
        private int numero;
        /// <summary>
        /// Numero de dias de la cuota.
        /// </summary>
        private int dias;
        /// <summary>
        /// Numero de dias de la cuota.
        /// </summary>
        private int diasreales;
        /// <summary>
        /// Fecha de inicio de la cuota.
        /// </summary>
        private int finicio;
        /// <summary>
        /// Fecha de vencimiento de la cuota.
        /// </summary>
        private int fvencimiento;
        /// <summary>
        /// Capital reducio de la cuota en la primera cuota es k total - k cuota.
        /// </summary>
        private decimal capitalreducido;
        /// <summary>
        /// Valor de interes deudor si existe.
        /// </summary>
        private decimal interesdeudor;

        /// <summary>
        /// Lista de rubros asociados a la cuota.
        /// </summary>
        private List<CuotaRubro> cuotarubros = new List<CuotaRubro>();


        /// <summary>
        /// Crea una instancia de cuota, dado el numero de cuota.
        /// </summary>
        /// <param name="numero"> Numero de cuota a crear.</param>
        public Cuota(int numero) {
            this.numero = numero;
        }

        /// <summary>
        /// Adiciona objetos tipo CuotaRubro a la lista.
        /// </summary>
        /// <param name="cuotarubro"> Objeto que contiene el detalle de un rubro de una cuota.</param>
        public void AddCuotaRubro(CuotaRubro cuotarubro) {
            this.cuotarubros.Add(cuotarubro);
        }

        /// <summary>
        /// Entrega y Fija el valor de: numero
        /// </summary>
        public int Numero { get => numero; set => numero = value; }

        /// <summary>
        /// Entrega y Fija el valor de: dias
        /// </summary>
        public int Dias { get => dias; set => dias = value; }

        /// <summary>
        /// Entrega y Fija el valor de: diasreales
        /// </summary>
        public int Diasreales { get => diasreales; set => diasreales = value; }

        /// <summary>
        /// Entrega y Fija el valor de: finicio
        /// </summary>
        public int Finicio { get => finicio; set => finicio = value; }

        /// <summary>
        /// Entrega y Fija el valor de: fvencimiento
        /// </summary>
        public int Fvencimiento { get => fvencimiento; set => fvencimiento = value; }

        /// <summary>
        /// Entrega y Fija el valor de: capitalreducido
        /// </summary>
        public decimal Capitalreducido { get => capitalreducido; set => capitalreducido = value; }

        /// <summary>
        /// Entrega y Fija el valor de: interesdeudor
        /// </summary>
        public decimal Interesdeudor { get => interesdeudor; set => interesdeudor = value; }

        /// <summary>
        /// Entrega el valor de: cuotarubros
        /// </summary>
        public List<CuotaRubro> GetCuotarubros() {
            return this.cuotarubros;
        }

        public decimal GetCapital() {
            decimal capital = 0;
            foreach (CuotaRubro cuotaRubro in cuotarubros) {
                if (cuotaRubro.Csaldo == "CAP-CAR") {
                    capital = cuotaRubro.Valor;
                    break;
                }
            }
            return capital;
        }
    }
}
