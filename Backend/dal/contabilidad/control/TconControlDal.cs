using modelo;
using System;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.contabilidad {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TconControl.
    /// </summary>
    public class TconControlDal {

        /// <summary>
        ///  Sentencia utilizada para obtener un objeto de tipo TconControl, con los datos de control de contabilidad.
        /// </summary>
        private static String JPQL = "select from TconControl ";

        /// <summary>
        /// Sentencia utilizada para obtener un objeto de tipo TconControl, con los datos de control de contabilidad.
        /// </summary>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <param name="ccuenta">Codigo de cuenta.</param>
        /// <returns></returns>
        public static tconcontrol Find() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tconcontrol obj = null;
            obj = contexto.tconcontrol.SingleOrDefault();
            if (obj == null) {
                obj = Crear();
            }
            return obj;
        }

        /// <summary>
        /// Crea y entrega un objeto de tipo TconControl, con valores por defecto.
        /// </summary>
        public static tconcontrol Crear() {
            tconcontrol obj = new tconcontrol();
            obj.fcontailizacionmodulos = 20140101;
		    obj.factualizacionsaldos = 20140101;
            Sessionef.Save(obj);
		    return obj;
	    }

        /// <summary>
        /// Sentencia utilizada para actualizar la fecha de ultima contabilizacion.
        /// </summary>
        private static String JPQL_UPD_FULTCONTABILIZACION = "update TconControl set fcontailizacionmodulos = @fcontable, factualizacionsaldos = @fcontable";

        /// <summary>
        /// Actualiza la fecha de ultima contabilizacion.
        /// </summary>
        public static void UpdateFultimacontabilizacion(int fcontable) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_UPD_FULTCONTABILIZACION, new SqlParameter("fcontable", fcontable));
        }

        /// <summary>
        /// Sentencia utilizada para actualiar la fecha de ultima actualizacion de saldos.
        /// </summary>
        private static String JPQL_UPD_FULT_ACT_SALDOS = "update TconControl set factualizacionsaldos = @fcontable";

        /// <summary>
        /// Actualiza la fecha de ultima actualizacion de saldos.
        /// </summary>
        public static void UpdateFultimaActSaldos(int fcontable) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_UPD_FULT_ACT_SALDOS, new SqlParameter("fcontable", fcontable));
        }


    }
}
