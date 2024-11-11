using core.componente;
using modelo;
using modelo.interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.dto.mantenimiento;

namespace prestaciones.comp.mantenimiento.expediente {
    public class Novedades :ComponenteMantenimiento {
        public override void Ejecutar(RqMantenimiento rm) {
            if(rm.GetTabla("NOVEDADES") == null || rm.GetTabla("NOVEDADES").Lregistros.Count() < 0) {
                return;
            }
            long? cnovedad = rm.GetLong("cnovedad");
            List<IBean> ldatos = rm.GetTabla("NOVEDADES").Lregistros;

            foreach(IBean o in ldatos) {
                tsocnovedadades obj = (tsocnovedadades)o;

                if(obj.cnovedad == 0) {
                    obj.cnovedad = int.Parse(cnovedad.ToString());
                    obj.ccompania = rm.Ccompania;
                    obj.cpersona = rm.Cpersona;
                    obj.ccatalogonovedad = rm.Ccatalogo;
                    obj.cdetallenovedad = rm.Cdetalle;

                }
            }
        }
    }
}
