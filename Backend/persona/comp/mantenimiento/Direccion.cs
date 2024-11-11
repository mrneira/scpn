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
    class Direccion : ComponenteMantenimiento
    {

        public override void Ejecutar(RqMantenimiento rm)
        {
            if (rm.GetTabla("DIRECCION") == null || rm.GetTabla("DIRECCION").Lregistros.Count() < 0)
            {
                return;
            }
            long? cpersona = rm.GetLong("c_pk_cpersona");
            List<IBean> ldatos = rm.GetTabla("DIRECCION").Lregistros;
            
            foreach (IBean o in ldatos)
            {
                tperpersonadireccion obj = (tperpersonadireccion)o;
                if (obj.cpersona == 0)
                {
                    obj.ccompania = rm.Ccompania;
                    obj.cpersona =(long) cpersona;
                    //obj.secuencia =Convert.ToInt32(obj.tipodireccioncdetalle);
                   // obj.veractual = 0;
                }
            
            }
        }
    }
}
