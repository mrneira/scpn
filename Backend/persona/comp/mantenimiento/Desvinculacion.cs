using core.componente;
using dal.persona;
using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace persona.comp.mantenimiento {
    class Desvinculacion :ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            if(!bool.Parse(rm.GetDatos("desvincular").ToString())) {
                return;
            }

            int cpersona = int.Parse(rm.GetDatos("cpersona").ToString());
            tperreferenciapersonales refp = TperReferenciaPersonalesDal.FindByCpersona(cpersona, rm.Ccompania);
            EntityHelper.SetActualizar(refp);
            if(refp.cpersonaconyugue != null) {
                tperreferenciapersonales refpcony = TperReferenciaPersonalesDal.FindByCpersona((long)refp.cpersonaconyugue, rm.Ccompania);
                refp.cpersonaconyugue = null;
                refp.identificacion = "";
                refp.nombre = "";
                refp.genero = null;
                //Sessionef.Eliminar(refpcony);
                TperReferenciaPersonalesDal.Delete((int)refpcony.cpersona, refpcony.ccompania);
                Sessionef.Actualizar(refp);
                // rm.AdicionarTabla("REFERENCIASPERSONALES", refp, false);

            } else {

                refp.identificacion = "";
                refp.nombre = "";
                refp.genero = null;
                Sessionef.Actualizar(refp);
            }

        }
    }
}
