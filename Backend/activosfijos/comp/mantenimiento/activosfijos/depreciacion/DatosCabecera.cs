using core.componente;
using core.servicios;
using dal.activosfijos;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.depreciacion {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de una depreciacion.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

            //pregunta por el valor del key eliminar dentro del request para actualizar el estado de la depreciacion
            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar")) {
                int cdepreciacion = int.Parse(rqmantenimiento.Mdatos["cdepreciacion"].ToString()); 
                TacfDepreciacionDal.Eliminar(rqmantenimiento, cdepreciacion);
                rqmantenimiento.Mtablas["CABECERA"] = null;
                rqmantenimiento.Mtablas["DETALLE"] = null;
                return;
            }

            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }

            tacfdepreciacion cabecera = (tacfdepreciacion)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            if (cabecera.cdepreciacion.Equals(0)) {
                cabecera.cdepreciacion = int.Parse(Secuencia.GetProximovalor("AFDEPRECIA").ToString());
            }
            TacfDepreciacionDal.Completar(rqmantenimiento, cabecera);
            rqmantenimiento.Mdatos["cdepreciacion"] = cabecera.cdepreciacion;
            rqmantenimiento.Response["cdepreciacion"] = cabecera.cdepreciacion;
            
        }
    }
}
