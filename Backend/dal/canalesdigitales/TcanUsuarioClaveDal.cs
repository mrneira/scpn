using modelo;
using modelo.servicios;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using util;
using util.servicios.ef;

namespace dal.canalesdigitales {

    public class TcanUsuarioClaveDal {

        public static tcanusuarioclave Find(int cclave, string cusuario, string ccanal) {
            //tcanusuarioclave obj = null;
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanusuarioclave.AsNoTracking().FirstOrDefault(x => x.cclave == cclave && x.cusuario == cusuario && x.ccanal == ccanal);
            //return obj;
        }

        public static int FindMaxValue(string cusuario, string ccanal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            return contexto.tcanusuarioclave.AsNoTracking().Where(x => x.cusuario == cusuario && x.ccanal == ccanal).Select(x => x.cclave).DefaultIfEmpty(0).Max();
        }

        /// <summary>
        /// Entrega la siguiente clave.
        /// </summary>
        public static int GetProximaClave(string cusuario, string ccanal) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IEnumerable<tcanusuarioclave> reg = contexto.tcanusuarioclave.AsNoTracking().Where(x => x.cusuario == cusuario && x.ccanal == ccanal).ToList();
            if (reg.Count() > 0) {
                return reg.Max(x => x.cclave) + 1;
            }
            return 1;
        }

        public static IList<Dictionary<string, object>> FindPasswords(string cusuario, string ccanal, int numeroregistros) {
            string SQL_ULTIMOS_N = "SELECT t.password from tcanusuarioclave t where t.cusuario = @cusuario and t.ccanal = @ccanal order by t.cclave desc";
            AtlasContexto contexto = new AtlasContexto();
            contexto = Sessionef.GetAtlasContexto();

            Dictionary<string, object> parametros = new Dictionary<string, object>();
            parametros["@cusuario"] = cusuario;
            parametros["@ccanal"] = ccanal;

            List<string> lcampos = new List<string>();
            ConsultaHelper ch = new ConsultaHelper(contexto, parametros, SQL_ULTIMOS_N);
            ch.registrosporpagina = numeroregistros;
            IList<Dictionary<string, object>> ldatos = ch.GetRegistrosDictionary();
            return ldatos;
        }

        public static tcanusuarioclave Crear(tcanusuarioclave obj) {
            obj.fcreacion = Fecha.GetFechaSistema();
            Sessionef.Grabar(obj);
            return obj;
        }
    }
}
