using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.facturacion
{

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tconparametros.
    /// </summary>
    public class TfacFacturaDetalleDal
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="cfactura"></param>
        /// <returns></returns>
        public static IList<tfacfacturadetalle> FindInDataBase(long? cfactura) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tfacfacturadetalle> obj = contexto.tfacfacturadetalle.Where(x => x.cfactura == cfactura).ToList();
            return obj;
        }

    }
}
