using core.componente;
using core.servicios;
using dal.activosfijos;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.actadebaja {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un egreso para actas de baja de un activo.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            
            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }

            tacfegreso cabecera = (tacfegreso)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            if (cabecera.cegreso.Equals(0)) {
                cabecera.cegreso = int.Parse(Secuencia.GetProximovalor("AFEGRESO").ToString());
            }

            TacfEgresoDal.Completar(rqmantenimiento, cabecera);
            rqmantenimiento.Mdatos["cegreso"] = cabecera.cegreso;
            rqmantenimiento.Response["cegreso"] = cabecera.cegreso;

           
        }
    }
}
