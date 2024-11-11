using modelo;
using modelo.helper;
using modelo.interfaces;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarDevolucionDto.
    /// </summary>

    public class TcarDevolucionDal {
        /// <summary>
        /// Secuencia de tabla de devoluciones.
        /// </summary>
        /// <returns>long</returns>
        public static long GetSecuencia()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            long secuencia = contexto.tcardevolucion.Select(x => x.cdevolucion).DefaultIfEmpty(0).Max();
            return secuencia;
        }

        /// <summary>
        /// Consulta registros de devoluciones por aplicar por persona
        /// </summary>
        /// <param name="cpersona">Codigo de persona</param>
        /// <returns>List</returns>
        public static List<tcardevolucion> FindByPersona(long cpersona)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcardevolucion> obj = contexto.tcardevolucion.AsNoTracking().Where(x => x.cpersona == cpersona && x.fdevolucion == null).ToList();
            if (obj != null) {
                EntityHelper.SetActualizar(obj.ToList<IBean>());
            }
            return obj;
        }
        public static List<tcardevolucion> Find(long cpersona)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcardevolucion> obj = contexto.tcardevolucion.AsNoTracking().Where(x => x.cpersona == cpersona && x.fdevolucion == null).ToList();
            
            return obj;
        }
        public static tcardevolucion Findpk(long cdevolucion)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcardevolucion obj = contexto.tcardevolucion.AsNoTracking().Where(x => x.cdevolucion == cdevolucion).FirstOrDefault();

            return obj;
        }

    }
}
