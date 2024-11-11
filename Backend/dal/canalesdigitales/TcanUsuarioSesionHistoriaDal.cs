using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanUsuarioSesionHistoriaDal {

        public static tcanusuariosesionhistoria Find(string cusuario, string ccanal, int csubcanal, string token) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanusuariosesionhistoria.AsNoTracking().FirstOrDefault(x => x.cusuario == cusuario && x.ccanal == ccanal && x.csubcanal == csubcanal && x.token == token);
        }

        public static tcanusuariosesionhistoria Crear(tcanusuariosesionhistoria obj) {
            obj.fcreacion = Fecha.GetFechaSistema();
            obj.finicio = Fecha.GetFechaSistema();
            Sessionef.Grabar(obj);
            return obj;
        }


        public static tcanusuariosesionhistoria Actualizar(tcanusuariosesionhistoria obj) { 
            obj.fsalida = Fecha.GetFechaSistema();
            Sessionef.Actualizar(obj);
            return obj;
        }
    }
}
