using modelo;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgenProducto.
    /// </summary>
    public class TgenProductoDal {


        /// <summary>
        /// Metodo que entrega la definicion de un producto. Busca los datos en cahce, si no encuentra los datos en cache busca en la base
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        public static tgenproducto Find(int cmodulo, int cproducto) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenproducto obj = null;
            obj = contexto.tgenproducto.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.cproducto == cproducto).SingleOrDefault();
            
            return obj;
        }
 

    }
}
