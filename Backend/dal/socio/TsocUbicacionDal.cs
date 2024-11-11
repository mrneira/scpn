using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.socio {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla ubicacion
    /// </summary>
    public class TsocUbicacionDal {
        /// <summary>
        /// Entrega datos vigentes de una persona.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tsocubicacion Find(long cubicacion) {
            tsocubicacion obj = new tsocubicacion();
            AtlasContexto contexto = Sessionef.GetAtlasContexto();

            try {
                obj = contexto.tsocubicacion.Where(x => x.cubicacion == cubicacion).Single();
            } catch(System.InvalidOperationException) {
                throw;
            }
            return obj;

        }

    }
}
