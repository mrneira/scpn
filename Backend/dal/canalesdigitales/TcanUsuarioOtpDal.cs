using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanUsuarioOtpDal {

        public static tcanusuariootp Find(long cotp) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanusuariootp.AsNoTracking().FirstOrDefault(x => x.cotp == cotp);
        }

        public static long FindMaxValue() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanusuariootp.AsNoTracking().Select(x => x.cotp).DefaultIfEmpty(0).Max();
        }

        public static tcanusuariootp Crear(tcanusuariootp obj, int tiempocaduca) {
            obj.fcreacion = Fecha.GetFechaSistema();
            obj.fcaducidad = obj.fcreacion.AddMinutes(tiempocaduca);
            Sessionef.Grabar(obj);
            return obj;
        }

        public static tcanusuariootp Actualizar(tcanusuariootp obj) {
            obj.validado = true;
            obj.fvalidado = Fecha.GetFechaSistema();
            Sessionef.Actualizar(obj);
            return obj;
        }

    }
}
