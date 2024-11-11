using core.componente;
using modelo;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util.dto.mantenimiento;
using util.dto.consulta;
using dal.monetario;
using dal.generales;
using util;

namespace monetario.util.rubro {

    /// <summary>
    /// Clase utilitaria que maneja rubros asociados a una transaccion monetaria.
    /// </summary>
    public class TransaccionRubro {

        private List<tmonrubro> lrubros;

        /// <summary>
        /// Crea una instancia de TransaccionRubro, con la definicion de rubros asociados a una transaccion.
        /// </summary>
        /// <param name="tgentransaction">Objeto que contien datos definicion de una transaccion monetaria.</param>
        public TransaccionRubro(tgentransaccion tgentransaction) {
            this.lrubros = TmonRubroDal.Find(tgentransaction).Cast<tmonrubro>().ToList();
        }

        /// <summary>
        /// Crea una instancia de TransaccionRubro, con la definicion de rubros asociados a una transaccion.Dado el modulo y transaccion.
        /// </summary>
        /// <param name="cmodulo">Codigo de modulo al que pertenece la transaccion.</param>
        /// <param name="ctransaccion">Codigo de transaccion a obtener los rubros.</param>
        public TransaccionRubro(int cmodulo, int ctransaccion) {
            tgentransaccion tgentransaction = TgentransaccionDal.Find(cmodulo, ctransaccion);
            this.lrubros = TmonRubroDal.Find(tgentransaction).Cast<tmonrubro>().ToList();
        }

        /// <summary>
        /// Entrega la definicion de un rubro de la transaccion, para un codigo de saldo especifico.
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <returns>TmonRubroDto</returns>
        public tmonrubro GetRubro(string csaldo) {
            tmonrubro rubro = null;
            foreach (tmonrubro obj in this.lrubros) {
                if (obj.csaldo.CompareTo(csaldo) != 0) {
                    continue;
                }
                rubro = obj;
            }
            if (rubro == null) {
                tmonrubro obj = this.lrubros[0];
                throw new AtlasException("BMON-005", "RUBROS NO DEFINIDOS EN TMONRUBRO MODULO: {0} TRANSACCION: {1} CODIGO DE SALDO: {2}",
                        obj.cmodulo, obj.ctransaccion, csaldo);
            }
            return rubro;
        }

        /// <summary>
        /// Entrega la definicion de un rubro de la transaccion, para un codigo de rubro.
        /// </summary>
        /// <param name="crubro">Codigo de rubro.</param>
        /// <returns>TmonRubroDto</returns>
        public tmonrubro GetRubro(int crubro) {
            tmonrubro rubro = null;
            foreach (tmonrubro obj in this.lrubros) {
                if (obj.crubro != crubro) {
                    continue;
                }
                rubro = obj;
            }
            if (rubro == null) {
                tmonrubro obj = this.lrubros[0];
                throw new AtlasException("BMON-006", "RUBROS NO DEFINIDOS EN TMONSALDO MODULO: {0} TRANSACCION: {1} RUBRO: {2}",
                        obj.cmodulo, obj.ctransaccion, crubro);
            }
            return rubro;
        }
    }
}
