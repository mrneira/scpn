using modelo;
using modelo.helper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarSolicitudCuota.
    /// </summary>
    public class TcarSolicitudCuotaDal {

        /// <summary>
        ///Consulta en la base de datos la cabecera de tabla de pagos asociada a la solicitud. 
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <returns>List<TcarSolicitudCuotaDto></returns>
        public static IList<tcarsolicitudcuota> Find(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcarsolicitudcuota.AsNoTracking().Where(x => x.csolicitud == csolicitud).OrderBy(x => x.numcuota).ToList();
        }

        /// <summary>
        ///Sentencia utilizada para eliminar tabla de pagos asociada a una solicitud. 
        /// </summary>
        private static String SQL_DEL = "delete from TcarSolicitudCuota where csolicitud = @csolicitud ";

        /// <summary>
        /// Elimina registros asociados a una solicitud.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        public static void Delete(long csolicitud)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                contexto.Database.ExecuteSqlCommand(SQL_DEL, new SqlParameter("@csolicitud", csolicitud));
            }
            catch (System.InvalidOperationException) {
                throw;
            }
        }

        /// <summary>
        /// Adiciona rubros por cuota.
        /// </summary>
        /// <param name="lcuota">Lista de cuotas.</param>
        /// <param name="lrubros">Lista de rubros.</param>
        public static void CompletaRubros(List<tcarsolicitudcuota> lcuota, List<tcarsolicitudrubro> lrubros)
        {
            List<tcarsolicitudrubro> lrubrosaux = new List<tcarsolicitudrubro>(lrubros);
            foreach (tcarsolicitudcuota cuota in lcuota) {
                List<tcarsolicitudrubro> lrubroscuota = TcarSolicitudCuotaDal.GetRubroscuota((int)cuota.numcuota, lrubrosaux);
                cuota.AddDatos("rubros", lrubroscuota);
            }
        }

        /// <summary>
        /// Entrega los rubros asociados a una cuota.
        /// </summary>
        /// <param name="numcuota">Numero de cuota.</param>
        /// <param name="lrubrosaux">Lista de rubros.</param>
        /// <returns></returns>
        private static List<tcarsolicitudrubro> GetRubroscuota(int numcuota, List<tcarsolicitudrubro> lrubrosaux)
        {
            List<tcarsolicitudrubro> lrubroscuota = new List<tcarsolicitudrubro>();
            foreach (tcarsolicitudrubro rubro in lrubrosaux) {
                if (rubro.numcuota == numcuota) {
                    lrubroscuota.Add(rubro);
                    continue;
                }
            }
            return lrubroscuota;
        }


        /// <summary>
        /// Entrega el valor de la cuota de todos los rubros.
        /// </summary>
        /// <param name="csolicitud">Numero de solicitud.</param>
        /// <param name="numcuota">Numero de cuota.</param>
        /// <returns></returns>
        public static decimal GetValorCuota(long csolicitud, int numcuota)
        {
            List<tcarsolicitudrubro> obj = new List<tcarsolicitudrubro>();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcarsolicitudrubro.AsNoTracking().Where(x => x.csolicitud == csolicitud && x.numcuota == numcuota).ToList();
            return obj.Sum(a => a.valorcuota.Value);
        }
    }

}
