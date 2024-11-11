using System;
using util.dto.consulta;
using util.dto.mantenimiento;

namespace garantias.datos {

    /// <summary>
    /// Clase utilitaria que maneja datos de una garantia.
    /// </summary>
    public class OperacionFachada {

        /// <summary>
        ///  Entrega un objeto con los datos de una operacion de garantia dado el numero de garantia.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        /// <returns></returns>
        public static Operacion GetOperacion(RqMantenimiento rqmantenimiento) {
		    return OperacionFachada.GetOperacion(rqmantenimiento.Coperacion, false);
	    }

        /// <summary>
        /// Entrega un objeto con los datos de una operacion de garantia dado el numero de operacion.
        /// </summary>
        /// <param name="rqconsulta"></param>
        /// <returns></returns>
        public static Operacion GetOperacion(RqConsulta rqconsulta) {
		    return OperacionFachada.GetOperacion(rqconsulta.Coperacion, true);
        }

        /// <summary>
        /// Entrega un objeto con los datos de una operacion de garantia dado el numero de operacion.
        /// </summary>
        /// <param name="coperacion"></param>
        /// <param name="consulta"></param>
        /// <returns></returns>
        public static Operacion GetOperacion(string coperacion, Boolean consulta) {
            DatosGarantia dc = DatosGarantia.GetDatosGarantia();
		    return dc.GetOperacion(coperacion, consulta);
        }

    }
}
