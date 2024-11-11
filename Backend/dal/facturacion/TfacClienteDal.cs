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
    /// Clase que implemeta, dml's manuales de la tabla tfaccliente.
    /// </summary>
    public class TfacClienteDal
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="ccliente"></param>
        /// <returns></returns>
        public static tfaccliente FindInDataBase(long? ccliente)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tfaccliente obj = null;
            obj = contexto.tfaccliente.Where(x => x.ccliente == ccliente).SingleOrDefault();

            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

    }
}
