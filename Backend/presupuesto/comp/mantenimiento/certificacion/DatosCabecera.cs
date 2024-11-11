using core.componente;
using core.servicios;
using dal.presupuesto;
using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace presupuesto.comp.mantenimiento.certificacion
{
    public class DatosCabecera : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0) {
                return;
            }

            tpptcertificacion cabecera = (tpptcertificacion)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            if (cabecera.ccertificacion == null) {
                cabecera.ccertificacion = Secuencia.GetProximovalor("PPTCERTIF").ToString();
            }
            if(cabecera.estadocdetalle.Equals("CERTIF")) {
                rqmantenimiento.Mdatos["actualizarvalorcertificacion"] = "1";
            }
            TpptCertificacionDal.Completar(rqmantenimiento, cabecera);
            rqmantenimiento.Mdatos["ccertificacion"] = cabecera.ccertificacion;
            rqmantenimiento.Mdatos["infoadicional"] = cabecera.infoadicional;
            rqmantenimiento.Response["ccertificacion"] = cabecera.ccertificacion;

            //pregunta por el valor del key eliminar dentro del request para actualizar el campo eliminado del compromiso seleccionado
            //if (rqmantenimiento.Mdatos.Keys.Contains("eliminar")) {
            //    TpptCompromisoDal.Eliminar(rqmantenimiento, cabecera);
            //    return;
            //}
        }
    }
}
