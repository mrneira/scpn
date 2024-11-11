using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace modelo.helper.cartera {

    /// <summary>
    /// Clase que que contiene valores volatiles de rubros asociados a cuotas de una tabla de pagos.
    /// </summary>
    public class CuentaPorCobrar : AbstractDto {

        /// <summary>
        /// Bandera que indica si inserto un registro de reverso.
        /// </summary>
        private bool registroregistrosreverso = false;

        public virtual bool Registroregistrosreverso { get => registroregistrosreverso; set => registroregistrosreverso = value; }

    }
}
