using modelo;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgenTipoProducto.
    /// </summary>
    public class TgenTipoProductoDal {


        /// <summary>
        /// Metodo que entrega la definicion de un tipo de producto. Busca los datos en cahce, si no encuentra los datos en cache busca en la
        /// base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        public static tgentipoproducto Find(int cmodulo, int cproducto, int ctipoproducto) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgentipoproducto obj = null;
            obj = contexto.tgentipoproducto.AsNoTracking().Where(x => x.cmodulo == cmodulo && x.cproducto == cproducto && x.ctipoproducto == ctipoproducto).SingleOrDefault();
            
            return obj;
        }
 

    }
}
