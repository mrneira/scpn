using core.componente;
using dal.cartera;
using dal.cobranzas;
using modelo;
using System;
using util;
using util.dto.mantenimiento;

namespace cartera.comp.mantenimiento.pago.validar {
    /// <summary>
    /// Clase que se encarga de ejecutar validaciones sobre la cobranza
    /// </summary>
    public class EstadoCobranza : ComponenteMantenimiento {

        /// <summary>
        /// Validación de estado de cobranza
        /// </summary>
        /// <param name="RqMantenimiento">Request de Mantenimiento</param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string estadoCobranza = TcarParametrosDal.GetValorTexto("ESTADO-COBRANZA-JURIDICO", rqmantenimiento.Ccompania);
            tcobcobranza cobranza = TcobCobranzaDal.Find(rqmantenimiento.Coperacion, estadoCobranza);

            if (cobranza != null) {
                throw new AtlasException("CAR-0060", "OPERACIÓN TIENE LA COBRANZA {1} EN ESTADO JURÍDICO, NO SE PERMITEN PAGOS", cobranza.ccobranza.ToString());
            }
        }

    }
}
