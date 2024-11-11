using modelo;
using modelo.helper;
using System;
using System.Data.SqlClient;
using System.Linq;
using util.servicios.ef;

namespace dal.persona {
    public class TperReferenciaPersonalesDal {
         public static tperreferenciapersonales FindByCpersonaConyugue(long cpersona, long cpersonaconyugue, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tperreferenciapersonales obj = null;
            obj = contexto.tperreferenciapersonales.AsNoTracking().Where(x => x.ccompania == ccompania && x.verreg == 0 &&
            x.cpersonaconyugue == cpersonaconyugue).SingleOrDefault();
            return obj;

        }

        /// <summary>
        /// Consulta el conyuge por codigo de persona
        /// </summary>
        /// <param name="cpersona">Codigo de la persona.</param>
        /// <param name="ccompania">Codigo de la compania.</param>
        /// <returns></returns>
        public static tperreferenciapersonales FindByCpersona(long cpersona, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tperreferenciapersonales obj = null;
            obj = contexto.tperreferenciapersonales.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0).SingleOrDefault();
            if(obj == null) {
                return null;
            }
            return obj;
        }

        /**
        * Sentencia que elimina regirtros de vinculación familiar.
        */
        private static String JPQL_DELETE = "delete from tperreferenciapersonales where cpersona = @cpersona and verreg = 0 and ccompania = @ccompania ";

        /// <summary>
        /// Elimina registros de vinculación familiar dado un numero de cpersona y ccompania.
        /// </summary>
        /// <param name="cpersona">Numero de persona.</param>
        /// <param name="ccompania">Numero de compania.</param>
        /// <returns></returns>
        public static void Delete(int cpersona, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            contexto.Database.ExecuteSqlCommand(JPQL_DELETE, new SqlParameter("cpersona", cpersona), new SqlParameter("ccompania", ccompania));
        }
    }
}
