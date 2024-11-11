using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.prestaciones {
    public class TpreFlujoExpedienteDal {
        public static tpreflujoexpediente Find(long flujoid, long secuencia, int cetapaactual) {
            tpreflujoexpediente obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tpreflujoexpediente.AsNoTracking().Where(x => x.flujoid == flujoid && x.secuencia == secuencia && x.cetapaactual == cetapaactual).SingleOrDefault();
            if (obj == null) {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        public static List<tpreflujoexpediente> FindList(long secuencia, int cetapaactual) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tpreflujoexpediente> lfujo = contexto.tpreflujoexpediente.AsNoTracking().Where(x => x.secuencia == secuencia && x.cetapaactual == cetapaactual).ToList();
            return lfujo;


        }

    }
}
