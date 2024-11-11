using modelo;
using modelo.servicios;
using System.Collections.Generic;
using System.Linq;
using util.servicios.ef;

namespace dal.bancaenlinea
{
    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TbanUsuario.
    /// </summary>
    public class TbanUsuariosDal
    {

        private static string SQL_ULTIMOS_N = "SELECT fmodificacion, password from TbanUsuarios t where t.cusuario = @cusuario" +
            " and t.fmodificacion=(select min(d.fmodificacion) from TbanUsuarios d where d.fmodificacion=t.fmodificacion and d.password=t.password)" +
            " group by fmodificacion, password" +
            " order by fmodificacion desc ";

        /// <summary>
        /// Enterga una lista de registros asociados a un usuario de TsegUsuarioDetalle ordenados en forma decendenete.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindPasswords(string cusuario, int numeroregistros) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cusuario"] = cusuario;

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_ULTIMOS_N);
            ch.registrosporpagina = numeroregistros;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="cusuario"></param>
        /// <returns></returns>
        public static tbanusuarios Find(string cusuario)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tbanusuarios.AsNoTracking().Where(x => x.cusuario == cusuario && x.verreg==0).SingleOrDefault();
        }

        public static tbanusuarios Find(long cpersona) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tbanusuarios.AsNoTracking().Where(x => x.cpersona == cpersona && x.verreg == 0).SingleOrDefault();
        }

        public static tbanusuarios FindPassword(long cpersona)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tbanusuarios.AsNoTracking().Where(x => x.cpersona == cpersona && x.verreg == 0 && x.estatuscusuariocdetalle == "ACT").SingleOrDefault();
        }

    }

}
