using core.componente;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace persona.comp.mantenimiento
{
    class ReferenciasBancarias : ComponenteMantenimiento
    {
        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("REFERENCIABANCARIA") == null || rm.GetTabla("REFERENCIABANCARIA").Lregistros.Count() <= 0)
            {
                return;
            }
            long? cpersona = rm.GetLong("c_pk_cpersona");
            List<IBean> ldatos = rm.GetTabla("REFERENCIABANCARIA").Lregistros;
            foreach (IBean o in ldatos)
            {
                tperreferenciabancaria obj = (tperreferenciabancaria)o;
                
                if (obj.cpersona == 0)
                {
                    obj.ccompania = rm.Ccompania;
                    obj.cpersona =(long) cpersona;
                }
            }
        }
    }
}