using modelo;
using modelo.helper;
using System.Linq;
using util.servicios.ef;

namespace dal.generales
{
    /// <summary>
    /// Metodo que entrega la definicion de una calificacion de creditos. Busca los datos en cahce, si no encuentra los datos en cache busca
    /// en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
    /// </summary>
    public class TgenCalificacionDal {

        /// <summary>
        /// Entrega la definicion de un canal.
        /// </summary>
        /// <param name="ccalificacion">Codigo de calificacion.</param>
        /// <returns></returns>
        public static tgencalificacion Find(string ccalificacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgencalificacion obj = null;

            obj = contexto.tgencalificacion.AsNoTracking().Where(x => x.ccalificacion == ccalificacion).SingleOrDefault();
            if (obj == null)
            {
                return null;
            }
            return obj;
        }

    }
}
