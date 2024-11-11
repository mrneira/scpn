using core.componente;
using core.servicios;
using dal.activosfijos;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.egreso {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un egreso.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            if (TacfInventarioCongeladoDal.DevolverStatus())
            {
                rqmantenimiento.Response["INVENTARIOCONGELADO"] = "ERROR: EL INVENTARIO SE ENCUENTRA CONGELADO, NO ES POSIBLE REALIZAR INGRESOS O EGRESOS";
                throw new AtlasException("ACTFIJ-001", "ERROR: EL INVENTARIO SE ENCUENTRA CONGELADO, NO ES POSIBLE REALIZAR INGRESOS O EGRESOS");
            }

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

            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar"))
            {
                TacfEgresoDal.Eliminar(rqmantenimiento, cabecera);
                return;
            }            
        }
    }
}
