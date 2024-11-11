using modelo;
using modelo.helper;
using System.Linq;
using util.servicios.ef;

namespace dal.generales
{
    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TgenCanalesDal
    {

        /// <summary>
        /// Entrega la definicion de un canal.
        /// </summary>
        /// <param name="ccanal">Codigo de canal.</param>
        /// <returns></returns>
        public static tgencanales Find(string ccanal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencanales obj = null;

            obj = contexto.tgencanales.AsNoTracking().Where(x => x.ccanal == ccanal).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

    }
}
