using modelo;
using System;
using System.Collections.Concurrent;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {

    public class TcarPerfilSegTipoCreSaldoDal {
        /// <summary>
        /// Metodo que entrega la definicion de perfiles contables de cartera. Busca los datos en cahce, si no encuentra los datos en cache busca 
        /// en la base, alamcena en cache y entrega la respuesta, si no existe datos retorna null.
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <param name="cestadooperacion">Codigo de estatus de la operacion de cartera.</param>
        /// <param name="ctipocredito">Codigo de tipo de credito de la operacion de cartera.</param>
        /// <param name="csegmento">Codigo de segmento.</param>
        /// <returns>TcarPerfilSegTipoCreSaldoDto</returns>
        public static tcarperfilsegtipocresaldo Find(string csaldo, string cestadooperacion, string ctipocredito, string csegmento) {
            try {
                tcarperfilsegtipocresaldo obj = null;
                string key = csaldo + "^" + cestadooperacion + "^" + ctipocredito;
                CacheStore cs = CacheStore.Instance;
                obj = (tcarperfilsegtipocresaldo)cs.GetDatos("tcarperfilsegtipocresaldo", key);
                if (obj == null) {
                    ConcurrentDictionary<string, Object> m = cs.GetMapDefinicion("tcarperfilsegtipocresaldo");
                    obj = FindInDataBase(csaldo, cestadooperacion, ctipocredito, csegmento);
                    //Sessionhb.GetSession().Evict(obj);
                    m[key] = obj;
                    cs.PutDatos("tcarperfilsegtipocresaldo", m);
                }
                return obj;
            } catch {
                return null;
            }
        }

        /// <summary>
        /// Consulta en la base de datos la definicion contable del tipo de credito estado de la operacion.
        /// </summary>
        /// <param name="csaldo">Codigo de saldo.</param>
        /// <param name="cestadooperacion">Codigo de estatus de la operacion de cartera.</param>
        /// <param name="ctipocredito">Codigo de tipo de credito de la operacion de cartera.</param>
        /// <param name="csegmento">Codigo de segmento</param>
        /// <returns>TcarPerfilSegTipoCreSaldoDto</returns>
        public static tcarperfilsegtipocresaldo FindInDataBase(string csaldo, string cestadooperacion, string ctipocredito, string csegmento) {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarperfilsegtipocresaldo obj = obj = contexto.tcarperfilsegtipocresaldo.AsNoTracking().Where(x => x.csaldo.Equals(csaldo) &&
                                                                    x.cestadooperacion.Equals(cestadooperacion) &&
                                                                    x.ctipocredito.Equals(ctipocredito) &&
                                                                    x.csegmento.Equals(csegmento)).Single();
            if(obj == null) { 
                throw new AtlasException("BCAR-0026", "PERFIL CONTABLE NO DEFINIDO TcarPerfilSegTipoCreSaldo CSALDO: {0} ESTADO OPERACION: {1} TIPOCREDITO: {2} SEGMENTO:{3}",
                        csaldo, cestadooperacion, ctipocredito, csegmento);
            }
            return obj;
        }

    }
}
