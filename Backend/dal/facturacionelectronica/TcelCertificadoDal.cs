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
    public class TcelCertificadoDal
    {
        private static string UPD_LOGDOCUMENTO_AUTORIZACION = "update tcelcertificado set activo = @activo";
        /// <summary>
        /// Entrega una lista de tconparametros 
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="codigo">código del parámetro</param>
        /// <returns>List<TconParametros></returns>
        public static tcelcertificado FindActivo() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcelcertificado obj;
            obj = contexto.tcelcertificado.Where(x => x.activo.Value.Equals(true)).SingleOrDefault();
            if (obj != null) {
                EntityHelper.SetActualizar(obj);
            }
            return obj;
        }

        public static void UpdateCertificadoEstado(bool activo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(UPD_LOGDOCUMENTO_AUTORIZACION, new SqlParameter("activo", activo));
        }
    }
}
