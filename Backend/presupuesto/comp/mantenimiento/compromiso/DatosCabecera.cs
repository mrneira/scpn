using core.componente;
using core.servicios;
using dal.presupuesto;
using modelo;
using System.Linq;
using util;
using util.dto.mantenimiento;

namespace presupuesto.comp.mantenimiento.compromiso
{

    public class DatosCabecera : ComponenteMantenimiento {

        /// <summary>
        /// Clase que se encarga de completar información de la cabecera de un compromiso para una partida.
        /// </summary>
        /// <param name="rqmantenimiento"></param>
        public override void Ejecutar(RqMantenimiento rqmantenimiento) {
                      

            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }

            tpptcompromiso cabecera = (tpptcompromiso)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            if (cabecera.ccompromiso == null)
            {
                cabecera.ccompromiso = Secuencia.GetProximovalor("PPTCOMPROMI").ToString();
            }
            TpptCompromisoDal.Completar(rqmantenimiento, cabecera);
            rqmantenimiento.Mdatos["ccompromiso"] = cabecera.ccompromiso;
            rqmantenimiento.Mdatos["infoadicional"] = cabecera.infoadicional;
            rqmantenimiento.Response["ccompromiso"] = cabecera.ccompromiso;
            
            //pregunta por el valor del key eliminar dentro del request para actualizar el campo eliminado del compromiso seleccionado
            if (rqmantenimiento.Mdatos.Keys.Contains("eliminar"))
            {
                TpptCompromisoDal.Eliminar(rqmantenimiento, cabecera);
                return;
            }
           
        }
    }
}
