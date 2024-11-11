using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanHorarioAtencionDal {

        public static tcanhorarioatencion Find(long chorario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanhorarioatencion.AsNoTracking().Where(x => x.chorario == chorario && x.activo == true).FirstOrDefault();
        }
        public static IList<tcanhorarioatencion> FindPorAgencia(int cagencia, int csucursal, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanhorarioatencion.AsNoTracking().Where(x => x.cagencia == cagencia && x.csucursal == csucursal && x.ccompania == ccompania).ToList();
        }

        public static IList<tcanhorarioatencion> FindDisponibles(int cagencia, int csucursal, int ccompania, int finicio) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanhorarioatencion.AsNoTracking()
                                               .Where(x => x.cagencia == cagencia && x.csucursal == csucursal && x.ccompania == ccompania && x.fatencion > finicio && x.activo == true)
                                               .ToList();
        }

        public static IList<tcanhorarioatencion> FindPorRango(int cagencia, int csucursal, int ccompania, int finicio, int ffin) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanhorarioatencion.AsNoTracking()
                                               .Where(x => x.cagencia == cagencia && x.csucursal == csucursal && x.ccompania == ccompania && (x.fatencion > finicio && x.fatencion <= ffin))
                                               .ToList();
        }

        public static tcanhorarioatencion FindOnePorFecha(int cagencia, int csucursal, int ccompania, int fatencion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanhorarioatencion.AsNoTracking().Where(x => x.cagencia == cagencia && x.csucursal == csucursal && x.ccompania == ccompania  && x.fatencion == fatencion).FirstOrDefault();
        }

        public static long FindMaxValue() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanhorarioatencion.AsNoTracking().Select(x => x.chorario).DefaultIfEmpty(0).Max();
        }

        public static tcanhorarioatencion Crear(tcanhorarioatencion obj) {
            Sessionef.Grabar(obj);
            return obj;
        }
    }
}
