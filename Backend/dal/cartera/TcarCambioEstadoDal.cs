using modelo;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarCambioEstado.
    /// </summary>
    public class TcarCambioEstadoDal {

        /// <summary>
        /// Metodo que entrega una lista de con la definicion de cambios de estado. Busca los datos en cahce, si no encuentra los datos en cache
        /// busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        public static tcarcambioestado Find(string tipo, string csaldo) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarcambioestado obj = contexto.tcarcambioestado.AsNoTracking().Where(x => x.tipo == tipo && x.csaldo == csaldo && x.activo == true).SingleOrDefault();
            if (obj == null) {
                return obj;
            }

            return obj;
	    }
        

    }
}
