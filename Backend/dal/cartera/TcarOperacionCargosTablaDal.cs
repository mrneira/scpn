using modelo;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using util;
using util.dto.mantenimiento;
using util.servicios.ef;

namespace dal.cartera {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarOperacionCargosTabla.
    /// </summary>
    public class TcarOperacionCargosTablaDal {

        /// <summary>
        /// Sentencia que devuelve una lista de cargos a incluir en la tabla de amortizacion.
        /// </summary>
        /// <summary>
        /// Consulta en la base de datos cargos a incluir en la tabla de amortizacion de la operacion de cartera.
        /// </summary>
        /// <param name="coperacion">Numero de operacion.</param>
        /// <returns>TcarOperacionCargosTablaDto</returns>
        public static List<tcaroperacioncargostabla> Find(String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcaroperacioncargostabla.AsNoTracking().Where(x => x.coperacion == coperacion).ToList();

        }

        /// <summary>
        /// Clona los cargos de la operacion anterior a la nueva operacion.
        /// </summary>
        /// <param name="rqmantenimiento">Request con el que se ejecuta la transaccion de arreglo de pagos.</param>
        /// <param name="coperacionAnterior">Numero de operacion de cartera anterior.</param>
        /// <param name="coperacionnueva">Numero de operacion de cartera nueva.</param>
        public static void ClonarTcarOperacionCargosTabla(RqMantenimiento rqmantenimiento, String coperacionAnterior, String coperacionnueva) {
            List<tcaroperacioncargostabla> lcargos = new List<tcaroperacioncargostabla>();
            List<tcaroperacioncargostabla> lcargosanteriores = TcarOperacionCargosTablaDal.Find(coperacionAnterior);
            foreach (tcaroperacioncargostabla obj in lcargosanteriores) {
                tcaroperacioncargostabla nuevo = (tcaroperacioncargostabla)obj.Clone();
                nuevo.coperacion = coperacionnueva;
                lcargos.Add(nuevo);
                Sessionef.Save(nuevo);
            }
            rqmantenimiento.AddDatos("TCAROPERACIONCARGOSTABLA-ARREGLO-PAGO", lcargos);
        }

        private static String JPQL_DELETE_ARREGLO_PAGOS = "delete from tcaroperacioncargostabla where coperacion = @coperacion ";

        /// <summary>
        /// Ejecuta reverso de arreglo de pagos de la nueva operacion.
        /// </summary>
        /// <param name="coperacion">Numero de operacion creada en el arreglo de pagos.</param>
        public static void ReversoArregloPagos(String coperacion) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE_ARREGLO_PAGOS, new SqlParameter("coperacion", coperacion));
        }

    }
}
