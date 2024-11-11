using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarSolicitudRubro. @version 4.1
    /// </summary>
    public class TcarSolicitudRubroDal {

        /// <summary>
        /// Consulta en la base de datos los rubos de tabla de pagos asociada a la solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns> List<TcarSolicitudRubroDto></returns>
        public static IList<tcarsolicitudrubro> Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudrubro.AsNoTracking().Where(x => x.csolicitud == csolicitud).OrderBy(x => x.numcuota).ToList();
        }

        public static tcarsolicitudrubro FindPorNumcuotaSaldo(long csolicitud, int numcuota, String csaldo)
        {
            tcarsolicitudrubro rubro = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            rubro = contexto.tcarsolicitudrubro.Where(x => x.csolicitud == csolicitud && x.numcuota == numcuota && x.csaldo == csaldo).SingleOrDefault();
            return rubro;
        }

        /// <summary>
        ///Sentencia utilizada para eliminar rubors de una tabla de pagos asociada a una solicitud. 
        /// </summary>
        private static String JPQL_DEL = "delete from TcarSolicitudRubro where csolicitud = @csolicitud ";

        /// <summary>
        ///Elimina registros asociados a una solicitud. 
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>                
        public static void Delete(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DEL, new SqlParameter("@csolicitud", csolicitud));
        }

    }

}
