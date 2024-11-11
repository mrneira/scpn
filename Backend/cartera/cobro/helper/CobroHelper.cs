using cartera.comp.mantenimiento.util;
using cartera.monetario;
using dal.generales;
using dal.monetario;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;
using util.enums;

namespace cartera.cobro.helper {

    /// <summary>
    /// Clase utilitaria utilizada en el cobro de operaciones de cartera.
    /// </summary>
    public class CobroHelper {

        /// <summary>
        ///Objeto que contiene los saldos de una operacion de cartera.
        /// </summary>
        protected saldo.Saldo saldo;
        /// <summary>
        ///Objeto que almacena informacion de una operacion de cartera.
        /// </summary>
        protected tcaroperacion tcaroperacion;
        /// <summary>
        ///Fecha de cobro.
        /// </summary>
        protected int fcobro;
        /// <summary>
        ///Bandera que indica si la operacion se paga completa, se cobra todas las cuotas.
        /// </summary>
        protected bool pagototaloperacion = false;
        /// <summary>
        ///Request de entrada con el que se ejecuta la transaccion monetaria de cobro.
        /// </summary>
        protected RqMantenimiento rqmantenimiento;
        /// <summary>
        ///Dictionary que almacena valores acumulados por codigo de saldo, se utiliza para guardar informacion en la tabla tcaroperaciontransaccionrubro.
        /// </summary>
        protected Dictionary<String, decimal> mcobro = new Dictionary<String, decimal>();
        /// <summary>
        ///Numero de decimales para la moneda de la operacion.
        /// </summary>
        protected int decimales;

        /// <summary>
        /// Metodo que fija variables utilizadas en la ejecucion de una transaccion.
        /// </summary>
        /// <param name="saldo">Objeto que contiene los valores adeudados por rubro.</param>
        /// <param name="fcobro">Fecha de cobro de las cuotas.</param>
        protected void Fijavariables(saldo.Saldo saldo, int fcobro) {
            this.saldo = saldo;
            this.fcobro = fcobro;
            tcaroperacion = this.saldo.Operacion.tcaroperacion;
            decimales = TgenMonedaDal.GetDecimales(tcaroperacion.cmoneda);
        }

        /// <summary>
        /// Metodo que adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rubro">Codigo de rubro.</param>
        /// <param name="prelacion"></param>
        protected void Adicionarrubro(tcaroperacionrubro rubro, tcarprelacioncobro prelacion) {
            if (prelacion==null) {
                throw new AtlasException("CAR-0059", "RUBRO [{0}] NO TIENE DEFINIDO UNA PRELACIÓN", rubro.csaldo);
            }
            this.Adicionarrubro(rubro, (int)prelacion.rubro);
            if (prelacion.rubroasociado != null) {
                this.Adicionarrubro(rubro, (int)prelacion.rubroasociado);
            }
        }

        /// <summary>
        /// Metodo que adiciona rubros al request monetario.
        /// </summary>
        /// <param name="rubro">Codigo de rubro.</param>
        /// <param name="crubro"></param>
        protected void Adicionarrubro(tcaroperacionrubro rubro, int crubro) {
            RubroHelper.AdicionarRubro(rqmantenimiento, crubro, rubro.codigocontable, rubro, rubro.GetPagadoentransaccion(),
                    tcaroperacion.coperacion, tcaroperacion.cmoneda);

        }

        /// <summary>
        /// Actualiza el map con los valores cobrados por codigo de saldo esta informacion se utiliza para guardar en
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <param name="valorpagado">Valor pagado.</param>
        protected void Actualizamap(String csaldo, decimal? valorpagado) {
            if (valorpagado == null) {
                return;
            }
            decimal? acumulado = 0;
            if(mcobro.ContainsKey(csaldo)) {
                acumulado = mcobro[csaldo];
            }
            
            if (acumulado == null) {
                mcobro[csaldo] = (decimal)valorpagado;
            } else {
                mcobro[csaldo] = (decimal)valorpagado + (decimal)acumulado;
            }
        }

        /// <summary>
        /// Actualiza el monto pagado en el rubro, si es capital el valor pagado es el saldo.
        /// </summary>
        /// <param name="cuota"></param>
        /// <param name="rubro">Objeto que contiene los datos de un rubro de una cuota.</param>
        /// <param name="monetarioacumuladocartera">Clase que se encarga de acumular montos por codigo contable y ejecutar monetarios acumulados</param>
        protected void Fijamontopagadoenrubro(tcaroperacioncuota cuota, tcaroperacionrubro rubro,
                MonetarioAcumuladoCartera monetarioacumuladocartera) {
            // Baja del capital de cuotas por vencer.
            if (EnumTipoSaldo.EsCapital(TmonSaldoDal.Find(rubro.csaldo).ctiposaldo)) {
                rubro.SetPagadoentransaccion((decimal)rubro.saldo - (decimal)rubro.cobrado - (decimal)rubro.descuento);
                monetarioacumuladocartera.AcumulaenMap(cuota, rubro);
            }
        }

        /// <summary>
        /// Entrega el valor de: mcobro
        /// </summary>
        /// <returns></returns>
        public Dictionary<String, decimal> GetMcobro() {
            return mcobro;
        }

        /// <summary>
        /// Fija el valor de: mcobro
        /// </summary>
        public void SetMcobro(Dictionary<String, decimal> mcobro) {
            this.mcobro = mcobro;
        }

        /// <summary>
        /// Fija el valor de tcaroperacion
        /// </summary>
        /// <param name="tcaroperacion">Datos de tcaroperacion.</param>
        public void SetTcaroperacion(tcaroperacion tcaroperacion) {
            this.tcaroperacion = tcaroperacion;
            decimales = TgenMonedaDal.GetDecimales(tcaroperacion.cmoneda);
        }

    }

}
