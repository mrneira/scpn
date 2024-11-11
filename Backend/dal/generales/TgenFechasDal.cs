using modelo;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.generales {

    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TgenFechas.
    /// </summary>
    public class TgenFechasDal {

        /// <summary>
        /// Entrega fecha laborable para una fecha calendario.
        /// </summary>
        /// <param name="fecha">Fecha a buscar un registro de feriados.</param>
        /// <param name="csucursal">Codigo de sucursal.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns>tgenfechas</returns>
        public static tgenfechas Find(int fecha, int csucursal, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tgenfechas tgenFechas = null;
            tgenFechas = contexto.tgenfechas.AsNoTracking().Where(x => x.fcalendario == fecha && x.csucursal == csucursal && x.ccompania == ccompania).SingleOrDefault();
            if (tgenFechas == null) {
                throw new AtlasException("BGEN-026", "FECHAS LABORABLES NO DEFINIDAS EN TEGNFECHAS FECHA: {0} SUCURSAL: {1}", fecha.ToString(), csucursal.ToString());
            }
            return tgenFechas;
        }
    }
}
