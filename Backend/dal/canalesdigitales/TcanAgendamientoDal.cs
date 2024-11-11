using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.canalesdigitales {
    public class TcanAgendamientoDal {

        public static tcanagendamiento Find(long cagendamiento) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanagendamiento.AsNoTracking().Where(x => x.cagendamiento == cagendamiento).FirstOrDefault();
        }
        public static IList<tcanagendamiento> FindPorHorario(long chorario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanagendamiento.AsNoTracking().Where(x => x.chorario == chorario).ToList();
        }

        public static IList<tcanagendamiento> FindPorUsuario(string cusuario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanagendamiento.AsNoTracking().Where(x => x.cusuario == cusuario).ToList();
        }

        public static tcanagendamiento FindPorUsuarioHorario(string cusuario, long chorario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanagendamiento.AsNoTracking().Where(x => x.cusuario == cusuario && x.chorario == chorario).FirstOrDefault();
        }

        public static IList<tcanagendamiento> FindNoAgendados(long chorario) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanagendamiento.AsNoTracking().Where(x => x.chorario == chorario && x.agendado == false).ToList();
        }

        public static int CountAgendamientosPorHora(long chorario, string hagendamiento) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanagendamiento.AsNoTracking().Where(x=> x.chorario == chorario && x.hagendamiento == hagendamiento).Count();
        }

        public static tcanagendamiento Crear(tcanagendamiento obj) {
            Sessionef.Grabar(obj);
            return obj;
        }

        public static tcanagendamiento Actualizar(tcanagendamiento obj) {
            Sessionef.Actualizar(obj);
            return obj;
        }

        public static void Eliminar(tcanagendamiento obj) {
            Sessionef.Eliminar(obj);
        }
    }
}
