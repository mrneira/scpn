using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.generales {
    public class TgenCantonDal {
        public static IList<tgencanton> FindAll() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tgencanton.AsNoTracking().ToList();
        }
    }
}
