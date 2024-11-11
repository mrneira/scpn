using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using core.componente;
using dal.cartera;
using modelo;
using util.dto.mantenimiento;

namespace cobranza.comp.mantenimiento.traspasoJuridico
{
   public class TraspasoLegal : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rqmantenimiento)
        {
            string coperacion = rqmantenimiento.Mdatos["coperacion"].ToString();
            tcaroperacion tcaroperacion = TcarOperacionDal.FindWithLock(coperacion);
            tcaroperacion.Actualizar = true;
            tcaroperacion.Esnuevo = false;
            string estado = rqmantenimiento.Mdatos["cestatus"].ToString();
            tcaroperacion.cestatus = estado ;
            

            rqmantenimiento.AdicionarTabla("TCAROPERACION", tcaroperacion, false);
        }

    }
}
