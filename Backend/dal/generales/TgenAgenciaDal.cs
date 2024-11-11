using modelo;
using modelo.helper;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.generales
{
    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenAgenciaDal {

        /// <summary>
        /// Método que entrega todas las Agencias
        /// </summary>
        /// <returns></returns>
        public static IList<tgenagencia> FindAll() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tgenagencia.AsNoTracking().OrderBy(x=>x.nombre).ToList();
        }

        /// <summary>
        /// Entrega la definicion de una agencia.
        /// </summary>
        /// <param name="cagencia">Codigo de agencia.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tgenagencia Find(int cagencia, int csucursal, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenagencia obj = null;

            obj = contexto.tgenagencia.AsNoTracking().Where(x => x.cagencia == cagencia && x.csucursal == csucursal && x.ccompania == ccompania).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }
    }
}
