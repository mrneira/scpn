using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanUsuarioDal {
        public static tcanusuario Find(string cusuario, string ccanal) {
            tcanusuario obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcanusuario.AsNoTracking().FirstOrDefault(x => x.cusuario == cusuario && x.ccanal == ccanal);
            return obj;
        }

        public static tcanusuario Crear(tcanusuario obj) {
            Sessionef.Grabar(obj);
            return obj;
        }

        public static tcanusuario Actualizar(tcanusuario obj) {
            Sessionef.Actualizar(obj);
            return obj;
        }
    }
}
