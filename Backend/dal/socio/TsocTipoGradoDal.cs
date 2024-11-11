using modelo;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util.servicios.ef;

namespace dal.socio {
    /// <summary>
    /// Clase que implemeta, dml's de la tabla tipo grado
    /// </summary>
    public class TsocTipoGradoDal {
        /// <summary>
        /// Entrega datos vigentes de una persona.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania.</param>
        /// <returns></returns>
        public static tsoctipogrado Find(long cgrado) {
            tsoctipogrado obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tsoctipogrado.AsNoTracking().Where(x => x.cgrado == cgrado).SingleOrDefault();
            return obj;
        }
        /// <summary>
        /// Obtiene el orden del grado por jerarquia
        /// </summary>
        /// <param name="cgrado"></param>
        /// <param name="jerarquia"></param>
        /// <returns></returns>
        public static int FindOrden(long cgrado, string jerarquia) {
            int obj = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                obj = contexto.tsoctipogrado.Where(x => x.cgrado == cgrado && x.cdetallejerarquia == jerarquia).Single().orden.Value;
            } catch(System.InvalidOperationException) {
                throw;
            }


            return obj;
        }

        /// <summary>
        /// Obtiene el orden del grado por orden 
        /// </summary>
        /// <param name="orden"></param>
        /// <returns></returns>
        public static int FindExistOrden(int orden) {
            int obj = 0;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            try {
                obj = contexto.tsoctipogrado.Where(x => x.orden == orden).Single().orden.Value;
            } catch(System.InvalidOperationException) {
                throw;
            }
            return obj;
        }
    }
}
