using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.generales {
    public class TgenProvinciaDal {

        public static IList<tgenprovincia> FindAll() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tgenprovincia.AsNoTracking().ToList();
        }
    }
}
