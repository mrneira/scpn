using dal.cartera;
using modelo;
using monetario.util;
using System;
using util.dto.mantenimiento;

namespace cartera.monetario {

    /// <summary>
    /// Clase utilitaria que se encarga de cambiar el codigo de transaccion del request y encera rubros.
    /// </summary>
    public class MonetarioHelper {

        /// <summary>
        /// Cambia en el requets de mantenimiento el codigo de transaccion monetaria con la cual se ejecuta la transaccion.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <param name="cevento"></param>
        /// <returns></returns>
        public static tcarevento FijaTransaccion(RqMantenimiento rqmantenimiento, String cevento) {
            tcarevento evento = TcarEventoDal.Find(cevento);
            rqmantenimiento.Cambiartransaccion((int)evento.cmodulo, (int)evento.ctransaccion);
            rqmantenimiento.EncerarRubros();
            return evento;
        }

        /// <summary>
        /// Ejecuta transaccion monetaria.
        /// </summary>
        /// <param name="rqmantenimiento">Datos de entrada con los que se ejecuta la transaccion.</param>
        public static void EjecutaMonetario(RqMantenimiento rqmantenimiento) {
            // ejecuta el monetario.
            if (rqmantenimiento.Rubros.Count > 0) {
                ComprobanteMonetario monetario = new ComprobanteMonetario();
                monetario.Ejecutar(rqmantenimiento);
            }
        }

    }
}
