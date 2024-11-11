using dal.cartera;
using System.Collections.Generic;
using util.dto.interfaces.lote;
using util.dto.lote;

namespace cartera.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener y eliminar simulaciones generadas en el día
    /// </summary>
    public class LimpiarArregloPago : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            Dictionary<string, string> entidades = new Dictionary<string, string>();
            entidades.Add("tcaroperacionarrepagorubro", "coperacion");
            TcarOperacionArregloPagoDal.EliminarArregloPagos(entidades, "tcaroperacionarreglopago", "coperacion", "APR");
        }
    }
}
