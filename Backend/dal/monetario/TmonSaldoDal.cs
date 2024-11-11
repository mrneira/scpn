using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;


namespace dal.monetario {

    /// <summary>
    /// Clase que implemeta, consultas manuales de la tabla TmonSaldo.
    /// </summary>
    public class TmonSaldoDal {

        /// <summary>
        /// Metodo que entrega la definicion de una transaccion. Si la transaccion maneja cache, busca los datos en cahce, si no encuentra los datos en cache busca en la base, 
        /// alamcena en cache y entrega la respuesta, si no existe datos retorna null. 
        /// </summary>
        /// <param name="csaldo">Codigo de saldo. EFECTIVO, BLOQUEADO, CAPITAL, INTERES, MORA ETC.</param>
        /// <returns>TmonSaldoDto</returns>
        public static tmonsaldo Find(String csaldo) {
            tmonsaldo obj = null;
            string key = "" + csaldo;
            CacheStore cs = CacheStore.Instance;

            obj = (tmonsaldo)cs.GetDatos("tmonsaldo", key);
            if (obj == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tmonsaldo");
                obj = FindInDataBase(csaldo);
                m.TryAdd(key, obj);
                cs.PutDatos("tmonsaldo", m);
            }
            return obj;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de un rubro.
        /// </summary>
        /// <param name="csaldo">Codigo de saldo. EFECTIVO, BLOQUEADO, CAPITAL, INTERES, MORA ETC.</param>
        /// <returns>TmonSaldoDto</returns>
        public static tmonsaldo FindInDataBase(String csaldo) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tmonsaldo obj = null;
            try {
                obj = contexto.tmonsaldo.Where(x => x.csaldo.Equals(csaldo)).Single();
            } catch (System.InvalidOperationException) {
                throw new AtlasException("BMON-002", "SALDO NO DEFINIDO EN TMONSALDO SALDO:{0}", csaldo);
            }
            return obj;
        }


        /// <summary>
        /// Entrega una lista de rubros por tipo de saldo.
        /// </summary>
        /// <param name="ctiposaldo">Codigo de tipo de saldo.</param>
        /// <returns>List<TmonSaldoDto></returns>
        public static IList<tmonsaldo> FindAll(string ctiposaldo) {

            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tmonsaldo> lista = new List<tmonsaldo>();
            try {
                lista = contexto.tmonsaldo.Where( x => x.ctiposaldo.Equals(ctiposaldo)).OrderBy(x => x.nombre).ToList();

            } catch (System.InvalidOperationException) {
                throw;
            }
            return lista;
        }

    }
}
