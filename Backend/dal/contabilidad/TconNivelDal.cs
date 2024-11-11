using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.contabilidad {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TconNivel.
    /// </summary>
    public class TconNivelDal {

        /// <summary>
        /// Entrega una lista de TconNivel ordenado de forma decendente por codigo de nivel.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>IList<TconNivelDto></returns>
        public static IList<tconnivel> FindDescendente(int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tconnivel> lista = new List<tconnivel>();
            lista = contexto.tconnivel.AsNoTracking().Where(x => x.ccompania == ccompania).OrderByDescending(x=> x.cnivel).ToList();
            return lista;
        }

    }
}
