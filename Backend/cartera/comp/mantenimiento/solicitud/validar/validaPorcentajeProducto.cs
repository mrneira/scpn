using cartera.datos;
using core.componente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using modelo;
using util;
using dal.generales;
using dal.cartera;

namespace cartera.comp.mantenimiento.solicitud.validar
{
    public class validaPorcentajeProducto : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            Solicitud solicitud = SolicitudFachada.GetSolicitud();
            tcarsolicitud tcarsolicitud = solicitud.Tcarsolicitud;
            int anio = Fecha.GetAnio(rqmantenimiento.Fconatable);
            tgenproducto producto = TgenProductoDal.Find(tcarsolicitud.cmodulo.Value, tcarsolicitud.cproducto.Value);
            decimal porcentaje = TcarParametrosDal.GetValorNumerico("PORCENTAJE_PAGADO_PRODUCTO", rqmantenimiento.Ccompania);
            
        }
    }
}
