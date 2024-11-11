using core.componente;
using dal.cartera;
using modelo;
using System.Collections.Generic;
using util.dto.mantenimiento;
namespace cartera.comp.mantenimiento.aprobacion
{
    /// <summary>
    /// Clase que pasa los datos tasas de una solicitud de credito a tasas de operacion de cartera.
    /// </summary
    public class SolicitudToOperacionTasa : ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
            List<tcarsolicitudtasa> lsoltasa = (List<tcarsolicitudtasa>)TcarSolicitudTasaDal.Find(long.Parse(rqmantenimiento.Mdatos["csolicitud"].ToString()));
            // Transforma a tasas de la operacion.
            List<tcaroperaciontasa> ltasa = TcarSolicitudTasaDal.ToTcarOperacionTasa(lsoltasa, rqmantenimiento.Coperacion);
            // Adiciona datos a Tabla para que haga el commit de los objetos al final.
            rqmantenimiento.AdicionarTabla(typeof(tcaroperaciontasa).Name.ToUpper(), ltasa, false);
        }
    }
}
