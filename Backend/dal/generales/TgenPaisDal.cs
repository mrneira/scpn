using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.generales {
    public class TgenPaisDal {
        public static IList<tgenpais> FindAll() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tgenpais.AsNoTracking().ToList();
        }
    }
}
