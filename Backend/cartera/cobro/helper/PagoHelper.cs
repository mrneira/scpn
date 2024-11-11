using cartera.datos;
using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.dto.mantenimiento;

namespace cartera.cobro.helper {

    /// <summary>
    /// Clase utilitaria utilizada en el cobro de operaciones de cartra, de esta clase heredan todas las opciones de cobro..
    /// </summary>
    public abstract class PagoHelper : ComponenteMantenimiento {

        /// <summary>
        /// Objeto que contiene los datos de una operacion de cartera.
        /// </summary>
        protected Operacion operacion;
        /// <summary>
        ///Objeto que contiene una instancia de cuentas por pagar asociadas a la operacion de cartera.
        /// </summary>
        protected Operacioncxp cxp;
        /// <summary>
        ///Valor pagado en caja o con debito a cuenta contable.
        /// </summary>
        protected decimal? valorpagado;
        /// <summary>
        ///Fecha de cobro de la operacion de cartera.
        /// </summary>
        protected int fcobro;

        protected bool aceptaPagoCero = false;

        /// <summary>
        /// Metodo que inicializa datos de una operacion de cartera.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        public void Inicializaroperacion(RqMantenimiento rqmantenimiento) {
            operacion = OperacionFachada.GetOperacion(rqmantenimiento);
        }

        /// <summary>
        /// Metodo que inicializa variables utilizadas en el cobro de operaciones de cartera.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <param name="aceptaPagoCero">true indica que se ejecuta la transaccion sin recibir valor a pagar.</param>
        /// <returns>Saldo</returns>
        public saldo.Saldo Inicializar(RqMantenimiento rqmantenimiento, bool aceptaPagoCero) {
            this.aceptaPagoCero = true;
            return this.Inicializar(rqmantenimiento);
        }

        /// <summary>
        /// Metodo que inicializa variables utilizadas en el cobro de operaciones de cartera.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion.</param>
        /// <returns>Saldo</returns>
        public saldo.Saldo Inicializar(RqMantenimiento rqmantenimiento) {
            Inicializaroperacion(rqmantenimiento);
            // El cobro se aplica con fecha de trabajo, ejemplo sabado se cobra mora hasta ese día.
            fcobro = (int)rqmantenimiento.Ftrabajo;
            // Distribuye el valor pagago y ejecuta el monetario del cobro.
            valorpagado = rqmantenimiento.Monto;
            if ((valorpagado == null) || ((valorpagado <= Constantes.CERO) && !aceptaPagoCero)) {
                throw new AtlasException("CAR-0004", "VALOR A PAGAR TIENE QUE SER MAYOR A CERO");
            }
            // Crea una inatancia de Operacioncxp
            cxp = new Operacioncxp(operacion.tcaroperacion);
            // Calcula valores adeudados de cuotas vencidas.

            saldo.Saldo saldo = new saldo.Saldo(operacion, fcobro);

            return saldo;
        }
    }
}

