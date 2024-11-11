using modelo;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgenFeriados.
    /// </summary>
    public class TgenFeriadosDal {


        /// <summary>
        /// Metodo que entrega la lista de feriados registrados
        /// </summary>
        public static IList<tgenferiados> FindAll(int? anio) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tgenferiados.AsNoTracking().Where(x => x.anio == anio).ToList();            
        }

    }
}
