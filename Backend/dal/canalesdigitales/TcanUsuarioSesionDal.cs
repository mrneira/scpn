using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanUsuarioSesionDal {

        public static tcanusuariosesion Find(string cusuario, string ccanal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanusuariosesion.AsNoTracking().FirstOrDefault(x => x.cusuario == cusuario && x.ccanal == ccanal);
        }

        public static tcanusuariosesion Find(string cusuario, string ccanal, string token) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanusuariosesion.AsNoTracking().FirstOrDefault(x => x.cusuario == cusuario && x.ccanal == ccanal && x.token == token);
        }

        public static List<tcanusuariosesion> FindPorSubCanal(int csubcanal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanusuariosesion.AsNoTracking().Where(x => x.csubcanal == csubcanal).ToList();
        }

        public static tcanusuariosesion Crear(tcanusuariosesion obj) {
            obj.fistema = Fecha.GetFechaSistemaIntger();
            obj.finicio = Fecha.GetFechaSistema();
            Sessionef.Grabar(obj);
            return obj;
        }

        public static void Eliminar(tcanusuariosesion obj) {
            Sessionef.Eliminar(obj);
        }
    }
}
