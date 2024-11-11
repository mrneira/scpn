using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.organismosdecontrol {

  
    public class TodcParametrosDal {


        /// <summary>
        /// Entrega una lista de todcparametros 
        /// </summary>
        /// <param name="codigo"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static todcparametros FindXCodigo(string codigo, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            todcparametros obj;
            obj = contexto.todcparametros.Where(x => x.codigo.Equals(codigo) &&
                                                                x.ccompania == ccompania).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        /// <summary>
        /// Entrega una lista de todcparametros 
        /// </summary>
        /// <param name="nombre"></param>
        /// <param name="ccompania"></param>
        /// <returns></returns>
        public static List<todcparametros> FindXNombre(string nombre, int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<todcparametros> lista = new List<todcparametros>();
            lista = contexto.todcparametros.AsNoTracking().Where(x => x.nombre.Equals(nombre) &&
                                                                x.ccompania == ccompania).ToList();
            return lista;
        }
    }
}
