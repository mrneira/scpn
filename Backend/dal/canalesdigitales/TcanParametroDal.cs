using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.canalesdigitales
{
    public class TcanParametroDal {

        public static tcanparametro Find(string cparametro) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanparametro.AsNoTracking().FirstOrDefault(x => x.cparametro == cparametro);
        }

        public static string GetValueString(string cparametro) {
            return Convert.ToString(Find(cparametro).valor);
        }
    }
}
