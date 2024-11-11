using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanSolicitudISSPOLDal {
        public static tcansolicitudisspol Crear(tcansolicitudisspol obj) {
            obj.fingreso = Fecha.GetFechaSistema();
            Sessionef.Grabar(obj);
            return obj;
        }
    }
}
