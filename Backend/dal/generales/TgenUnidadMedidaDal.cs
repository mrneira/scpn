using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.generales
{

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tgenunidadmedida.
    /// </summary>
    public class TgenUnidadMedidaDal
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cmedida"></param>
        /// <returns></returns>
        public static tgenunidadmedida FindInDataBase(long? cmedida)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenunidadmedida obj = null;
            obj = contexto.tgenunidadmedida.Where(x => x.cmedida == cmedida).SingleOrDefault();

            if (obj != null)
            {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

    }
}
