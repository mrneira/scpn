using dal.cartera;
using dal.generales;
using general.util;
using modelo;
using System;
using System.Collections.Generic;

namespace cartera.helper {

    /// <summary>
    /// Clase utilitaria que se encarga de .
    /// </summary>
    public class TasasOperacion {

        private Boolean cambioTasa = false;

        private IList<tcaroperaciontasa> ltasas;


        /// <summary>
        /// Crea una instancia de TasasOperacion.
        /// </summary>
        public TasasOperacion(String coperacion) {
            ltasas = TcarOperacionTasaDal.Find(coperacion);
	    }

        /// <summary>
        /// Ejecuta el cambio de tasas de la operacion.
        /// </summary>
        public void CambiarTasa(int cfrecuencia) {
		    foreach (tcaroperaciontasa tcarOperacionTasa in ltasas) {
                this.FijarNuevaTasa(tcarOperacionTasa, cfrecuencia);
            }
        }

        /// <summary>
        /// Cambio de tasa a la operacion.
        /// </summary>
        private void FijarNuevaTasa(tcaroperaciontasa tcarOperacionTasa, int cfrecuencia) {
            // Obtiene la tasa de reajuste.
            tgentasareferencial tref = TgenTasareferencialDal.Find(tcarOperacionTasa.ctasareferencial, tcarOperacionTasa.cmoneda);
            Decimal? tasaBase = tref.tasa;
		    if (tcarOperacionTasa.tasabase.CompareTo(tasaBase) == 0) {
                return; // No cambia la tasa.
            }
		    this.cambioTasa = true;
            Decimal tasanominal = Tasa.GetTasa(tasaBase??0, tcarOperacionTasa.margen, tcarOperacionTasa.operador);
            Decimal tasaEfectiva = Tasa.GetTasaEfectiva(tasanominal, cfrecuencia);

            tcarOperacionTasa.tasabase = tasaBase??0;
            tcarOperacionTasa.tasa = tasanominal;
            tcarOperacionTasa.tasaefectiva = tasaEfectiva;
        }

        /// <summary>
        /// Indica si existe cambio de tasa en ese caso se realiza el reajuste.
        /// </summary>
        public Boolean IsCambioTasa() {
            return cambioTasa;
        }

        /// <summary>
        /// Entrega la nueva lista de tasas de la operacion.
        /// </summary>
        public IList<tcaroperaciontasa> GetLtasas() {
            return ltasas;
        }

    }
}
