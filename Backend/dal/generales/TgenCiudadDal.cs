using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.generales {
    public class TgenCiudadDal {

        public static IList<tgenciudad> FindAll() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tgenciudad.AsNoTracking().ToList();
        }
    }
}
