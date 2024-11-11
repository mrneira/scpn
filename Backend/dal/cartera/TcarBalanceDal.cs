using modelo;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using util;
using util.servicios.ef;

namespace dal.cartera {
    public class TcarBalanceDal {

        /// <summary>
        /// Metodo que entrega la definicion de las cuentas de balance 
        /// </summary>
        /// <param name="cbalance">Codigo de balance.</param>
        /// <returns>TcarBalanceDto</returns>
        public static tcarbalance Find(int cbalance)
        {
            tcarbalance obj = null;
            string key = cbalance.ToString();
            CacheStore cs = CacheStore.Instance;
            try {
                obj = (tcarbalance)cs.GetDatos("tcarbalance", key);
                if (obj == null) {
                    ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarbalance");
                    obj = FindInDataBase(cbalance);
                    m[key] = obj;
                    cs.PutDatos("tcarbalance", m);
                }
                return obj;
            }
            catch {
                return null;
            }
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de una cuenta de balance.
        /// </summary>
        /// <param name="cbalance">Codigo de balance.</param>
        /// <returns>TcarEstatusDto</returns>
        public static tcarbalance FindInDataBase(int cbalance)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            tcarbalance obj = obj = contexto.tcarbalance.AsNoTracking().Where(x => x.cbalance == cbalance).SingleOrDefault();
            if (obj == null) {
                return obj;
            }
            return obj;
        }

        /// <summary>
        /// Metodo que entrega la definicion del balance
        /// </summary>
        /// <returns>IList<TcarBalanceDto></returns>
        public static IList<tcarbalance> FindAll()
        {
            IList<tcarbalance> ldatos = null;
            String key = "tcarbalance";
            CacheStore cs = CacheStore.Instance;
            ldatos = (List<tcarbalance>)cs.GetDatos("tcarbalance", key);
            if (ldatos == null) {
                ConcurrentDictionary<string, object> m = cs.GetMapDefinicion("tcarbalance");
                ldatos = FindInDataBase();
                m[key] = ldatos;
                cs.PutDatos("tcarbalance", m);
            }
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tcarbalance.
        /// </summary>
        /// <returns>IList<TcarBalanceDto></returns>
        public static IList<tcarbalance> FindInDataBase()
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcarbalance> ldatos = ldatos = contexto.tcarbalance.AsNoTracking().ToList();
            return ldatos;
        }

        /// <summary>
        /// Consulta en la base de datos la definicion de tcarbalance.
        /// </summary>
        /// <returns>IList<TcarBalanceDto></returns>
        public static IList<tcarbalance> FindInDataBaseToTipo(string tipo)
        {
            AtlasContexto contexto = Sessionef.GetAtlasContexto();
            IList<tcarbalance> ldatos = contexto.tcarbalance.AsNoTracking().Where(x => x.cdetalletipo == tipo).OrderBy(x => x.orden).ToList();
            return ldatos;
        }

    }
}
