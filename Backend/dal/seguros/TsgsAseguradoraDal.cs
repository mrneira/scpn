using modelo;
using System.Linq;
using util.servicios.ef;

namespace dal.seguros {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TsgsAseguradoraDto.
    /// </summary>

    public class TsgsAseguradoraDal {
        /// <summary>
        /// Consulta los datos de la aseguradora
        /// </summary>
        /// <param name="caseguradora">Codigo de aseguradoara.</param>
        /// <returns>TsgsAseguradoraDto</returns>
        public static tsgsaseguradora Find(int caseguradora)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsgsaseguradora obj = contexto.tsgsaseguradora.Where(x => x.caseguradora == caseguradora).SingleOrDefault();
            return obj;
        }

    }
}
