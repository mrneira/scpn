using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanSolicitudBuroDal {
        public static tcansolicitudburo Crear(tcansolicitudburo obj) {
            obj.fingreso = Fecha.GetFechaSistema();
            Sessionef.Grabar(obj);
            return obj;
        }
    }
}
