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

namespace presupuesto.comp.mantenimiento.eliminarcertificacion
{
    class DatosCabecera : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            if (rqmantenimiento.GetTabla("CABECERA") == null || rqmantenimiento.GetTabla("CABECERA").Lregistros.Count() < 0)
            {
                return;
            }

            tpptcertificacion cabecera = (tpptcertificacion)rqmantenimiento.GetTabla("CABECERA").Lregistros.ElementAt(0);
            
            if (cabecera.estadocdetalle.Equals("CERTIF"))
            {
                rqmantenimiento.Mdatos["actualizarvalorcertificacion"] = "1";
            }
            cabecera.estadocdetalle = "ANULAD";
            TpptCertificacionDal.Completar(rqmantenimiento, cabecera);

            rqmantenimiento.Mdatos["ccertificacion"] = cabecera.ccertificacion;

        }
    }
}
