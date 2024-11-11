using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanVersionDal {
        public static tcanversion Find(string cversion, string ccanal, int csubcanal) {
            tcanversion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcanversion.AsNoTracking().FirstOrDefault(x => x.cversion == cversion && x.ccanal == ccanal && x.csubcanal == csubcanal);
            return obj;
        }
    }
}
