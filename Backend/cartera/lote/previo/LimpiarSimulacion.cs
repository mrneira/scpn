using dal.cartera;
using System.Collections.Generic;
using util.dto.interfaces.lote;
using util.dto.lote;

namespace cartera.lote.previo
{
    /// <summary>
    /// Clase que se encarga de obtener y eliminar simulaciones generadas en el día
    /// </summary>
    public class LimpiarSimulacion : ITareaPrevia {

        public void Ejecutar(RequestModulo requestmodulo, string ctarea, int? orden)
        {
            Dictionary<string, string> entidades = new Dictionary<string, string>();
            entidades.Add("tcarsolicituddocumentos", "csolicitud");
            entidades.Add("tcarsolicituddescuentos", "csolicitud");
            entidades.Add("tcarsolicitudgastosliquida", "csolicitud");
            entidades.Add("tcarsolicitudrubro", "csolicitud");
            entidades.Add("tcarsolicitudcuota", "csolicitud");
            entidades.Add("tcarsolicitudcapacidadpagoie", "csolicitud");
            entidades.Add("tcarsolicitudcapacidadpago", "csolicitud");
            entidades.Add("tcarsolicitudrequisitos", "csolicitud");
            entidades.Add("tcarsolicitudgarantias", "csolicitud");
            entidades.Add("tcarsolicitudseguros", "csolicitud");
            entidades.Add("tcarsolicitudtasa", "csolicitud");
            entidades.Add("tcarsolicitudcargostabla", "csolicitud");
            entidades.Add("tcarsolicitud", "csolicitud");
            entidades.Add("tcarsolicitudetapa", "csolicitud");
            TcarSolicitudDal.EliminarSimulacion(entidades, "tgensolicitud", "csolicitud", "SIM");
        }
    }
}
