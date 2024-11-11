using System;
using System.Collections.Generic;
using System.Linq;

namespace modelo.servicios {

    /// <summary>
    /// Clase utilitaria que se encarga de obtener registros de la base de forma paginada.
    /// </summary>
    public class ScrollableResults {

        private ConsultaHelper consulta;
        public int pagina = 1;
        public int registrosporpagina = 10;
        public int registroactual = 0;
        private IList<Dictionary<string, object>> ldatosactual = null;
        private Dictionary<string, object> itemactual;

        public ScrollableResults(AtlasContexto contexto, Dictionary<string, object> parametros, string sql, int registrosporpagina) {
            this.registrosporpagina = registrosporpagina;
            consulta = new ConsultaHelper(contexto, parametros, sql);
            consulta.registrosporpagina = registrosporpagina;
        }

        public Boolean Next() {
            // solo se ejecuta la primera vez
            if (ldatosactual==null) {
                ldatosactual = consulta.GetRegistrosDictionary();
                if (ldatosactual.Count <= 0) {
                    return false;
                }
            }
            // Para cambiar de pagina cuando ya no hay registros
            if (registroactual >= 0 && registroactual >= registrosporpagina) {
                registroactual = 0;
                pagina++;
                consulta.pagina = pagina;
                ldatosactual = consulta.GetRegistrosDictionary();
                if (ldatosactual.Count <= 0) {
                    return false;
                }
            }
            // Cuando la ultima pagina trae menos registros que el numero de registrosporpagina ->es la ultima pagina
            if (registroactual >= ldatosactual.Count) {
                registroactual = -1;
            }
            if (registroactual < 0) {
                return false;
            }
            itemactual = ldatosactual.ElementAt(registroactual);
            registroactual++;
            return true;
        }

        public Dictionary<string, object> Get() {
            return itemactual;
        }

    }
}
