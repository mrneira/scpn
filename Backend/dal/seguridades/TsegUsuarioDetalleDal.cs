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

    public class TsegUsuarioDetalleDal {

        private static string SQL_ULTIMOS_N = "SELECT fmodificacion, password from TsegUsuarioDetalle t where t.cusuario = @cusuario and t.ccompania = @ccompania " +
            " and t.fmodificacion=(select min(d.fmodificacion) from tsegusuariodetalle d where d.fmodificacion=t.fmodificacion and d.password=t.password)" +
            " group by fmodificacion, password" +
            " order by fmodificacion desc ";

        /// <summary>
        /// Enterga una lista de registros asociados a un usuario de TsegUsuarioDetalle ordenados en forma decendenete.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> FindPasswords(string cusuario, int? ccompania, int numeroregistros) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cusuario"] = cusuario;
            parametros["@ccompania"] = ccompania;

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_ULTIMOS_N);
            ch.registrosporpagina = numeroregistros;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }
        /// <summary>
        /// Enterga una datos vigentes de un usuario.
        /// </summary>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static IList<tsegusuariodetalle> Find( int ccompania)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tsegusuariodetalle> obj = null;

            obj = contexto.tsegusuariodetalle.AsNoTracking().Where(x => x.ccompania == ccompania && x.verreg == 0).ToList();
            
            return obj;
        }
        /// <summary>
        /// Enterga una datos vigentes de un usuario.
        /// </summary>
        /// <param name="cusuario">Codigo de usuario.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static tsegusuariodetalle Find(String cusuario, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tsegusuariodetalle obj = null;

            obj = contexto.tsegusuariodetalle.AsNoTracking().Where(x => x.cusuario == cusuario && x.ccompania == ccompania && x.verreg == 0).SingleOrDefault();
            if(obj == null) {
                throw new AtlasException("SEG-001", "USUARIO {0} NO EXISTE", cusuario);
            }
            EntityHelper.SetActualizar(obj);
            return obj;
        }

        /// <summary>
        /// Enterga una datos vigentes de un usuario.
        /// </summary>
        /// <param name="cpersona">Codigo de persona.</param>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static tsegusuariodetalle FindCpersona(long? cpersona, int ccompania) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tsegusuariodetalle> lobj = null;

            lobj = contexto.tsegusuariodetalle.AsNoTracking().Where(x => x.cpersona == cpersona && x.ccompania == ccompania && x.verreg == 0).ToList();
            if(lobj == null || lobj.Count <= 0) {
                throw new AtlasException("SEG-001", "USUARIO {0} NO EXISTE", "");
            }

            if(lobj.Count > 1) {
                throw new AtlasException("SEG-032", "USUARIO ASOCIADO INCORRECTAMENTE", "");
            }
            tsegusuariodetalle obj = lobj.ElementAt(0);
            EntityHelper.SetActualizar(obj);

            return obj;
        }


        private static string SQL_USUARIOS_COMPROBANTE_CONTABLE = "select p.cpersona, p.nombre from tperpersonadetalle p, tsegusuariodetalle s " +
                                                                " where p.cpersona = s.cpersona " +
                                                                " and p.ccompania = s.ccompania  and p.ccompania = @ccompania and p.verreg = 0 " +
                                                                " and s.verreg = 0 " +
                                                                " order by p.nombre asc ";
        /// <summary>
        /// Entrega una lista con el nombre de usuario que pertenecen al sistema.
        /// </summary>
        /// <param name="ccompania">Codigo de compania a la que pertenece el usuario.</param>
        /// <returns></returns>
        public static IList<Dictionary<string, object>> ListaUsuarios(int ccompania) {
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@ccompania"] = ccompania;

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_USUARIOS_COMPROBANTE_CONTABLE);
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }
    }
}
