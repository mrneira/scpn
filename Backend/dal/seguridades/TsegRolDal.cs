using modelo;
using modelo.helper;
using modelo.interfaces;
using modelo.servicios;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.seguridades {
    /// <summary>
    /// Clase que implementa dml's manuales contra la base de datos.
    /// </summary>
    public class TsegRolDal {

        private static String SQL_ROLES_ACTIVOS = "select tsr.crol, tsr.nombre "
                                                + "from tsegrol tsr, tsegusuariorol tsu "
                                                + "where tsr.crol = tsu.crol "
                                                + "and tsr.ccompania = tsu.ccompania "
                                                + "and tsr.activo = 1 "
                                                + "and tsu.verreg = 0 "
                                                + "and tsu.cusuario = @cusuario  and tsu.ccompania = @ccompania order by tsr.nombre ";

        /// <summary>
        /// Entrega lista de roles activos para el usuario.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania al que pertence el usuario.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> Find(string cusuario, int ccompania) {

            List<IBean> lista = new List<IBean>();
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cusuario"] = cusuario;
            parametros["@ccompania"] = ccompania;

            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_ROLES_ACTIVOS);
            ch.registrosporpagina = 1000;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;

        }
        /// <summary>
        /// Entrega el rol por codigp
        /// </summary>
        /// <param name="crol"></param>
        /// <returns></returns>
        public static tsegrol Find(int crol) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegrol obj = contexto.tsegrol.AsNoTracking().Where(x => x.crol.Equals(crol)).SingleOrDefault();
            return obj;
        }

    }
}
