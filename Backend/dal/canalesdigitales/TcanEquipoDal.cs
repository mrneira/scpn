using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanEquipoDal {

        public static tcanequipo Find(string cusuario, int cequipo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanequipo.AsNoTracking().FirstOrDefault(x => x.cusuario == cusuario && x.cequipo == cequipo);
        }

        public static int FindMaxValue(string cusuario, string ccanal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanequipo.AsNoTracking().Where(x => x.cusuario == cusuario && x.ccanal == ccanal).Select(x => x.cequipo).DefaultIfEmpty(0).Max();
        }

        public static tcanequipo Crear(tcanequipo obj) {
            obj.freal = Fecha.GetFechaSistema();
            obj.fingreso = obj.freal;
            Sessionef.Grabar(obj);
            return obj;
        }
    }
}
