using core.componente;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento {
    public class Adicional :ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            if(rm.GetTabla("ADICIONAL") == null || rm.GetTabla("ADICIONAL").Lregistros.Count() <= 0) {
                return;
            }
            long? cpersona = rm.GetLong("c_pk_cpersona");
            List<IBean> ldatos = rm.GetTabla("ADICIONAL").Lregistros;
            foreach(IBean o in ldatos) {
                tperinformacionadicional obj = (tperinformacionadicional)o;

                if(obj.cpersona == 0) {
                    obj.ccompania = rm.Ccompania;
                    obj.cpersona = (long)cpersona;
                }
            }
        }
    }
}
