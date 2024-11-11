using modelo;
using modelo.helper;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.persona {
    public class TperPersonaDireccionDal {
        public static tperpersonadireccion Find(long cpersona, int ccompania)
        {
            tperpersonadireccion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            obj = contexto.tperpersonadireccion.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0 && x.tipodireccionccatalogo == 304 && x.tipodireccioncdetalle == "2").SingleOrDefault();
            if (obj == null) {
                return null;
            } else {
                EntityHelper.SetActualizar(obj);
            }

            return obj;
        }

        public static List<tperpersonadireccion> FindToList(long cpersona, int ccompania)
        {
            List<tperpersonadireccion> obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tperpersonadireccion.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0 && x.tipodireccionccatalogo == 304 && x.tipodireccioncdetalle == "2").ToList();
            return obj;
        }

        public static tperpersonadireccion Crear(tperpersonadireccion obj) {
            Sessionef.Grabar(obj);
            return obj;
        }

        public static tperpersonadireccion Actualizar(tperpersonadireccion obj) {
            Sessionef.Actualizar(obj);
            return obj;
        }

        //public static void ActualizarCanalesDigitales(tperpersonadireccion obj) {
        //    AtlasContexto contexto = Sessionef.GetAtlasContexto();
        //    Sessionef.InsertOrUpdate(obj, contexto); // Actualizar(obj);
        //}
    }
}
