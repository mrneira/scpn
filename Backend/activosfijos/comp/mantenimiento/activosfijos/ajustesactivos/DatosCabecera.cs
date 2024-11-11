using core.componente;
using core.servicios;
using dal.activosfijos;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace activosfijos.comp.mantenimiento.activosfijos.ajustesactivos {

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un ajuste de bodega.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {

         
            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0)
            {
                return;
            }


            tacfajuste cabecera = (tacfajuste)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            if (cabecera.cajuste.Equals(0)) {
                cabecera.cajuste = int.Parse(Secuencia.GetProximovalor("AFAJUSTE").ToString());
            }

            TacfAjusteDal.Completar(rqmantenimiento, cabecera);
            rqmantenimiento.Mdatos["cajuste"] = cabecera.cajuste;
            rqmantenimiento.Response["cajuste"] = cabecera.cajuste;


            int cajuste = cabecera.cajuste;
            //pregunta por el valor del key eliminar dentro del request para actualizar el campo eliminado del ajuste seleccionado
            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar"))
            {
                TacfAjusteDal.Eliminar(rqmantenimiento, cabecera);
                rqmantenimiento.Mdatos["cajuste"] = cajuste;
                return;
            }
  
        }
    }
}
