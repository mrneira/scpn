using core.componente;
using core.servicios;
using dal.activosfijos;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.ingreso {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un ingreso.
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

            tacfingreso cabecera = (tacfingreso)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            if (cabecera.cingreso.Equals(0)) {
                cabecera.cingreso = int.Parse(Secuencia.GetProximovalor("AFINGRESO").ToString());
            }
            TacfIngresoDal.Completar(rqmantenimiento, cabecera);
            rqmantenimiento.Mdatos["cingreso"] = cabecera.cingreso;
            rqmantenimiento.Response["cingreso"] = cabecera.cingreso;
           

            //pregunta por el valor del key eliminar dentro del request para actualizar el campo eliminado del ingreso seleccionado
            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar"))
            {
                TacfIngresoDal.Eliminar(rqmantenimiento, cabecera);
                return;
            }
           
        }
    }
}
