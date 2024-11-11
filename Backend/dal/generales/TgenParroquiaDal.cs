using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.generales {
    public class TgenParroquiaDal {
        public static IList<tgenparroquia> FindAll() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tgenparroquia.AsNoTracking().ToList();
        }
    }
}
