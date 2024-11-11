using modelo;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    /// <summary>
    /// Clase que implemeta, dml's manuales de la tabla TcarPrelacionCobroDto.
    /// </summary>
    public class TcarPrelacionCobroDal {

        /// <summary>
        /// Metodo que entrega la definicion de prelacion de cobro de cartera. Busca los datos en cahce, 
        /// si no encuentra los datos en cache busca en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <returns>TcarPrelacionCobroDto</returns>
        public static List<tcarprelacioncobro> FindAll() {
            List<tcarprelacioncobro> ldatos = null;
            string key = "tcarprelacioncobro";
            CacheStore cs = CacheStore.Instance;
            ldatos = (List<tcarprelacioncobro>)cs.GetDatos("tcarprelacioncobro", key);
            if (ldatos == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarprelacioncobro");
                ldatos = TcarPrelacionCobroDal.FindInDatabase();
                //foreach (tcarprelacioncobro obj in ldatos) {
                //    Sessionhb.GetSession().Evict(obj);
                //}
                m[key] = ldatos;
                cs.PutDatos("tcarprelacioncobro", m);
            }
            return ldatos;
        }

        /// <summary>
        /// Busca en la base de datos la definicion de prelacion de cobro de operaciones de cartera.
        ///// </summary>
        /// <returns>TcarPrelacionCobroDto</returns>
        private static List<tcarprelacioncobro> FindInDatabase() {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            List<tcarprelacioncobro> ldatos = contexto.tcarprelacioncobro.AsNoTracking().OrderBy(x => x.orden).ToList();
            if (ldatos.Count.Equals(0)) {
                throw new AtlasException("BCAR-0008", "PRELACION DE COBRO NO DEFINDO");
            }
            return ldatos;
        }

        /// <summary>
        /// Entrega un objeto con la definciion de la prelacion de cobro de cartera, 
        /// dado la lista de prelacion de cobro y un codigo de saldo.
        /// </summary>
        /// <param name="lprelacion">Lista que contiene la prelacion de cobro de cartera.</param>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <returns>TcarPrelacionCobroDto</returns>
        public static tcarprelacioncobro GetTcarPrelacionCobro(List<tcarprelacioncobro> lprelacion, string csaldo) {
            tcarprelacioncobro obj = null;
            foreach (tcarprelacioncobro p in lprelacion) {
                if (p.csaldo.Equals(csaldo)) {
                    obj = p;
                    break;
                }
            }
            return obj;
        }

    }

}
