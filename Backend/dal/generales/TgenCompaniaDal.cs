using modelo;
using modelo.helper;
using System.Linq;
using util.servicios.ef;

namespace dal.generales
{

    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenCompaniaDal
    {

        /// <summary>
        /// Entrega informacion de la compania.
        /// </summary>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tgencompania Find(int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencompania obj = null;

            obj = contexto.tgencompania.AsNoTracking().Where(x => x.ccompania == ccompania).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

    }
}
