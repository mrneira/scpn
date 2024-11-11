using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.activosfijos {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tconparametros.
    /// </summary>
    public class TacfParametrosDal {


        /// <summary>
        /// Entrega una lista de tacfparametros 
        /// </summary>
        /// <param name="codigo"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static tacfparametros FindXCodigo(string codigo, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tacfparametros obj;
            obj = contexto.tacfparametros.Where(x => x.codigo.Equals(codigo) &&
                                                                x.ccompania == ccompania).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega una lista de tacfparametros 
        /// </summary>
        /// <param name="nombre"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static List<tacfparametros> FindXNombre(string nombre, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tacfparametros> lista = new List<tacfparametros>();
            lista = contexto.tacfparametros.AsNoTracking().Where(x => x.nombre.Equals(nombre) &&
                                                                x.ccompania == ccompania).ToList();
            return lista;
        }
    }
}
