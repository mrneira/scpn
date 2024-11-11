using modelo;
using System.Linq;
using util.servicios.ef;

namespace dal.canalesdigitales {

    public class TcanActivacionDal {

        #region METODOS

        public static tcanactivacion FindPorCredencial(string credencial) {
            //tcanactivacion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanactivacion.AsNoTracking().FirstOrDefault(x => x.credencial == credencial);
            //return obj;
        }

        /// <summary>
        /// Busca la entidad por sus claves primarias
        /// </summary>
        /// <param name="cpersona"></param>
        /// <param name="ccredencial"></param>
        /// <returns></returns>
        public static tcanactivacion Find(long cpersona, string ccredencial) {
            tcanactivacion obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            obj = contexto.tcanactivacion.AsNoTracking().FirstOrDefault(x => x.cpersona == cpersona && x.credencial == ccredencial);
            return obj;
        }

        #endregion

        #region MANTERNIMIENTO
        /// <summary>
        /// Se ingresa un registro
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static tcanactivacion Crear(tcanactivacion obj) {

            Sessionef.Grabar(obj);

            return obj;
        }

        /// <summary>
        /// Se actualiza un registro existente
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static tcanactivacion Actualizar(tcanactivacion obj) {

            Sessionef.Actualizar(obj);

            return obj;
        }

        /// <summary>
        /// Se elimina un registro en la base de datos        
        /// </summary>
        /// <param name="obj"></param>
        /// <returns></returns>
        public static tcanactivacion Eliminar(tcanactivacion obj) {

            Sessionef.Eliminar(obj);

            return obj;
        }

        #endregion

    }
}
