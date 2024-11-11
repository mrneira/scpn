using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.facturacionelectronica {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tconparametros.
    /// </summary>
    public class TcelInfoEmpresaDal
    {
        /// <summary>
        /// Entrega informacion de la empresa
        /// </summary>
        public static tcelinfoempresa GetTcelinfoempresa() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcelinfoempresa obj;
            obj = contexto.tcelinfoempresa.SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }
    }
}
