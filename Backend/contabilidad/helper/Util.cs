using core.servicios;

namespace contabilidad.helper {

    public class Util {

        /// <summary>
        /// Fija el numero de comprobante contable cuando se crea un nuevo comprobante.
        /// </summary>

        public static string GetCcomprobante() {
            long secuencia = Secuencia.GetProximovalor("COMPROBANTE");
		    return secuencia.ToString();
	    }

    }
}
