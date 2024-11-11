using modelo;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla tcarsolicitudrequisitos
    /// </summary>
    public class TcarSolicitudRequisitosDal {
        /// <summary>
        /// Consulta los requisitos asociados a una solicitud de credito.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns></returns>
        public static IList<tcarsolicitudrequisitos> Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudrequisitos.AsNoTracking().Where(x => x.csolicitud == csolicitud).ToList();
        }

        /**
         * Sentencia que devuelve una lista de cargos de liquidacion asociadas a una solicitud.
         */
        private static string SPQL = "delete from TcarSolicitudRequisitos where csolicitud = @csolicitud ";

        /// <summary>
        /// Elimina requisitos de una solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        public static void Delete(long csolicitud) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(SPQL, new SqlParameter("@csolicitud", csolicitud));
        }

        /// <summary>
        /// Crea y entrega una lista de requisitos de informacion a verificar por solicitud.
        /// </summary>
        /// <param name="lrequisitos">Lista de requisitos por producto.</param>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns> List TcarSolicitudRequisitosDto </returns>
        public static List<tcarsolicitudrequisitos> CreateTcarSolicitudRequisitos(List<tcarproductorequisitos> lrequisitos, long csolicitud) {
            List<tcarsolicitudrequisitos> lsolreq = new List<tcarsolicitudrequisitos>();
            if (lrequisitos == null) {
                return lsolreq;
            }
            foreach (tcarproductorequisitos obj in lrequisitos) {
                tcarsolicitudrequisitos req = new tcarsolicitudrequisitos();
                req.csolicitud = csolicitud;
                req.crequisito = (int)obj.crequisito;
                req.opcional = (obj.opcional);
                req.orden = obj.orden;
                lsolreq.Add(req);
            }
            return lsolreq;
        }

    }

}
